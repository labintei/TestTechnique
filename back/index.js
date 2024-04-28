const express = require('express');
const { uploadFile } = require('./controllers/upload');
const { progressStatus } = require('./controllers/progress');
const { getFileId } = require('./controllers/getFileId');

const app = express();
// const PORT = 9898;
const PORT = 4200;

// Configure the static folder
app.use(express.static('public'));

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