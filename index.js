const express = require('express');
const app = express();
const config = require("./config");
const mongoose = require('mongoose');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const layout = require("express-ejs-layouts");
const flash = require('connect-flash');
const PORT = config.port || 3000;
const dbURL = config.dbURL;
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("layout", "./inc/layout");
app.use(express.static("./public"));
app.use(layout);
app.use(flash());

app.use(expressSession({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}))

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then((result) => {
  app.listen(PORT)
  console.log('Site hazır !')
})
.catch((error) => {
console.log('Site hazır değil !')
})

app.use(require('./routers/main'));
app.use(require('./routers/posts'));

//404 sayfası
app.use(function (req, res, next) {
  res.status(404).send("Sayfa Bulunamadı !")
})