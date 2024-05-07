const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//Db connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB Connection successful');
});

//Server
const port = process.env.PORT;
// const HOST = '0.0.0.0';

app.listen(port, () => {
  console.log(`App runing on port ${port}... `);
});
