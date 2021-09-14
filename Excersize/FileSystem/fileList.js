"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
;
;
function getFileFullPath(dirCWT, file) {
    return path_1.default.join(path_1.default.resolve(dirCWT), file['name']);
}
async function getImageList(dir) {
    const fileList = await fs_1.default.readdirSync(dir, { withFileTypes: true });
    const dic = {};
    fileList.forEach(function (file) {
        let full = getFileFullPath(dir, file);
        let stats = fs_1.default.statSync(full);
        if (!stats.isDirectory()) {
            let createdDate = stats.birthtime.getFullYear() + '/'
                + ('0' + (stats.birthtime.getMonth() + 1)).slice(-2) + '/'
                + ('0' + stats.birthtime.getDate()).slice(-2);
            dic[file['name']] = { fullPath: full, size: stats.size, date: createdDate };
        }
    });
    return dic;
}
async function clean() {
    const directoryPathToThumbnails = './thumbnails';
    if (await fs_1.default.existsSync(directoryPathToThumbnails)) {
        const orgFiles = await getImageList(directoryPathToThumbnails);
        for (let orgfile in orgFiles) {
            await fs_1.default.promises.unlink(orgFiles[orgfile]['fullPath']);
        }
        await fs_1.default.rmdirSync(directoryPathToThumbnails);
    }
    await fs_1.default.mkdirSync(directoryPathToThumbnails);
    const directoryPathToImages = './images';
    if (await fs_1.default.existsSync(directoryPathToImages)) {
        const files = await getImageList(directoryPathToImages);
        for (let file in files) {
            //console.log(file);
            await fs_1.default.promises.unlink(files[file]['fullPath']);
        }
        await fs_1.default.rmdirSync(directoryPathToImages);
    }
    await fs_1.default.mkdirSync(directoryPathToImages);
}
async function uploadImage(file) {
    let buffer = await fs_1.default.createReadStream(file);
    const sharpData = await (0, sharp_1.default)();
    await buffer.pipe(sharpData);
    //console.log(path.sep);
    let pathes = file.split(path_1.default.sep);
    let fileName = pathes[pathes.length - 1];
    await sharpData.toFile('./images/' + fileName);
}
async function createThumbnail(file, width, height) {
    const files = await getImageList('./images');
    let fileNameNoExt = file.split('.')[0];
    let fileExtend = file.split('.')[1];
    let thumbnailName = './thumbnails/' + fileNameNoExt + width.toString() + 'x' + height.toString() + '.' + fileExtend;
    let buffer = await fs_1.default.createReadStream(files[file]["fullPath"]);
    const sharpData = await (0, sharp_1.default)();
    await buffer.pipe(sharpData);
    await sharpData
        .resize(width, height)
        .toFile(thumbnailName);
}
async function getImage(fileName, width, height) {
    const directoryPathToThumbnails = './thumbnails';
    const files = await getImageList(directoryPathToThumbnails);
    // file name managed in the systm.
    const fileNameNoExt = fileName.split('.')[0];
    const fileExtend = fileName.split('.')[1];
    const thumbnailName = fileNameNoExt + width.toString() + 'x' + height.toString() + '.' + fileExtend;
    const thumbnailAbsolute = directoryPathToThumbnails + path_1.default.sep + thumbnailName;
    if (thumbnailName in files) {
        console.log("Loading from a cache");
    }
    else {
        console.log("Creating in a cache");
        await createThumbnail(fileName, width, height);
    }
    return await fs_1.default.createReadStream(thumbnailAbsolute);
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
