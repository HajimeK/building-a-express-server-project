import express, { Request, Response, NextFunction } from 'express';
import createError  from 'http-errors';
import morgan from 'morgan'; // log output
import helmet from 'helmet'; // secure header
import cors from 'cors'; // Cross-Origine
import rateLimit from 'express-rate-limit';
import image from './routes/image/index';
//import cookieParser from "cookie-parser";

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
// app.use(function(request: Request,
//                 response: Response,
//                 next: NextFunction) {
//     next(createError(404));
// });
// app.use(function(error: Error,
//                 request: Request,
//                 response: Response) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     response.send(error);
// });
/**
* all
* @param '/*' Any requests coming
* @param Function functions that processes the
* @return NA
*/
app.all('/*', function(request, response, next){
    console.log('Page Called' + request.path);
    next();
});

app.get('/', (req, res) => {
    res.send('This is the face page for image handling middleware');
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

export default app;