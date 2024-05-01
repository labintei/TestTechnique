const express = require('express');
const { uploadFile } = require('./controllers/upload');
const { progressStatus } = require('./controllers/progress');
const { getFileId } = require('./controllers/getFileId');

const app = express();
const PORT = 9898;
// const PORT = 4200;
var cors = require('cors');

app.use(cors());


// Configure the static folder
app.use(express.static('public'));

app.options('/getFileId', (req, res) => {
    // Ajoutez les en-têtes CORS appropriés
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send();
});

const uploadProgress = {};

// Middleware to track the upload progress
function progressTracker(req, res, next) {
    req.uploadProgress = uploadProgress;
    next();
}

app.use(progressTracker);

// Routes for getting the file ID before uploading
app.post('/getFileId', progressTracker, getFileId);
// Routes for uploading files
app.post('/upload', progressTracker, uploadFile);
// Routes for tracking the upload progress once the client has the file ID
app.get('/progress', progressTracker, progressStatus);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});