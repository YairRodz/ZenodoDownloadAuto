# ZENODO DATA RETRIEVAL AND GENERATION OF LIST CHEMICAL FILES OF INTEREST

This project consists of two main components, both aimed at facilitating the retrieval and processing of chemical study data from Zenodo, an open-access repository where researchers can share and preserve their research outputs.

The first component is a script named `ZenodoAutomation.js`, this script interacts with the Zenodo API to perform searches based on author and community criteria and it retrieves ZIP files that match these criteria.

The second component is a JavaScript script named `extractChemFiles`. This script processes the ZIP files downloaded by `ZenodoAutomation.js`, extracting files that are of particular interest for chemical studies, specifically focusing on the NMR (Nuclear Magnetic Resonance) field.

# Zenodo Automation

The Zenodo Automation script interfaces with the Zenodo API to automate the process of downloading files associated with two search criteria: author and community. The script is currently being developed in two parallel versions: JavaScript (`ZenodoAutomation.js`) and Python (`ZenodoAutomation.py`), please refer to the appropriate section in this Readme for instructions on how to run each version.

## ZenodoAutomation.js – JavaScript Version

 `ZenodoAutomation.js` is a JavaScript script that interfaces with the Zenodo API to automate the process of downloading files associated with two search criteria: author and community.

## Requirements

To run these scripts, you will need the following:

- Node.js: An open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser.
- npm (Node Package Manager): A package manager for the JavaScript programming language. It is the default package manager for the JavaScript runtime environment Node.js.

You will also need the following Node.js packages:

- axios: A promise-based HTTP client for the browser and Node.js.
- fs (File System): A built-in Node.js package for working with the file system.
- path: A built-in Node.js package for working with file and directory paths.
- csv-writer: A package for creating CSV strings or writing them directly to a file.
- unzipper: A package for extracting zip files.
- yargs: A package for building interactive command line tools.
- jszip: A package for creating, reading, and editing .zip files.
- node-fetch: A package for making HTTP requests.

You can install Node.js and npm from the [official Node.js website](https://nodejs.org/). After you have installed Node.js and npm, you can install the necessary Node.js packages using the following commands in your terminal:

```bash
npm install axios
npm install csv-writer
npm install unzipper
npm install yargs
npm install jszip
npm install node-fetch
```

Please note that you don't need to install `fs` and `path` as they are built-in modules in Node.js.

## Setup

To get started, download or clone the repository.

To run the script successfully, you need to provide a valid Zenodo access token. Follow these steps to do this:
- Create a text file called "access_token.txt" and save it in the root directory of the repository.
- Follow the instructions on [Zenodo](https://developers.zenodo.org/#quickstart-upload) to create the token.
- Open the "access_token.txt" file and paste your Zenodo access token into it, save the file and close it.
- The script will automatically read the access token from this file.

If the "resultsSearch" folder does not exist, the script will create it automatically. All the downloaded files will be stored in this folder.

## Usage

1. Run the script:

```bash
node ZenodoAutomationJavascript.js
node ZenodoAutomationJavascript.js
node ZenodoAutomationJavascript.js --authorName "Author's Name" --communityName "Community Name" --userName "Your Name"
node ZenodoAutomationJavascript.js --authorName "Damien Jeannerat" --userName "DamienJeanneratAsUserName"
```

2. Enter the user name.

3. When prompted enter the desired search term (author name and the community), if you do not have either criterion, simply press the enter key to leave the field blank.

4. If there are files linked to the entered search criteria, they will be downloaded to the "resultsSearch" folder inside the folders called “Content” the Zip files will be automatically decompressed into the folder named "Decompressed".

5. Finally, the script will automatically generate a JSON log of the downloaded files, this log will save information about each search in a JSON file in the "resultsSearch" directory, the name of each JSON file includes the author's name, the community name, the start and end time of the search (in milliseconds), the user name, and the date of the search. The information saved in each JSON file includes the start and end time of the search in both milliseconds and standard time format, as well as the search criteria used.

Please note that this script has been tested on Windows operating systems. For other operating systems, you may need to modify the script to handle differences in path syntax.

## Known Issues in the JavaScript Version

### Error When Searching by Author Name

In the current JavaScript version, there is an error when searching by author name and changing the start by last names instead of first names, this error can result in several unhandled rejections, as shown below:

Unhandled rejection Error: invalid signature: 0x46445025 ... Unhandled rejection Error: invalid signature: 0xa0d656e ... Unhandled rejection Error: invalid signature: 0x656c6946 ... Unhandled rejection Error: invalid signature: 0x474e5089 ... Unhandled rejection Error: invalid signature: 0x474e5089 ... Unhandled rejection Error: invalid signature: 0x46445025 ...

Maybe these errors are caused by an issue with the `unzipper` library, which is used to unzip the downloaded files.

### Empty Content Folders

Additionally, was observed that the Content folders are mostly left empty of files, this issue is being addressed for resolution in future updates..

## ZenodoAutomation.py – Python Version

 `ZenodoAutomation.py` is a Python script that interfaces with the Zenodo API to automate the process of downloading files associated with two search criteria: author and community.

## ZenodoAutomation.py – Python version
Currently, the Python version of the script is behind in development and has fewer features and more bugs than the JavaScript version.

ZenodoAutomation.py  is a Python script that connects to the Zenodo API to automate downloading files linked to two search criteria: author and community.

## Requirements

- Python 3.x
- pip
- import os
- import requests
- import itertools
- import csv

## Setup

To get started, download or clone the repository.

To run the script successfully, provide a valid Zenodo access token. Follow these steps to do this:
- Create a text file called "access_token.txt" and save it in the root directory of the repository.
- Follow the instruction on [Zenodo](https://developers.zenodo.org/#quickstart-upload) to create the token.
- Open the "access_token.txt" file and paste your Zenodo access token into it, save the file and close it.
- Open the script called `ZenodoAutomation.py` and make sure that the "access_token.txt" document is located in the same folder where the script is located. Remember that this file should contain your personal access token obtained from Zenodo, for this reason, is important to note that this is personal data and you should be careful to prevent accidentally share or expose the file.

If the "repositoryData" folder does not exist, the script will create it automatically, all the downloaded files will be stored in this folder.

## Usage

1. Run the script:
   
```
python ZenodoAutomationPython.py
python3 ZenodoAutomationPython.py
python3 ZenodoAutomationPython.py --author "Author Name" 
python3 ZenodoAutomationPython.py --community "Community Name"
python3 ZenodoAutomationPython.py --author "Author Name" --community "Community Name"
python3 ZenodoAutomationPython.py --author "Damien Jeannerat" 

```

3. Enter the desired search term.

4. When prompt enter the author name, and the community and if you do not have either criterion, simply press the enter key to leave the field blank.

5. If there are files linked to the entered search criteria, they will be downloaded to the "repositoryData" folder.

6. Finally, the script will automatically generate a CSV log of the downloaded files in the /`./repositoryData folder` , this log will include details associated with the downloaded files.

Please note that this script has only been tested on Windows operating systems. For other operating systems, you may need to modify the script to handle differences in path syntax.

# Javascript extraction from local .zip file and generation of list files of interest

`extractChemFiles.js` is a JavaScript script that interfaces with the local file system to automate the process of extracting files of interest from a .zip file and generating an HTML table listing these files.

## Requirements

To run this script, you will need the following:

- Node.js: An open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser.
- npm (Node Package Manager): A package manager for the JavaScript programming language. It is the default package manager for the JavaScript runtime environment Node.js.

You will also need the following Node.js packages:

- fs (File System): A built-in Node.js package for working with the file system.
- path: A built-in Node.js package for working with file and directory paths.
- JSZip: A package for creating, reading, and editing .zip files.
- node-fetch: A package for making HTTP requests.

You can install Node.js and npm from the [official Node.js website](https://nodejs.org/). After you have installed Node.js and npm, you can install the necessary Node.js packages using the following commands in your terminal:

```bash
npm install jszip
npm install node-fetch
```

Please note that you don't need to install `fs` and `path` as they are built-in modules in Node.js.

## Setup

To get started, download or clone the repository.

To run the script successfully, you need to provide a valid .zip file. This can be either a local file path or a URL. The script will automatically extract the files of interest from the .zip file and generate an HTML table listing these files.

If the output directory does not exist, the script will create it automatically. The HTML table will be saved as `table.html` in the output directory.

## Usage

1. If you run the script without providing a source for the .zip file, you will see the following usage instructions:

```bash
$ node src/caller.js
Usage: node caller.js <URL or file path>
Example (URL): node caller.js https://example.com/path/to/zipfile.zip
Example (File Path): node caller.js ./path/to/local/zipfile.zip
```

2. Provide the source of the .zip file. This can be either a local file path or a URL. It is suggested to use the .zip files obtained in the `resultSearch` folder when using the `ZenodoAutomationJavascript.js` script. Therefore, you should use the correct path specified for Linux or Windows.

For Windows, you should use double backslashes (`\\`) in your file paths, like so:

```bash
node src/caller.js "C:\\path\\to\\your\\zipfile.zip"
```

For Linux, you can use forward slashes (`/`) in your file paths, like so:

```bash
node src/caller.js "/path/to/your/zipfile.zip"
```

Remember to replace `/path/to/your/zipfile.zip` or `C:\\path\\to\\your\\zipfile.zip` with the actual path to your .zip file.

3. The `caller.js` script will call the `ExtractChemFiles` class methods from `extractChemFiles.js`. It takes a .zip file (either from a URL or a local file path) as an argument, creates an instance of `ExtractChemFiles`, and calls the `generateHtml()` method to generate the HTML table.

4. The script will automatically extract files of interest (`.png`, `.mol`, `.sdf`, and `.mnova` files) from the .zip file and generate an HTML table listing these files.

5. The extracted files will be saved in a directory within the current directory. The directory will be named `fromURL_<hash>` if the source is a URL, where `<hash>` is a unique hash generated from the URL. If the source is a local file, the files will be saved in the same directory as the .zip file. Within this directory, the extracted files will be saved in a subdirectory named `filesOfInterest`.

6. The HTML table will be saved as `table.html` in the same directory as the extracted files. This table provides a preview and download link for each extracted file.

## Example

You can use the `wget` command (on Linux) or `curl` command (on Windows) to download a .zip file from a URL, and then use the `caller.js` script to process the .zip file:

For Linux:

```bash
wget https://zenodo.org/records/1146869/files/sample1.zip
node src/caller.js sample1.zip
```

For Windows:

```bash
curl -O https://zenodo.org/records/1146869/files/sample1.zip
node src/caller.js sample1.zip
```

The output will be saved as `table.html` in the same directory as the extracted files.

## Known Issues

Please note that while `caller.js` is supposed to also work with URLs, this feature was not working at the time of writing. For now, this option can be ignored.

# Proposed Future Enhancements

Here are some suggestions for future enhancements to the project:

## Generalize the File Extraction Process

Instead of programming each case (.png, .mol, .mnova, etc.) separately, consider creating a method to generalize this process. One possible implementation could involve using a .json file where we specify the types of files we're interested in, and whether we should have a download option (when clicked), or a preview (like `<img...>`). The advantage of this approach is that adding new features wouldn't require changing the JavaScript code, but only the `fileOfInterestDefinition.json` file.

## Variant of src/caller.js

Consider creating a variant of `src/caller.js` that calls `src/extractChemFiles.js` for each existing zip file in the `resultSearch` folder, instead of needing to point to a specific .zip file. This could further automate the process and save user time.

# Related links

[Demo downloading a remote zip file](html/demoListFilesFromZip.html)

[Demo downloading a remote zip file and shows and download on click on .png files](html/demoListFilesAndShowsPNG.html)

[Demo downloading a remote zip file and shows and enlarge on click on .png files](html/demoZoomImages.html)

[Demo downloading a remote zip file and allows to dowload zip files with Bruker spectra](html/zipBrukerDataFromRepository.html)