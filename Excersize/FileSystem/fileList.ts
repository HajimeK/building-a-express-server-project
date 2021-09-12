import fs from 'fs';
import path from 'path';

interface imageFile {
    fullPath: string;
    size: number;
    date: string
};

interface imageFileList {
    [id: string]: imageFile;
};

function getFileFullPath(dirCWT: string, file: fs.Dirent): string {
    return path.join(path.resolve(dirCWT), file['name']);
}

function getImageList(dir: string): imageFileList {
    const fileList = fs.readdirSync(dir, {withFileTypes: true});
    const dic: imageFileList = {};
    fileList.forEach(function(file: fs.Dirent){
        let full = getFileFullPath(dir, file);
        let stats = fs.statSync(full);
        if(!stats.isDirectory()){
            let createdDate = stats.birthtime.getFullYear() + '/'
            + ('0' + (stats.birthtime.getMonth() + 1)).slice(-2) + '/'
            + ('0' + stats.birthtime.getDate()).slice(-2);
            dic[file['name']] = {fullPath: full, size: stats.size, date : createdDate };
        }
    });

    return dic;
}

const files = getImageList('./images');
console.log(files);

async function getImage(filePath: string) {
    try {
        let buffer = fs.createReadStream(filePath);
        return buffer;
    } catch(error) {
        console.log(`failed to read ${error}`)
    }
}

for (let file in files) {
    console.log(files[file]["fullPath"]);
    let buffer = getImage(files[file]["fullPath"]);
    //console.log(buffer);
}