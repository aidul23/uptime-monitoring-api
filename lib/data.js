const fs = require('fs');
const path = require('path');


const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

//write data to file
lib.create = (dir, file , data, callback) => {
    //open file for writting
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            //convert data to string
            const stringData = JSON.stringify(data);

            //write data to file
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if(!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3) {
                            callback(false);
                        } else {
                            callback("error closing the file");
                        }
                    });
                } else {
                    callback("error writing to new file")
                }
            });
        } else {
            callback("couldn't create new file");
        }
    });
}

//read file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf-8', (err, data) => {
        callback(err, data);
    });
}

//update existing file
lib.update = (dir, file, data, callback) => {
    //file open for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            //convert the data to string
            const stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor, (err1) => {
                if(!err1) {
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if(!err2) {
                            fs.close(fileDescriptor, (err3) => {
                                if(!err3) {
                                    callback(false);
                                } else {
                                    callback('error closing file');
                                }
                            });
                        } else {
                            callback('error writing to file');
                        }
                    });
                } else {
                    console.log("error truncting file");
                }
            });
        } else {
            console.log("error updating");
        }
    });
}

//delete file
lib.delete = (dir, file, callback) => {
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err) => {
        if(!err) {
            callback(false);
        } else {
            console.log('error deleting file');
        }
    });
}
module.exports = lib;