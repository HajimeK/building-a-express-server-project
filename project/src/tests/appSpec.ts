import request from 'supertest';
import app from '../app';

const req = request(app);

describe('Test Suite for building an express server project', () => {
    // '/getImageList'
    it('Initialize the server. Clear images and thumbnails', async () => {
        await req
            .get('/image/clean')
            .expect(200)
            .expect ( (response) => {
                console.log(response.body);
            });
    });

    // '/getImageList'
    it('Get image list after initial should be 0.', async () => {
        await req
            .get('/image/list')
            .expect(200)
            .expect ( (response) => {
                expect(Object.keys(response.body).length).toBe(0);
            });
    });

    // '/uploadImage'
    it('Upload an image', async () => {
        await req
            .post('/image/upload')
            .attach('image', 'original/encenadaport.jpg')
            .expect(200)
            .expect ( (response) => {
                console.log(response.body);
            });
    });

    // '/getImageList'
    it('Get image list after the first upload should be 1.', async () => {
        await req
            .get('/image/list')
            .expect(200)
            .expect ( (response) => {
                expect(Object.keys(response.body).length).toBe(1);
            });
    });

    // '/getImage with size'
    it('Getting a file which exists, but not in the cache', async () => {
        await req
            .get('/image/get')
            .query({ image: "encenadaport.jpg", width: 100, height: 100 })
            .expect(200)
            .expect ( (response) => {
                console.log(response.body);
            });
    });

    // '/getImage with the same size'
    it('Getting a file which exists, also in the cache', async () => {
        await req
            .get('/image/get')
            .query({ image: "encenadaport.jpg", width: 100, height: 100 })
            .expect(200)
            .expect ( (response) => {
                console.log(response.body);
            });
    });

    it('Getting a file which dows not exist', async () => {
        await req
            .get('/image/get')
            .query({ image: "notexist.jpg", width: 100, height: 100 })
            .expect(400)
            .expect ( (response) => {
                console.log(response.text);
            });
    });

    it('Getting a file with wrong query size', async () => {
        await req
            .get('/image/get?image=encenadaport.jpg&width=abc&height=xyz')
            .expect(400)
            .expect ( (response) => {
                console.log(response.text);
            });
    });

});