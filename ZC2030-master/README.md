# ZC2030 Website and API

## Installation

Make sure you have `node`, `npm` and `mysql` installed.

```bash
# Clone the repository
git clone https://github.com/ryanito/ZC2030.git

# Go inside the directory
cd ZC2030

# Install dependencies
npm install
```

Copy `.env.example` to `.env` and populate each value.

```bash
# Start development server
npm run dev
```

### Admin Credentials

When the server is started for the first time, a default administrator account is created with the following credentials:

Username | Password
------------ | -------------
admin | TD7j2Wdx

You can log in with this account at `/admin-login` to create categories, inputs and other administrator accounts.

### Development mode

In the development mode, we will have 2 servers running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

### Production mode

In the production mode, we will have only 1 server running. All the client side code will be bundled into static files using webpack and it will be served by the Node.js/Express application.

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

All the source code will be inside **src** directory. Inside src, there is a client and server directory. All the frontend code (react, css, js and any other assets) will be in the client directory. Backend Node.js/Express code will be in the server directory.

### Making Changes

Follow the installation instructions above to set up the project.

Contributors to this repository can deploy to the [Heroku instance](https://zc2030.herokuapp.com) by pushing to the **master** branch.

```bash
# On master branch
git push
```

Make sure you have tested your changes on the development server before deploying.

### API documentation

The API was developed with the aid of [Postman](https://www.postman.com/). The API documentation for this project can be found [here](https://documenter.getpostman.com/view/12117103/T1DmEzNf).
This can also be imported to your local postman instance to aid testing. With the two environment variables setup - development and production.
It is not recommended to do any data-altering requests manually to the production server.
