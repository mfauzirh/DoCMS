require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");
const session = require('express-session');

// const { logger } = require('./middleware/logEvents');
// const errorHandler = require('./middleware/errorHandler');
const port = process.env.PORT || 5000

const app = express()

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}))

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// custom middleware logger
// app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// Configure express-session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
  }));

// Swagger API Documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));

app.use('/documentations', require('./routes/api/documentations'));
app.use('/versioning', require('./routes/api/versioning'))
app.use('/chapters', require('./routes/api/chapters'));
app.use('/sections', require('./routes/api/sections'));

// Authentication
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// app.use(errorHandler);

app.listen(port, () => {
    console.log('Connected to MongoDB');
    console.log(`Server live on port ${port}`)
})