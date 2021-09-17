import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface imageFile {
    fullPath: string;
    size: number;
    date: string
}

export interface imageFileList {
    [id: string]: imageFile;
}

function getFileFullPath(dirCWT: string, file: fs.Dirent): string {
    return path.join(path.resolve(dirCWT), file['name']);
}

export function getImageList(dir: string): Promise<imageFileList> {
    return new Promise((resolve, reject) => {
        try {
            const fileList = fs.readdirSync(dir, {withFileTypes: true});
            const dic: imageFileList = {};
            fileList.forEach(function(file: fs.Dirent){
                const full = getFileFullPath(dir, file);
                const stats = fs.statSync(full);
                if(!stats.isDirectory()){
                    const createdDate = stats.birthtime.getFullYear().toString() + '/'
                    + ('0' + (stats.birthtime.getMonth() + 1).toString()).slice(-2) + '/'
                    + ('0' + stats.birthtime.getDate().toString()).slice(-2);
                    dic[file['name']] = {fullPath: full, size: stats.size, date : createdDate };
                }
            });

            resolve(dic);
        } catch (error) {
            reject(error);
        }
    });
}

export async function clean() : Promise<void> {
    const directoryPathToThumbnails = './thumbnails';
    if (fs.existsSync(directoryPathToThumbnails)) {
        const orgFiles = await getImageList(directoryPathToThumbnails);
        for (const orgfile in orgFiles) {
            await fs.promises.unlink(orgFiles[orgfile]['fullPath']);
        }
        fs.rmdirSync(directoryPathToThumbnails);
    }
    fs.mkdirSync(directoryPathToThumbnails);

    const directoryPathToImages = './images';
    if (fs.existsSync(directoryPathToImages)) {
        const files = await getImageList(directoryPathToImages);
        for (const file in files) {
            //console.log(file);
            await fs.promises.unlink(files[file]['fullPath']);
        }
        fs.rmdirSync(directoryPathToImages);
    }
    fs.mkdirSync(directoryPathToImages);
}
export async function uploadImage(file: string, fileStream: fs.ReadStream) : Promise<void> {
    const sharpData = sharp();
    fileStream.pipe(sharpData);
    //console.log(path.sep);
    const pathes = file.split(path.sep);
    const fileName = pathes[pathes.length - 1];
    await sharpData.toFile('./images/' + fileName);
}

async function createThumbnail(file: string, width: number, height: number) {
    const files = await getImageList('./images');
    const fileNameNoExt = file.split('.')[0]
    const fileExtend = file.split('.')[1];
    const thumbnailName: string = './thumbnails/' + fileNameNoExt + width.toString() + 'x' + height.toString() + '.' + fileExtend;

    const buffer = fs.createReadStream(files[file]["fullPath"]);
    const sharpData = sharp();
    buffer.pipe(sharpData);
    await sharpData
            .resize(width, height)
            .toFile(thumbnailName );
}

export async function getImage(fileName:string, width: number, height: number): Promise<fs.ReadStream> {
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

    return new Promise((resolve, reject) => {
        try {
            resolve(fs.createReadStream(thumbnailAbsolute, { flags: "r+" }));
        } catch (error) {
            reject(error);
        }
    });
}

// async function main() : Promise<void> {
//     await clean();

//     const orgFiles = await getImageList('./original');
//     for (const orgfile in orgFiles) {
//         const fileStream: fs.ReadStream = fs.createReadStream(orgfile);
//         await uploadImage(orgFiles[orgfile]['fullPath'], fileStream);
//     }

//     const files = await getImageList('./images');
//     console.log(files);
//     for (const file in files) {
//         await createThumbnail(file, 200, 200);
//     }

//     const filesForResize = await getImageList('./images');
//     for (const file in filesForResize) {
//         await getImage(file, 100, 100);
//     }
// }

// void main();
