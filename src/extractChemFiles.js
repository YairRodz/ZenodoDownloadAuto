
import fs from 'fs';
import JSZip from 'jszip';
import fetch from 'node-fetch'; // Now directly using ESM import
import path from 'path';
class ExtractChemFiles {
    constructor() {
        this.zip = null; // Placeholder for the JSZip instance
    }

    // Static factory method to create an instance from a URL
    static async fromUrl(zipUrl) {
        const instance = new ExtractChemFiles();
        const response = await fetch(zipUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch ZIP: ${response.statusText}`);
        }
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        instance.zip = await JSZip.loadAsync(arrayBuffer);
        return instance;
    }

    // Static factory method to create an instance from a local file
    static async fromFile(filePath) {
        const instance = new ExtractChemFiles();
        const data = fs.readFileSync(filePath);
        instance.zip = await JSZip.loadAsync(data);
        return instance;
    }
   async generateHtml() {
        if (!this.zip) {
            throw new Error('ZIP file has not been loaded.');
        }

        // Create the images directory if it does not exist
        const imagesDir = './images';
        fs.mkdirSync(imagesDir, { recursive: true });

        let tableRows = `<tr><th>File Name</th><th>Preview & Download</th></tr>`;

        const filePromises = [];

        for (const [relativePath, zipEntry] of Object.entries(this.zip.files)) {
            if (relativePath.endsWith('.png')) {
                // Generate a unique filename by including the enclosing folder name
                const uniqueFileName = relativePath.replace(/[/\\:]/g, '_');
                const imgFilePath = path.join(imagesDir, uniqueFileName);

                const promise = zipEntry.async("nodebuffer").then((buffer) => {
                    fs.writeFileSync(imgFilePath, buffer);
                    tableRows += `<tr>
                        <td>${relativePath}</td>
                        <td><a href="${imgFilePath}" download="${uniqueFileName}"><img src="${imgFilePath}" style="width:100px; cursor:pointer;"></a></td>
                    </tr>`;
                });

                filePromises.push(promise);
            } else {
                tableRows += `<tr><td>${relativePath}</td><td></td></tr>`;
            }
        }

        // Wait for all the files to be processed
        await Promise.all(filePromises);

        // Generate the HTML content
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ZIP Contents</title>
            </head>
            <body>
                <table>${tableRows}</table>
            </body>
            </html>`;

        // Write the HTML file
        await fs.promises.writeFile('table.html', htmlContent);
        console.log('HTML table generated successfully.');
    }
}

export default ExtractChemFiles;