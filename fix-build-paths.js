const fs = require('fs');
const path = require('path');

function fixFile(filename) {
    const fullPath = path.join(__dirname, filename);
    let content = fs.readFileSync(fullPath, 'utf8');
    const original = content;
    
    // Fix hardcoded path - use simple string replace
    content = content.replace("const DIR = 'C:/Users/ASUS/Desktop/OLPW';", "const DIR = process.cwd();");
    content = content.replace('const DIR = "C:/Users/ASUS/Desktop/OLPW";', 'const DIR = process.cwd();');
    
    // Fix CURR path in build-more.js
    content = content.replace("const CURR = path.join(DIR, 'curriculum');", "const CURR = path.join(DIR, 'curriculum');");
    content = content.replace('const CURR = path.join(DIR, "curriculum");', "const CURR = path.join(DIR, 'curriculum');");
    
    if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed: ${filename}`);
    } else {
        console.log(`No changes needed: ${filename}`);
    }
}

fixFile('build-curriculum.js');
fixFile('build-more.js');
fixFile('build-quizzes.js');
fixFile('build-chapter-images.js');
console.log('All done!');