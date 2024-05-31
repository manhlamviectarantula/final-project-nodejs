const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser');
const multer = require('multer');

dotenv.config()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());

require('./dbs/mongo')
app.use('/', require('./routes'))

module.exports = app;