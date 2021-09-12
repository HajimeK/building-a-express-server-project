"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var port = 3000;
var options = {
    'method': 'GET',
    'url': '',
    'headers': {
        'Authorization': ''
    }
};
// Code snipped for express.js
app.all('/*', function (req, res, next) {
    console.log('Page Called' + req.path);
    console.log('IP address' + req.ip);
    next();
});
app.get('/hello', function (req, res) {
    res.send('Hello, world!');
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
