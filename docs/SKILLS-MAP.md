# How this project uses your learned skills

Reference: [Raul Kelly — Software Engineering Career Track, Foundations to Core](https://www.credential.net/6f64d5d4-7184-4b50-b53c-4d1665d2a6a3).

The credential was reviewed on October 17, 2026. It identifies Springboard as issuer and September 15, 2026 as the issue date. Its certificate image describes JavaScript, React.js, Python, Flask, Node, Express, Redux, and MongoDB, and topics including foundational web development, Git/GitHub, intermediate JavaScript, JavaScript and APIs, React views, and full-stack backend development.

This implementation uses a coherent JavaScript subset of those skills. Python/Flask and Redux are not needed for this app's current size. Their omission does not mean they were absent from the certificate. A certificate does not establish which individual techniques you prefer or have mastered; this map explains the choices made here.

| Learned area | Where to find it | What to explain |
| --- | --- | --- |
| HTML and CSS | `client/index.html`, `client/src/styles.css` | Semantic forms, labels, Grid/Flexbox, responsive breakpoints |
| JavaScript | `server/services/jobs.js`, `client/src/api.js` | Arrays, objects, modules, validation, async/await, integer-cent pricing |
| React | `client/src/App.jsx`, `client/src/components/` | Components, props, state, effects, controlled inputs, conditional rendering |
| Node.js | `server/index.js`, `package.json` | Server runtime, npm scripts, environment variables |
| Express and REST APIs | `server/app.js`, `server/routes/jobs.js` | Middleware, GET/POST/PATCH, request validation, status codes, error handling |
| MongoDB | `server/models/Job.js`, `server/services/store.js` | Mongoose schemas, indexed queries, persistent documents, conditional updates |
| Testing | `tests/jobs.test.js`, `tests/api.test.js` | Business-rule tests and HTTP integration tests using Node's test runner |
| Git and GitHub | `.gitignore`, `README.md` | Suggested workflow: initialize a repo, commit source and lockfile, publish, connect to Render |
| Deployment | `render.yaml` | Build the React client, start Express, configure private database environment variables |

## Suggested code-reading order

1. Follow a submitted form from `RequestForm.jsx` to `App.jsx` to `api.js`.
2. Read the POST route and `createJob()` validation.
3. Read `updateJob()` and explain why a quote must be accepted before arrival.
4. Trace server cents into `money()` for display.
5. Compare memory storage with MongoDB storage and explain persistence.
6. Read the tests that reject a skipped workflow step and unconfirmed payment.

The source is intentionally plain JavaScript/JSX with explicit functions and small modules. Vite is a build tool for React, not a separate application framework. No claim is made that you personally authored or completed review of this generated implementation.
