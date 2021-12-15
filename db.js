const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' })

mongoose
  .connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connexion success!', process.env.DB_LOCAL);
  })
  .catch((err) => { console.log("Failed to connect to MongoDB", err)});

//const connection = mongoose.createConnection(process.env.DB_LOCAL);