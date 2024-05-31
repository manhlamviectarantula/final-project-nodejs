const mongoose = require('mongoose');

class Mongo {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        .then(() => {
            console.log('Database connection successful');
        })
        .catch(error => {
            console.log('Database connection error');
        });
    }
}

module.exports = new Mongo();