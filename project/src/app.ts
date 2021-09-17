import express from 'express';
import morgan from 'morgan'; // log output
import helmet from 'helmet'; // secure header
import cors from 'cors'; // Cross-Origine
import rateLimit from 'express-rate-limit';
import image from './routes/image/index';

const app = express()
const port = 3000

app.use(morgan("common"));
app.use(helmet());

// whitelist
const allowedOrigins = ['http://localhost:3000'];
const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(corsOptions));

// limitter
const limitter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limitter);

// router
app.use('/image', image);

/**
* Describe processes that are common to all the requests here.
* @param '/*' Any requests coming
*/
app.all('/*', function(request, response, next){
    console.log('IP address' + request.ip);
    next();
});

/**
 * Default path for the health check purpose.
 */
app.get('/', (req, res) => {
    res.send('This is the face page for image handling middleware');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

export default app;