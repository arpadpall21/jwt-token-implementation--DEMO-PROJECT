# Access & Refresh JWT Token basic demo

## Architecture
There are 2 servers with distinct responsibilities 
- the Resource Server (responsible for resource management)
- the Authentication Server (responsible for Authentication & session token management)

## Setup
- run `npm install` to install packages locally
- start the resource server with `npm resourceServer/server.js` (listens on `localhost:3000`)
- start the authentication server with `npm authServer/server.js` (listens on `localhost:3001`)

## Usage (follow the `test.rest` example)
- the user signs in on `POST localhost:3001/signup`
- the user signs logs in on `POST localhost:3001/login` (receives the access token through cookies)
- the resource server `localhost:3000` is accessible by the received Access Token passed in header `Authorization Bearer <accessToken>`
- the Access Token expires in 30 minutes, so the resource server is not accessible with it after 30 minutes
- a new access token can be requested on `localhost:3001/refresh` (which is valid for another 30 minutes, then a new one should be requested on `localhost:3001/refresh` and so on)
- the user can log out on `localhost:3001/logout`