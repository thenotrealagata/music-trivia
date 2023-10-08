// Example function: access user profile (name, images, id, country, ...)
export async function getProfile(accessToken) {
    accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    return data;
}

getProfile();

export async function getTopTracks(accessToken) {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();
    //console.log(data);

    return data;
}

export async function getFavArtist(accessToken) {
    accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=1', {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();
    //console.log(data);

    return data;
}

getTopTracks();