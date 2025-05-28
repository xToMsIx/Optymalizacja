// SPA Navigation (disable for external links)
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.hostname === window.location.hostname && !link.hash) {
        link.addEventListener('click', (e) => {
            // For multi-page, let browser handle navigation
        });
    }
});

// Theme switcher
const themeToggle = document.getElementById('theme-toggle');
let isDark = true;
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (isDark) {
            document.documentElement.style.setProperty('--bg', '#f5f5f5');
            document.documentElement.style.setProperty('--text', '#23243a');
            document.documentElement.style.setProperty('--section-bg', '#e6e6ef');
            document.documentElement.style.setProperty('--card-bg', '#fff');
            themeToggle.textContent = "☀️";
        } else {
            document.documentElement.style.setProperty('--bg', '#181a23');
            document.documentElement.style.setProperty('--text', '#f5f5f5');
            document.documentElement.style.setProperty('--section-bg', '#222235');
            document.documentElement.style.setProperty('--card-bg', '#23243a');
            themeToggle.textContent = "🌙";
        }
        isDark = !isDark;
    });
}

// Clock widget
if (document.getElementById('clock')) {
    function updateClock() {
        const now = new Date();
        const options = { 
            hour: '2-digit', minute: '2-digit', second: '2-digit', 
            day: '2-digit', month: '2-digit', year: 'numeric'
        };
        document.getElementById('clock').textContent = now.toLocaleString('pl-PL', options);
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Daily Quote widget
const quotes = [
    "Granie to nie tylko rozrywka — to pasja! 🎮",
    "Wygrywa ten, kto nigdy się nie poddaje.",
    "W każdej grze najważniejsza jest przyjaźń.",
    "Nie licz punktów, licz frajdę!",
    "Najlepsza gra? Ta, przy której się bawisz.",
    "Nie graj, by wygrać — graj, by żyć przygodą.",
    "Game Over to nie koniec. To nowy początek!"
];
if (document.getElementById('daily-quote')) {
    const today = new Date().getDate();
    document.getElementById('daily-quote').textContent = quotes[today % quotes.length];
}

// Random Game widget
const games = [
    "Elden Ring", "Cyberpunk 2077", "Baldur's Gate 3", "DOOM Eternal", "Hollow Knight",
    "The Witcher 3", "Control", "Fable", "GTA 6", "Final Fantasy XVI"
];
if (document.getElementById('random-game')) {
    const random = Math.floor(Math.random() * games.length);
    document.getElementById('random-game').textContent = games[random];
}

// Weather widget (demo, static)
if (document.getElementById('weather')) {
    document.getElementById('weather').innerHTML = `
        <img src="https://img.icons8.com/color/48/000000/partly-cloudy-day--v2.png" style="vertical-align:middle; width:36px" alt="weather">
        <span style="font-weight:bold;">18°C</span> | Warszawa
    `;
}

// News ticker
const tickerNews = [
    "GTA 6 potwierdzone! Premiera już 30.05.2025.",
    "Nowy patch do Baldur's Gate 3 już dostępny.",
    "Wiedźmin 4 z oficjalnym trailerem!",
    "Ranking: Najlepsze gry 2025 roku.",
    "Dołącz do naszego Discorda – społeczność GameVerse rośnie!"
];
if (document.getElementById('news-ticker')) {
    let idx = 0;
    function showTicker() {
        document.getElementById('news-ticker').textContent = tickerNews[idx];
        idx = (idx + 1) % tickerNews.length;
    }
    showTicker();
    setInterval(showTicker, 4000);
}

// Recenzje: filtr i wyszukiwarka
const genreFilter = document.getElementById('genre-filter');
const reviewSearch = document.getElementById('review-search');
if (genreFilter || reviewSearch) {
    function filterReviews() {
        const genre = genreFilter ? genreFilter.value : "all";
        const query = reviewSearch ? reviewSearch.value.toLowerCase() : "";
        document.querySelectorAll('.review-item').forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const matchesGenre = (genre === "all" || item.dataset.genre === genre);
            const matchesSearch = (!query || title.includes(query));
            item.style.display = (matchesGenre && matchesSearch) ? 'flex' : 'none';
        });
    }
    if (genreFilter) genreFilter.addEventListener('change', filterReviews);
    if (reviewSearch) reviewSearch.addEventListener('input', filterReviews);
}

// Ranking tabs
document.querySelectorAll('.ranking-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const ranking = tab.getAttribute('data-ranking');
        const rankingContent = document.getElementById('ranking-content');
        if (!rankingContent) return;
        if (ranking === "top2025") {
            rankingContent.innerHTML = `
                <table class="ranking-table">
                <thead>
                <tr><th>Miejsce</th><th>Tytuł</th><th>Gatunek</th><th>Ocena</th></tr>
                </thead>
                <tbody>
                <tr><td>1</td><td>Final Fantasy XVI</td><td>RPG</td><td>9.8</td></tr>
                <tr><td>2</td><td>Elden Ring</td><td>RPG/Akcja</td><td>9.7</td></tr>
                <tr><td>3</td><td>Cyberpunk 2077: Phantom Liberty</td><td>RPG</td><td>9.5</td></tr>
                </tbody>
                </table>
            `;
        } else if (ranking === "rpg") {
            rankingContent.innerHTML = `
                <table class="ranking-table">
                <thead>
                <tr><th>Miejsce</th><th>Tytuł</th><th>Ocena</th></tr>
                </thead>
                <tbody>
                <tr><td>1</td><td>Baldur's Gate 3</td><td>9.9</td></tr>
                <tr><td>2</td><td>The Witcher 3: Wild Hunt</td><td>9.8</td></tr>
                <tr><td>3</td><td>Divinity: Original Sin 2</td><td>9.7</td></tr>
                </tbody>
                </table>
            `;
        } else if (ranking === "multiplayer") {
            rankingContent.innerHTML = `
                <table class="ranking-table">
                <thead>
                <tr><th>Miejsce</th><th>Tytuł</th><th>Typ</th><th>Ocena</th></tr>
                </thead>
                <tbody>
                <tr><td>1</td><td>Counter-Strike 2</td><td>FPS</td><td>9.5</td></tr>
                <tr><td>2</td><td>League of Legends</td><td>MOBA</td><td>9.3</td></tr>
                <tr><td>3</td><td>Fortnite</td><td>Battle Royale</td><td>9.0</td></tr>
                </tbody>
                </table>
            `;
        }
    });
});

// Społeczność: ankieta
const pollForm = document.getElementById('poll-form');
const pollResults = document.getElementById('poll-results');
if (pollForm) {
    pollForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const selected = pollForm.querySelector('input[name="game"]:checked');
        if (!selected) return;
        let votes = {
            Witcher4: Math.floor(Math.random() * 100),
            GTA6: Math.floor(Math.random() * 100),
            TES6: Math.floor(Math.random() * 100)
        };
        votes[selected.value] += 20; // bias for the chosen
        let sum = votes.Witcher4 + votes.GTA6 + votes.TES6;
        pollResults.innerHTML = `
            <b>Wyniki ankiety:</b>
            <ul>
                <li>Wiedźmin 4: <strong>${Math.round(100 * votes.Witcher4 / sum)}%</strong></li>
                <li>GTA 6: <strong>${Math.round(100 * votes.GTA6 / sum)}%</strong></li>
                <li>The Elder Scrolls VI: <strong>${Math.round(100 * votes.TES6 / sum)}%</strong></li>
            </ul>
        `;
        pollForm.classList.add('hidden');
        pollResults.classList.remove('hidden');
    });
}

// Steam Top widget (demo, static)
const steamTopList = [
    {name: "Counter-Strike 2", users: "1 120 000"},
    {name: "Dota 2", users: "700 000"},
    {name: "PUBG: BATTLEGROUNDS", users: "350 000"}
];
if (document.getElementById('steam-top')) {
    document.getElementById('steam-top').innerHTML = steamTopList.map(g => `<li>${g.name} <span style="color:var(--accent);font-size:0.97em">(${g.users} graczy)</span></li>`).join('');
}

// Countdown widget
if (document.getElementById('countdown')) {
    function updateCountdown() {
        const release = new Date('2025-05-30T00:00:00');
        const now = new Date();
        const diff = release - now;
        if (diff <= 0) {
            document.getElementById('countdown').textContent = "Już dostępne!";
            return;
        }
        const d = Math.floor(diff / (1000*60*60*24));
        const h = Math.floor((diff / (1000*60*60)) % 24);
        const m = Math.floor((diff / (1000*60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        document.getElementById('countdown').textContent = `${d} dni, ${h} godz., ${m} min, ${s} s`;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Simple Calendar widget
if (document.getElementById('calendar')) {
    function renderCalendar() {
        const el = document.getElementById('calendar');
        if (!el) return;
        const now = new Date();
        let html = `<table style="width:100%;background:transparent;color:inherit;"><tr>`;
        const days = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
        days.forEach(d => html += `<th style="padding:2px">${d}</th>`);
        html += `</tr><tr>`;
        let date = new Date(now.getFullYear(), now.getMonth(), 1);
        let day = (date.getDay() + 6) % 7;
        for (let i=0;i<day;i++) html += "<td></td>";
        while (date.getMonth() === now.getMonth()) {
            const isToday = (date.getDate() === now.getDate());
            html += `<td style="${isToday ? 'background:var(--accent);color:var(--primary);border-radius:50%;font-weight:bold;' : ''}padding:2px;text-align:center">${date.getDate()}</td>`;
            if ((date.getDay()+6)%7 === 6) html += "</tr><tr>";
            date.setDate(date.getDate()+1);
        }
        html += "</tr></table>";
        el.innerHTML = html;
    }
    renderCalendar();
}

// RGB Light Bar (animated)
if (document.getElementById('rgb-light')) {
    let i = 0;
    setInterval(() => {
        document.getElementById('rgb-light').style.background = `linear-gradient(90deg, 
            hsl(${i%360},100%,50%),
            hsl(${(i+30)%360},100%,50%),
            hsl(${(i+60)%360},100%,50%),
            hsl(${(i+90)%360},100%,50%),
            hsl(${(i+120)%360},100%,50%)
        )`;
        i+=5;
    }, 60);
}

// Formularz kontaktowy
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        contactForm.classList.add('hidden');
        contactSuccess.classList.remove('hidden');
        contactForm.reset();
    });
}