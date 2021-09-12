import express, { HttpException, Request, Response, NextFunction } from 'express';
import createError  from 'http-errors';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
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
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// router
app.use('/image', image);
app.use(function(request: Request,
                response: Response,
                next: NextFunction) {
    next(createError(404));
});
app.use(function(error: HttpException,
                request: Request,
                response: Response,
                next: NextFunction) {
    response.status(error.status || 500);
    response.send(error);
});
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


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

export default app;