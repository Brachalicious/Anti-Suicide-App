// Netlify serverless YouTube search proxy.
//
// Why this exists:
// The in-app Karaoke search, Quick Picks, and Healing Music Playlists used
// to embed YouTube with the `listType=search&list=<query>` iframe parameter.
// Google deprecated/removed that embed mode years ago — it now silently
// renders a blank/broken player ("video not showing"). The fix is to resolve
// a real video ID server-side and embed it via the standard, non-deprecated
// /embed/<videoId> URL, which always works.
//
// How it resolves a video ID (no API key required):
//   1. If YOUTUBE_API_KEY env var is set, use the official YouTube Data API
//      v3 `search.list` endpoint (most accurate, has quota limits).
//   2. Otherwise, fetch YouTube's own public search results HTML page and
//      pull the first "videoId" out of the embedded page data. This needs
//      zero setup/API key and works out of the box.
//
// Wire-up:
//   netlify.toml redirects /api/youtube-search → /.netlify/functions/youtube-search
//
// Request shape (GET):
//   /api/youtube-search?q=<search text>
//
// Response shape (JSON):
//   200 { videoId: string, title: string }
//   4xx/5xx { error: string }

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }

    const query = String((event.queryStringParameters || {}).q || '').trim();
    if (!query) {
        return jsonResponse(400, { error: 'Query param "q" is required.' });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    try {
        if (apiKey) {
            const result = await searchViaDataApi(query, apiKey);
            if (result) return jsonResponse(200, result);
            // Fall through to the HTML scrape if the API returned nothing.
        }

        const scraped = await searchViaScrape(query);
        if (scraped) return jsonResponse(200, scraped);

        return jsonResponse(404, { error: 'No videos found.' });
    } catch (err) {
        return jsonResponse(502, { error: 'Failed to search YouTube.' });
    }
};

async function searchViaDataApi(query, apiKey) {
    const params = new URLSearchParams({
        part: 'snippet',
        type: 'video',
        maxResults: '1',
        videoEmbeddable: 'true',
        q: query,
        key: apiKey
    });
    const resp = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!resp.ok) return null;
    const data = await resp.json();
    const item = data.items && data.items[0];
    if (!item) return null;
    return {
        videoId: item.id.videoId,
        title: (item.snippet && item.snippet.title) || ''
    };
}

async function searchViaScrape(query) {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const resp = await fetch(url, {
        headers: {
            // A desktop UA gets consistent server-rendered HTML with the
            // ytInitialData blob embedded, which contains real video IDs.
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    const idMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (!idMatch) return null;
    const videoId = idMatch[1];

    let title = '';
    const titleMatch = html.match(
        new RegExp(`"videoId":"${videoId}"[^}]*?"title":\\{"runs":\\[\\{"text":"([^"]+)"`)
    );
    if (titleMatch) title = titleMatch[1];

    return { videoId, title };
}

function jsonResponse(statusCode, obj) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(obj)
    };
}
