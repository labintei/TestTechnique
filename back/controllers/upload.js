const multer = require("multer");
const { sanitizeFilename } = require("../utils/sanitizeFilename");

// Configure the storage location and filename
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        // Sanitize the filename before saving
        callback(null, sanitizeFilename(file.originalname));
    }
});

// Mocking the diskStorage function
multer.diskStorage = function (options) {
    this.getFilename = options.filename;
    this.getDestination = options.destination;
};

const upload = multer({ storage: storage }).array('files');
// const upload = multer({ storage: storage }).single('file');

// Upload the file and track the progress
function uploadFile(req, res) {

    console.log('uploadFile');

    const uploadProgress = req.uploadProgress;
    // Initialize progress tracking
    let fileId = req.query.fileId; // Assuming the client sends the file ID as a query parameter

    if(!fileId) {
        return res.status(400).send('File ID is required');
    }
    if(!uploadProgress[fileId]) {
        return res.status(400).send('Invalid file ID');
    }
    // Set the total file size using the content-length header
    uploadProgress[fileId] = { received: 0, total: req.headers['content-length'] };
    
    upload(req, res, function(err) {
        if (err) {
            console.log('ici');
            console.log(err);
            return res.end("Error uploading file.");
        }
        uploadProgress[fileId].finished = true;
        res.end("File is uploaded");
    });
    // Track progress and update the received bytes
    req.on('data', (chunk) => {
        uploadProgress[fileId].received += chunk.length;
    });
}

module.exports = {
    uploadFile
};

// const multer = require("multer");
// const { sanitizeFilename } = require("../utils/sanitizeFilename");

// // Configure the storage location and filename
// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './uploads');
//     },
//     filename: function (req, file, callback) {
//         // Sanitize the filename before saving
//         callback(null, sanitizeFilename(file.originalname));
//     }
// });

// // Mocking the diskStorage function
// multer.diskStorage = function (options) {
//     this.getFilename = options.filename;
//     this.getDestination = options.destination;
// };

// const upload = multer({ storage: storage }).array('files'); // Change from single to array

// // Upload the files and track the progress
// function uploadFiles(req, res) {
//     console.log('uploadFiles');

//     const uploadProgress = req.uploadProgress;
//     // Assuming the client sends the file IDs as query parameters
//     const fileIds = req.query.fileIds; // Array of file IDs

//     if (!fileIds || !Array.isArray(fileIds)) {
//         return res.status(400).send('File IDs are required');
//     }

//     fileIds.forEach(fileId => {
//         if (!uploadProgress[fileId]) {
//             return res.status(400).send('Invalid file ID');
//         }
//         // Set the total file size using the content-length header
//         uploadProgress[fileId] = { received: 0, total: req.headers['content-length'] };
//     });

//     upload(req, res, function(err) {
//         if (err) {
//             console.log(err);
//             return res.end("Error uploading files.");
//         }
//         fileIds.forEach(fileId => {
//             uploadProgress[fileId].finished = true;
//         });
//         res.end("Files are uploaded");
//     });

//     // Track progress and update the received bytes
//     req.on('data', (chunk) => {
//         fileIds.forEach(fileId => {
//             uploadProgress[fileId].received += chunk.length;
//         });
//     });
// }

// module.exports = {
//     uploadFiles
// };
