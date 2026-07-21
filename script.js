const componentMap = [
    { id: 'navbar-container', file: 'components/navbar.html' },
    { id: 'hero-container', file: 'components/hero.html' },
    { id: 'profil-container', file: 'components/profil.html' },
    { id: 'organisasi-container', file: 'components/organisasi.html' },
    { id: 'layanan-container', file: 'components/layanan.html' },
    { id: 'potensi-container', file: 'components/potensi.html' },
    { id: 'umkm-container', file: 'components/umkm.html' },
    { id: 'galeri-container', file: 'components/galeri.html' },
    { id: 'berita-container', file: 'components/berita.html' },
    { id: 'faq-container', file: 'components/faq.html' },
    { id: 'kontak-container', file: 'components/kontak.html' },
    { id: 'footer-container', file: 'components/footer.html' }
];

async function loadComponent(containerId, file) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Gagal memuat ${file}`);
        container.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-danger">Gagal memuat bagian halaman.</p>';
    }
}

async function loadComponents() {
    await Promise.all(componentMap.map(({ id, file }) => loadComponent(id, file)));
    initializePage();
}

function initializePage() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }

    const navbar = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');

    if (navbar && backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                navbar.classList.remove('navbar-dark');
                navbar.classList.add('navbar-light');
            } else {
                navbar.classList.remove('scrolled');
                navbar.classList.remove('navbar-light');
                navbar.classList.add('navbar-dark');
            }

            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));

    const counters = document.querySelectorAll('.counter');
    let counterStarted = false;
    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counterStarted) {
            counterStarted = true;
            counters.forEach((counter) => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current).toLocaleString('id-ID');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target.toLocaleString('id-ID');
                    }
                };

                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));

    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Terima kasih! Pesan Anda telah dikirim. (Ini adalah form statis sebagai contoh).');
        this.reset();
    });

    // Tambah efek klik pada nav items
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', function () {
            navLinks.forEach((el) => el.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

window.openUmkmDetail = function (name, owner, category, desc, price, location, phone, img) {
    document.getElementById('umkmName').innerText = name;
    document.getElementById('umkmOwner').innerText = owner;
    document.getElementById('umkmCategory').innerText = category;
    document.getElementById('umkmDesc').innerText = desc;
    document.getElementById('umkmPrice').innerText = price;
    document.getElementById('umkmLocation').innerText = location;
    document.getElementById('umkmModalImg').src = img;
    document.getElementById('umkmWaBtn').href = 'https://wa.me/' + phone;

    const modal = new bootstrap.Modal(document.getElementById('umkmModal'));
    modal.show();
};

window.openLightbox = function (imgSrc) {
    document.getElementById('lightboxImage').src = imgSrc;
    const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    modal.show();
};

document.addEventListener('DOMContentLoaded', loadComponents);
