const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️";
        localStorage.setItem("anjarleTheme", "dark");
    } else {
        themeBtn.textContent = "🌙";
        localStorage.setItem("anjarleTheme", "light");
    }
});

if (localStorage.getItem("anjarleTheme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});