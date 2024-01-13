const expApp = require('./index');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
const APP_PORT = process.env.PORT ;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
});

expApp.listen(APP_PORT, () => {
    console.log(`Server is running on ${APP_PORT}`);
}
);