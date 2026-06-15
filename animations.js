/* Live District — shared animations */

/* ─── CUSTOM CURSOR ─── */
(function () {
    if (window.matchMedia('(hover: none)').matches) return;

    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    var label = document.createElement('span');
    label.className = 'cursor-text';
    cursor.appendChild(label);
    document.body.appendChild(cursor);

    // Zero-lag position tracking
    document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    }, { passive: true });

    // Standard hover — links, buttons, events, gallery cards (exclude artist/bento items)
    document.querySelectorAll('a:not(.artist-card):not(.bento-item), button, .events-row, .gallery-card').forEach(function (el) {
        el.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
        el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
    });

    // Artist card hover — expand bubble with artist name
    document.querySelectorAll('.artist-card').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            var nameEl = el.querySelector('.artist-name');
            label.textContent = nameEl ? nameEl.textContent.trim() : '';
            cursor.classList.remove('is-hovering');
            cursor.classList.add('is-artist-hover');
        });
        el.addEventListener('mouseleave', function () {
            cursor.classList.remove('is-artist-hover');
            label.textContent = '';
        });
    });

    // Bento item hover — side-label "CLICK"
    document.querySelectorAll('.bento-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            label.textContent = 'CLICK';
            cursor.classList.remove('is-hovering');
            cursor.classList.add('is-bento-hover');
        });
        el.addEventListener('mouseleave', function () {
            cursor.classList.remove('is-bento-hover');
            label.textContent = '';
        });
    });
})();

/* ─── LENIS SMOOTH SCROLL ─── */
(function () {
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
    s.onload = function () {
        var lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
})();

/* ─── SCROLL PROGRESS BAR ─── */
(function () {
    var bar = document.createElement('div');
    bar.className = 'scroll-bar';
    document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
})();

/* ─── ABOUT ACCENT LINE ─── */
(function () {
    var line = document.querySelector('.about-accent-line');
    if (!line) return;
    var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            line.classList.add('is-visible');
            io.disconnect();
        }
    }, { threshold: 0.5 });
    io.observe(line);
})();

/* ─── EVENTS TABLE STAGGER ─── */
document.querySelectorAll('.events-table').forEach(function (table) {
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var header = entry.target.querySelector('.events-header');
            var rows   = Array.from(entry.target.querySelectorAll('.events-row'));

            function reveal(el, delay) {
                setTimeout(function () {
                    el.classList.add('row-in');
                    el.addEventListener('animationend', function () {
                        el.classList.remove('row-in');
                        el.classList.add('revealed');
                    }, { once: true });
                }, delay);
            }

            if (header) reveal(header, 0);
            rows.forEach(function (row, i) { reveal(row, (i + 1) * 40); });
            io.unobserve(entry.target);
        });
    }, { threshold: 0.05 });
    io.observe(table);
});

/* ─── SCROLLED NAV ─── */
(function () {
    var html = document.documentElement;
    var ticking = false;

    // Set correct state immediately on load (handles page refresh mid-scroll)
    if (window.scrollY > 50) html.classList.add('is-scrolled');

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                html.classList.toggle('is-scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();
