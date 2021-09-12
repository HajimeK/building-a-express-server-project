import express from 'express';
import fs from 'fs';
import sharp from 'sharp';
const images =  express.Router();

images.get('/', (req, res) => {
    res.send('image API');
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the 
* @return NA
*/
images.get('/getList', function(request, response) {
    console.log('Page Called' + request.path);
    const fileList = fs.readdirSync('./images', {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name);
    response.send(fileList);
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the 
* @return NA
*/
images.get('/getImage', function(request, response) 
{
    console.log('image');
    fs.readFile('./example.png', (err, data) => {
        res.type('png');
        res.send(data);
    });
    response.type('');
    response.send();
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the 
* @return NA
*/
images.get('/getThumbnails', function(request, response) {
    console.log('Page Called' + request.path);
    response.send("images added");
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the 
* @return NA
*/
images.get('/deleteImage', function(request, response) {
    console.log('Page Called' + request.path);
    response.send("images added");
});

/**
* Getting a  list of uploaded images
* @param '/*' Any requests coming
* @param Function functions that processes the 
* @return NA
*/
images.get('/replaceImage', function(request, response) {
    console.log('Page Called' + request.path);
    response.send("images added");
});


export default images;