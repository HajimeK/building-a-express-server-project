import express from 'express';
import multer from 'multer';
import { getImageList, getImage, clean }  from './fileutil';
import path from 'path';

const images =  express.Router();
images.get('/', (req, res) => {
    console.log(path.resolve('./'));
    res.send('raouted to image');
});

// // for maintenance
images.use(express.static(__dirname + '/images'));
images.use('/images', express.static('images'));
images.use(express.static(__dirname + '/thumbnails'));
images.use('/thumbnails', express.static('/thumbnails'));

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the 
* @return NA
*/
images.get('/list', function(request, response) {
    getImageList('./images')
    .then(resolve => {
        return response.send(resolve);
    })
    .catch(reject => {
        return response.send(reject);
    });
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the
* @return NA
*/
images.get('/get', function(request: express.Request,
                            response: express.Response)
{
    console.log('image');
    const fileName: string = (request.query.image as string);
    const width: number = parseInt(request.query.width as string);
    const height: number = parseInt(request.query.height as string);
    console.log('Getting an image :' + fileName);
    console.log('Width = ' + width.toString());
    console.log('Height = ' + height.toString());
    getImage(fileName, width, height)
    .then( resolve => {
        return response.status(200).send(resolve);
    })
    .catch(error => {
        return response.status(400).send(error);
    });
});

const imageUpload = multer({
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, 'images/');
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        }
    ),
});
/**
* Getting a  list of uploaded images
* curl --location --request POST 'http://localhost:3000/image/upload' \
* --form 'image=@"<path to the file>/encenadaport.jpg"'
* @param '/*' Any requests coming
* @param Function functions that processes the
* @return NA
*/
images.post('/upload', imageUpload.single('image'), (request, response) => {
    console.log(request.file);
    response.sendStatus(200);
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the 
* @return NA
*/
images.delete('/delete', function(request, response) {
    // not implemented
    return response.sendStatus(400);
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the
* @return NA
*/
images.get('/clean', function(request, response) {
    clean()
    .then(() => {
        return response.sendStatus(200);
    })
    .catch(error => {
        return response.send(error);
    });
});


export default images;