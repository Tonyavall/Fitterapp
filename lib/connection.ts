import { connect, connection } from 'mongoose'
import 'detenv'

const connectionString =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Foodsy';

connect(connectionString);

module.exports = connection;