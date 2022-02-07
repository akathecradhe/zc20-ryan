require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const enforce = require('express-sslify');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(session({
  secret: '846P36BDitZs2s66UP'
}));

const corsOptions = {
  origin: 'http://localhost:8081'
};

app.use(express.static('dist'));
app.use('/public', express.static('public'));

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes/participant.routes')(app);
require('./app/routes/organisation.routes')(app);
require('./app/routes/trainer.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/logout.route')(app);
require('./app/routes/calculator.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'));
});

const db = require('./app/models');

db.sequelize.sync();
