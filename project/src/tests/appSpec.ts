import request from 'supertest';
import app from '../app';

describe('Test Suite for building an express server project', () => {
    // '/getImageList'
    it('getImageList', async (done) => {
        await request(app)
            .get('/getImageList')
            .expect(200, done.fail)
    });
    // '/getImage'
    it('/getImage', async (done) => {
        await request(app)
            .get('/getImage')
            .expect(200, done.fail)
    });
    // '/uploadImage'
    it('/uploadImage', async (done) => {
        await request(app)
            .post('/uploadImage')
            .expect(200, done.fail)
    });
    // '/deleteImage'
    it('/deleteImage', async (done) => {
        await request(app)
            .delete('/deleteImage')
            .expect(200, done.fail)
    });
    // '/getThumbnails'
    it('/getThumbnails', async (done) => {
        await request(app)
            .get('/getThumbnails')
            .expect(200, done.fail)
    });
    // '/getThumbnail'
    it('/getThumbnail', async (done) => {
        await request(app)
            .get('/getThumbnail')
            .expect(200, done.fail)
    });
});