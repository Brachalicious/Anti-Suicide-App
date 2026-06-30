// Netlify serverless Gemini proxy.
//
// Why this exists:
// The browser-side chatbots used to require every user to paste their own
// Google Gemini API key into Account Settings before the bot would respond.
// Most users have no idea what that means and just saw silence. This function
// runs on Netlify's edge with a single GEMINI_API_KEY env var (set once by
// the site owner) so the bot works for everyone out of the box.
//
// Setup (one-time, in the Netlify dashboard):
//   Site settings → Build & deploy → Environment → Environment variables
//   Add:  GEMINI_API_KEY = <your free key from https://aistudio.google.com/apikey>
//
// Wire-up:
//   netlify.toml redirects /api/chat → /.netlify/functions/chat so the
//   browser code can just POST to /api/chat with no awareness of Netlify.
//
// Request shape (JSON):
//   { systemPrompt: string,
//     userMessage: string,
//     userName?:   string,         // appended to the system prompt
//     history?:    [{role, content}] }   // last few turns, optional
//
// Response shape (JSON):
//   200 { reply: string }
//   4xx/5xx { error: string }

const GEMINI_MODEL = 'gemini-1.5-flash';

exports.handler = async (event) => {
    // CORS preflight — let any origin call this in case the page is loaded
    // from a preview / custom domain that doesn't share the Netlify host.
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return jsonResponse(500, {
            error: 'Server not configured: set GEMINI_API_KEY in Netlify env vars.'
        });
    }

    let payload;
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (_) {
        return jsonResponse(400, { error: 'Invalid JSON body.' });
    }

    const userMessage = String(payload.userMessage || '').trim();
    if (!userMessage) {
        return jsonResponse(400, { error: 'userMessage is required.' });
    }

    const systemPrompt = String(payload.systemPrompt || '');
    // Sanitize the display name so it can't break out of the prompt.
    const safeName = String(payload.userName || '')
        .replace(/[\r\n\t]/g, ' ')
        .trim()
        .slice(0, 80);
    const nameInstruction = safeName
        ? ` The person you are talking with is named ${safeName}. Greet them by name in your first reply and use their name occasionally where it feels warm and natural — never robotic. Do not invent any other names for them.`
        : '';

    const fullSystem = systemPrompt + nameInstruction;

    // Build Gemini "contents" array: history turns + final user turn.
    const contents = [];
    const history = Array.isArray(payload.history) ? payload.history.slice(-10) : [];
    for (const m of history) {
        if (!m || typeof m.content !== 'string') continue;
        contents.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(m.content) }]
        });
    }
    contents.push({
        role: 'user',
        parts: [{ text: `${fullSystem}\n\nUser: ${userMessage}` }]
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    try {
        const upstream = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: { temperature: 0.85, maxOutputTokens: 600 },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                ]
            })
        });

        const data = await upstream.json().catch(() => ({}));
        if (!upstream.ok) {
            const detail = data && data.error && data.error.message;
            return jsonResponse(upstream.status, { error: detail || 'Gemini upstream error' });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return jsonResponse(200, { reply });
    } catch (err) {
        return jsonResponse(502, { error: String(err && err.message || err) });
    }
};

function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store'
        },
        body: JSON.stringify(body)
    };
}
