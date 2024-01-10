# Zenodo Automation

Zenodo Automation is a Python script that connects to the Zenodo API to automate downloading files linked to two search criteria: author and community.

## Requirements

- Python 3.x
- pip
- import os
- import requests
- import itertools
- import csv

## Setup

To get started, you'll need download or clone the repository to your local machine.

To run the script successfully, you need to provide a valid Zenodo access token. Follow these steps to do this:
- Create a text file called "access_token.txt" and save it in the root directory of the repository.
- Open the "access_token.txt" file and paste your Zenodo access token into it. Save the file and close it.
- Open the script called "ZenodoAutomation.py" and provide the correct path to the "access_token.txt" file after the equal sign (=) in the token_file_path variable and use double backslashes (\\\) to indicate the path, like this: 'C:\\\Users\\\mary\\\docs\\\ZenodoAuto\\\access_token.txt'. Remember that this file should contain your personal access token obtained from Zenodo, for this reason, is important to note that this is personal data and you should be careful to prevent accidentally share or expose the file.

If the "repositoryData" folder does not exist, the script will create it automatically, all the downloaded files will be stored in this folder.

## Usage

1. Run the script.

2. Enter the desired search term.

3. First, you will be prompted to enter the author, and then the community and if you do not have either criterion, simply press the enter key to leave the field blank.

4. If there are files linked to the entered search criteria, they will be downloaded to the "repositoryData" folder.

5. Finally, the script will ask you if you want to get a log of the downloaded files in CSV format, this log will include details associated with the downloaded files.

Please note that this script has only been tested on Windows operating systems. For other operating systems, you may need to modify the script to handle differences in path syntax.
