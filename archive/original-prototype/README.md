# VMS — Vehicle Mobile Service

Independent, editable capstone prototype for roadside and at-home mechanic service. No ChatGPT account, OpenAI hosting, API keys, or npm dependencies are required to run the website.

## Open in VS Code

Open this folder: `C:\Users\raulk\Desktop\VMS\vms-render`.

Files to edit:

- `public/index.html`: page structure and metadata.
- `public/styles.css`: colors, typography, responsive layout.
- `public/app.js`: driver and mechanic demo flows.
- `server.js`: local preview server.
- `render.yaml`: Render Static Site configuration.

## Run locally

Install Node.js if it is not already available. In the VS Code terminal, run:

```sh
npm start
```

Open http://localhost:3000. Stop the preview with Ctrl+C. Run `npm run build` for JavaScript syntax checks. The checked-in `public` directory is the deployable website; no compilation or dependency installation is needed.

## Deploy to your Render account

1. Create a GitHub repository for this project. In VS Code, open this folder, use Source Control > Initialize Repository, commit the files, and Publish to GitHub. Publish the contents of this folder as the repository root.
2. Sign in at https://dashboard.render.com in your own account.
3. Select New > Static Site and connect that GitHub repository.
4. Set Build Command to `npm run build`.
5. Set Publish Directory to `public`. Leave Root Directory blank when this folder is the repository root.
6. Create the Static Site. Render supplies its own HTTPS URL after deployment.

Alternatively, create a Render Blueprint from the repository; the included `render.yaml` defines the Static Site.

If you upload the entire parent VMS folder instead, set Root Directory to `vms-render` for the manual Static Site setup.

The Render copy runs independently of the existing ChatGPT-hosted copy and does not require ChatGPT sign-in. Future Git pushes to the connected branch can trigger Render deployments. This project has not yet been deployed to your Render account.

Official instructions: https://render.com/docs/static-sites and https://render.com/docs/blueprint-spec.

## Try the demo

1. In Driver view, enter a location, vehicle, and issue, then submit a request.
2. Switch to Mechanic and send an itemized quote.
3. Switch to Driver to accept it.
4. In Mechanic view, mark arrival, start service, and finish service.
5. In Driver view, confirm the vehicle is running, rate the service, and complete the demo payment.
6. View the receipt in My services.

## Current scope

This is a frontend prototype, not a live dispatch platform. One shared demo request and service history are stored in the browser's localStorage on each origin. They do not synchronize across devices, accounts, or tabs in real time. Hosting it on Render does not add a database or real users. Existing data on the ChatGPT-hosted origin will not transfer automatically.

Mechanic profiles, distances, ETA, map, calls, video consultation, and payments are simulated. No charges or real calls occur. Fonts load from Google Fonts, with local font fallbacks.

A production version needs authentication and separate roles, a backend/database, real location and matching, realtime job updates, communication integrations, and payment processing.
