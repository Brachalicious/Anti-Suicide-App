// This script loads Psalms from a JSON file and populates the Tehilim UI in index.html

let psalmsData = null;

async function loadPsalmsJSON() {
    if (psalmsData) return psalmsData;
    // Adjust the path if you move the file elsewhere
    const response = await fetch('psalms.json');
    psalmsData = await response.json();
    return psalmsData;
}

function toggleTehilim() {
    const panel = document.getElementById('tehilim-panel');
    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
        renderPsalmsChapters();
    } else {
        panel.style.display = 'none';
    }
}

async function renderPsalmsChapters() {
    const data = await loadPsalmsJSON();
    const chapters = data.text;
    const btnsDiv = document.getElementById('psalms-chapter-btns');
    btnsDiv.innerHTML = '';
    chapters.forEach((chapter, idx) => {
        // Only show chapters with content
        if (Array.isArray(chapter) && chapter.length > 0 && chapter.some(v => v && v.trim())) {
            const btn = document.createElement('button');
            btn.textContent = `Psalm ${idx + 1}`;
            btn.className = 'psalm-chapter-btn';
            btn.style = 'padding:6px 14px; border-radius:16px; background:#ede9fe; color:#5b3fa6; font-size:13px; font-weight:600; border:none; margin-bottom:4px; cursor:pointer;';
            btn.onclick = () => showPsalm(idx + 1);
            btnsDiv.appendChild(btn);
        }
    });
}

async function showPsalm(chapterNum) {
    const data = await loadPsalmsJSON();
    const chapter = data.text[chapterNum - 1];
    const display = document.getElementById('psalms-display');
    const title = document.getElementById('psalms-chapter-title');
    const versesDiv = document.getElementById('psalms-verses');
    title.textContent = `Psalm ${chapterNum}`;
    versesDiv.innerHTML = '';
    if (Array.isArray(chapter)) {
        chapter.forEach((verse, idx) => {
            if (verse && verse.trim()) {
                const p = document.createElement('div');
                p.textContent = `${idx + 1}. ${verse}`;
                p.style = 'margin-bottom:6px; color:#3d2c4e; font-size:15px;';
                versesDiv.appendChild(p);
            }
        });
    }
    display.style.display = 'block';
}

// Optionally, style chapter buttons on click

document.addEventListener('DOMContentLoaded', () => {
    // Hide panel on load
    const panel = document.getElementById('tehilim-panel');
    if (panel) panel.style.display = 'none';
});
