const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'olpw-site.js');
let content = fs.readFileSync(filePath, 'utf8');

const searchStr = `function applyPalette() {
        apply();
        paintTile();
        var old = document.querySelector('.olpw-ambient');
        if (old) old.remove();
        if (document.body) ambient();
    }`;

const newFunc = `function applyPalette() {
        apply();
        // Also set CSS variables directly on root for immediate persistence
        var name = paletteName();
        var inks = PALETTE_INKS[name] || PALETTE_INKS.green;
        var root = document.documentElement;
        root.style.setProperty('--olpw-accent', inks[0]);
        root.style.setProperty('--olpw-accent-2', inks[1]);
        root.style.setProperty('--olpw-accent-deep', inks[2]);
        root.style.setProperty('--olpw-accent-soft', inks[3] ? 'rgba(' + parseInt(inks[3].slice(1,3),16) + ',' + parseInt(inks[3].slice(3,5),16) + ',' + parseInt(inks[3].slice(5,7),16) + ',0.10)' : 'rgba(22, 163, 74, 0.10)');
        root.style.setProperty('--olpw-on-accent', inks[4] ? '#' + inks[4].slice(1) : '#FFFFFF');
        root.style.setProperty('--olpw-gradient', 'linear-gradient(135deg, ' + inks[0] + ' 0%, ' + inks[1] + ' 100%)');
        root.style.setProperty('--olpw-gradient-hover', 'linear-gradient(135deg, ' + inks[2] + ' 0%, ' + inks[1] + ' 100%)');
        root.style.setProperty('--olpw-glow', inks[0] + '80');
        root.style.setProperty('--accent', inks[0]);
        root.style.setProperty('--accent-hover', inks[2]);
        root.style.setProperty('--accent-soft', inks[3] ? 'rgba(' + parseInt(inks[3].slice(1,3),16) + ',' + parseInt(inks[3].slice(3,5),16) + ',' + parseInt(inks[3].slice(5,7),16) + ',0.10)' : 'rgba(22, 163, 74, 0.10)');
        root.style.setProperty('--accent-bright', inks[1]);
        root.style.setProperty('--accent-deep', inks[2]);
        root.style.setProperty('--accent-glow', inks[3] ? 'rgba(' + parseInt(inks[3].slice(1,3),16) + ',' + parseInt(inks[3].slice(3,5),16) + ',' + parseInt(inks[3].slice(5,7),16) + ',0.12)' : 'rgba(74, 222, 128, 0.12)');
        paintTile();
        var old = document.querySelector('.olpw-ambient');
        if (old) old.remove();
        if (document.body) ambient();
    }`;

if (content.includes('function applyPalette() {\n        apply();\n        paintTile();\n        var old = document.querySelector(\'.olpw-ambient\');\n        if (old) old.remove();\n        if (document.body) ambient();\n    }')) {
    content = content.replace(
        'function applyPalette() {\n        apply();\n        paintTile();\n        var old = document.querySelector(\'.olpw-ambient\');\n        if (old) old.remove();\n        if (document.body) ambient();\n    }',
        newFunc
    );
    fs.writeFileSync(filePath, content);
    console.log('Done: applyPalette function updated');
} else {
    console.log('Could not find exact match');
}