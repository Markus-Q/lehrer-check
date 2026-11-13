// Version hochzählen: schreibt den aktuellen Zeitstempel in app.js (BUILD), version.txt und die ?v=-Anhänge in index.html.
// Aufruf vor jedem Commit:  node bump.mjs
// Zweck: GitHub Pages cached Dateien bis zu 10 Minuten. Mit dem Anhang ?v=… laden Browser nach einer Änderung sofort die neuen Dateien,
// und die Seite lädt sich selbst neu, wenn version.txt neuer ist als der laufende Stand (siehe checkVersion in app.js).
import fs from 'fs';
const p=n=>String(n).padStart(2,'0'), d=new Date();
const build=`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
const v=build.replace(/\D/g,'');
let a=fs.readFileSync('app.js','utf8');
a=a.replace(/^const BUILD = '[^']*';/m,`const BUILD = '${build}';`);
fs.writeFileSync('app.js',a);
fs.writeFileSync('version.txt',build+'\n');
let h=fs.readFileSync('index.html','utf8');
h=h.replace(/(style\.css|glass\.css|app\.js)(\?v=\d+)?"/g,`$1?v=${v}"`);
fs.writeFileSync('index.html',h);
console.log('Version',build);
