
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import router from './routes/index';
const rateLimit = require("express-rate-limit");

// whitelist
const whitelist = ['http://localhost:3000', 'http://localhost:3001']
const corsOptions = {
    origin: function (origin: string, callback: Function) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

// limitter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });


const app = express();
const port = 3000;
app.use(morgan("common"));
app.use(helmet());
//app.use(cors(corsOptions));
app.use(limiter);
// router
app.use('/api', router);

var options = {
    'method': 'GET',
    'url': '',
    'headers': {
        'Authorization': ''
    }
};

// Code snipped for express.js
app.all('/*', function(req, res, next){
    console.log('Page Called' + req.path);
    console.log('IP address' + req.ip);
    next();
});

app.get('/hello', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})