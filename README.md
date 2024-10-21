# Web Application developed with React JS And Node JS

## DESCRIPTION

This app is a test for the lagos group and consist of a front-end app that consumes the node API
that fetch the data from the public itunes API and search for the artist name and returns a list of results.
The content of the list is a table containing the artist information.

## PROJECT STRUCTURE

we have two main folders

- front
- backend

### VARIABLES

Now we need the following environment variables

MONGO_PASS=pass
MONGO_USER=youruse
SESSION_SECRET_KEY=Xb1AmPAR4HILeA18
PUBLIC_API_ITUNES=https://itunes.apple.com

### How to run the app

first of all you need to install the dependencies using the following command inside the root foolder
with yarn

```bash
yarn
```

OR with npm

```bash
npm install
```

And inside of the main folders you run the same command

```bash
cd front && yarn && cd ../backend && yarn && cd ..
```

And finally we run the application
In the root folder we run the following command

```bash
yarn start
```

open app [GO_TO_APP](http://localhost:4000)
