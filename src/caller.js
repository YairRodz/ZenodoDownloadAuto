import ExtractChemFiles from './extractChemFiles.js';

// Check if an argument is provided
if (process.argv.length < 3) {
    console.log("Usage: node caller.js <URL or file path>");
    console.log("Example (URL): node caller.js https://example.com/path/to/zipfile.zip");
    console.log("Example (File Path): node caller.js ./path/to/local/zipfile.zip");
    process.exit(1); // Exit the script with a non-zero error code
}

const argument = process.argv[2]; // Get the command line argument

function isUrl(string) {
    return /^https?:\/\//.test(string);
}

if (isUrl(argument)) {
    // It's a URL, use fromUrl
    ExtractChemFiles.fromUrl(argument)
        .then(extractor => extractor.generateHtml())
        .catch(error => console.error('An error occurred with URL:', error));
} else {
    // It's a file path, use fromFile
    ExtractChemFiles.fromFile(argument)
        .then(extractor => extractor.generateHtml())
        .catch(error => console.error('An error occurred with file:', error));
}
