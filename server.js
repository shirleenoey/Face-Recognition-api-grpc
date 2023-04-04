const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    // host : 'dpg-cglskq3hp8u2dv4njscg-a',
    // port : 5432, //database port
    // user : 'face_rec_database_user',
    // password : 'FucPYo7MvLinb5wIAqjvrPEvnP9lM3vR',
    // database : 'face_rec_database'
    connectionString : 'postgres://face_rec_database_user:FucPYo7MvLinb5wIAqjvrPEvnP9lM3vR@dpg-cglskq3hp8u2dv4njscg-a/face_rec_database',
    ssl : true
  }
});

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => res.send('server is live'));
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });


app.listen(process.env.PORT || 3000, () => {
	console.log(`running on port ${process.env.PORT}`);
})