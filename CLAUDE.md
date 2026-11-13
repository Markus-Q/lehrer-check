# Lehrer-Check: Projektwissen für Claude Code

Dieses Dokument ersetzt den bisherigen Chat. Zusätzlich zum Code gilt alles hier. Lies zuerst diese Datei, dann `index.html`, `style.css` und `app.js`.

## 1. Worum es geht

- **Max** (Maximilian Zeren, Schüler, Deutschland) hat die Webseite „Lehrer-Check“ für seine Klasse gebaut. Die Klasse bewertet ihre Lehrer anonym-sachlich mit Sternen. Die Seite ist **nur für Klassenmitglieder** gedacht.
- **Vier Dateien:** `index.html` (Grundgerüst), `style.css` (Papier-Design), `glass.css` (Glas-Design, Beta) und `app.js` (JavaScript als ES-Modul, ca. 1340 Zeilen, LF-Zeilenenden). Lokal per Doppelklick geht es nicht (Module brauchen einen Server, z. B. ein kleiner Node-Server (Python ist auf Maxs PC nicht installiert)). Kein Build, kein npm, keine Abhängigkeiten außer den Firebase-SDK-Imports von `gstatic.com` (Version `10.12.2`, Konstante `FB_VERSION`).
- **Sprache der Oberfläche: Deutsch.** Kommentare im Code ebenfalls Deutsch. Halte diesen Stil bei.

## 2. Hosting und Infrastruktur

- **GitHub:** Repo `Markus-Q/lehrer-check`, Branch `main`, die Dateien liegen im Root. **GitHub Pages** liefert sie aus (Adresse `https://markus-q.github.io/lehrer-check/`). Ein Push auf `main` ist das Deployment, nach ca. 1–2 Minuten live.
- **Firebase-Projekt:** `lehererschrck` (der Tippfehler im Namen ist echt, nicht ändern). Genutzt werden **Firestore** und **Authentication mit anonymem Login**. Die Web-Konfiguration (`FIREBASE_CONFIG`, enthält apiKey usw.) steht fest in der Datei. Ein Web-API-Key ist öffentlich und kein Geheimnis. Die Sicherheit kommt ausschließlich aus den Firestore-Regeln.
- **Firestore-Regeln** stehen als Template-String `RULES` in `app.js` (der BOSS kopiert sie unter „Ich“ → Werkzeuge → „Firestore-Regeln kopieren“; es gibt kein Verbindungs-/Einstellungsfenster mehr, auch keinen Status-Knopf oben und keine Einrichtungsanleitung). **Die Regeln werden nicht automatisch deployed.** Max muss sie von Hand in der Firebase-Konsole einfügen: Firestore Database → Rules → Publish. **Immer wenn du Felder, Collections oder Berechtigungen änderst, musst du `RULES` anpassen und Max den neuen Regeltext im Chat geben mit der Anweisung, ihn zu veröffentlichen.** Sonst bricht die Seite mit „Keine Berechtigung“.
- **Impressum und Datenschutz** sind in der Seite eingebaut (Konstante `LEGAL` mit Name und E-Mail, Funktion `legalHTML`, Links unten auf jeder Seite). Max nutzt dort seinen Namen und seine private Mail. Die Adresse ist bewusst leer.

## 3. Rollen und Zugang

- **Lokaler Modus:** Ohne Firebase-Konfiguration läuft alles nur im Browser (`localStorage`, Schlüssel `lc_local_v1`). Dort darf jeder Lehrer verwalten.
- **Cloud-Modus (aktuell Normalfall):**
  - **BOSS:** Wer sich als Erster „BOSS“ nennt, legt das Dokument `meta/boss` an (`{uid,name:'BOSS',createdAt}`, nur einmal anlegbar). Max ist BOSS. Der BOSS-Status hängt an der **anonymen Firebase-UID im Browser**. Neues Gerät, privates Fenster oder gelöschte Browserdaten bedeuten, dass man nicht mehr BOSS ist. Zurücksetzen: in der Firebase-Konsole `meta/boss` löschen.
  - **Nur der BOSS** darf Lehrer anlegen, ändern und löschen.
  - **BOSS-Code (Wiederherstellung):** Der BOSS erzeugt unter „Ich“ einen langen Code (wird nur einmal angezeigt, ein neuer Code macht alte ungültig). Auf einem neuen Gerät gibt man ihn über „BOSS-Code eingeben“ (Wartescreen bzw. Anfrage-Fenster) ein und wird BOSS (`isBoss()` = Besitzer von `meta/boss` oder gültiger Code-Besitzer `S.bossDev`). Fehlt der Code und das Gerät ist weg, hilft weiter, `meta/boss` in der Firebase-Konsole zu löschen.
  - **Zugangsfreigabe:** Jeder andere stellt eine Anfrage (`members/{uid}`: `{uid,name,status:'pending'|'approved'|'rejected',createdAt,decidedAt}`). Erst nach Freigabe durch den BOSS (Tab „Ich“, Bereich Zugangsanfragen) sind Lehrer, Bewertungen und Stunden lesbar und schreibbar. Dazu gehören Zulassen, Ablehnen, Entziehen und Löschen. Der Name ist nach der Anfrage **fest** (nicht änderbar). Wer abgelehnt wurde, kann erst neu anfragen, wenn der BOSS den Eintrag löscht. Doppelte Namen werden dem BOSS markiert. Der Name „BOSS“ ist für normale Anfragen gesperrt.
  - Die Daten-Listener (Lehrer, Bewertungen, Stunden) starten erst bei Zugang (`syncAccess`, `startData`, `stopData`). Der BOSS abonniert zusätzlich `members`.

## 4. Datenmodell (Firestore)

- `meta/boss`: siehe oben.
- `bossCodes/{code}`: BOSS-Code (40 Zeichen A–Z/2–7), der Code ist die Dokument-ID. `{createdAt,createdBy}`. `get` darf jeder Angemeldete (nur wer den Code kennt), `list`/`create`/`delete` nur der BOSS.
- `bossDevices/{uid}`: `{uid,code,createdAt}`. Ein Gerät, das einen BOSS-Code eingelöst hat. Es ist BOSS, solange `bossCodes/{code}` existiert (Regel `isCodeBoss`). Nur das eigene Dokument ist lesbar.
- `members/{uid}`: siehe oben.
- `teachers/{id}`: `{name, subjects[], createdAt, createdBy}`. Name = nur Anrede und Nachname („Frau Müller“). Das ist so gewollt (Datenschutz). Keine Vornamen, keine privaten Infos.
- `ratings/{teacherId_uid}` (eine Bewertung pro Person und Lehrer, Dokument-ID ist Pflicht): `{teacherId,userId,f,h,b,u,a,p,g,tags[≤4],rec(null|bool),subject,createdAt,updatedAt}` (kein Name im Dokument). **Es gibt keine Kommentare mehr** (bewusst entfernt, auch aus UI und CSV). Alte Kommentare liegen evtl. noch in der Datenbank, werden aber nicht angezeigt. Neue Schreibvorgänge mit Feld `comment` scheitern an `keys().hasOnly`.
- `lessons/{teacherId_uid_YYYY-MM-DD}`: `{teacherId,userId,points(-10..10),day,createdAt,updatedAt}`. `day` ist das **UTC-Datum von heute** (`dayKey()`), die Regeln erzwingen das (`today()`). Dadurch höchstens ein Eintrag pro Tag, Lehrer und Person.
- **Anonymität:** Bewertungen und Stunden enthalten keinen Namen (`userName` wurde entfernt, Mitglieder sehen nur die anonyme `userId`). Nur der BOSS kann über `members` zuordnen. Die CSV-Spalte „Von“ gibt es **nur für den BOSS** (`whoMap`). Alte Dokumente mit `userName` bereinigt der BOSS-Browser automatisch einmalig (`stripOldNames`, Regel `onlyStripsName`).
- **Regeln gegen Missbrauch:** Bewertungen und Stunden nur für existierende Lehrer (`exists(teacherPath)`), `createdAt`/`updatedAt` müssen Zahlen und plausibel sein (`pastOk`/`nowOk`). CSV-Zellen werden gegen Formel-Injection geschützt (`csvCell`).

## 5. Bewertungslogik

- **7 Kriterien** (Konstante `CRIT`, Sterne 1–5): `f` Freundlichkeit, `h` Hilfsbereitschaft, `b` Beibringungskraft, `u` Unterrichtsgestaltung, `a` Anpassung an die Klasse, `p` Prüfungen & Benotung, `g` Gerechtigkeit.
- **Stichwörter (Tags)**, maximal 4 (`TAGS`): humor, streng, chaos, anschaulich, hausi, locker, schlaf, puenktlich, zeit, fordernd, buch, laut. Die IDs stehen auch in den Regeln.
- **Mindestanzahl (`MIN_N = 3`):** Durchschnitte, Noten, Weiterempfehlung, Tags, Fächer-Auswertung und CSV erscheinen erst ab 3 Bewertungen pro Lehrer (Stunden-Punkte ab 3 verschiedenen Schülern). Das ist nur eine Anzeigesperre in der UI, die Rohdaten sind für Mitglieder weiter lesbar. Gesteuert über `a.ok`/`a.lok` in `computeAll`.
- **Weiterempfehlung** (`rec`, ja/nein/leer) und optional das Fach.
- **Stunden-Punkte:** −10 bis +10, **1× pro Tag und Lehrer**, Gewicht in der Gesamtnote **10 %** (`LESSON_W = 0.10`). Die Gesamtnote ist also zu 90 % der Sterne-Schnitt und zu 10 % die umgerechnete Stunden-Stimmung.
- Weitere Funktionen: Statistik (Auswertung), Vergleich von Lehrern (Radar, Balken), Fächerfilter, Sortierung, Suche, CSV-Export (Bewertungen und Stunden), Demo-Daten im lokalen Modus.

## 6. Code-Aufbau (Orientierung in `app.js`)

- Zustand: `const S = {teachers,ratings,lessons,A,tab,q,subj,sort,cmp,cloud,mode,ready,authed,err,boss,me,members,askedName,_got:{…}}`. Hilfen: `isBoss()`, `canManage()`, `hasAccess()`, `nameLocked()`, `pendingCount()`.
- Cloud: `startCloud` (anonymer Login, `meta/boss` und `members/{UID}` abonnieren), `syncAccess`, `startData`, `stopData`, `recomputeReady`, `claimBoss`, `startLocal`. `api = {requestAccess, withdrawAccess, setMember, deleteMember, addTeacher, updateTeacher, deleteTeacher, saveRating, deleteRating, saveLesson, deleteLesson}`.
- Rendering: `renderMain`, `refreshMain`, `onData`, `renderBanner`, `gateHTML` (Wartescreen ohne Zugang), `viewMe`, `memberSection`, `detailHTML`, `rateHTML`, `lessonHTML`, `teacherFormHTML`, `nameHTML`/`requestHTML`, `legalHTML`. Fenster („Sheets“): `openSheet(type,id)`, `renderSheet`, `closeSheet` (Typen: detail, rate, lesson, teacher, name, legal, bosscode, bosskey).
- Events: **ein** Handler-Objekt `H` mit Aktionen über `data-act="…"` (Event-Delegation). Neue Buttons bekommen `data-act` und einen Eintrag in `H`.
- Lokale Speicherung im Browser (immer in try/catch über `ls`): `lc_uid`, `lc_name`, `lc_local_v1`, `lc_fbcfg`, `lc_design` (`glass`; Glas-Design, sonst Papier), `lc_theme` (`dark`; Dunkelmodus nur per Schalter unter „Ich“, folgt bewusst nicht dem Gerät; Farben als CSS-Variablen in `style.css`, `html[data-theme=dark]`).

## 7. Design: Schulheft-Look, bewusst nicht „KI-haft“

- Konzept: **Zeugnis / Schulheft.** Karoraster, roter Randstrich links (`body::before`), tintenblau (`--ink` `#1b2a6b`), rot (`--red` `#bd3022`), Papierbeige, Graphit (`#26251f`). Schriften: **Gloock** (Überschriften) und **Courier Prime** (Text). Handgezeichnete SVG-Formen (Haken, roter Ring um die Note, Unterstreichungen), Stempel-Effekt, Strichzeichnung-Animationen.
- **Glas-Design (Beta, optional):** Umschalter unter „Ich“ → Werkzeuge („Glas-Design (Beta)“ / „Papier-Design“), lokal gespeichert (`lc_design`), gesetzt als `html[data-design=glass]` (vor dem ersten Rendern per Inline-Skript in `index.html`). `glass.css` ersetzt den Papier-Look komplett: Milchglas-Scheiben mit `backdrop-filter`, farbiger Hintergrund aus weichen Farbflächen, Petrol (`--ink`) und Koralle (`--red`, nur für Warnendes), Systemschrift, Ring-Note (`--v` am `.grade`), Balken statt Kästchen, Pillen statt Stempel. Funktioniert hell und dunkel. Alles ist an `html[data-design=glass]` gebunden, Papier bleibt Standard und unverändert. Die Farben laufen über CSS-Variablen (auch `--ink-rgb`/`--red-rgb`), neue Elemente also immer mit Variablen stylen. Eckenform: weiche Squircle-Ecken über `corner-shape: var(--g-shape)` (Standard `superellipse(1.5)`, überall derselbe Radius `--r` = 30px, egal wie groß das Element ist, Chrome ab 139, sonst normale Rundung); nur echte Kreise (Noten-Ring) bleiben Kreise. Der Glasrand ist überall gleich dick (`--g-line`, von `setHairline()` in `app.js` auf genau 1 Geräte-Pixel gesetzt) und hellt den Hintergrund auf: transparenter Rand plus Ring als `::after` mit eigenem `backdrop-filter` (`--g-rim-bg`, `--g-rim-fx`), Maske schneidet die Mitte aus. Kein `inset`-Schatten als Kante (macht oben dicker). Performance-Vorsicht: Blur nur auf wenigen Flächen (Leisten, Karten, Fenster), nicht auf jeder Kleinigkeit.
- **Entfernt auf Wunsch (nicht wieder einbauen):** die Tackerlöcher am linken Rand und die Papierkorn-Schicht (Rauschfilter).
- **Genau zwei Display-Arten:** (1) **Smartphone** = Basis ohne Medienabfrage (eine Spalte, Karten gestapelt, Fenster als Blatt von unten). (2) **iPad 11"** (A16: 2360 x 1640 px, Pixeldichte 2, also 820 x 1180 CSS-px hochkant und 1180 x 820 quer; Referenz-Handy: 1080 x 2400 px, ca. 400 ppi, Pixeldichte ca. 2,6, also ca. 411 x 914 CSS-px) = eine einzige Medienabfrage `(min-width:760px) and (min-height:600px)` am Ende von `style.css` (und der Sheet-Regel in `glass.css`): breite Zeilen-Karten mit drei Spalten, zweispaltige Auswertung, Fenster mittig, größere Schrift und Tippflächen (44px statt 38px), `--wrapmax` 1080px. Handy quer (breit, aber nur ca. 400 hoch) und iPad im Splitview (unter 760 breit) bleiben bewusst im Smartphone-Modus. **Keine weiteren Breakpoints einführen.** Safe-Area-Insets beachten. `prefers-reduced-motion` wird respektiert.

## 8. Scroll-Architektur (wichtig, hier steckt viel Feinarbeit)

- Das **Dokument scrollt nicht.** `html` und `body` haben `overflow:hidden`. Aufbau als Flex-Spalte: feste Kopfzeile `.top`, scrollbarer Bereich **`#scroller`** (enthält `<main id="app">`), feste untere Tableiste `.tabbar` (`position:fixed`). Dadurch bleiben Kopf und Fuß auf iOS beim Überziehen **immer stehen**, und nur der Inhalt federt. Die Scroll-Resets nutzen `$('#scroller').scrollTo(…)` und nicht `window.scrollTo`.
- **iOS:** federt nativ im `#scroller` (und in den Fenstern `.sheet`, mit `overscroll-behavior:contain`). Max findet das „sehr gut“.
- **Android:** Der native Stretch-Effekt ist ausgeschaltet (`body.android …{overscroll-behavior-y:none}`). Stattdessen gibt es **selbstgebautes Überziehen** (IIFE „Android: eigenes Überziehen“ vor `settingsHTML`). Es gilt für `#scroller` und alle `.sheet`-Fenster über Event-Delegation auf `document`. Es verschiebt per `translate3d` den Inhalt (`#app` bzw. das erste Kind des Fensters). Es besteht aus Gummiband-Ziehen am Rand und einer **kritisch gedämpften Feder ohne Nachschwingen** (exakte Lösung `x=(A+B·t)·e^(−W·t)`, `W=13`). Beim schnellen Wischen bis an den Rand wird das Tempo aus den Scroll-Ereignissen geschätzt (Überschwingen bis etwa 12 % der Fensterhöhe). Das Vorbild ist das Verhalten der ColorOS-Einstellungen auf Max' OnePlus 15 (Referenzvideo: weich, einmal über den Rand, gleichmäßig zurück, kein Wackeln).
- **Ruckel-Ursachen im Feder-Code, die keine Performance sind (behoben):** (1) Beim Start der Feder aus dem Scroll-Ereignis konnte `t` negativ sein (Bild-Zeitstempel liegt vor `performance.now()`), dadurch sprang die erste Position einige Pixel in die Gegenrichtung: `t` ist jetzt `Math.max(0,…)`. (2) Beim erneuten Antippen während der Feder wurde `x` hart auf 0 gesetzt (Sprung): jetzt läuft die Feder weiter bzw. wird beim erneuten Ziehen nahtlos übernommen (Umkehrung der Gummiband-Kurve). (3) Beim Zurückziehen des Fingers und nach dem Loslassen scrollte der Browser nativ weiter und verdoppelte die Bewegung bzw. lief gegen die Feder: `scrollTop` wird am Rand festgehalten (`pinDir`, `pinMax`), solange gezogen oder gefedert wird. Nur synthetisch mit simulierten Touch-Events im Browser geprüft, nicht auf dem OnePlus.
- **Performance-Lektionen (Android, 120 Hz):** Der Touch-Listener muss **passiv** sein, ein nicht-passiver `touchmove` blockiert das native Scrollen und lässt es ruckeln. Es gibt kein `preventDefault` und kein `touch-action: pan-y` auf dem Scroller (das würde das waagerechte Wischen der Fach-Chips blockieren). Kein dauerhaftes `will-change: transform` auf `#app`. Schwere Vollbild-Effekte (Rauschfilter) vermeiden.
- Max testet auf einem **OnePlus 15 (Android, ColorOS, 120 Hz)** und einem **iPad (60 Hz)**.

## 9. So arbeitet Max, und so arbeitest du mit ihm

- Antworte **auf Deutsch**, knapp und klar. Max ist kein Programmierer und will Ergebnisse statt Erklärungen.
- **Veröffentlichen heißt: auf `main` pushen.** Max möchte die Datei **nicht** zusätzlich als Anhang geschickt bekommen, ein Push reicht. Committe mit klaren deutschen Nachrichten. Bei Fehlern von GitHub (z. B. 503) kurz erneut versuchen. Wenn jemand anderes gepusht hat (Max hat z. B. einmal eine `CNAME`-Datei angelegt und wieder gelöscht), erst `fetch` und `rebase`, dann pushen.
- **Änderungen immer direkt committen und pushen.** Die Seite wird noch von niemandem außer Max benutzt, er testet live auf GitHub Pages.
- **Bei Unklarheit nachfragen statt raten.** Fasse Fragen zusammen und gib eine Empfehlung an. Keine Zwischenupdates und keine ungefragten Testläufe. Eine Syntaxprüfung (z. B. `node --check` auf dem extrahierten Modul-Skript) ist aber sinnvoll. Sage ehrlich, dass du nicht auf einem echten Handy testen konntest.
- Max meldet Gefühl und Aussehen oft nur ungefähr („fühlt sich unnatürlich an“, „ruckelt“). Frag dann gezielt nach dem Was (zu stark, zu schwach, Ruckeln beim Scrollen oder nur am Rand) und stelle Werte nach. Ein Referenzvideo ist sehr hilfreich. Frames lassen sich mit ffmpeg zu einem Kontaktbogen zusammensetzen.
- Bei Handy-Anleitungen nenne die **englischen** Bezeichnungen der Oberfläche (sein Handy läuft auf Englisch).
- Änderungen an der Datenstruktur: immer zusammen mit den Firestore-Regeln denken (siehe Abschnitt 2).

## 10. Rechtliches (Stand der Beratung, keine Rechtsberatung)

- Lehrernamen mit Bewertungen: nicht automatisch verboten (BGH-Urteil „spickmich.de“ 2009, öffentlich und mit Anmeldung zulässig). Hier ist es deutlich harmloser, weil nur freigegebene Klassenmitglieder Zugriff haben, es nur Sterne und Punkte gibt und keine Freitexte. Es bleiben DSGVO-Pflichten (Datenschutzerklärung ist eingebaut, Firebase liegt bei Google, evtl. USA). Lehrer können Löschung ihres Eintrags verlangen. Dann den Eintrag sofort löschen.
- Max wurde geraten, die Seite nur in der Klasse zu teilen und im Zweifel bei Schule oder Verbindungslehrkraft nachzufragen.

## 11. Offene Ideen und Hinweise

- Kein Feld für den echten Schülernamen (nur Name oder Kürzel). Max wollte nur „Herr/Frau + Nachname“ bei Lehrern. Auf Wunsch ergänzbar.
- Die Freigabe hängt am Browser/Gerät (anonyme UID). Neues Gerät bedeutet neue Anfrage.
- Möglich, aber bisher nicht gewünscht: Parallax-Effekt der Titel beim Überziehen auf Android (im Referenzvideo bewegt sich der große Titel weniger als die Liste).
- Mögliche weitere Performance-Schritte, falls es auf Android noch ruckelt: Raster-Hintergrund vereinfachen, Animationen reduzieren, lange Listen virtualisieren.
