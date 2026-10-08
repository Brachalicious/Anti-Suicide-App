// Netlify serverless YouTube search proxy.
//
// Why this exists:
// The in-app Karaoke search, Quick Picks, and Healing Music Playlists used
// to embed YouTube with the `listType=search&list=<query>` iframe parameter.
// Google deprecated/removed that embed mode years ago — it now silently
// renders a blank/broken player ("video not showing"). The fix is to run a
// real YouTube Data API search server-side (so the free API key never ships
// to the browser) and return the first real video ID, which embeds reliably
// via the standard /embed/<videoId> URL.
//
// Setup (one-time, in the Netlify dashboard):
//   Site settings → Build & deploy → Environment → Environment variables
//   Add:  YOUTUBE_API_KEY = <a free key from https://console.cloud.google.com/apis/credentials
//                             with the "YouTube Data API v3" enabled>
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

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return jsonResponse(500, {
            error: 'Server not configured: set YOUTUBE_API_KEY in Netlify env vars.'
        });
    }

    const query = String((event.queryStringParameters || {}).q || '').trim();
    if (!query) {
        return jsonResponse(400, { error: 'Query param "q" is required.' });
    }

    try {
        const params = new URLSearchParams({
            part: 'snippet',
            type: 'video',
            maxResults: '1',
            videoEmbeddable: 'true',
            q: query,
            key: apiKey
        });
        const resp = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
        const data = await resp.json();

        if (!resp.ok) {
            const msg = (data && data.error && data.error.message) || 'YouTube API error';
            return jsonResponse(resp.status, { error: msg });
        }

        const item = data.items && data.items[0];
        if (!item) {
            return jsonResponse(404, { error: 'No videos found.' });
        }

        return jsonResponse(200, {
            videoId: item.id.videoId,
            title: (item.snippet && item.snippet.title) || ''
        });
    } catch (err) {
        return jsonResponse(502, { error: 'Failed to reach YouTube API.' });
    }
};

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
