const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const port = 3001;
const accessTokenExpiresInMin = 2;

const db = require('./fakeDb');
const app = express();
app.use(express.json(), cookieParser());


app.post('/singup', (req, res) => {
  const { name: userName, password: userPassword } = req.body.user;

  if (db.password[userName]) {
    res.status(409);
    res.end();
    return;
  }

  db.password[userName] = userPassword;

  res.status(200);
  res.send({ message: 'singup OK' });
  res.end();
});

app.post('/login', (req, res) => {
  const { name: userName, password: userPassword } = req.body.user;

  if (db.password[userName] && db.password[userName] === userPassword) {
    let refreshToken;
    const dbRefreshToken = db.refreshToken[userName];

    if (dbRefreshToken) {
      refreshToken = dbRefreshToken;
    } else {
      refreshToken = generateRefreshToken(userName);
      db.refreshToken[userName] = refreshToken;
    }

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('accessToken', generateAccessToken(userName, accessTokenExpiresInMin), { httpOnly: true });

    res.status(200);
    res.send({ message: 'login OK' });
    res.end();
    return;
  }

  res.status(401);
  res.end();
});

app.post('/refresh', (req, res) => {
  const { name: userName } = req.body.user;
  const refreshToken = req.cookies.refreshToken;

  if (db.refreshToken[userName] && db.refreshToken[userName] === refreshToken) {
    res.cookie('accessToken', generateAccessToken(userName, accessTokenExpiresInMin), { httpOnly: true });

    res.status(200);
    res.send({ message: 'token refresh OK' });
    res.end();
    return;
  }

  res.status(401);
  res.end();
});

app.post('/logout', (req, res) => {
  const { name: userName } = req.body.user;
  const refreshToken = req.cookies.refreshToken;

  if (db.refreshToken[userName] && db.refreshToken[userName] === refreshToken) {
    delete db.refreshToken[userName];
    res.cookie('refreshToken', '', { httpOnly: true });
    res.cookie('accessToken', '', { httpOnly: true });

    res.status(200);
    res.send({ message: 'logout out OK' });
    res.end();
    return;
  }

  res.status(401);
  res.end();
});

function generateAccessToken(userName, expiresInMin = 30) {
  return jwt.sign({ userName }, process.env.ACCES_TOKEN_SECRET, { expiresIn: `${Number.parseInt(expiresInMin)}m` });
}

function generateRefreshToken(userName) {
  return jwt.sign({ userName }, process.env.REFRESH_TOKEN_SECRET);
}

app.listen(port, () => {
  console.info(`authentication server is runing on port ${port}...`);
});
