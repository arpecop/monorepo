// To run this script:
// 1. Make sure you have Node.js installed.
// 2. Create a file named, for example, 'spotifyFetcher.js'.
// 3. Paste this code into the file.
// 4. If you are using an older Node.js version that doesn't have native fetch,
//    you might need to install 'node-fetch': `npm install node-fetch@2`
//    Then uncomment the line: `const fetch = require('node-fetch');`
// 5. Run the script from your terminal: `node spotifyFetcher.js`

// const fetch = require('node-fetch'); // Uncomment this line if you get a 'fetch is not defined' error

// Spotify API credentials
// These are suitable for Client Credentials Flow (accessing public data)
const clientId = '6da85f44af66470a855122f829c18a7f';
const clientSecret = 'b3d41fd147c54250ae9745fe83f44349';

// Base64 encode the client ID and client secret for the Authorization header
const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

/**
 * Fetches an access token from the Spotify API using the Client Credentials Flow.
 * @returns {Promise<string|null>} The access token or null if an error occurred.
 */
async function getAccessToken() {
    try {
        console.log('Attempting to get Spotify access token...');
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authString}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get access token: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Access token obtained successfully.');
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        return null;
    }
}

/**
 * Searches for a track on Spotify using the obtained access token.
 * This demonstrates accessing public data with client credentials.
 * @param {string} accessToken - The Spotify API access token.
 * @param {string} query - The search query (e.g., 'Bohemian Rhapsody').
 * @returns {Promise<object|null>} Search results or null if an error occurred.
 */
async function searchTrack(accessToken, query) {
    if (!accessToken) {
        console.error('No access token available for search.');
        return null;
    }

    try {
        console.log(`Searching for track: "${query}"...`);
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to search track: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Search successful.');
        return data;
    } catch (error) {
        console.error('Error searching for track:', error.message);
        return null;
    }
}

/**
 * Main function to execute the Spotify API calls.
 */
async function main() {
    const accessToken = await getAccessToken();

    if (accessToken) {
        // Example: Search for a popular track
        const searchQuery = 'Blinding Lights The Weeknd';
        const searchResults = await searchTrack(accessToken, searchQuery);

        if (searchResults && searchResults.tracks && searchResults.tracks.items.length > 0) {
            const firstTrack = searchResults.tracks.items[0];
            console.log('\n--- Found Track ---');
            console.log(`Track Name: ${firstTrack.name}`);
            console.log(`Artist(s): ${firstTrack.artists.map(a => a.name).join(', ')}`);
            console.log(`Album: ${firstTrack.album.name}`);
            console.log(`Spotify URL: ${firstTrack.external_urls.spotify}`);
            console.log(`Preview URL: ${firstTrack.preview_url || 'N/A'}`);
        } else {
            console.log(`No tracks found for "${searchQuery}".`);
        }
    } else {
        console.log('Could not proceed without an access token.');
    }

    console.log('\n--- Important Note ---');
    console.log('This script uses the Client Credentials Flow, which is for public Spotify data.');
    console.log('To get the *currently playing song for a specific user*, you need to implement');
    console.log('the full OAuth 2.0 Authorization Code Flow, which involves user redirects and a web server.');
}

// Execute the main function
main();
