/* Live District — shared animations */

/* ─── ANTI-CLICKJACKING (pojistka, když hosting nenastaví X-Frame-Options/CSP) ─── */
(function () {
    if (window.top !== window.self) {
        try { window.top.location = window.self.location; }
        catch (e) { document.documentElement.style.display = 'none'; }
    }
})();

/* ─── EVENTY: automaticky skryj proběhlé + na homepage nech 5 nadcházejících ───
   Datum se čte z .col-kdy ("18. 7." nebo rozsah "14–17. 7." → rozhoduje KONEC).
   Rok v datu není → dopočítá se: kdyby datum vyšlo víc než ~6 měsíců do minulosti,
   jde skoro jistě o příští rok. Běží při každém načtení = vždy aktuální, bez údržby.
   Musí běžet PŘED ostatními IIFE nad .events-row (stagger, mobil, kurzor), aby ty
   pracovaly už jen s aktuálními řádky. */
(function () {
    var rows = Array.prototype.slice.call(document.querySelectorAll('.events-row'));
    if (!rows.length) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var SIX_MONTHS = 183 * 24 * 60 * 60 * 1000;

    function endDate(text) {
        if (!text) return null;
        var t = text.replace(/[‒-―]/g, '-');                 // pomlčky → '-'
        var m = t.match(/(\d{1,2})\s*(?:-\s*(\d{1,2}))?\s*\.\s*(\d{1,2})\s*\./);
        if (!m) return null;
        var day = parseInt(m[2] || m[1], 10);                          // u rozsahu jeho konec
        var month = parseInt(m[3], 10);
        var d = new Date(today.getFullYear(), month - 1, day);
        d.setHours(0, 0, 0, 0);
        if (today - d > SIX_MONTHS) d.setFullYear(d.getFullYear() + 1); // dávno v minulosti = příští rok
        return d;
    }

    rows.forEach(function (row) {
        var kdy = row.querySelector('.col-kdy');
        var d = endDate(kdy && kdy.textContent);
        if (d && d < today) row.remove();                              // proběhlý event → pryč
    });

    // Homepage (<body class="home">): z nadcházejících nech jen prvních 5.
    if (document.body.classList.contains('home')) {
        Array.prototype.slice.call(document.querySelectorAll('.events-row'))
            .slice(5)
            .forEach(function (row) { row.remove(); });
    }
})();

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
    // Respektuj uživatele, kteří mají vypnuté animace
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var s = document.createElement('script');
    s.src = 'lenis.min.js';   // lokálně (CSP povoluje jen 'self')
    s.onload = function () {
        if (typeof Lenis === 'undefined') return;
        var lenis = new Lenis({
            duration: 1.35,                                   // delší = víc setrvačnosti
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.6,
            lerp: 0.085,                                      // nižší = plynulejší dojezd
            syncTouch: true,                                  // setrvačnost i na dotyku/mobilu
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);

        // Zastavit scroll když je otevřené mobilní menu (CSS .lenis-stopped)
        window.addEventListener('ld:menu-open',  function () { lenis.stop();  });
        window.addEventListener('ld:menu-close', function () { lenis.start(); });
    };
    s.onerror = function () { /* fallback: nativní scroll zůstává funkční */ };
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

    // Reálná výška displeje pro fullscreen menu (iOS lišta mění viewport).
    // Bereme největší známou výšku, aby menu vždy pokrylo celý display bez prosvítání.
    function setMenuHeight() {
        var vv = window.visualViewport;
        var h = Math.max(
            window.innerHeight || 0,
            document.documentElement.clientHeight || 0,
            vv ? vv.height : 0
        );
        html.style.setProperty('--menu-h', h + 'px');
    }
    setMenuHeight();
    window.addEventListener('resize', setMenuHeight);
    window.addEventListener('orientationchange', setMenuHeight);

    var savedScrollY = 0;
    function openMenu() {
        setMenuHeight();                                   // přepočítej těsně před otevřením
        savedScrollY = window.scrollY || window.pageYOffset || 0;
        window.dispatchEvent(new Event('ld:menu-open'));   // zastaví Lenis pod menu
        html.classList.add('menu-open');
        document.body.style.top = (-savedScrollY) + 'px';  // drž vizuální pozici (fixní body)
        toggle.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        html.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, savedScrollY);                  // vrať scroll na původní místo
        toggle.setAttribute('aria-expanded', 'false');
        window.dispatchEvent(new Event('ld:menu-close'));  // obnoví Lenis
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

/* ─── FORMULÁŘ → ODESLAT NA MAIL (Web3Forms) ───
   Statický web sám maily neposílá → odeslání řeší Web3Forms (zdarma, bez účtu). Po úspěchu → stránka Odesláno.
   KAM CHODÍ MAILY = nastavuje se přístupovým klíčem ACCESS_KEY níže:
     1) jdi na https://web3forms.com → zadej cílový e-mail (teď: ondrejhladik7@gmail.com) → klíč ti přijde do mailu
     2) klíč vlož do ACCESS_KEY
     3) až budeš chtít posílat na booking@livedistrict.eu, vyžádej klíč pro tu adresu a tady ho vyměň
   Platí pro poptávku i formuláře na detailech umělců. */
(function () {
    var ACCESS_KEY = 'a121576d-a9b9-4a9d-8feb-2aac65e0d819';   // ← příjemce: ondrejhladik7@gmail.com (změna = nový klíč)

    // Vlastní validace místo nativní bubliny: chybné povinné pole zčervená (.field-invalid).
    // Vrací první chybné pole (nebo null, když je vše OK).
    function validate(form) {
        var bad = null;
        form.querySelectorAll('input, textarea, select').forEach(function (el) {
            var field = el.closest ? el.closest('.field') : null;
            var ok = el.checkValidity();
            if (field) field.classList.toggle('field-invalid', !ok);
            if (!ok && !bad) bad = el;
        });
        return bad;
    }

    document.querySelectorAll('form.inquiry-form').forEach(function (form) {
        form.setAttribute('novalidate', '');   // vypni nativní bublinu → validaci si řešíme sami

        // jakmile uživatel pole opraví, červené zvýraznění hned zmizí
        form.addEventListener('input', function (e) {
            var field = e.target && e.target.closest ? e.target.closest('.field') : null;
            if (field && field.classList.contains('field-invalid') && e.target.checkValidity()) {
                field.classList.remove('field-invalid');
            }
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var bad = validate(form);
            if (bad) { bad.focus(); return; }   // něco chybí/špatně → zůstat na stránce, zvýraznit červeně
            var btn = form.querySelector('.form-submit');
            var orig = btn ? btn.textContent : '';
            function reset(msg) { if (btn) { btn.disabled = false; btn.textContent = orig; } if (msg) alert(msg); }
            if (btn) { btn.disabled = true; btn.textContent = 'Odesílám…'; }

            var data = new FormData(form);
            data.append('access_key', ACCESS_KEY);
            data.append('subject', 'Nová poptávka — Live District');
            data.append('from_name', 'Live District web');
            var email = form.querySelector('#email');
            if (email && email.value) data.append('replyto', email.value);   // odpověď půjde rovnou poptávajícímu

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: data
            })
            .then(function (r) { return r.json(); })
            .then(function (res) {
                if (res && res.success) { window.location.href = 'odeslano'; }
                else { reset('Odeslání se nezdařilo. Zkuste to prosím znovu, nebo nás kontaktujte na booking@livedistrict.eu.'); }
            })
            .catch(function () { reset('Odeslání se nezdařilo. Zkontrolujte připojení a zkuste to prosím znovu.'); });
        });
    });
})();
