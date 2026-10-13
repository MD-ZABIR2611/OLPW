const fs = require('fs');
const path = require('path');

const src = process.cwd();
const dest = path.join(process.cwd(), 'public');

if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
}

fs.mkdirSync(dest, { recursive: true });

function copyDir(srcDir, destDir) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        
        // Skip excluded files/dirs
        if (['node_modules', '.git', 'public', '.vercel', '.github'].includes(entry.name)) continue;
        if (entry.name.startsWith('.') && !entry.name === 'manifest.json') continue;
        if (entry.name.match(/^package.*\.json$/)) continue;
        if (entry.name.match(/^build-.*\.js$/)) continue;
        if (entry.name.match(/^fix-.*\.js$/)) continue;
        if (entry.name === 'vercel.json') continue;
        
        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDir(src, dest);
console.log('Copied to public/ directory');