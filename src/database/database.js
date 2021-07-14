const mongoose = require('mongoose');

let url = 'mongodb://localhost:27017/jsw'

mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(db => console.log('Base de datos conectada :)'))
    .catch(err => console.error(err));