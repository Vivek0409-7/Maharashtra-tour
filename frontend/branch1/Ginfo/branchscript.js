document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            if (document.body.classList.contains("dark")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });

        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark");
        }
    }

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.querySelector("nav");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("active");
        });

        document.querySelectorAll("nav a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
            });
        });
    }

    // Hero Slider
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const slideInterval = 5000;
    let autoSlideTimer = null;

    if (slides.length > 0 && dots.length > 0) {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlideIndex = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(nextIndex);
        }

        function startTimer() {
            stopTimer();
            autoSlideTimer = setInterval(nextSlide, slideInterval);
        }

        function stopTimer() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startTimer();
            });
        });

        startTimer();
    }

    const itemsData = [
        { 
            title: "Raigad Fort", 
            category: "fort", 
            location: "RAIGAD DISTRICT", 
            page: "../forts/raigad.html",
            img: "https://extranet.traveldhamaka.com/assets/sightseeing/Raigad%20Fort.JPG", 
            desc: "Capital fort of the Maratha Empire, famed for its monumental architecture and coronation throne." 
        },
        { 
            title: "Sinhagad Fort", 
            category: "fort", 
            location: "PUNE DISTRICT", 
            page: "../forts/sinhagad.html",
            img: "https://rrtravelscabs.com/wp-content/uploads/2023/11/b3.jpg", 
            desc: "Historic hill fortress strategically positioned near Pune city, celebrated for Tanaji Malusare's valor." 
        },
        { 
            title: "Pratapgad Fort", 
            category: "fort", 
            location: "SATARA DISTRICT", 
            page: "../forts/pratapgad.html",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7lNisiyWJCMZvIcakJidNgVQQRIJQ72oaeIJK6gyhuHz2A8U_Lq5NSHxn&s=10", 
            desc: "Famous hill fort located near Mahabaleshwar known for historic battles and Afzal Khan's encounter." 
        },
        { 
            title: "Murud-Janjira Fort", 
            category: "fort", 
            location: "RAIGAD DISTRICT", 
            page: "../forts/murudjanjira.html",
            img: "https://flybtc.blr1.digitaloceanspaces.com/ncl/blog/gp5U4elAHFjvXy0Fx17IOSOzlDCF7xDcg4xcPfQj.jpg", 
            desc: "Unconquered marine fortress surrounded by Arabian Sea waters, famous for 22 rounded bastions." 
        },
        { 
            title: "Shivneri Fort", 
            category: "fort", 
            location: "PUNE DISTRICT", 
            page: "../forts/shivnari.html",
            img: "https://eqiaboov9ot.exactdn.com/wp-content/uploads/2023/10/Shivneri_fort2.jpg?strip=all", 
            desc: "Birthplace of Chhatrapati Shivaji Maharaj in Junnar, featuring seven fortified entry gates." 
        },
        { 
            title: "Rajgad Fort", 
            category: "fort", 
            location: "PUNE DISTRICT", 
            page: "../forts/rajgad.html",
            img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/08/9b/10/rajgad-buruj.jpg?w=1200&h=-1&s=1", 
            desc: "First capital of the Maratha Kingdom boasting royal architectural remains and Padmavati Machi." 
        },
        { 
            title: "Torna Fort", 
            category: "fort", 
            location: "PUNE DISTRICT", 
            page: "../forts/torna.html",
            img: "https://www.mtdc.co.in/wp-content/uploads/2019/11/1563865812_1512127259_DKyhm4VVwAAOfG4.jpg.png.jpg", 
            desc: "First fort captured by Chhatrapati Shivaji Maharaj at age 16, also known as Prachandagad." 
        },
        { 
            title: "Harishchandragad", 
            category: "fort", 
            location: "AHILYANAGAR DISTRICT", 
            page: "../forts/harishchandragad.html",
            img: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Kalbhairav_pinnacle_Scj.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original", 
            desc: "Ancient hill fort famous for the spectacular semi-circular Konkan Kada cliff and Kedareshwar cave." 
        },
        { 
            title: "Sindhudurg Fort", 
            category: "fort", 
            location: "SINDHUDURG DISTRICT", 
            page: "../forts/sindhudurg.html",
            img: "https://media.licdn.com/dms/image/v2/D4D22AQEfR92UkToBKw/feedshare-shrink_800/feedshare-shrink_800/0/1697804771880?e=2147483647&v=beta&t=5U3zuUussQMsrF5SEj5775yl-2Bk8ALgB-_7mimb3RE", 
            desc: "Imposing sea fort constructed by Shivaji Maharaj off the Malvan shoreline with cast-iron foundations." 
        },
        { 
            title: "Panhala Fort", 
            category: "fort", 
            location: "KOLHAPUR DISTRICT", 
            page: "../forts/panhala.html",
            img: "https://www.sawaimansingresort.com/images/panhala-fort/panhala-fort-01.jpg", 
            desc: "Massive strategic stronghold commanding pass views in Western Ghats, featuring Sajja Kothi." 
        },
        { 
            title: "Lohagad & Visapur", 
            category: "fort", 
            location: "PUNE DISTRICT", 
            page: "../forts/lohagad-visapur.html",
            img: "https://pratik18p.wordpress.com/wp-content/uploads/2011/11/dsc_0054.jpg", 
            desc: "Twin hill fortresses near Lonavala popular for scenic monsoon trekking and Vinchu Kata spur." 
        },
        { 
            title: "Kalsubai Peak", 
            category: "hill", 
            location: "AHILYANAGAR DISTRICT", 
            page: "../forts/kalsubai.html",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Kalsubai_Peak_Maharashtra.jpg/1280px-Kalsubai_Peak_Maharashtra.jpg", 
            desc: "Highest peak in Maharashtra (1,646 m) offering expansive Sahyadri views and iconic iron ladder routes." 
        },
        { 
            title: "Mahabaleshwar", 
            category: "hill", 
            location: "SATARA DISTRICT", 
            page: "../forts/mahabaleshwar.html",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Mahabaleshwar_valley_view.jpg/1280px-Mahabaleshwar_valley_view.jpg", 
            desc: "Premier hill station known for lush green valleys, panoramic viewpoints, and strawberry farms." 
        },
        { 
            title: "Panchgani", 
            category: "hill", 
            location: "SATARA DISTRICT", 
            page: "../forts/panchgani.html",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Panchgani_tableland.jpg/1280px-Panchgani_tableland.jpg", 
            desc: "Scenic hill retreat famed for the vast volcanic Table Land plateau and refreshing colonial climate." 
        },
        { 
            title: "Lonavala & Khandala", 
            category: "hill", 
            location: "PUNE DISTRICT", 
            page: "../forts/lonavala.html",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lonavala_Western_Ghats.jpg/1280px-Lonavala_Western_Ghats.jpg", 
            desc: "Popular Sahyadri getaway featuring misty hills, cascading waterfalls, Karla Caves, and chikki." 
        },
        { 
            title: "Matheran", 
            category: "hill", 
            location: "RAIGAD DISTRICT", 
            page: "../forts/matheran.html",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Matheran_Western_Ghats.jpg/1280px-Matheran_Western_Ghats.jpg", 
            desc: "Asia's only automobile-free hill station renowned for red laterite trails, heritage toy train, and vistas." 
        },
        { 
            title: "Igatpuri", 
            category: "hill", 
            location: "NASHIK DISTRICT", 
            page: "../forts/igatpuri.html",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dhamma_Giri_Pagoda_Igatpuri.jpg/1280px-Dhamma_Giri_Pagoda_Igatpuri.jpg", 
            desc: "Serene Western Ghats retreat nestled amidst fog-laden peaks, waterfalls, and Vipassana Centre." 
        }
    ];

    const fortGrid = document.getElementById("fortGrid");
    const searchInput = document.getElementById("fortSearch");
    const noResults = document.getElementById("noResults");
    const tabButtons = document.querySelectorAll(".tab-btn");

    let currentCategory = "all";

    function renderGrid() {
        if (!fortGrid) return;
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        fortGrid.innerHTML = "";
        let count = 0;

        itemsData.forEach(item => {
            const matchesCat = currentCategory === "all" || item.category === currentCategory;
            const matchesSearch = item.title.toLowerCase().includes(query) || item.location.toLowerCase().includes(query);

            if (matchesCat && matchesSearch) {
                count++;
                const card = document.createElement("article");
                card.className = "beach-card";
                card.setAttribute("data-category", item.category);

                // Clicking ONLY the image opens that specific fort/hill page
                // Clicking the Explore button updates the map and does not navigate
                card.innerHTML = `
                    <a href="${item.page}" class="card-img-link" title="Open ${item.title} page">
                        <img src="${item.img}" alt="${item.title}" onerror="this.onerror=null;this.src='shiv.jpg';">
                    </a>
                    <div class="card-content">
                        <span class="location">${item.location}</span>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                        <button type="button" onclick="event.stopPropagation(); showOnMap('${item.title}')">Explore</button>
                    </div>
                `;
                fortGrid.appendChild(card);
            }
        });

        if (noResults) {
            noResults.style.display = count === 0 ? "block" : "none";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", renderGrid);
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.getAttribute("data-category");
            renderGrid();
        });
    });

    renderGrid();
});

// Show destination on Google Map and scroll smoothly down to map section
function showOnMap(name) {
    const googleMap = document.getElementById("googleMap");
    if (googleMap) {
        const formattedName = encodeURIComponent(name + ", Maharashtra");
        googleMap.src = `https://maps.google.com/maps?q=${formattedName}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    }
    const mapSection = document.getElementById("map-section");
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: "smooth" });
    }
}
window.showOnMap = showOnMap;

