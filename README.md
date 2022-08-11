# HalloApp Web Client

## Pre-requisites

1. Have npm and node installed (preferably with NVM as NVM allows for switching between different versions of npm/node, if/when needed) [Resource](https://github.com/nvm-sh/nvm#install--update-script)
   ```
   curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash 
   ```

 2. Install an IDE (VSCode is preferred with Volar extension)
 
## Dev Environment

1. Clone this repo, go into it
2. Install the modules ```npm install``` (if successful, the node_modules dir will be created and populated)
3. ```npm run dev``` (go to https://localhost:3000)

## Dev Environment CORS

Since dev is hosted on localhost, fetching assets from HalloApp's production sites will be blocked by CORS.  For now, we circumvent this by using an external proxy service: https://cors-anywhere.herokuapp.com/corsdemo, which requires the user to go and request permission to use the service once every 24 hours (there's a big button on the site for this).  Furthermore, please note that if too many requests or too much data is requested every hour, the service will throttle usage for that hour.

## Protobufs

The proto files are built and gathered from the [Schemas repo](https://github.com/HalloAppInc/schemas).
They will need to be re-generated for the web client whenever there are (needed) updates.

Note: Need version 7.x of protobufjs and uses protobufjs-cli

1. Go to /src/proto
2. Delete the old server.d.ts and server.js
3. Generate the javascript file clients.js<br>
   ```../../node_modules/protobufjs-cli/bin/pbjs -t static-module -w es6 -o server.js server.proto```
4. Generate the typescript file server.d.ts<br>
   ```../../node_modules/protobufjs-cli/bin/pbts -o server.d.ts server.js```

Repeat (steps 1 to 4) for each proto file that's needed

Note2: During web.js generation there's a bug where protobufjs redeclared end2 in the same block, modify web.js and change end2 to end3 to continue
