require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const opn = require('opn');

const router = require('./router')
const errorMidleware = require('./middlewares/error-middlewares');
const { storageConfig, fileFilter } = require('./service/file-service');



const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(__dirname + '/client/build/'));
app.use(multer({ storage: storageConfig, fileFilter, dest: "uploads" }).single("file"));
app.use('/', router);

app.use(errorMidleware);


const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => {
      // if (!process.env.APP_DEVELOPMENT.indexOf('dev'))
      //   opn(`http://localhost:${PORT}`);
      console.log(`Сервер запушен на порту ${PORT}!`)
    })    
  } catch (error) {
    console.log('Error', error);
  }
}
start();



