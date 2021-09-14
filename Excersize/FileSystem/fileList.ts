import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

async function getImageList(dir: string): Promise<imageFileList> {
    const fileList = await fs.readdirSync(dir, {withFileTypes: true});
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

async function clean() {
    const directoryPathToThumbnails = './thumbnails';
    if (await fs.existsSync(directoryPathToThumbnails)) {
        const orgFiles = await getImageList(directoryPathToThumbnails);
        for (let orgfile in orgFiles) {
            await fs.promises.unlink(orgFiles[orgfile]['fullPath']);
        }
        await fs.rmdirSync(directoryPathToThumbnails);
    }
    await fs.mkdirSync(directoryPathToThumbnails);

    const directoryPathToImages = './images';
    if (await fs.existsSync(directoryPathToImages)) {
        const files = await getImageList(directoryPathToImages);
        for (let file in files) {
            //console.log(file);
            await fs.promises.unlink(files[file]['fullPath']);
        }
        await fs.rmdirSync(directoryPathToImages);
    }
    await fs.mkdirSync(directoryPathToImages);
}

async function uploadImage(file: string) {
    let buffer = await fs.createReadStream(file);
    const sharpData = await sharp();
    await buffer.pipe(sharpData);
    //console.log(path.sep);
    let pathes = file.split(path.sep);
    let fileName = pathes[pathes.length - 1];
    await sharpData.toFile('./images/' + fileName);
}

async function createThumbnail(file: string, width: number, height: number) {
    const files = await getImageList('./images');
    let fileNameNoExt = file.split('.')[0]
    let fileExtend = file.split('.')[1];
    let thumbnailName: string = './thumbnails/' + fileNameNoExt + width.toString() + 'x' + height.toString() + '.' + fileExtend;

    let buffer = await fs.createReadStream(files[file]["fullPath"]);
    const sharpData = await sharp();
    await buffer.pipe(sharpData);
    await sharpData
            .resize(width, height)
            .toFile(thumbnailName );
}

async function getImage(fileName:string, width: number, height: number) {
    const directoryPathToThumbnails = './thumbnails';
    const files = await getImageList(directoryPathToThumbnails);
    // file name managed in the systm.
    const fileNameNoExt = fileName.split('.')[0]
    const fileExtend = fileName.split('.')[1];
    const thumbnailName: string = fileNameNoExt + width.toString() + 'x' + height.toString() + '.' + fileExtend;
    const thumbnailAbsolute : string = directoryPathToThumbnails + path.sep + thumbnailName;

    if(thumbnailName in files) {
        console.log("Loading from a cache");
    } else {
        console.log("Creating in a cache");
        await createThumbnail(fileName,
                                width,
                                height);
    }
    return await fs.createReadStream(thumbnailAbsolute);
}

async function main() {
    await clean();

    const orgFiles = await getImageList('./original');
    for (let orgfile in orgFiles) {
        await uploadImage(orgFiles[orgfile]['fullPath']);
    }

    const files = await getImageList('./images');
    for (let file in files) {
        await createThumbnail(file, 200, 200);
    }

    const filesForResize = await getImageList('./images');
    for (let file in filesForResize) {
        let s = await getImage(file, 100, 100);
    }
}

main();
