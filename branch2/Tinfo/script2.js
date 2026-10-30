document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById("themeToggle");

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            themeToggle.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            themeToggle.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️️";
    }

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.querySelector("nav");

    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("active");
    });

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    });

    const searchInput = document.getElementById('templeSearch');
    const cards = document.querySelectorAll('.beach-card');
    const noResultsMsg = document.getElementById('noResults');
    const tabButtons = document.querySelectorAll('.tab-btn');

    let currentCategory = "all";

    function filterCards() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            const textContent = card.innerText.toLowerCase();
            const keywords = card.getAttribute('data-keywords') || '';
            const category = card.getAttribute('data-category');

            const matchesSearch = textContent.includes(query) || keywords.includes(query);
            const matchesCategory = currentCategory === "all" || category === currentCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', filterCards);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            filterCards();
        });
    });

    const ashtavinayakData = [
        { stop: 1, name: "Mayureshwar (Morgaon)", location: "Morgaon, Pune District", desc: "The traditional starting point. Lord Ganesha defeated the demon Sindhu riding a peacock mount.", highlight: "Peacock Mount & Nandi Idol", nextDist: "~65 km to Siddhatek", mapQuery: "Shri Mayureshwar Ganpati Mandir, Morgaon" },
        { stop: 2, name: "Siddhivinayak (Siddhatek)", location: "Siddhatek, Ahmednagar District", desc: "Situated along the Bhima River, the only idol in the Ashtavinayak circuit where the trunk turns right.", highlight: "Right-turned Trunk", nextDist: "~85 km to Theur", mapQuery: "Shree Siddhivinayak Temple, Siddhatek" },
        { stop: 3, name: "Chintamani (Theur)", location: "Theur, Pune District", desc: "Remover of worries. Ganesha retrieved the lost precious jewel for Sage Kapila at the river confluence.", highlight: "Confluence of 3 Rivers", nextDist: "~50 km to Ranjangaon", mapQuery: "Chintamani Ganpati Temple, Theur" },
        { stop: 4, name: "Mahaganapati (Ranjangaon)", location: "Ranjangaon, Pune District", desc: "Represents Ganesha's most powerful form with 10 trunks and 20 arms in lore.", highlight: "Supreme 10-Trunked Form", nextDist: "~85 km to Ozar", mapQuery: "Maha Ganapati Temple, Ranjangaon" },
        { stop: 5, name: "Vighneshwar (Ozar)", location: "Ozar, Pune District", desc: "The vanquisher of obstacles. Enclosed inside fortified walls with rubies set into the idol's eyes.", highlight: "Fortified Temple Walls", nextDist: "~15 km to Lenyadri", mapQuery: "Vighnahar Ganpati Temple, Ozar" },
        { stop: 6, name: "Girijatmaj (Lenyadri)", location: "Lenyadri, Pune District", desc: "Situated inside Buddhist rock-cut Cave 18 atop a hill, reached by climbing 307 stone steps.", highlight: "307 Mountain Steps", nextDist: "~140 km to Pali", mapQuery: "Girijatmaj Ganpati Temple, Lenyadri" },
        { stop: 7, name: "Ballaleshwar (Pali)", location: "Pali, Raigad District", desc: "The only Ashtavinayak shrine named directly after an ardent devotee—a young boy named Ballal.", highlight: "Named After Child Devotee", nextDist: "~40 km to Mahad", mapQuery: "Ballaleshwar Pali" },
        { stop: 8, name: "Varadvinayak (Mahad)", location: "Mahad, Raigad District", desc: "Giver of boons. Includes a sacred oil lamp (Nandadeep) burning continuously since 1892.", highlight: "Eternal Lamp (Since 1892)", nextDist: "~155 km back to Morgaon", mapQuery: "Varadvinayak Temple, Mahad" },
        { stop: 9, name: "Mayureshwar (Morgaon) - Completion", location: "Morgaon, Pune District", desc: "Pilgrims return to Morgaon to complete the traditional Ashtavinayak Yatra circuit.", highlight: "Circuit Completion", nextDist: "Pilgrimage Complete!", mapQuery: "Shri Mayureshwar Ganpati Mandir, Morgaon" }
    ];

    let activeIndex = 0;

    const stopTag = document.getElementById('yatra-stop-tag');
    const title = document.getElementById('yatra-temple-title');
    const loc = document.getElementById('yatra-temple-loc');
    const desc = document.getElementById('yatra-temple-desc');
    const highlight = document.getElementById('yatra-highlight');
    const distance = document.getElementById('yatra-distance');
    const progressText = document.getElementById('yatra-progress-text');
    const mapIframe = document.getElementById('ashtavinayakMap');
    const nodesContainer = document.getElementById('nodesContainer');
    const prevBtn = document.getElementById('prevStopBtn');
    const nextBtn = document.getElementById('nextStopBtn');

    function renderNodes() {
        if (!nodesContainer) return;
        nodesContainer.innerHTML = ashtavinayakData.map((item, index) => `
            <button class="node-btn ${index === activeIndex ? 'active' : ''}" onclick="selectAshtavinayakStep(${index})">
                ${index === 8 ? '🏁' : index + 1}
            </button>
        `).join('');
    }

    function updateAshtavinayakView() {
        const item = ashtavinayakData[activeIndex];
        if (!item || !title) return;

        stopTag.innerText = `Stop ${item.stop} of 9`;
        title.innerText = item.name;
        loc.innerText = `📍 ${item.location}`;
        desc.innerText = item.desc;
        highlight.innerText = item.highlight;
        distance.innerText = item.nextDist;

        const pct = Math.round(((activeIndex + 1) / ashtavinayakData.length) * 100);
        progressText.innerText = `${pct}% Done`;

        const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(item.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        mapIframe.src = mapUrl;

        prevBtn.disabled = activeIndex === 0;
        nextBtn.disabled = activeIndex === ashtavinayakData.length - 1;

        renderNodes();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (activeIndex > 0) {
                activeIndex--;
                updateAshtavinayakView();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (activeIndex < ashtavinayakData.length - 1) {
                activeIndex++;
                updateAshtavinayakView();
            }
        });
    }

    window.selectAshtavinayakStep = function(index) {
        activeIndex = index;
        updateAshtavinayakView();
    };

    updateAshtavinayakView();
});