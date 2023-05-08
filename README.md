# JWT token implementation

## Description
- Access & refresh token implementation with JWT Token

## Setup
- Run `npm install` to install packages locally
- Start the resource server with `npm resourceServer/server.js` (listens on http://localhost:3000)
- Start the authentication server with `npm authServer/server.js` (listens on http://localhost:3001)

## Architecture
There are 2 servers with distinct responsibilities 
- The Resource Server (responsible for resource management)
- The Authentication Server (responsible for Authentication & session token management)

## Usage (follow the `test.rest` example)
- The user signs in on `POST localhost:3001/signup`
- The user logs in on `POST localhost:3001/login` (receives the access token through cookies)
- The resource server (`localhost:3000`) is accessible with the received Access Token, as header `Authorization Bearer <accessToken>`
- The Access Token expires in 1 minute after this time the resource server is not accessible with the expired token
- A new access token can be requested on `POST localhost:3001/refresh` (which is valid for another 1 minute and so on)
- The user can log out on `POST localhost:3001/logout`