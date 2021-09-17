
# About

This is project to intended to provide middleware that stores and provides re-seized images APIs with **Node.js + Express.js + TypeScript**. No database is used in the project, instead stores them in file storage.

In case considering about more scaled cases, you will most probably prepare separate storage and database for effective use.

# How to try this project

## Set up

Clone the repository and run below first.
(Of course you set up npm and node.js as a prerequisite.)
```
cd project
npm install
npm run build
```

## Unit test

Following command to run the test with *Jasmine* and *supertest*.
```
cd project
npm run test
```

Be executing the above scenario, followings will be executed.

1. Initialize the server. Clear images and thumbnails
2. Get image list after initial should be 0.
3. Upload an image
4. Get image list after the first upload should be 1.
5. Getting a file which exists, but not in the cache
6. Getting a file which exists, also in the cache
7. Getting a file which dows not exist

## Run the application for test

To run the application, execute below.
```
npm run dev
```

You can start accessing the web with the following url.
```
http://localhost:3000
```

Following API methods are provided.
- list (ex. http://local:3000/image/list)
- get (ex. http://localhost:3000/image/get?image=encenadaport.jpg&width=100&height=100)
- upload (see below note)
- clean (ex. http://localhost:3000/image/clean)

You can also do some *"health check"* by simply requesting *http://local:3000/image/* to find the application is up an running.

### note

#### How to register images

At firts there is no image registered in the application.
So you need to upload.
Please refer below to see how the files to be uploaded for registration.
Only you can get the resized image which are regitered in this way.
```
curl --location --request POST 'http://localhost:3000/image/upload' \
--form 'image=@"<path to your local image>"'
```

#### Restrictions

Due to security consideration with CORS (Cross Origin Resource Sharing) , this application allows only local access. If you want to add other origins, add that source to allowedOrigins list in the [app.ts](./project/src/app.ts).



## License

Althogh I have create application from scratch in the Udacity course, please consider about the following license.

[License](LICENSE.txt)
