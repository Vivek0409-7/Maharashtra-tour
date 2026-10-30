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
    themeToggle.textContent = "☀️";
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

const searchInput = document.getElementById("beachSearch");
const beachCards = document.querySelectorAll(".beach-card");
const noResults = document.getElementById("noResults");

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase().trim();
    let visible = 0;

    beachCards.forEach(card => {
        const beachName = card.querySelector("h3").textContent.toLowerCase();
        const location = card.querySelector(".location").textContent.toLowerCase();

        if (beachName.includes(searchText) || location.includes(searchText)) {
            card.style.display = "block";
            visible++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.style.display = visible === 0 ? "block" : "none";
});

function showBeach(name) {
    const googleMap = document.getElementById("googleMap");
    const formattedName = encodeURIComponent(name + ", Maharashtra");
    
    googleMap.src = `https://maps.google.com/maps?q=${formattedName}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

    document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
}