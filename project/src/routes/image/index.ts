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
* @return json format of the image list
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
* @param image file name stored in the images folder
* @param width width of the image to get
* @param height height of the image to get
* @return the image file resized.
*/
images.get('/get', function(request: express.Request,
                            response: express.Response)
{
    try {
        const fileName: string = (request.query.image as string);
        const width: number = parseInt(request.query.width as string);
        const height: number = parseInt(request.query.height as string);
        console.log('Getting an image :' + fileName);
        // Check if the file size is valid or not
        if (width > 0 && height > 0) {
            console.log('Width = ' + width.toString());
            console.log('Height = ' + height.toString());
        } else {
            throw new Error("Invalid height/width parameters")
        }

        getImage(fileName, width, height)
        .then( resolve => {
            const fileNameArr = fileName.split('.');
            const fileExt = fileNameArr[fileNameArr.length - 1];
            resolve.pipe(response);
            return response.status(200).type(fileExt); // to work with not only with jpg, but pnd and others
        })
        .catch(error => {
            return response.status(400).send("Invalid original file names. Please check with /image/list to see if the files exists.");
        });
    } catch(error) {
        return response.status(400).send("Invalid height/width parameters");
    }
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
* Upload an image.
* curl --location --request POST 'http://localhost:3000/image/upload' \
* --form 'image=@"<path to the file>/encenadaport.jpg"'
*/
images.post('/upload', imageUpload.single('image'), (request, response) => {
    console.log(request.file);
    response.sendStatus(200);
});

/**
* Delete an image
* @param image name
*/
images.delete('/delete', function(request, response) {
    // not implemented
    return response.sendStatus(400);
});

/**
* clean up all the images including cache
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