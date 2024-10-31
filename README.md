# LoopIn
How to Set up and Deploy:

---These instructions are specifically aimed at render changes might need to made for other hosting methods---
## Url and requests in the client and server need to be updated and changed to your preferences/sites

## Set up Web service:
  - On render create new web service
  - link the git repositry and connect
  - set local region
  - set the root directory to server
  - set build command to npm install
  - set start command to node server.js
  - add a new enviroment variable called DATABASE_URL to your postgresql URI
  - and then deploy

## Set up static site:
  - On render create new static site
  - link the git repositry and connect
  - set the root directory to client
  - set build command to npm run build
  - set publish directory to dist
  - and then deploy
