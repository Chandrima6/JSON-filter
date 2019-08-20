const path = require('path');
const fs = require('fs');
function compareJSON(file1, file2) {
    let obj1, obj2, keysArr1, keysArr2;
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    fs.readFile(file1, 'utf8', function (err, data) {
        if (err) throw err;
        obj1 = JSON.parse(data);
        keysArr1 = Object.keys(obj1);
        fs.readFile(file2, 'utf8', function (err, data) {
            if (err) throw err;
            obj2 = JSON.parse(data);
            keysArr2 = Object.keys(obj2);
            console.log(keysArr1.diff(keysArr2));
        });
    });
    
    

   
}


compareJSON(process.argv[2], process.argv[3]);