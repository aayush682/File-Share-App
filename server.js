const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT;
const cors = require('cors');
const fileRoute = require('./routes/fileRoute');
const showFileRoute = require('./routes/showFile');
const downloadFileRoute = require('./routes/downloadFile');
const db = require('./config/db');
db();

//Cors
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}

//Middleware
app.use(express.json());
app.use(cors(corsOptions));

//Templates Engines
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Static Files
app.use(express.static('public'));


//routes
app.use('/api/files', fileRoute);
app.use('/files', showFileRoute);
app.use('/files/download', downloadFileRoute);


app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
})