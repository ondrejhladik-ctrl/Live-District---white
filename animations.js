/* Live District — shared animations */

/* ─── ARTIST MARQUEE: pevný první batch + náhodné navazující batche ───
   Generuje se PŘED kurzorem a crowd-partingem, aby na nově vzniklé dlaždice
   navázaly stejné interakce. Track = 2 identické poloviny → bezešvý -50% loop. */
(function () {
    var track = document.querySelector('.bento-track');
    var fixed = track && track.querySelector('.bento-fixed');
    if (!track || !fixed) return;

    var templates = Array.prototype.slice.call(fixed.querySelectorAll('.bento-item'));
    if (!templates.length) return;

    function shuffle(a) {
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    // Náhodný batch: 8 sloupců, každý vyplněn na 3 řady náhodným vzorem
    // čtverců (span 1) a vertikálů (span 2). Plní se po sloupcích → bez děr.
    var COL_PATTERNS = [[2, 1], [1, 2], [1, 1, 1]];
    function buildRandomBatch(avoidFirstHref) {
        var batch = document.createElement('div');
        batch.className = 'bento-mosaic bento-random';
        var pool = shuffle(templates.slice());
        // ať batch nezačíná stejným umělcem, jako skončil předchozí (na švu nejsou stejní u sebe)
        if (avoidFirstHref && pool.length > 1 && pool[0].getAttribute('href') === avoidFirstHref) {
            pool.push(pool.shift());
        }
        var pi = 0, lastHref = null;
        for (var col = 0; col < 8; col++) {
            var pat = COL_PATTERNS[Math.floor(Math.random() * COL_PATTERNS.length)];
            for (var k = 0; k < pat.length; k++) {
                var tpl = pool[pi % pool.length];
                pi++;
                var item = tpl.cloneNode(true);
                item.style.transform = '';
                item.style.gridRow = 'span ' + pat[k];
                batch.appendChild(item);
                lastHref = tpl.getAttribute('href');
            }
        }
        batch._lastHref = lastHref;
        return batch;
    }

    var fixedItems = fixed.querySelectorAll('.bento-item');
    var fixedFirst = fixedItems[0].getAttribute('href');
    var fixedLast = fixedItems[fixedItems.length - 1].getAttribute('href');

    // 1. polovina: [pevný, náhodný, náhodný] – hlídáme švy, ať na sebe nenavazují stejní umělci
    var r1 = buildRandomBatch(fixedLast);
    var r2 = buildRandomBatch(r1._lastHref);
    var guard = 0;
    while (r2._lastHref === fixedFirst && guard++ < 6) { r2 = buildRandomBatch(r1._lastHref); }
    var seq = [fixed, r1, r2];
    seq.slice(1).forEach(function (b) { track.appendChild(b); });
    // 2. identická polovina (klony) → bezešvý loop při translateX(-50%)
    seq.forEach(function (b) { track.appendChild(b.cloneNode(true)); });
})();

/* ─── CUSTOM CURSOR ─── */
(function () {
    if (window.matchMedia('(hover: none)').matches) return;

    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    var label = document.createElement('span');
    label.className = 'cursor-text';
    cursor.appendChild(label);
    document.body.appendChild(cursor);

    // Zero-lag position tracking (left/top, ať mix-blend-difference dál blenduje s pozadím)
    document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    }, { passive: true });

    // Standard hover — links, buttons, events, gallery cards (exclude artist/bento items)
    document.querySelectorAll('a:not(.artist-card):not(.bento-item), button, .events-row, .gallery-card').forEach(function (el) {
        el.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
        el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
    });

    // Artist card hover — static "CLICK" with the default simple text styling
    document.querySelectorAll('.artist-card').forEach(function (el) {
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

    // Bento item hover — dynamic artist name inside the beige pill
    document.querySelectorAll('.bento-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            var img = el.querySelector('img');
            label.textContent = el.getAttribute('data-cursor-text') || (img && img.alt) || 'CLICK';
            cursor.classList.remove('is-hovering');
            cursor.classList.add('is-artist-hover');
        });
        el.addEventListener('mouseleave', function () {
            cursor.classList.remove('is-artist-hover');
            label.textContent = '';
        });
    });
})();

/* ─── ARTIST GRID "CROWD PARTING" ───
   Hovered item scales up (CSS :hover); all other items smoothly shift
   away from it in their relative direction. Pure additive layer —
   leaves the bento layout, gradient title and cursor logic untouched. */
(function () {
    if (window.matchMedia('(hover: none)').matches) return;
    var batches = document.querySelectorAll('.bento-mosaic');
    if (!batches.length) return;

    var SHIFT = 12; // px the surrounding items part away (subtle)

    batches.forEach(function (batch) {
        var items = Array.prototype.slice.call(batch.querySelectorAll('.bento-item'));
        if (items.length < 2) return;

        // Scroll-independent centres, relative to the batch (position:relative)
        var centers = [];
        function measure() {
            centers = items.map(function (el) {
                return { cx: el.offsetLeft + el.offsetWidth / 2, cy: el.offsetTop + el.offsetHeight / 2 };
            });
        }
        measure();
        window.addEventListener('load', measure);
        window.addEventListener('resize', measure);

        function part(idx) {
            items[idx].style.transform = '';            // hovered keeps its CSS :hover scale
            var h = centers[idx];
            items.forEach(function (el, i) {
                if (i === idx) return;
                var dx = centers[i].cx - h.cx;
                var dy = centers[i].cy - h.cy;
                var dist = Math.hypot(dx, dy) || 1;
                var tx = (dx / dist) * SHIFT;
                var ty = (dy / dist) * SHIFT;
                el.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
            });
        }
        function reset() {
            items.forEach(function (el) { el.style.transform = ''; });
        }

        items.forEach(function (el, i) {
            el.addEventListener('mouseenter', function () { part(i); });
            el.addEventListener('mouseleave', reset);
            el.addEventListener('focus', function () { part(i); });
            el.addEventListener('blur', reset);
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

/* ─── MOBILE NAV (hamburger + menu) ───
   Hamburger a menu se vytvoří dynamicky (nav je duplikovaný v ~17 HTML).
   Menu se staví z existujících odkazů v .top-nav → vždy v souladu s desktop navem.
   Viditelnost řeší CSS media queries; na desktopu jsou prvky display:none. */
(function () {
    var nav = document.querySelector('.top-nav');
    if (!nav) return;
    var html = document.documentElement;

    // Hamburger do lišty (díky space-between skončí vpravo)
    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    // Fullscreen světlé menu do <body> (mimo mix-blend header, ať se barvy neinvertují)
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';

    var list = document.createElement('nav');
    list.className = 'mobile-menu-links';
    nav.querySelectorAll('.nav-left a, .nav-right a').forEach(function (a) {
        var link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = (a.textContent || '').trim();
        link.className = 'mobile-menu-link';
        list.appendChild(link);
    });
    menu.appendChild(list);
    document.body.appendChild(menu);

    function openMenu() {
        html.classList.add('menu-open');
        toggle.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        html.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
        if (html.classList.contains('menu-open')) closeMenu();
        else openMenu();
    });
    list.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu); // zavře a zároveň naviguje
    });
    menu.addEventListener('click', function (e) {
        if (e.target === menu) closeMenu(); // klik na prázdné pozadí
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && html.classList.contains('menu-open')) closeMenu();
    });
})();

/* ─── EVENTS na mobilu: klub + město na jeden řádek ───
   Obalí .col-lokace + .col-club do .col-venue (zachová DOM pořadí), aby šly na mobilu
   stylovat jako jeden řádek. Na desktopu má .col-venue display:contents → tabulka beze změny. */
(function () {
    document.querySelectorAll('.events-row').forEach(function (row) {
        var lokace = row.querySelector('.col-lokace');
        var club = row.querySelector('.col-club');
        if (!lokace || !club || row.querySelector('.col-venue')) return;
        var venue = document.createElement('div');
        venue.className = 'col-venue';
        lokace.parentNode.insertBefore(venue, lokace);
        venue.appendChild(lokace);
        venue.appendChild(club);
    });
})();

/* ─── FORMULÁŘ → ODESLAT NA MAIL ───
   Statický web bez backendu → po odeslání poskládáme údaje a otevřeme mail klient
   předvyplněný na booking adresu. Platí pro poptávku i formuláře na detailech umělců. */
(function () {
    var MAIL = 'ondrej.hladik@icloud.com';
    document.querySelectorAll('form.inquiry-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var lines = [];
            form.querySelectorAll('input, textarea').forEach(function (el) {
                var lbl = el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
                var key = lbl ? lbl.textContent.trim() : (el.name || el.id || 'Pole');
                lines.push(key + ': ' + (el.value.trim() || '—'));
            });
            window.location.href = 'mailto:' + MAIL
                + '?subject=' + encodeURIComponent('Nezávazná poptávka — Live District')
                + '&body=' + encodeURIComponent(lines.join('\r\n'));
        });
    });
})();
