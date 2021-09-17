import { getImageList, getImage, clean, uploadImage }  from '../routes/image/fileutil';
import fs from 'fs';

function delay(delayInms: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
}

describe('Test Suite for fileutil to handle images', () => {

    // utility function test
    it('Upload file', () => {
        getImageList('./original')
        .then(resolve => {
            expect(Object.keys(resolve).length).toBe(5);
        }).catch(reject => {
            // somethign unexpected
            console.log(reject);
        });
    });

    // '/getImageList'
    it('Initialize the server. Clear images and thumbnails', async () => {
        await clean();
        getImageList('./images')
        .then(resolve => {
            expect(Object.keys(resolve).length).toBe(0);
        }).catch(reject => {
            // somethign unexpected
            console.log(reject);
        });
        getImageList('./thumbnails')
        .then(resolve => {
            expect(Object.keys(resolve).length).toBe(0);
        }).catch(reject => {
            // somethign unexpected
            console.log(reject);
        });
    });

    it('Upload file, and store in images folder', async () => {
        const orgFiles = await getImageList('./original');
        const fileStream: fs.ReadStream = fs.createReadStream(orgFiles[Object.keys(orgFiles)[0]]['fullPath']);
        await uploadImage(orgFiles[Object.keys(orgFiles)[0]]['fullPath'], fileStream);

        getImageList('./images')
        .then(resolve => {
            expect(Object.keys(resolve).length).toBe(1);
        }).catch(reject => {
            // somethign unexpected
            console.log(reject);
        });
    });

    it('No image in the thumbnails after just uploaded the images', () => {
        getImageList('./thumbnails')
        .then(resolve => {
            expect(Object.keys(resolve).length).toBe(0);
        }).catch(reject => {
            // somethign unexpected
            console.log(reject);
        });
    });

    it('Get Image from file and see thumbnails are created', async () => {
        const filesForResize = await getImageList('./images');
        for (const file in filesForResize) {
            await getImage(file, 100, 100);
        }
        getImageList('./thumbnails')
        .then(resolve => {
            expect(Object.keys(resolve).length).toBe(1);
        }).catch(reject => {
            // somethign unexpected
            console.log(reject);
        });
    });

    it('Get Image from cache when already cached', async () => {
        console.log("waiting 5 seconds");
        let timestamp  = 1;
        getImageList('./thumbnails')
        .then(resolve => {
            timestamp = resolve[Object.keys(resolve)[0]]['date'];
        }).catch(reject => {
            // somethign unexpected
            console.log(reject);
        });
        await delay(3000);
        expect(Date.now()).toBeGreaterThan(timestamp);
    });
});