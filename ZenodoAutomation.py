import os
import requests
import itertools
import csv

# Define the path to the file that contains your ACCESS_TOKEN
# For example 'C:\\Users\\mary\\docs\\ZenodoAuto\\access_token.txt'
token_file_path = 'C:\\Users\\yairl\\Intership\\ZenodoDownloadAuto\\access_token.txt'

# Open the file in read mode
with open(token_file_path, 'r') as token_file:
    # Read the ACCESS_TOKEN from the file
    ACCESS_TOKEN = token_file.read().strip()

def download_file(download_url, save_path):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    response = requests.get(download_url, stream=True)
    with open(save_path, 'wb') as fd:
        for chunk in response.iter_content(chunk_size=128):
            fd.write(chunk)

def write_to_csv(save_path, data):
    with open(save_path, 'w', newline='', encoding='utf-8-sig') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Title', 'Description', 'Creators', 'Upload Type'])
        writer.writerows(data)

def search_and_download(author_name=None, community_name=None):
    global ACCESS_TOKEN
    if author_name:
        author_names = author_name.split()
        author_permutations = [' '.join(permutation) for permutation in itertools.permutations(author_names)]
        queries = [f'creators.name:"{name}"' for name in author_permutations]
        query = ' OR '.join(queries)
    else:
        query = ''
    if community_name:
        if query:
            query += ' AND '
        query += f'communities:"{community_name}"'
    response = requests.get('https://zenodo.org/api/records',
                            params={'access_token': ACCESS_TOKEN, 'q': query})

    data = response.json()

    records_data = []
    for record in data['hits']['hits']:
        print(f"Description: {record['metadata'].get('description', 'N/A')}")
        print(f"Title: {record['metadata'].get('title', 'N/A')}")
        print(f"Creators: {record['metadata'].get('creators', 'N/A')}")
        print(f"Upload Type: {record['metadata'].get('upload_type', 'N/A')}")
        if record['files']:
            download_url = record['files'][0]['links']['self']
            title = record['metadata'].get('title', 'N/A')
            safe_title = "".join(c if c.isalnum() else "_" for c in title)
            save_path = os.path.join('repositoryData', f"{safe_title}.zip")
            download_file(download_url, save_path)
            records_data.append([record['metadata'].get('title', 'N/A'), record['metadata'].get('description', 'N/A'), record['metadata'].get('creators', 'N/A'), record['metadata'].get('upload_type', 'N/A')])
        else:
            print("This record has no files to download.")
    if records_data:
        csv_path = os.path.join('repositoryData', 'records.csv')
        write_to_csv(csv_path, records_data)

if __name__ == "__main__":
    while True:
        author_name = input("Enter the name of the author (or press Enter to quit): ")
        if not author_name:
            break
        community_name = input("Enter the name of the community (or press Enter to skip): ")
        search_and_download(author_name or None, community_name or None)