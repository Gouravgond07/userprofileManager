const mongoose = require('mongoose');
const { mongodbConfig } = require('./index');
if (mongodbConfig.MONGO_ENVIRONMENT === 'dev') {
    mongoose.set('debug', true);
}
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: mongodbConfig.user,
    pass: mongodbConfig.pass
}

const connection = mongoose.createConnection(`mongodb://${mongodbConfig.host}:${mongodbConfig.port}/${mongodbConfig.dbName}`, options);

module.exports = connection;