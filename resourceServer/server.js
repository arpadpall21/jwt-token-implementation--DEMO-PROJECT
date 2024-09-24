const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = 3000;

const db = require('./fakeDb');
const app = express();
app.use(express.json());


app.get('/posts', authenticate, (req, res) => {
  if (db.posts[`${req.user}`]) {
    res.json({ posts:db.posts[`${req.user}`] });
    return;
  }

  res.json({ posts:[] });
});

app.post('/posts', authenticate, (req, res) => {
  const userName = req.user;

  if (!db.posts[userName]) {
    db.posts[userName] = [];
  }

  db.posts[userName].push(...req.body.posts);

  res.status(200);
  res.end();
});

app.delete('/posts', authenticate, (req, res) => {
  const userName = req.user;
  delete db.posts[userName];

  res.status(200);
  res.end();
});

function authenticate(req, res, next) {
  const authHearder = req.get('authorization');
  const jwtToken = authHearder && authHearder.split(' ')[1];

  if (!jwtToken) {
    res.sendStatus(401);
  }

  jwt.verify(jwtToken, process.env.ACCES_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.error(err);
        res.sendStatus(403);
        res.end();

        return;
      }

      req.user = user.userName;
      next();
  });
}

app.listen(port, () => {
  console.info(`resource server is runing on port ${port}...`);
});
