# LOFINO Programming Task

Welcome to the LOFINO Full Stack Programming Task! Your task is to complete a small Express/React application concerned with Berlins subway network.

## Introduction

Berlin has 9 subway `line`s (U1 to U9). Each of those stop at a number of `station`s and run from a starting station to an end station and back.

All of those lines have been assigned a unique _color_ for easy identification.

https://en.wikipedia.org/wiki/Berlin_U-Bahn

Your task is to complete the existing backend and frontend application to provide some basic navigation page for users.

## Prerequisites

- an installation of Node.js (>=14) and npm
- your favorite IDE
- a possibility to share the result, e.g Dropbox or Github

## Getting Started

### Backend

In the directory `backend_ubahn` you'll find a Node.js application with an Express server ready to be used.

```sh
# enter directory
cd backend_ubahn

# install node modules
npm ci

# run server
npm start
```

To check if the server works, you can query a dummy endpoint:

```sh
curl http://localhost:8080/hello
# -> Hello World"
```

In `src/data/lines.json` you'll find the definition of the sample data. You can access this by importing `lines` from `src/data`. You may want to postprocess the data in some way.

There's a function in `src/domain/getNextStops.ts` that you should implement, see the corresponding tests in the `__tests__` directory.

### Frontend

```sh
# enter directory
cd frontend_ubahn

# install node modules
npm ci

# run server and bundler
npm start
```

Open `http://localhost:3000/` in your web browser. It should show a welcome message and fetched data from the backend.

## Backend Tasks

Your task is to serve HTTP routes that answer a couple of questions for the line network:

1. given a `line` that is passed with a GET request, which stations are served by the line?
2. given a `line` that is passed with a GET request and a `station` belonging to the line, what are the next N stops relative to the passed station?
   - a value for N can be passed optionally via the route. Default: 3
   - a value for the `direction` can be optionally passed via the route. See `src/domain/getNextStops.ts`. Default: `forward`
3. given a `line` and a `station` that are passed with a GET request, which other lines are accessible at that station?
4. given two `station`s, how can a passenger navigate from the first station to the second station?
   - see the `getRoute()` function for further explanation and tests
   - any valid route suffices, you don't need to optimize for distance etc.

Implement the functionality in the corresponding functions in the `src/domain/` folder and make sure any corresponding tests in the `src/domain/__tests__` directory pass by running `npm run test`.

## Frontend Tasks

Your task here is to provide an interactive React application that queries the backend and presents the results to the user.

1. fetch line infos via backend route `GET /lines`
2. provide a possibility to the user to select one of those lines
3. once selected, list the stations of that line
4. the stations are selectable. When selecting a station:
   - fetch the accessible lines for that station from the backend and display them
   - color the background of the station names according to their colors (see [here](<https://en.wikipedia.org/wiki/U5_(Berlin_U-Bahn)>) for examples)
   - query the backend for the next `3` stops on the selected line and show them to the user.

For an example on how the frontend _could_ look like, refer to [this rough scetch](frontend_ubahn/example/frontend-example.png).

## Notes

- Feel free to use third party modules where appropriate. You may also change the structure of the files the way you think is appropriate.
- Some of the software structure is not great. Feel free to refactor existing modules as you please.
- You may also change the signature of the domain functions to pass in more appropriate data structures
- There are tests for the backend part. Make sure they pass for the tasks that you're working on. Feel free to extend the tests where appropriate.
  - to run the tests, run `npm run test-watch` in the backend.
- Focus on code quality and working software, try to follow best practices. Treat the final version of your solution like the first MR you open at a new company.
- Keep an eye on security, usability etc.
- That said, you don't need to make this project "production ready". At this point we only care about the code you write to implement the requirements.
- Feel free to add comments on the code if you want to explain something or on a place that could be improved
  - you can also add comments on the bottom of this document

## Your Notes

Here you can add your own notes and comments about the project.
For example, what trade offs did you have to decide for? What would you have done differently if you had more time?
What did you think of the tasks? Was it too much / too easy / too ambiguous?
