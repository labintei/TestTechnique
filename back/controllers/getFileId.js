function getFileId(req, res) {
    const uploadProgress = req.uploadProgress;
    console.log('uploadProgress:', uploadProgress);
    const fileId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    uploadProgress[fileId] = { received: 0, total: 0, started: false};
    res.json({ fileId });
}

module.exports = getFileId;