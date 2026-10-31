// Use backend only when running locally; on Vercel, fall back to localStorage
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : null;

let selectedCategory = 'Heritage Tour';
let activeUserSession = JSON.parse(localStorage.getItem('aagman_active_session') || 'null');
let submissionsStore = [];

let activeSelectedSubmission = null;
let logoClickCounter = 0;
let logoClickTimer = null;
let isDevAuthenticated = localStorage.getItem('aagman_dev_auth') === 'true';

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('aagman_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (isDevAuthenticated) {
        document.getElementById('devToggleBtn').classList.add('authenticated');
    }
    checkUserSession();

    // --- STEP 2: Bind Form Event Listener ---
    const plannerForm = document.getElementById('journeyPlannerForm');
    if (plannerForm) {
        plannerForm.addEventListener('submit', handleGenerateAiPlan);
    }
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('aagman_theme', newTheme);
    updateThemeIcon(newTheme);

    triggerToast('Theme Updated', `Switched to ${newTheme.toUpperCase()} mode.`);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (theme === 'dark') {
        btn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }
}

function checkUserSession() {
    const authView = document.getElementById('authView');
    const plannerDashboard = document.getElementById('plannerDashboard');

    if (activeUserSession) {
        authView.style.display = 'none';
        plannerDashboard.style.display = 'block';
        document.getElementById('sessionUserName').innerText = activeUserSession.name;
        renderUserSavedJourneys();
    } else {
        authView.style.display = 'block';
        plannerDashboard.style.display = 'none';
    }
}

function switchAuthTab(tab) {
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

async function handleUserRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;

    // If backend is available (localhost), try it first
    if (API_BASE_URL) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                triggerToast('Registration Error', data.message || 'Registration failed');
                return;
            }
            activeUserSession = data.user;
            localStorage.setItem('aagman_active_session', JSON.stringify(activeUserSession));
            localStorage.setItem('aagman_token', data.token);
            triggerToast('Account Created!', `Welcome to Aagman, ${name}.`);
            checkUserSession();
            return;
        } catch (err) {
            console.warn('Backend unavailable, using localStorage fallback.');
        }
    }

    // localStorage fallback (used on Vercel where no backend is deployed)
    const users = JSON.parse(localStorage.getItem('aagman_users') || '[]');
    if (users.find(u => u.email === email)) {
        triggerToast('Already Registered', 'This email is already in use. Please login.');
        return;
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem('aagman_users', JSON.stringify(users));
    activeUserSession = { id: newUser.id, name, email };
    localStorage.setItem('aagman_active_session', JSON.stringify(activeUserSession));
    triggerToast('Account Created!', `Welcome to Aagman, ${name}.`);
    checkUserSession();
}


async function handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    // If backend is available (localhost), try it first
    if (API_BASE_URL) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                triggerToast('Authentication Failed', data.message || 'Invalid credentials');
                return;
            }
            activeUserSession = data.user;
            localStorage.setItem('aagman_active_session', JSON.stringify(activeUserSession));
            localStorage.setItem('aagman_token', data.token);
            triggerToast('Welcome Back!', `Signed in as ${data.user.name}.`);
            checkUserSession();
            return;
        } catch (err) {
            console.warn('Backend unavailable, using localStorage fallback.');
        }
    }

    // localStorage fallback
    const users = JSON.parse(localStorage.getItem('aagman_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        triggerToast('Login Failed', 'Email or password incorrect. Please check and try again.');
        return;
    }
    activeUserSession = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('aagman_active_session', JSON.stringify(activeUserSession));
    triggerToast('Welcome Back!', `Signed in as ${user.name}.`);
    checkUserSession();
}


function handleUserLogout() {
    activeUserSession = null;
    localStorage.removeItem('aagman_active_session');
    localStorage.removeItem('aagman_token');
    triggerToast('Signed Out', 'You have been logged out safely.');
    checkUserSession();
}

function selectTopic(chipElement) {
    document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
    chipElement.classList.add('active');
    selectedCategory = chipElement.innerText;
}

async function handleGenerateAiPlan(e) {
    if (e) e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating itinerary...`;

    const travelers = document.getElementById('travelers')?.value || '';
    const date = document.getElementById('travelDate')?.value || '';
    const preferences = document.getElementById('messageText')?.value || '';

    // If backend is available, try it
    if (API_BASE_URL) {
        try {
            const res = await fetch(`${API_BASE_URL}/planner/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ circuit: selectedCategory, travelers, date, preferences })
            });
            const result = await res.json();
            if (res.ok) {
                triggerToast('AI Plan Generated!', 'Custom itinerary created successfully.');
                await renderUserSavedJourneys();
                const form = document.getElementById('journeyPlannerForm');
                if (form) form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Generate AI Custom Itinerary <i class="fa-solid fa-wand-magic-sparkles"></i>`;
                return;
            }
        } catch (err) {
            console.warn('Backend unavailable, generating local itinerary.');
        }
    }

    // localStorage fallback — generate a sample itinerary client-side
    const itinerary = generateLocalItinerary(selectedCategory, travelers, date, preferences);
    const journeys = JSON.parse(localStorage.getItem('aagman_saved_journeys') || '[]');
    journeys.unshift({ id: Date.now().toString(), circuit: selectedCategory, travelers, date, preferences, itinerary, createdAt: new Date().toISOString() });
    localStorage.setItem('aagman_saved_journeys', JSON.stringify(journeys));

    triggerToast('Itinerary Created!', 'Your custom Maharashtra travel plan is ready.');
    renderUserSavedJourneys();
    const form = document.getElementById('journeyPlannerForm');
    if (form) form.reset();

    submitBtn.disabled = false;
    submitBtn.innerHTML = `Generate AI Custom Itinerary <i class="fa-solid fa-wand-magic-sparkles"></i>`;
}

function generateLocalItinerary(circuit, travelers, date, preferences) {
    const places = {
        'Heritage Tour': ['Raigad Fort', 'Shivneri Fort', 'Pratapgad Fort'],
        'Spiritual': ['Shirdi Sai Baba Temple', 'Siddhivinayak Temple', 'Trimbakeshwar Jyotirlinga'],
        'Adventure': ['Lonavala', 'Mahabaleshwar', 'Igatpuri'],
        'Beaches': ['Alibaug Beach', 'Ganpatipule Beach', 'Tarkarli Beach'],
        'Wildlife': ['Tadoba Tiger Reserve', 'Navegaon National Park', 'Melghat Tiger Reserve'],
    };
    const spots = places[circuit] || ['Mumbai', 'Pune', 'Nashik'];
    return `✨ Your Custom Maharashtra Itinerary — ${circuit}
Travelers: ${travelers || 'N/A'} | Travel Date: ${date || 'N/A'}
${preferences ? 'Preferences: ' + preferences : ''}

Day 1 — Arrival & ${spots[0]}
• Arrive, check-in to hotel
• Visit ${spots[0]} (guided tour available)
• Evening local cuisine dinner

Day 2 — Explore ${spots[1]}
• Morning visit to ${spots[1]}
• Afternoon sightseeing & photography
• Cultural show in the evening

Day 3 — ${spots[2]} & Departure
• Early morning visit to ${spots[2]}
• Shopping for local handicrafts
• Depart with memories to cherish

💡 Tip: Book accommodations in advance during peak season (Oct–Feb).`;
}


async function renderUserSavedJourneys() {
    const container = document.getElementById('savedJourneysList');
    if (!container) return;

    // Try backend if available
    if (API_BASE_URL) {
        try {
            const res = await fetch(`${API_BASE_URL}/planner/saved`);
            const journeys = await res.json();
            displayJourneys(container, journeys);
            return;
        } catch (err) {
            console.warn('Backend unavailable, loading from localStorage.');
        }
    }

    // localStorage fallback
    const journeys = JSON.parse(localStorage.getItem('aagman_saved_journeys') || '[]');
    displayJourneys(container, journeys);
}

function displayJourneys(container, journeys) {
    if (!journeys || journeys.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No custom plans yet. Fill in your preferences and click Generate!</p>`;
        return;
    }

    container.innerHTML = journeys.map(j => `
        <div class="journey-card" style="background: var(--card-bg, #fff); padding: 1rem; margin-bottom: 1rem; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1);">
            <div class="journey-card-top" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span class="journey-badge" style="background: var(--primary, #e65100); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${j.circuit}</span>
                <span class="journey-ref" style="font-size: 0.75rem; color: #888;">${new Date(j.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                <strong>Travelers:</strong> ${j.travelers || 'N/A'} | <strong>Date:</strong> ${j.date || 'N/A'}
            </div>
            ${j.preferences ? `<p style="font-size: 0.85rem; color: var(--secondary); font-style: italic; margin-bottom: 0.6rem;">
                <strong>Your Preferences:</strong> "${j.preferences}"
            </p>` : ''}
            <div class="ai-generated-plan" style="white-space: pre-line; font-size: 0.9rem; line-height: 1.5; color: var(--text-main);">
                ${j.itinerary}
            </div>
        </div>
    `).join('');
}


document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        openDevModal();
    }
});

function handleLogoClick() {
    logoClickCounter++;
    clearTimeout(logoClickTimer);
    if (logoClickCounter >= 5) {
        logoClickCounter = 0;
        openDevModal();
    } else {
        logoClickTimer = setTimeout(() => { logoClickCounter = 0; }, 1500);
    }
}

function openDevModal() {
    if (isDevAuthenticated) {
        toggleDevDrawer();
    } else {
        document.getElementById('devAuthModal').classList.add('active');
    }
}

function closeDevModal() {
    document.getElementById('devAuthModal').classList.remove('active');
}

function authenticateDeveloper(e) {
    e.preventDefault();
    const u = document.getElementById('devUser').value;
    const p = document.getElementById('devPass').value;

    if (u === 'admin' && p === 'maharashtra2026') {
        isDevAuthenticated = true;
        localStorage.setItem('aagman_dev_auth', 'true');
        closeDevModal();
        document.getElementById('devToggleBtn').classList.add('authenticated');
        toggleDevDrawer();
        triggerToast('Developer Unlocked', 'Backend log inspector active.');
    } else {
        triggerToast('Access Denied', 'Invalid credentials.');
    }
}

function logoutDeveloper() {
    isDevAuthenticated = false;
    localStorage.removeItem('aagman_dev_auth');
    document.getElementById('devDrawer').classList.remove('open');
    document.getElementById('devToggleBtn').classList.remove('authenticated');
    triggerToast('Console Locked', 'Developer session closed.');
}

function toggleDevDrawer() {
    const drawer = document.getElementById('devDrawer');
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open')) {
        updateDevDrawerList();
    }
}

async function updateDevDrawerList() {
    const countBadge = document.getElementById('devSubmissionCount');
    const listContainer = document.getElementById('devSubmissionsList');

    try {
        const res = await fetch(`${API_BASE_URL}/planner/all`);
        submissionsStore = await res.json();
        countBadge.innerText = submissionsStore.length;

        if (submissionsStore.length === 0) {
            listContainer.innerHTML = `<p style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">No journey plans recorded yet across users.</p>`;
            document.getElementById('devJsonViewer').innerText = '// Select a submission to view JSON payload.';
            return;
        }

        listContainer.innerHTML = submissionsStore.map((sub, index) => `
            <div class="dev-submission-card ${index === 0 ? 'selected' : ''}" onclick="inspectSubmission(${index})">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                    <strong style="color: #FFF; font-size: 0.95rem;">${sub.user?.name || 'User'}</strong>
                    <span style="color: var(--accent-gold); font-size: 0.75rem; font-family: monospace;">${sub.referenceId}</span>
                </div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">${sub.category} | ${new Date(sub.createdAt).toLocaleTimeString()}</div>
            </div>
        `).join('');

        inspectSubmission(0);
    } catch (err) {
        listContainer.innerHTML = `<p style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">Error fetching backend logs.</p>`;
    }
}

function inspectSubmission(index) {
    if (!submissionsStore[index]) return;
    activeSelectedSubmission = submissionsStore[index];
    document.getElementById('devJsonViewer').innerText = JSON.stringify(activeSelectedSubmission, null, 2);
}

function copyActiveJSON() {
    if (!activeSelectedSubmission) return;
    navigator.clipboard.writeText(JSON.stringify(activeSelectedSubmission, null, 2));
    triggerToast('Copied!', 'JSON payload copied to clipboard.');
}

function exportAllJSON() {
    if (submissionsStore.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissionsStore, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aagman_all_journeys_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Exported!', 'JSON array downloaded.');
}

function clearDevStorage() {
    submissionsStore = [];
    document.getElementById('devJsonViewer').innerText = '// Logs cleared from view.';
    triggerToast('Cleared', 'Submission logs reset.');
}

const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

function switchTab(evt, tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    evt.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function triggerToast(title, message) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// AFTER
// Explore Category Navigation
function handleExploreClick(title, message, targetUrl) {
    triggerToast(title, message);
    setTimeout(() => {
        if (!targetUrl) return;
        
        const path = window.location.pathname;
        if (path.endsWith('/frontend')) {
            window.location.href = 'frontend/' + targetUrl;
        } else {
            window.location.href = targetUrl;
        }
    }, 1000);
}

(function() {
    const container = document.getElementById('featured-showcase-container');
    if (!container) return;
    const slides = container.querySelectorAll('.showcase-card');
    const bgLayer = document.getElementById('showcase-bg-layer');
    let activeIndex = 0;

    function renderSlide(index) {
        slides.forEach((slide, i) => slide.classList.toggle('showcase-active', i === index));
        const activeImage = slides[index].querySelector('img');
        if (bgLayer && activeImage) bgLayer.style.backgroundImage = `url('${activeImage.src}')`;
    }

    document.getElementById('showcase-next-trigger').addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % slides.length;
        renderSlide(activeIndex);
    });

    document.getElementById('showcase-prev-trigger').addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
        renderSlide(activeIndex);
    });

    renderSlide(activeIndex);
    setInterval(() => {
        activeIndex = (activeIndex + 1) % slides.length;
        renderSlide(activeIndex);
    }, 4000);
})();

(function() {
    const component = document.getElementById('ls3d-component');
    if (!component) return;
    const items = component.querySelectorAll('.ls3d-item');
    const totalItems = items.length;
    let activeIdx = Math.floor(totalItems / 2);

    function renderCarousel() {
        items.forEach((item, index) => {
            let offset = index - activeIdx;
            if (offset > totalItems / 2) offset -= totalItems;
            else if (offset < -totalItems / 2) offset += totalItems;

            const absOffset = Math.abs(offset);
            item.style.transform = `translateX(${offset * 280}px) translateZ(${-absOffset * 100}px) rotateY(${offset * -22}deg) scale(${1 - absOffset * 0.12})`;
            item.style.zIndex = 100 - absOffset;
            item.style.opacity = absOffset > 2 ? '0' : '1';
            item.style.pointerEvents = offset === 0 ? 'auto' : 'none';
            item.classList.toggle('ls3d-active', offset === 0);
        });
    }

    document.getElementById('ls3d-prev-control').addEventListener('click', () => { activeIdx = (activeIdx - 1 + totalItems) % totalItems; renderCarousel(); });
    document.getElementById('ls3d-next-control').addEventListener('click', () => { activeIdx = (activeIdx + 1) % totalItems; renderCarousel(); });
    items.forEach((item, index) => item.addEventListener('click', () => { activeIdx = index; renderCarousel(); }));
    renderCarousel();
})();