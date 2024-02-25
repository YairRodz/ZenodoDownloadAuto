import ExtractChemFiles from './extractChemFiles.js';

// Provide help if no argument is given
if (process.argv.length < 3) {
    console.log("Usage: node caller.js <URL or file path>");
    console.log("Example (URL): node caller.js https://example.com/path/to/zipfile.zip");
    console.log("Example (File Path): node caller.js ./path/to/local/zipfile.zip");
    process.exit(1);
}

const argument = process.argv[2]; // Get the command line argument

function isUrl(string) {
    return /^https?:\/\//.test(string);
}

async function processZip(source) {
    try {
        const extractor = isUrl(source)
            ? await ExtractChemFiles.fromUrl(source)
            : await ExtractChemFiles.fromFile(source);
        await extractor.generateHtml();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


processZip(argument);
