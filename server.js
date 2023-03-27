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
    host : '127.0.0.1',
    port : 5432, //database port
    user : 'postgres',
    password : 'OTTIElee7',
    database : 'FaceRec'
  }
});

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => res.send('success'));
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });


app.listen(3000, () => {
	console.log('running on port 3000');
})