function progressStatus (req, res) {

    const uploadProgress = req.uploadProgress;
    const fileId = req.query.fileId; // Assuming the client sends the file ID as a query parameter
    console.log('fileId:', fileId);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send the current progress to the client every second
    const intervalId = setInterval(() => {
        console.log(uploadProgress);
        if (uploadProgress[fileId]) {
            const progress = uploadProgress[fileId];
            const percentage = Math.floor((progress.received / progress.total) * 100);

            res.write(`data: ${JSON.stringify({ progress: percentage })}\n\n`);

            if (progress.finished) {
                clearInterval(intervalId);
                res.write(`data: ${JSON.stringify({ progress: 100 })}\n\n`);
                res.end();
            }
        } else {
            res.write(`data: ${JSON.stringify({ progress: 0 })}\n\n`);
        }
    }, 100);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
}

module.exports = {
    progressStatus
};