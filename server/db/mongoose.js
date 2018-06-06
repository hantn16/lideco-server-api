var mongoose = require('mongoose');
const connection = process.env.MONGO_URL || 'mongodb://localhost:27017/SaleReportApp';
mongoose.Promise = global.Promise;
mongoose.connect(connection,(e) =>{
    if (e) {
        console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
        throw e;
      }
    console.log('Connect successfully!!!');
});

module.exports = mongoose;