/*
--------------------------
Edwin le Cointre(577328)
--------------------------
    Before Running!!!
--------------------------
Elements you need to input into the terminal:
  npm init -y
  npm install node
  npm install spotify-web-api-node readline
The node modules are deleted as per requirement, thus the program will not run if the node modules are not installed
--------------------------
To run the program in the terminal:
  node index.js
--------------------------
*/
// Assignment 1:
const SpotifyWebApi = require('spotify-web-api-node');
const readline = require('readline');

// Spotify API credentials
const spotifyApi = new SpotifyWebApi({
  clientId: '2a49552af8234223bdfdd2d0b5693e5b',
  clientSecret: 'a3380319febe45dd80d54651b3053c00'
});

// Get access token from Spotify API
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Commented out the console.log statements to prevent output
    // console.log('The access token expires in ' + data.body['expires_in']);
    // console.log('The access token is ' + data.body['access_token']);

    // Save the access token
    spotifyApi.setAccessToken(data.body['access_token']);

    // Prompt the user for a song and artist after setting the access token
    promptUserForSong();
  })
  .catch(function(err) {
    console.error('Access token error:', err);
  });

// Function to search the song and save it in a JSON object
function searchSong(songName, artistName) {

  spotifyApi.searchTracks(`track:${songName} artist:${artistName}`)
    .then(function(data) {
      const tracks = data.body.tracks.items;
      if (tracks.length > 0) {
        const song = tracks[0];
        const songDetails = {
          artists: song.artists.map(artist => artist.name).join(', '),
          songName: song.name,
          previewLink: song.preview_url || 'No preview available',
          album: song.album.name
        };
        // Print the song details in the desired format
        console.log(`Artist: ${songDetails.artists}`);
        console.log(`Song Name: ${songDetails.songName}`);
        console.log(`Preview Link: ${songDetails.previewLink}`);
        console.log(`Album: ${songDetails.album}`);
      } else {
        console.log(`No song found with the name '${songName}' by '${artistName}'.`);
      }
    })
    //Error handling:
    .catch(function(err) {
      console.error('Error occurred while searching for the song:', err);
    });
}

// Function to prompt the user for a song and artist name
function promptUserForSong() {
  const rel = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Ask user for song name and artist name
  rel.question('Enter a song name: ', (songName) => {
    if (!songName.trim()) {
      console.log('Please enter a valid song name.');
      rel.close();
      promptUserForSong();
    } else {
      rel.question('Enter the artist name: ', (artistName) => {
        if (!artistName.trim()) {
          console.log('Please enter a valid artist name.');
          rel.close();
          promptUserForSong();
        } else {
          searchSong(songName.trim(), artistName.trim());
          rel.close();
        }
      });
    }
  });
}
