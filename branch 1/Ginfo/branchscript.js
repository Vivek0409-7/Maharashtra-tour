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
        { title: "Raigad Fort", category: "fort", location: "RAIGAD DISTRICT", img: "https://extranet.traveldhamaka.com/assets/sightseeing/Raigad%20Fort.JPG", desc: "Capital fort of the Maratha Empire, famed for its monumental architecture." },
        { title: "Sinhagad Fort", category: "fort", location: "PUNE DISTRICT", img: "https://rrtravelscabs.com/wp-content/uploads/2023/11/b3.jpg", desc: "Historic hill fortress strategically positioned near Pune city." },
        { title: "Pratapgad Fort", category: "fort", location: "SATARA DISTRICT", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7lNisiyWJCMZvIcakJidNgVQQRIJQ72oaeIJK6gyhuHz2A8U_Lq5NSHxn&s=10", desc: "Famous hill fort located near Mahabaleshwar known for historic battles." },
        { title: "Murud-Janjira Fort", category: "fort", location: "RAIGAD DISTRICT", img: "https://flybtc.blr1.digitaloceanspaces.com/ncl/blog/gp5U4elAHFjvXy0Fx17IOSOzlDCF7xDcg4xcPfQj.jpg", desc: "Unconquered marine fortress surrounded by Arabian Sea waters." },
        { title: "Shivneri Fort", category: "fort", location: "PUNE DISTRICT", img: "https://eqiaboov9ot.exactdn.com/wp-content/uploads/2023/10/Shivneri_fort2.jpg?strip=all", desc: "Birthplace of Chhatrapati Shivaji Maharaj in Junnar." },
        { title: "Rajgad Fort", category: "fort", location: "PUNE DISTRICT", img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/08/9b/10/rajgad-buruj.jpg?w=1200&h=-1&s=1", desc: "First capital of the Maratha Kingdom boasting royal architectural remains." },
        { title: "Torna Fort", category: "fort", location: "PUNE DISTRICT", img: "https://www.mtdc.co.in/wp-content/uploads/2019/11/1563865812_1512127259_DKyhm4VVwAAOfG4.jpg.png.jpg", desc: "First fort captured by Chhatrapati Shivaji Maharaj at age 16." },
        { title: "Harishchandragad", category: "fort", location: "AHILYANAGAR DISTRICT", img: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Kalbhairav_pinnacle_Scj.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original", desc: "Ancient hill fort famous for the spectacular Konkan Kada cliff." },
        { title: "Sindhudurg Fort", category: "fort", location: "SINDHUDURG DISTRICT", img: "https://media.licdn.com/dms/image/v2/D4D22AQEfR92UkToBKw/feedshare-shrink_800/feedshare-shrink_800/0/1697804771880?e=2147483647&v=beta&t=5U3zuUussQMsrF5SEj5775yl-2Bk8ALgB-_7mimb3RE", desc: "Imposing sea fort constructed off the Malvan shoreline." },
        { title: "Panhala Fort", category: "fort", location: "KOLHAPUR DISTRICT", img: "https://www.sawaimansingresort.com/images/panhala-fort/panhala-fort-01.jpg", desc: "Massive strategic stronghold commanding pass views in Western Ghats." },
        { title: "Lohagad & Visapur", category: "fort", location: "PUNE DISTRICT", img: "https://pratik18p.wordpress.com/wp-content/uploads/2011/11/dsc_0054.jpg", desc: "Twin hill fortresses popular for monsoon trekking." },
        { title: "Kalsubai Peak", category: "hill", location: "AHILYANAGAR DISTRICT", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", desc: "Highest peak in Maharashtra offering expansive Sahyadri views." },
        { title: "Mahabaleshwar", category: "hill", location: "SATARA DISTRICT", img: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3aa?auto=format&fit=crop&w=800&q=80", desc: "Premier hill station known for valleys, viewpoints, and strawberry farms." },
        { title: "Panchgani", category: "hill", location: "SATARA DISTRICT", img: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3aa?auto=format&fit=crop&w=800&q=80", desc: "Scenic hill retreat famed for volcanic plateaus and pleasant climate." },
        { title: "Lonavala & Khandala", category: "hill", location: "PUNE DISTRICT", img: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3aa?auto=format&fit=crop&w=800&q=80", desc: "Popular getaway featuring lush green hills, waterfalls, and caves." },
        { title: "Matheran", category: "hill", location: "RAIGAD DISTRICT", img: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3aa?auto=format&fit=crop&w=800&q=80", desc: "Automobile-free hill station renowned for peaceful forest trails." },
        { title: "Igatpuri", category: "hill", location: "NASHIK DISTRICT", img: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3aa?auto=format&fit=crop&w=800&q=80", desc: "Serene hill town nestled amidst Western Ghats peaks and waterfalls." }
    ];

    const fortGrid = document.getElementById("fortGrid");
    const searchInput = document.getElementById("fortSearch");
    const noResults = document.getElementById("noResults");
    const tabButtons = document.querySelectorAll(".tab-btn");

    let currentCategory = "all";

    function renderGrid() {
        const query = searchInput.value.toLowerCase().trim();
        fortGrid.innerHTML = "";
        let count = 0;

        itemsData.forEach(item => {
            const matchesCat = currentCategory === "all" || item.category === currentCategory;
            const matchesSearch = item.title.toLowerCase().includes(query) || item.location.toLowerCase().includes(query);

            if (matchesCat && matchesSearch) {
                count++;
                const card = document.createElement("article");
                card.className = "beach-card";
                card.innerHTML = `
                    <img src="${item.img}" alt="${item.title}">
                    <div class="card-content">
                        <span class="location">${item.location}</span>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                        <button onclick="showOnMap('${item.title}')">Explore →</button>
                    </div>
                `;
                fortGrid.appendChild(card);
            }
        });

        noResults.style.display = count === 0 ? "block" : "none";
    }

    searchInput.addEventListener("input", renderGrid);

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

function showOnMap(name) {
    const googleMap = document.getElementById("googleMap");
    const formattedName = encodeURIComponent(name + ", Maharashtra");
    googleMap.src = `https://maps.google.com/maps?q=${formattedName}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
}