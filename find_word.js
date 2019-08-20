const path = require('path');
const fs = require('fs');
function searchFilesInDirectory(dir, filter, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }
    let fullLine = '';
    let finalObj = {};
    let stringsArr = [];
    const files = fs.readdirSync(dir);
    const found = getFilesInDirectory(dir, ext, filter);
    found.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        let arr = fileContent.split(/\r?\n/);
        arr.forEach((line, idx)=> {
            if(line.includes(':')) {
                line = line.trim();
                if(line.includes(',')) {
                    line = line.substring(line.indexOf(':') + 1, line.lastIndexOf(','));
                    line = line.trim();
                    if (!stringsArr.includes(line)) {
                        stringsArr.push(line);
                        if (line !== undefined && line.includes("'")) { 
                            line = line.split('');
                            line[0] = '"'
                            line[line.length - 1] = '"';
                            line = line.join('');
                            fullLine = fullLine + line + ":" + line + ',\n';
                        }
                    }
                    
                } else {
                    line = line.substring(line.indexOf(':') + 1);
                    line = line.trim();
                    if (!stringsArr.includes(line)) {
                        stringsArr.push(line);
                        if (line !== undefined && line.includes("'")) { 
                            line = line.split('');
                            line[0] = '"'
                            line[line.length - 1] = '"';
                            line = line.join('');
                            fullLine = fullLine + line + ":" + line + ',\n';
                        }
                    }
                    
                }
            }
        });

    });
    fullLine = replaceAllBackSlash(fullLine);
    fullLine = fullLine.split('');
    if (fullLine[fullLine.length - 2] === ',') {
        fullLine[fullLine.length - 2] = '';
        fullLine = fullLine.join('');
    } else {
        fullLine = fullLine.join('');
    }
    fullLine = `{\n` +fullLine + `}`;
    fullLine = new Object(fullLine);
    fullLine = JSON.stringify(fullLine);
    finalObj = JSON.parse(fullLine);
    writeToFile(finalObj);
}

// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
function getFilesInDirectory(dir, ext, filter) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);
        // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
        if (stat.isDirectory()) {
            const nestedFiles = getFilesInDirectory(filePath, ext, filter);
            files = files.concat(nestedFiles);
        } else {
            const extension = path.extname(file).split('.');
            const lastExtension = extension[extension.length - 1];
            if (lastExtension === ext && filePath.includes(filter)) {
                files.push(filePath);
            }
        }
    });
    return files;
}

function replaceAllBackSlash(targetStr){
    var index=targetStr.indexOf("\\");
    while(index >= 0){
        targetStr=targetStr.replace("\\","");
        index=targetStr.indexOf("\\");
    }
    return targetStr;
}

function writeToFile(data) {
    fs.writeFile('texts.json', data, 'utf8', function(err) {
        if (err) throw err;
        console.log('complete writing file');
    });
}

searchFilesInDirectory(process.argv[2], process.argv[3], process.argv[4]);

exports.printMsg = function() {
    console.log("This is a message from the demo package");
  }
  


