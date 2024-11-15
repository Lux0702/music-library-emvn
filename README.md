# Music Library API

This is a RESTful API for managing a music library, where users can perform operations like searching, creating, updating, and deleting tracks and playlists.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Run the API](#run-the-api)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/Lux0702/music-library-emvn.git
    ```

2. Navigate to the project directory:

    ```bash
    cd music-library-emvn
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Make sure to create a `.env` file in the root of your project with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/music_library_api
UPLOAD_PATH=./uploads

CLOUD_NAME=dwev7nm6r
CLOUD_API_KEY=436472459367319
CLOUD_API_SECRET=p_oB2kAuc_yxr1xWGxN_mudiV1g
```
## Database
If you need to restore the database from a `.tar.gz` backup file located in the `database/backup` folder, follow these steps:

1. **Navigate to the backup directory:**
   
   First, ensure you are in the root directory of your project and navigate to the `database/backup` folder where your `.tar.gz` backup file is stored:

   ```bash
   cd database/backup
   ```
   Use the tar command to extract the .tar.gz file. Replace mongodb_backup.tar.gz with the actual name of your backup file.
   ```bash
   tar -xzvf mongodb_backup.tar.gz
   ```
## Restore the Database Using MongoDB:
   ```bash
  mongorestore --uri="mongodb://localhost:27017" --db=music_library_api path/to/database/backup/mongodb_backup
  ```
## Run the API
To run the API locally, use the following command:

```bash

npm start
This will start the server on the port defined in the .env file (default: 5000). You can access the API at:
http://localhost:5000
```
## API Endpoints
Tracks
```bash
Create a Track
POST /api/tracks
Create a new music track. Requires the following body fields:

title: Title of the track.
artist: Artist of the track.
album: Album of the track.
genre: Genre of the track.
releaseYear: Year of release.
duration: Duration of the track (in seconds).
mp3File: MP3 audio file (optional).
Get All Tracks
GET /api/tracks
Fetch all the tracks in the library.
```
Update a Track
```bash
PUT /api/tracks/:id
Update an existing track by ID. You can update any field of the track.
```

Delete a Track
```bash
DELETE /api/tracks/:id
Delete a track by its ID.
```

Search Tracks
```bash
GET /api/tracks/search?q=<query>
Search tracks based on title, artist, album, or genre.
```

Playlists
```bash
Create a Playlist
POST /api/playlists
Create a new playlist. Requires the following body fields:

title: Title of the playlist.
description: Description of the playlist.
albumCover: Image file for the album cover (optional).
Get All Playlists
GET /api/playlists
Fetch all playlists.
```
Update a Playlist
```bash

PUT /api/playlists/:playlistId
Update an existing playlist by ID.
```
Delete a Playlist
```bash

DELETE /api/playlists/:playlistId
Delete a playlist by its ID.
```
Add a Track to a Playlist
```bash
POST /api/playlists/:playlistId/tracks/:trackId
Add an existing track to a playlist.
```

Get Playlist in M3U Format
```bash
GET /api/playlists/:playlistId/m3u
Get a playlist in M3U format.
```
### Frontend Interface
To access the frontend interface of the Music Library, you can use the following GitHub repository:

Frontend GitHub Repository: [music-library-FE](https://github.com/Lux0702/music-library-FE)
