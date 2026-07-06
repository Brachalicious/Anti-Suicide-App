#!/usr/bin/env node
/**
 * run-tests.js
 * ────────────
 * Headless test harness for the Fight Suicide Project by MysticMinded³³ app.
 *
 * Launches system Chrome (via puppeteer-core), opens the local
 * test.html dashboard, clicks "Run all tests", and prints a
 * per-test pass/fail table plus a summary count.
 *
 * Requirements:
 *   • The static server must be running (task "Serve debug page" at :5500).
 *   • puppeteer-core is installed as a dev dependency.
 *   • System Chrome is at /Applications/Google Chrome.app on macOS.
 *
 * Usage:
 *   node run-tests.js               # default: http://localhost:5500
 *   node run-tests.js --url=https://fightsuicideproject.netlify.app
 *   node run-tests.js --key=AIzaSy… # also test the BYOK Gemini path
 */

const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Command-line argv parsing (no external deps).
const args = process.argv.slice(2).reduce((acc, a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) acc[m[1]] = m[2] === undefined ? true : m[2];
    return acc;
}, {});
const BASE_URL = args.url || 'http://localhost:5500';
const GEMINI_KEY = args.key || '';

const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const GREY  = '\x1b[90m';
const BOLD  = '\x1b[1m';
const RESET = '\x1b[0m';

function color(s, c) { return `${c}${s}${RESET}`; }

(async () => {
    console.log(`\n${BOLD}🧪 Fight Suicide Project by MysticMinded³³ — headless test runner${RESET}`);
    console.log(`   Target: ${BASE_URL}`);
    console.log(`   BYOK key: ${GEMINI_KEY ? '(supplied, ' + GEMINI_KEY.slice(0, 8) + '…)' : '(not supplied — Google API round-trip test will skip)'}\n`);

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: CHROME_PATH,
            headless: 'new',
            protocolTimeout: 180000,             // give CDP 3 min instead of 30 s
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--use-fake-ui-for-media-stream',   // auto-approve mic/camera prompts if any
                '--use-fake-device-for-media-stream'
            ]
        });
    } catch (e) {
        console.error(color('❌ Could not launch Chrome:', RED), e.message);
        process.exit(2);
    }

    const page = await browser.newPage();
    page.setDefaultTimeout(60000);

    // Forward the app's own console to our terminal so we see anything weird.
    page.on('pageerror', (err) => console.log(color('  page error:', RED), err.message));
    page.on('console', (msg) => {
        const t = msg.type();
        let text;
        try { text = msg.text(); } catch (_) { text = '<binary>'; }
        // Ignore super-noisy stuff.
        if (/favicon|popup-blocked|missing initial state/i.test(text)) return;
        // Test-log lines (from log() in test.html) always start with "[HH:MM:SS] ".
        // Forward those at info level so we see per-test progress.
        if (/^\[\d{2}:\d{2}:\d{2}\]/.test(text)) {
            console.log(color('  · ', GREY) + text.replace(/^\[\d{2}:\d{2}:\d{2}\]\s*/, ''));
            return;
        }
        if (t === 'error' || t === 'warning' || t === 'log' || t === 'info') {
            console.log(color(`  [${t}] `, GREY) + text.slice(0, 200));
        }
    });

    console.log(color('→ Opening test dashboard…', GREY));
    try {
        await page.goto(`${BASE_URL}/test.html`, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
        console.error(color('❌ Could not load test.html:', RED), e.message);
        console.error('   Is the local server running? Try:  python3 -m http.server 5500');
        await browser.close();
        process.exit(3);
    }

    // If the caller supplied a BYOK Gemini key, install it in the app frame
    // so the BYOK path test runs against real Google.
    if (GEMINI_KEY) {
        await page.waitForFunction(() => {
            const f = document.getElementById('appFrame');
            return f && f.contentWindow && typeof f.contentWindow.scopedKey === 'function';
        }, { timeout: 15000 });
        await page.evaluate((k) => {
            const w = document.getElementById('appFrame').contentWindow;
            w.localStorage.setItem(w.scopedKey('openai_api_key'), k);
        }, GEMINI_KEY);
        console.log(color('  ✔ Gemini key installed into app frame localStorage', GREY));
    }

    console.log(color('→ Clicking "Run all tests"…', GREY));
    await page.click('#runAllBtn');

    // Wait until the "Pending" counter drops to 0, i.e. every test settled.
    // Stream progress so we can see which test is currently running rather
    // than staring at a blank screen for 60 s.
    console.log(color('→ Waiting for all tests to finish…', GREY));
    let lastReport = -1;
    let stuckSince = Date.now();
    const startedAt = Date.now();
    const HARD_TIMEOUT = 15 * 60 * 1000; // 15 minutes — plenty for 49 × 12 s tests
    while (Date.now() - startedAt < HARD_TIMEOUT) {
        let state;
        try {
            state = await page.evaluate(() => ({
                pass: +document.getElementById('countPass').textContent,
                fail: +document.getElementById('countFail').textContent,
                skip: +document.getElementById('countSkip').textContent,
                pending: +document.getElementById('countPending').textContent
            }));
        } catch (e) {
            process.stdout.write('\n');
            console.error(color('⚠️  Chrome eval error: ', YELLOW), e.message);
            // Try one last diagnostic dump before bailing.
            try {
                const png = await page.screenshot({ path: 'test-hang.png', fullPage: true });
                console.error(color('   Wrote screenshot: test-hang.png', YELLOW));
            } catch (_) {}
            break;
        }
        const done = state.pass + state.fail + state.skip;
        if (done !== lastReport) {
            const total = done + state.pending;
            const bar = '█'.repeat(Math.round((done / Math.max(total, 1)) * 30)).padEnd(30, '░');
            process.stdout.write(`\r  ${bar} ${done}/${total}  ✅ ${state.pass}  ❌ ${state.fail}  ⏸️  ${state.skip}     `);
            lastReport = done;
            stuckSince = Date.now();
        } else if (Date.now() - stuckSince > 30000) {
            // Nothing has moved for 30 s — probably wedged. Dump a diag frame.
            process.stdout.write('\n');
            console.error(color(`⚠️  No progress for 30 s — currently ${done}/${state.pass + state.fail + state.skip + state.pending} settled.`, YELLOW));
            try {
                await page.screenshot({ path: 'test-stuck.png', fullPage: true });
                console.error(color('   Screenshot: test-stuck.png', YELLOW));
            } catch (_) {}
            break;
        }
        if (state.pending === 0) break;
        await new Promise(r => setTimeout(r, 500));
    }
    process.stdout.write('\n');

    // Pull structured results back out of the DOM.
    const results = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.test'));
        return rows.map((row) => {
            let group = 'unknown';
            let n = row.closest('.card');
            if (n) {
                const h = n.querySelector('h2');
                if (h) group = h.textContent.trim();
            }
            return {
                group,
                name: row.querySelector('.name').textContent.trim(),
                status: (row.querySelector('.badge').textContent || '').trim(),
                detail: (row.querySelector('.detail').textContent || '').trim()
            };
        });
    });

    // Print grouped, colored report.
    const grouped = {};
    for (const r of results) (grouped[r.group] = grouped[r.group] || []).push(r);

    console.log('');
    for (const group of Object.keys(grouped)) {
        console.log(`${BOLD}${group}${RESET}`);
        for (const r of grouped[group]) {
            let icon, c;
            if (r.status === 'pass') { icon = '✅'; c = GREEN; }
            else if (r.status === 'fail') { icon = '❌'; c = RED; }
            else if (r.status === 'skip') { icon = '⏸️ '; c = YELLOW; }
            else { icon = '⌛'; c = GREY; }
            console.log(`  ${icon}  ${color(r.name, c)}`);
            if (r.detail && (r.status === 'fail' || r.status === 'skip' || args.verbose)) {
                console.log(color('       ' + r.detail, GREY));
            }
        }
        console.log('');
    }

    const summary = {
        pass: results.filter(r => r.status === 'pass').length,
        fail: results.filter(r => r.status === 'fail').length,
        skip: results.filter(r => r.status === 'skip').length,
        pending: results.filter(r => r.status !== 'pass' && r.status !== 'fail' && r.status !== 'skip').length
    };

    console.log(BOLD + 'SUMMARY' + RESET);
    console.log(`  ${color('✅ ' + summary.pass + ' passed', GREEN)}`);
    console.log(`  ${color('❌ ' + summary.fail + ' failed', summary.fail ? RED : GREY)}`);
    console.log(`  ${color('⏸️  ' + summary.skip + ' skipped', YELLOW)}`);
    if (summary.pending) console.log(`  ${color('⌛ ' + summary.pending + ' pending (timed out)', GREY)}`);
    console.log('');

    await browser.close();
    process.exit(summary.fail === 0 ? 0 : 1);
})();
