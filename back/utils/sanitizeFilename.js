const path = require("path");

function sanitizeFilename(filename) {
    // Extract the base name and extension
    const extension = path.extname(filename);
    let baseName = path.basename(filename, extension);
  
    // Sanitize the base name by removing problematic characters
    // This regex replaces anything that is not alphanumeric, underscore, or hyphen
    baseName = baseName.replace(/[^\w-]/g, '_');
  
    // Construct the full sanitized filename
    const sanitizedFilename = `${baseName}${extension}`;
    return sanitizedFilename;
}

module.exports = {
    sanitizeFilename,
};