import axios from 'axios';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import unzipper from 'unzipper';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

// Declare and initialize global variables at the top of the script
let searchCount = 0;
let searchId = 0;

const argv = yargs(hideBin(process.argv)).options({
    authorName: { type: 'string', demandOption: false, alias: 'a' },
    communityName: { type: 'string', demandOption: false, alias: 'c' },
    userName: { type: 'string', demandOption: false, alias: 'u' }
}).argv;

const tokenFilePath = './access_token.txt';
const ACCESS_TOKEN = fs.readFileSync(tokenFilePath, 'utf8').trim();

const downloadFile = async (downloadUrl, savePath) => {
    const writer = fs.createWriteStream(savePath);
    const response = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const writeToFile = async (savePath, data) => {
    const csvWriter = createCsvWriter({
        path: savePath,
        header: [
            {id: 'upload_type', title: 'Upload Type'},
            {id: 'publication_type', title: 'Publication Type'},
            {id: 'image_type', title: 'Image Type'},
            {id: 'publication_date', title: 'Publication Date'},
            {id: 'title', title: 'Title'},
            {id: 'creators', title: 'Creators'},
            {id: 'description', title: 'Description'},
            {id: 'access_right', title: 'Access Right'},
            {id: 'license', title: 'License'},
            {id: 'embargo_date', title: 'Embargo Date'},
            {id: 'access_conditions', title: 'Access Conditions'},
            {id: 'doi', title: 'DOI'},
            {id: 'prereserve_doi', title: 'Prereserve DOI'},
            {id: 'keywords', title: 'Keywords'},
            {id: 'notes', title: 'Notes'},
            {id: 'related_identifiers', title: 'Related Identifiers'},
            {id: 'contributors', title: 'Contributors'},
            {id: 'references', title: 'References'},
            {id: 'communities', title: 'Communities'},
            {id: 'grants', title: 'Grants'},
            {id: 'journal_title', title: 'Journal Title'}
        ]
    });

    await csvWriter.writeRecords(data);
};

function createMetadata(upload_type, publication_type, image_type, publication_date, title, creators, description, access_right, license, embargo_date, access_conditions, doi, prereserve_doi, keywords, notes, related_identifiers, contributors, references, communities, grants, journal_title) {
    return {
        upload_type,
        publication_type,
        image_type,
        publication_date,
        title,
        creators,
        description,
        access_right,
        license,
        embargo_date,
        access_conditions,
        doi,
        prereserve_doi,
        keywords,
        notes,
        related_identifiers,
        contributors,
        references,
        communities,
        grants,
        journal_title
    };
}

const searchAndDownload = async (authorName = null, communityName = null, userName) => {
    searchCount++;
    searchId++;
    const searchDate = new Date();
    const searchFolder = `Search_${searchCount}_${searchDate.getDate()}_${searchDate.getMonth()+1}_${searchDate.getFullYear()}_${searchDate.getHours()}h${searchDate.getMinutes()}m${searchDate.getSeconds()}s`;
    const searchPath = path.join('resultsSearch', searchFolder);
    fs.mkdirSync(searchPath, { recursive: true });
    const searchStartTimeMS = searchDate.getTime();
    const searchStartTime = new Date(searchStartTimeMS).toISOString();
    

    let query = '';
    if (authorName) {
        query = `metadata.creators.person_or_org.name:"${authorName}"`;
    }
    if (communityName) {
        query += query ? ' AND ' : '';
        query += `communities:"${communityName}"`;
    }

    const response = await axios.get('https://zenodo.org/api/records', {
        params: {access_token: ACCESS_TOKEN, q: query}
    });

    const data = response.data;
    const recordsData = [];

    for (const record of data.hits.hits) {
        const recordFolder = `theZenodo_${record.id}`;
        const recordPath = path.join(searchPath, 'Results', recordFolder);
        fs.mkdirSync(recordPath, { recursive: true });

        const contentPath = path.join(recordPath, 'Content');
        fs.mkdirSync(contentPath, { recursive: true });

        const decompressedPath = path.join(recordPath, 'Decompressed');
        fs.mkdirSync(decompressedPath, { recursive: true });

        const metadataPath = path.join(recordPath, 'metadataFile');
        fs.mkdirSync(metadataPath, { recursive: true });

        const metadata = createMetadata(
            record.metadata.upload_type,
            record.metadata.publication_type,
            record.metadata.image_type,
            record.metadata.publication_date,
            record.metadata.title,
            record.metadata.creators,
            record.metadata.description,
            record.metadata.access_right,
            record.metadata.license,
            record.metadata.embargo_date,
            record.metadata.access_conditions,
            record.metadata.doi,
            record.metadata.prereserve_doi,
            record.metadata.keywords,
            record.metadata.notes,
            record.metadata.related_identifiers,
            record.metadata.contributors,
            record.metadata.references,
            record.metadata.communities,
            record.metadata.grants,
            record.metadata.journal_title
        );

        recordsData.push(metadata);

    fs.writeFileSync(path.join(metadataPath, 'metadata.json'), JSON.stringify(metadata, null, 2));
 
    if (record.files && record.files.length > 0) {
        const downloadUrl = record.files[0].links.self;
        const title = record.metadata.title || 'N/A';
        const safeTitle = title.replace(/\W/g, '_');
        const savePath = path.join(contentPath, `Zip_${safeTitle}.zip`);
    
        await downloadFile(downloadUrl, savePath);
    
        fs.createReadStream(savePath)
            .pipe(unzipper.Extract({ path: decompressedPath }));
    
        recordsData.push(metadata);
    } else {
        console.log("This record has no files to download.");
    }
    }
    
    const searchEndDate = new Date();
    const searchEndTimeMS = searchEndDate.getTime();
    const searchEndTime = new Date(searchEndTimeMS).toISOString();


    const searchInfo = {
        searchId,
        authorName,
        communityName,
        searchStartTimeMS,
        searchEndTimeMS,
        searchStartTime,
        searchEndTime,
        userName,
        searchDate: searchDate.toISOString().split('T')[0],
        criteria: recordsData
    };

    const fileName = `${authorName}_${communityName}_${searchStartTimeMS}_${searchEndTimeMS}_${userName}_${searchDate.toISOString().split('T')[0]}.json`.replace(/:/g, '-');
    fs.writeFileSync(path.join(searchPath, fileName), JSON.stringify(searchInfo));
    
    if (recordsData.length > 0) {
        const csvPath = path.join(searchPath, 'records.csv');
        await writeToFile(csvPath, recordsData);
    }};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

const main = async () => {
    let userName = argv.userName;
    if (!userName) {
        userName = await askQuestion("Enter your name: ");
    }

    let authorName = argv.authorName;
    let communityName = argv.communityName;

    if (!authorName) {
        while (true) {
            authorName = await askQuestion("Enter the name of the author (or press Enter to quit): ");
            if (!authorName) {
                rl.close();
                break;
            }
            communityName = await askQuestion("Enter the name of the community (or press Enter to skip): ");
            await searchAndDownload(authorName, communityName, userName);
        }
    } else {
        await searchAndDownload(authorName, communityName || null, userName);
        process.exit(); // Exit after completing the search
    }
};

main();
