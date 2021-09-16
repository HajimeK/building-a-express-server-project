"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.clean = exports.getImageList = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
function getFileFullPath(dirCWT, file) {
    return path_1.default.join(path_1.default.resolve(dirCWT), file['name']);
}
function getImageList(dir) {
    return new Promise((resolve, reject) => {
        try {
            const fileList = fs_1.default.readdirSync(dir, { withFileTypes: true });
            const dic = {};
            fileList.forEach(function (file) {
                const full = getFileFullPath(dir, file);
                const stats = fs_1.default.statSync(full);
                if (!stats.isDirectory()) {
                    const createdDate = stats.birthtime.getFullYear().toString() + '/'
                        + ('0' + (stats.birthtime.getMonth() + 1).toString()).slice(-2) + '/'
                        + ('0' + stats.birthtime.getDate().toString()).slice(-2);
                    dic[file['name']] = { fullPath: full, size: stats.size, date: createdDate };
                }
            });
            resolve(dic);
        }
        catch (error) {
            reject();
        }
    });
}
exports.getImageList = getImageList;
async function clean() {
    const directoryPathToThumbnails = './thumbnails';
    if (fs_1.default.existsSync(directoryPathToThumbnails)) {
        const orgFiles = await getImageList(directoryPathToThumbnails);
        for (const orgfile in orgFiles) {
            await fs_1.default.promises.unlink(orgFiles[orgfile]['fullPath']);
        }
        fs_1.default.rmdirSync(directoryPathToThumbnails);
    }
    fs_1.default.mkdirSync(directoryPathToThumbnails);
    const directoryPathToImages = './images';
    if (fs_1.default.existsSync(directoryPathToImages)) {
        const files = await getImageList(directoryPathToImages);
        for (const file in files) {
            //console.log(file);
            await fs_1.default.promises.unlink(files[file]['fullPath']);
        }
        fs_1.default.rmdirSync(directoryPathToImages);
    }
    fs_1.default.mkdirSync(directoryPathToImages);
}
exports.clean = clean;
async function uploadImage(file) {
    const buffer = fs_1.default.createReadStream(file);
    const sharpData = (0, sharp_1.default)();
    buffer.pipe(sharpData);
    //console.log(path.sep);
    const pathes = file.split(path_1.default.sep);
    const fileName = pathes[pathes.length - 1];
    await sharpData.toFile('./images/' + fileName);
}
async function createThumbnail(file, width, height) {
    const files = await getImageList('./images');
    const fileNameNoExt = file.split('.')[0];
    const fileExtend = file.split('.')[1];
    const thumbnailName = './thumbnails/' + fileNameNoExt + width.toString() + 'x' + height.toString() + '.' + fileExtend;
    const buffer = fs_1.default.createReadStream(files[file]["fullPath"]);
    const sharpData = (0, sharp_1.default)();
    buffer.pipe(sharpData);
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
    return new Promise((resolve, reject) => {
        try {
            resolve(fs_1.default.createReadStream(thumbnailAbsolute));
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getImage = getImage;
async function main() {
    await clean();
    const orgFiles = await getImageList('./original');
    for (const orgfile in orgFiles) {
        await uploadImage(orgFiles[orgfile]['fullPath']);
    }
    const files = await getImageList('./images');
    console.log(files);
    for (const file in files) {
        await createThumbnail(file, 200, 200);
    }
    const filesForResize = await getImageList('./images');
    for (const file in filesForResize) {
        await getImage(file, 100, 100);
    }
}
void main();
