import fs from 'fs';
import JSZip from 'jszip';
import fetch from 'node-fetch';
import path from 'path';
import crypto from 'crypto';

class ExtractChemFiles {
    constructor(source, outputDir) {
        this.zip = null;
        this.source = source;
        this.outputDir = outputDir;
    }

    static async fromUrl(zipUrl) {
        // Create a hash from the URL to use as a unique folder name
        const hash = crypto.createHash('md5').update(zipUrl).digest('hex');
        const outputDir = path.join(__dirname, `fromURL_${hash}`);
        const instance = new ExtractChemFiles(zipUrl, outputDir);
        const response = await fetch(zipUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch ZIP: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        instance.zip = await JSZip.loadAsync(arrayBuffer);
        return instance;
    }

    static async fromFile(filePath) {
        const outputDir = path.dirname(filePath);
        const instance = new ExtractChemFiles(filePath, outputDir);
        const data = fs.readFileSync(filePath);
        instance.zip = await JSZip.loadAsync(data);
        return instance;
    }

    async generateHtml() {
        if (!this.zip) {
            throw new Error('ZIP file has not been loaded.');
        }

        // Create the images directory within the output directory
        const filesOfInterestDir = path.join(this.outputDir, 'filesOfInterest');
        fs.mkdirSync(filesOfInterestDir, { recursive: true });

        let tableRows = `<tr><th>File Name</th><th>Preview & Download</th></tr>`;
        const filePromises = [];

        for (const [relativePath, zipEntry] of Object.entries(this.zip.files)) {
            const uniqueFileName = relativePath.replace(/[/\\:]/g, '_');
            const filePath = path.join(filesOfInterestDir, uniqueFileName);
        
            if (relativePath.endsWith('.png')) {
                const promise = zipEntry.async("nodebuffer").then((buffer) => {
                   fs.writeFileSync(filePath, buffer);
                    const relativePath = path.relative(this.outputDir, filePath);
                    tableRows += `<tr>
                        <td>${relativePath}</td>
                        <td><a href="${relativePath}" download="${uniqueFileName}"><img src="${relativePath}" style="width:100px; cursor:pointer;"></a></td>
                    </tr>`;
                });
        
                filePromises.push(promise);
            } else if (relativePath.endsWith('.mol') || relativePath.endsWith('.sdf')) {
                const promise = zipEntry.async("nodebuffer").then((buffer) => {
                    fs.writeFileSync(filePath, buffer);
                    const relativePath = path.relative(this.outputDir, filePath);
                    tableRows += `<tr>
                        <td>${relativePath}</td>
                        <td><a href="${relativePath}" download="${uniqueFileName}">${relativePath}</a></td>
                    </tr>`;
                });
        
                filePromises.push(promise);
            } else if (relativePath.endsWith('.mnova')) {
                const promise = zipEntry.async("nodebuffer").then((buffer) => {
                    fs.writeFileSync(filePath, buffer);
                    const relativePath = path.relative(this.outputDir, filePath);
                    const iconPath = path.join('iconImages', 'mnovaIcon.png');
                    tableRows += `<tr>
                        <td>${relativePath}</td>
                        <td><a href="${relativePath}" download="${uniqueFileName}"><img src="${iconPath}" style="width:30px; height:30px;"> ${relativePath}</a></td>
                    </tr>`;
                });
        
                filePromises.push(promise);
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

        // Write the HTML file in the output directory
        const htmlFilePath = path.join(this.outputDir, 'table.html');
        await fs.promises.writeFile(htmlFilePath, htmlContent);
        console.log(`HTML table generated successfully at ${htmlFilePath}.`);
    }
}

export default ExtractChemFiles;
