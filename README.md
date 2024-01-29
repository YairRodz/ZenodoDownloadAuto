# Zenodo Automation

The Zenodo Automation script interfaces with the Zenodo API to automate the process of downloading files associated with two search criteria: author and community. The script is currently being developed in two parallel versions: JavaScript (`ZenodoAutomation.js`) and Python (`ZenodoAutomation.py`), please refer to the appropriate section in this Readme for instructions on how to run each version.

## ZenodoAutomation.js – JavaScript Version

 `ZenodoAutomation.js` is a JavaScript script that interfaces with the Zenodo API to automate the process of downloading files associated with two search criteria: author and community.

## Requirements

- Node.js
- npm
- axios
- fs
- path

You can install the necessary Node.js packages using npm:

```bash
npm install axios fs path
```

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
node ZenodoAutomation.js
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
python ZenodoAutomation.py
```

3. Enter the desired search term.

4. When prompt enter the author name, and the community and if you do not have either criterion, simply press the enter key to leave the field blank.

5. If there are files linked to the entered search criteria, they will be downloaded to the "repositoryData" folder.

6. Finally, the script will automatically generate a CSV log of the downloaded files, this log will include details associated with the downloaded files.

Please note that this script has only been tested on Windows operating systems. For other operating systems, you may need to modify the script to handle differences in path syntax.
