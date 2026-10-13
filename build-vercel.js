const fs = require('fs');
const path = require('path');

console.log('=== Vercel Build Script Started ===');
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);

const src = process.cwd();
const dest = path.join(process.cwd(), 'public');

console.log('Source:', src);
console.log('Destination:', dest);

if (fs.existsSync(dest)) {
    console.log('Removing existing public directory...');
    fs.rmSync(dest, { recursive: true, force: true });
}

console.log('Creating public directory...');
fs.mkdirSync(dest, { recursive: true });
console.log('Public directory created:', fs.existsSync(dest));

function copyDir(srcDir, destDir) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    let copied = 0;
    
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        
        // Skip excluded files/dirs
        if (['node_modules', '.git', 'public', '.vercel', '.github'].includes(entry.name)) continue;
        if (entry.name.startsWith('.') && entry.name !== 'manifest.json') continue;
        if (entry.name.match(/^package.*\.json$/)) continue;
        if (entry.name.match(/^build-.*\.js$/)) continue;
        if (entry.name.match(/^fix-.*\.js$/)) continue;
        if (entry.name === 'vercel.json') continue;
        
        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            copied++;
        }
    }
    return copied;
}

console.log('Starting copy...');
const copied = copyDir(src, dest);
console.log(`Copied ${copied} files to public/ directory`);

// Verify public directory exists and has content
const publicExists = fs.existsSync(dest);
console.log('Public directory exists:', publicExists);
if (publicExists) {
    const files = fs.readdirSync(dest);
    console.log('Files in public:', files.length);
    if (files.length > 0) {
        console.log('First 5 files:', files.slice(0, 5));
    }
}

console.log('=== Vercel Build Script Completed ===');