import { connect, connection } from 'mongoose'

import dotenv from 'dotenv'
dotenv.config()

connect(process.env.MONGODB_URI || 'mongodb://localhost/Final', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = connection;