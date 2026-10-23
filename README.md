# VMS-Project — Vehicle Mobile Service

A readable full-stack capstone application using **JavaScript, React, Node.js, Express, and MongoDB/Mongoose**. Drivers describe roadside or at-home vehicle problems; the demo mechanic proposes a quote, the driver accepts, and both sides advance the service through a simulated payment.

## Run on your computer

Requirements: Node.js 22.12 or later and npm. No API keys are required for demo mode.

```sh
npm install
npm run dev
```

Open **http://localhost:5173**. Vite serves React and forwards `/api` requests to Express on port 3001. Keep both processes running; Ctrl+C stops them. `npm run dev` uses the default port 3001; if you change the backend port, update the proxy in `client/vite.config.js` too.

For the production version locally:

```sh
npm run build
npm start
```

Open **http://localhost:3001**. Express serves the built React app and the API from the same origin.

```sh
npm test
```

Tests cover server validation, price calculations, request transitions, completion confirmation, session isolation, and stale updates.

## Project layout

```text
client/src/App.jsx                 React state and page coordination
client/src/components/             Request form, job card, illustrative map
client/src/api.js                  Fetch requests and currency formatting
client/src/styles.css              Responsive CSS
server/app.js                      Express app and middleware
server/routes/jobs.js              REST endpoints
server/services/jobs.js            Input validation and job rules
server/services/store.js           Memory and MongoDB storage adapters
server/models/Job.js               Mongoose schema
tests/                            Automated backend tests
docs/                             Skills mapping, API guide, project handoff
archive/original-prototype/        Earlier standalone HTML/CSS/JS prototype
render.yaml                       Render Web Service configuration
```

The files at the root are the current application. The archive is a reference, not a second app you need to run. Original Desktop files have also been retained.

## Enable MongoDB

Copy `.env.example` to `.env`. For local MongoDB or an Atlas database, set:

```dotenv
STORAGE_MODE=mongodb
MONGODB_URI=mongodb://127.0.0.1:27017/vms
```

Use your own Atlas connection URI when hosting. Keep credentials in `.env` or Render environment variables, never in Git. A failed MongoDB connection stops startup; the app never silently switches storage. Default `memory` mode is temporary and loses requests on server restart. The database adapter is implemented, but a live MongoDB connection must be tested with your database.


## Demo walkthrough

1. Driver: enter location, vehicle, symptoms, and service type.
2. Mechanic: review the request, optionally open a consultation demo, and quote labor/parts. Travel is computed on the server using the illustrative distance.
3. Driver: accept the itemized quote.
4. Mechanic: mark arrival, start the service, then mark it finished.
5. Driver: confirm the vehicle is running, choose a rating, and complete the simulated payment.
6. My services: review the request and receipt. Open another request from history or create a new one.
