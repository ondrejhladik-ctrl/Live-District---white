/* Live District — překlady webu
   Zdrojem je čeština v HTML. Slovník T ji podle přesné shody textu nahradí zvoleným
   jazykem, takže stránky se neduplikují. Text, který ve slovníku není (jména umělců,
   města, kluby), zůstává beze změny.
   Změníš-li česky text v HTML, změň i jeho klíč ve slovníku, jinak zůstane nepřeložený.
   Hodnota ve slovníku je anglický překlad.
   Skript se načítá PŘED animations.js, aby cookie lišta a formulář měly k dispozici ldT. */
(function () {
    var KEY = 'ld-lang';
    var LANGS = [['cs', 'CZ', 'Čeština'], ['en', 'EN', 'English']];   // kód, zkratka v patičce, název v mobilním menu

    var T = {
        /* Navigace a patička */
        "NEZÁVAZNÁ POPTÁVKA": "INQUIRY",   // krátce, delší text v menu najíždí na logo
        "EVENTY": "EVENTS",
        "UMĚLCI": "ARTISTS",
        "TÝM": "TEAM",
        "KONTAKT": "CONTACT",
        "Booking a management současných umělců.": "Booking and management of contemporary artists.",
        "BOOKING A MANAGEMENT": "BOOKING AND MANAGEMENT",
        "SOUČASNÝCH UMĚLCŮ": "OF CONTEMPORARY ARTISTS",
        "IČO: 01744933": "Company ID: 01744933",
        "Ochrana osobních údajů": "Privacy policy",

        /* Názvy stránek */
        "Eventy": "Events",
        "Naši umělci": "Our artists",
        "Tým": "Team",
        "Kontakt": "Contact",
        "Odesláno": "Sent",

        /* Homepage */
        "O AGENTUŘE": "ABOUT THE AGENCY",
        "NAŠI UMĚLCI": "OUR ARTISTS",
        "ZOBRAZIT UMĚLCE": "VIEW ARTISTS",
        "Live District je bookingová agentura zaměřená na profesionální zastoupení současných umělců. Zajišťujeme booking, komunikaci a kompletní podporu vystoupení – od klubových akcí až po festivaly a speciální eventy.": "Live District is a booking agency focused on the professional representation of contemporary artists. We handle booking, communication and full performance support – from club nights to festivals and special events.",
        "Spolupracujeme s interprety i pořadateli a klademe důraz na kvalitu, spolehlivost a dlouhodobé vztahy.": "We work with artists and promoters alike, with an emphasis on quality, reliability and long-term relationships.",

        /* Eventy */
        "KDY": "WHEN",
        "LOKACE": "LOCATION",
        "CLUB": "CLUB",
        "UMĚLEC": "ARTIST",
        "SEZNAM EVENTŮ": "EVENT LIST",

        /* Formulář */
        "Nezávazná poptávka": "Non-binding inquiry",
        "Zašlete nám svou poptávku a my se vám ozveme s informacemi o dostupnosti a podmínkách vystoupení.": "Send us your inquiry and we will get back to you with details on availability and performance terms.",
        "Pro zajištění umělce a profesionální podporu při plánování vaší akce vyplňte, prosím, tento formulář.": "To book an artist and get professional support in planning your event, please fill in this form.",
        "Typ akce": "Event type",
        "Vybraný umělec / umělci": "Selected artist(s)",
        "Místo konání": "Venue",
        "Preferovaný termín": "Preferred date",
        "Kontaktní osoba": "Contact person",
        "Email": "Email",
        "Telefon": "Phone",
        "Detail poptávky": "Inquiry details",
        "Odeslat": "Send",
        "Odesílám…": "Sending…",
        "Koncert, festival, soukromá akce…": "Concert, festival, private event…",
        "Město a název klubu": "City and club name",
        "DD. MM. YYYY": "DD/MM/YYYY",
        "Jméno a příjmení": "First and last name",
        "Jméno umělce": "Artist name",
        "vás@email.cz – povinné pole": "your@email.com – required",
        "+420 000 000 000 – povinné pole": "+420 000 000 000 – required",
        "Blížší informace o akci, počet hostů, technické zázemí…": "More about the event, number of guests, technical setup…",
        "Bližší informace o akci, počet hostů, technické zázemí…": "More about the event, number of guests, technical setup…",
        "Odeslání se nezdařilo. Zkuste to prosím znovu, nebo nás kontaktujte na booking@livedistrict.eu.": "Sending failed. Please try again or contact us at booking@livedistrict.eu.",
        "Odeslání se nezdařilo. Zkontrolujte připojení a zkuste to prosím znovu.": "Sending failed. Please check your connection and try again.",
        "Děkujeme za vaši poptávku. Ozveme se vám co nejdříve na uvedené kontakty.": "Thank you for your inquiry. We will get back to you as soon as possible using the contact details you provided.",
        "Zpět na hlavní stránku": "Back to homepage",

        /* Cookie lišta */
        "Nastavení cookies": "Cookie settings",
        "Google Analytics nám ukazuje, jak se web používá, a videa z YouTube mohou ukládat vlastní cookies. Obojí načteme jen s vaším souhlasem.": "Google Analytics shows us how the website is used, and YouTube videos may store their own cookies. We only load them with your consent.",
        "Více informací": "More information",
        "Analytika (Google Analytics)": "Analytics (Google Analytics)",
        "Videa z YouTube": "YouTube videos",
        "Odmítnout vše": "Reject all",
        "Uložit výběr": "Save selection",
        "Přijmout vše": "Accept all",
        "Video z YouTube se načte až po vašem souhlasu s cookies.": "The YouTube video will load once you accept cookies.",
        "Povolit videa": "Allow videos",
        "Přehrát na YouTube": "Watch on YouTube",
        "Zkopírováno": "Copied",

        /* Umělci */
        "CASE26 je český rapper známý svým osobitým stylem, energickým flow a autentickými texty. Spolupracuje s ERNE100 a jejich společné skladby kombinují melodické beaty s tvrdým rapem. Jedno z výrazných jmen současné české rapové scény.": "CASE26 is a Czech rapper known for his distinctive style, energetic flow and authentic lyrics. He works with ERNE100, and their joint tracks combine melodic beats with hard-hitting rap. One of the standout names on today's Czech rap scene.",
        "Svoji hudební dráhu začal jako bubeník v rockové kapele. První EP vydal v roce 2018 a dnes má na kontě osm alb, platinové singly, miliony zhlédnutí videoklipů i spolupráce s nejvýraznějšími jmény české rapové scény.": "He started his music career as a drummer in a rock band. He released his first EP in 2018 and today has eight albums, platinum singles, millions of music video views and collaborations with the biggest names on the Czech rap scene.",
        "ERNE100 je český rapper a člen Czechomoravia Drillegacy (CMD), který se rychle prosazuje na tuzemské undergroundové rapové scéně díky svému energickému trap a drill soundu a autentickým textům. V roce 2023 vydal debutové album Freedom Is Priceless. Je známý spoluprací na singlu Ewa Farna s polským rapperem Frosti, kde hostují i Yzomandias a Žabson.": "ERNE100 is a Czech rapper and member of Czechomoravia Drillegacy (CMD), quickly making his mark on the Czech underground rap scene with his energetic trap and drill sound and authentic lyrics. In 2023 he released his debut album Freedom Is Priceless. He is known for the single Ewa Farna with Polish rapper Frosti, which also features Yzomandias and Žabson.",
        "Katannah je rapper z Teplic s nigerijsko-bosenskými kořeny. Rapovat začal v 17 letech a zaujal autentickými texty a osobitým stylem. Má za sebou velmi úspěšné album The Underdog, ze kterého singl 415 dosáhl platinového ocenění.": "Katannah is a rapper from Teplice with Nigerian-Bosnian roots. He started rapping at 17 and stood out with his authentic lyrics and distinctive style. His highly successful album The Underdog includes the single 415, which went platinum.",
        "Lboy je český rapper, který se pohybuje na pomezí moderního rapu a osobní výpovědi. Ve své tvorbě sází na autentické texty, vlastní zkušenosti a atmosférický sound reflektující realitu mladé generace.": "Lboy is a Czech rapper working at the crossroads of modern rap and personal storytelling. His music relies on authentic lyrics, his own experiences and an atmospheric sound that reflects the reality of the younger generation.",
        "Na kontě má jedno zlaté album a platinový singl, což potvrzuje jeho silnou pozici na české rapové scéně. Jeho hudba je syrová, upřímná a postavená na výrazném vibeu i emocích.": "He has a gold album and a platinum single to his name, confirming his strong position on the Czech rap scene. His music is raw, honest and built on a distinctive vibe and emotion.",
        "MC KENNY je pražský rapper známý svým česky rapovaným stylem, energickým flow a autentickými texty, které reflektují životní zkušenosti a osobní boj. Nedávná spolupráce s Katannahem na singlu Quarterback sbírá silné ohlasy napříč českou rap scénou.": "MC KENNY is a Prague rapper known for his Czech-language style, energetic flow and authentic lyrics reflecting life experience and personal struggle. His recent collaboration with Katannah on the single Quarterback has drawn a strong response across the Czech rap scene.",
        "Objev The Mag W/RAP — MEIZIMEN prorazil bangerem Spokojenej boyy. Vydal EP 4 a 4 (Deluxe) a jeho tracky dosahují milionů streamů. Svěží hlas nové generace českého rapu.": "A discovery of The Mag W/RAP, MEIZIMEN broke through with the banger Spokojenej boyy. He has released the EPs 4 and 4 (Deluxe), and his tracks reach millions of streams. A fresh voice of the new generation of Czech rap.",
        "Nando je český hip-hop/rap interpret, který se prosazuje skrze energickou rapovou tvorbu a spolupráce s dalšími umělci na scéně. V roce 2025 vydal singly KLÍČ (feat. Eduardo1 & AG9), BIG STEPPA (feat. Eduardo1) a PISTOLA.": "Nando is a Czech hip-hop/rap artist making his name with energetic rap and collaborations with other artists on the scene. In 2025 he released the singles KLÍČ (feat. Eduardo1 & AG9), BIG STEPPA (feat. Eduardo1) and PISTOLA.",
        "Nikdevil je rapový umělec z Ústeckého kraje, jehož tvorba stojí na autenticitě, moderním zvuku a osobních příbězích. Inspiraci hledá ve vlastním životě a každým releasem rozvíjí svůj charakteristický styl. Mezi jeho nejvýraznější skladby patří „Stačí mi rok“, která představuje důležitý bod jeho dosavadní kariéry.": "Nikdevil is a rap artist from the Ústí Region whose work is built on authenticity, a modern sound and personal stories. He draws inspiration from his own life and develops his signature style with every release. His standout tracks include “Stačí mi rok”, a key moment in his career so far.",
        "Radek Yang je začínající český rapper z nové generace. Sledujte jeho cestu a první kroky na české rap scéně na sociálních sítích.": "Radek Yang is an up-and-coming Czech rapper from the new generation. Follow his journey and first steps on the Czech rap scene on social media.",
        "Sensey patří mezi nejvýraznější talenty českého rapu. Na kontě má platinové album BRATAN, desky SNY JSOU MOCNĚJŠÍ NEŽ SKUTEČNOST a BRATAN 2.0 a spolupráce s Hugo Toxxx, Calin a Vercetti CG. Jeho tvorba výrazně rezonuje domácí rapovou scénou.": "Sensey is one of the most striking talents in Czech rap. He has the platinum album BRATAN to his name, along with the records SNY JSOU MOCNĚJŠÍ NEŽ SKUTEČNOST and BRATAN 2.0 and collaborations with Hugo Toxxx, Calin and Vercetti CG. His work resonates strongly across the Czech rap scene.",
        "Finalista The Mag Wrap 2025 z Teplic přináší do českého rapu svěží energii. Už track Bůuh (feat. Magenta) ukázal jeho melodickou flow a cit pro detail. Jeho nový projekt Stejný místo, Nový boty nabízí devět skladeb plných autenticity.": "A finalist of The Mag Wrap 2025 from Teplice, he brings fresh energy to Czech rap. The track Bůuh (feat. Magenta) already showed his melodic flow and eye for detail. His new project Stejný místo, Nový boty offers nine tracks full of authenticity.",
        "XSUICIDEX je mladý umělec z Prahy, který tvoří převážně ve slovenském jazyce. Do širšího povědomí se dostal díky rapové soutěži The Mag Wrap. Mezi jeho nejznámější skladby patří „LATINO“ s Victorem Kal.": "XSUICIDEX is a young artist from Prague who creates mainly in Slovak. He rose to wider attention through the rap competition The Mag Wrap. His best-known tracks include “LATINO” with Victor Kal.",

        /* Tým */
        "je zakladatel bookingové agentury zaměřené především na rapovou scénu. V hudebním prostředí se pohybuje přes 6 let a aktivně se podílí na budování a propojování lidí napříč scénou. Specializuje se na booking koncertů a management umělců, se silným citem pro aktuální směr rapové kultury.": "is the founder of a booking agency focused mainly on the rap scene. He has worked in the music industry for over 6 years and is actively involved in building the scene and connecting people across it. He specialises in concert booking and artist management, with a strong feel for where rap culture is heading.",
        "Na svém kontě má přes 100 zorganizovaných či vyjednaných koncertů pro své umělce, čímž si vybudoval pevné jméno a silnou síť kontaktů napříč scénou.": "He has organised or negotiated more than 100 concerts for his artists, earning a solid reputation and a strong network of contacts across the scene.",
        "Začínal jako manažer rappera Lboy, se kterým dlouhodobě spolupracuje dodnes a právě tahle spolupráce ho přivedla přímo do zákulisí hudebního byznysu a dala mu reálné porozumění tomu, co umělec skutečně potřebuje. V roce 2025 působil jako booking agent v rámci Universal Music Czech Republic, kde se zaměřoval především na booking rapových interpretů.": "He started out as manager of the rapper Lboy, with whom he still works today. That partnership took him straight behind the scenes of the music business and gave him a real understanding of what an artist truly needs. In 2025 he worked as a booking agent at Universal Music Czech Republic, focusing mainly on booking rap artists.",
        "Live District není jen bookingová agentura, je to platforma propojující streetovou autenticitu s profesionálním hudebním byznysem. Buduje dlouhodobé příležitosti pro umělce, vytváří silná partnerství mezi scénou a značkami a zaměřuje se na strategický růst, ne jen na jednorázové koncerty.": "Live District is not just a booking agency – it is a platform connecting street authenticity with the professional music business. It builds long-term opportunities for artists, creates strong partnerships between the scene and brands, and focuses on strategic growth rather than one-off concerts.",

        /* Zásady ochrany osobních údajů */
        "Zásady ochrany osobních údajů": "Privacy policy",
        "Live District • IČO 01744933 • aktualizováno 5. 11. 2026": "Live District • Company ID 01744933 • updated 5 November 2026",
        "Vážíme si vašeho soukromí a vaše osobní údaje zpracováváme v souladu s nařízením (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb., o zpracování osobních údajů. Tyto zásady popisují, jaké údaje a proč na webu Live District zpracováváme.": "We respect your privacy and process your personal data in accordance with Regulation (EU) 2016/679 (GDPR) and Czech Act No. 110/2019 Coll. on the processing of personal data. This policy describes what data we process on the Live District website and why.",
        "Správce osobních údajů": "Data controller",
        "Správcem vašich osobních údajů je Live District, IČO 01744933, booking a management současných umělců. Ve všech záležitostech týkajících se ochrany osobních údajů nás můžete kontaktovat na e-mailu": "The controller of your personal data is Live District, company ID 01744933, booking and management of contemporary artists. For all matters concerning data protection, you can contact us by email at",
        "Jaké údaje zpracováváme": "What data we process",
        "Prostřednictvím formuláře": "Through the form",
        "nám sami poskytujete zejména:": "you provide us in particular with:",
        "jméno a příjmení kontaktní osoby,": "the contact person's first and last name,",
        "e-mailovou adresu,": "email address,",
        "telefonní číslo,": "phone number,",
        "údaje o akci (typ akce, vybraný umělec, místo a termín konání, bližší popis poptávky).": "event details (event type, selected artist, venue and date, further description of the inquiry).",
        "Web nevyžaduje registraci ani přihlašování. Pokud s tím souhlasíte, zpracováváme navíc údaje o tom, jak web používáte, a to prostřednictvím služby Google Analytics. Jde například o navštívené stránky, zdroj návštěvy, přibližnou polohu, typ zařízení a prohlížeče a identifikátory uložené v cookies.": "The website does not require registration or login. If you agree, we also process data on how you use the website through Google Analytics. This includes, for example, pages visited, the source of your visit, approximate location, device and browser type, and identifiers stored in cookies.",
        "Proč údaje zpracováváme": "Why we process data",
        "Údaje z poptávkového formuláře zpracováváme za účelem vyřízení vaší poptávky, zpětného kontaktování, přípravy nabídky a případného jednání o uzavření smlouvy o zajištění umělce.": "We process data from the inquiry form in order to handle your inquiry, contact you back, prepare an offer and, where applicable, negotiate a contract for booking an artist.",
        "Právním základem je provedení opatření přijatých před uzavřením smlouvy na vaši žádost (čl. 6 odst. 1 písm. b GDPR), případně náš oprávněný zájem na vyřízení vaší poptávky a komunikaci s vámi (čl. 6 odst. 1 písm. f GDPR).": "The legal basis is taking steps at your request prior to entering into a contract (Art. 6(1)(b) GDPR) or, where applicable, our legitimate interest in handling your inquiry and communicating with you (Art. 6(1)(f) GDPR).",
        "Údaje z Google Analytics zpracováváme za účelem měření návštěvnosti a zlepšování webu. Právním základem je váš souhlas (čl. 6 odst. 1 písm. a GDPR), který můžete kdykoli odvolat přes odkaz „Nastavení cookies“ v patičce webu.": "We process data from Google Analytics to measure traffic and improve the website. The legal basis is your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time via the “Cookie settings” link in the website footer.",
        "Jak dlouho údaje uchováváme": "How long we keep data",
        "Údaje uchováváme po dobu nezbytně nutnou k vyřízení poptávky a vzájemné komunikaci. Pokud z poptávky nevznikne spolupráce, údaje zlikvidujeme nejpozději do 12 měsíců. V případě navázání spolupráce uchováváme údaje po dobu stanovenou právními předpisy, zejména účetními a daňovými.": "We keep data for as long as necessary to handle the inquiry and communicate with you. If the inquiry does not lead to cooperation, we delete the data within 12 months at the latest. If cooperation is established, we keep the data for the period required by law, in particular accounting and tax law.",
        "Údaje v Google Analytics uchováváme nejdéle 14 měsíců.": "We keep data in Google Analytics for a maximum of 14 months.",
        "Komu údaje předáváme": "Who we share data with",
        "Vaše osobní údaje nepředáváme třetím stranám pro jejich marketingové účely ani je neprodáváme. Mohou být zpřístupněny pouze našim zpracovatelům, kteří nám zajišťují provoz webu a komunikaci (poskytovatel hostingu a e-mailové služby), a to vždy na základě smlouvy a v nezbytném rozsahu.": "We do not share your personal data with third parties for their marketing purposes, nor do we sell it. It may only be made available to our processors who provide website operation and communication (hosting and email service providers), always under a contract and only to the extent necessary.",
        "Pokud souhlasíte s analytickými cookies, zpracovává údaje o používání webu také společnost Google Ireland Limited jako poskytovatel služby Google Analytics. Údaje se přitom mohou dostat i mimo Evropskou unii, zejména do USA.": "If you consent to analytics cookies, data on website use is also processed by Google Ireland Limited as the provider of Google Analytics. The data may also be transferred outside the European Union, in particular to the USA.",
        "Cookies a úložiště prohlížeče": "Cookies and browser storage",
        "Bez vašeho souhlasu web nepoužívá sledovací ani analytické cookies. Pokud souhlasíte, ukládá služba Google Analytics do vašeho prohlížeče cookies": "Without your consent, the website does not use tracking or analytics cookies. If you agree, Google Analytics stores the cookies",
        "a": "and",
        "s platností až 2 roky, které slouží k rozlišení návštěvníků a měření návštěvnosti. Reklamní funkce Google Analytics nepoužíváme.": "in your browser, valid for up to 2 years, which are used to distinguish visitors and measure traffic. We do not use the advertising features of Google Analytics.",
        "V úložišti vašeho prohlížeče si pamatujeme vaši volbu ohledně cookies a zvolený jazyk, a to do doby, než je změníte nebo úložiště vymažete. Tyto informace neslouží ke sledování. Svou volbu cookies můžete kdykoli změnit přes odkaz „Nastavení cookies“ v patičce webu.": "In your browser's storage we remember your cookie choice and selected language until you change them or clear the storage. This information is not used for tracking. You can change your cookie choice at any time via the “Cookie settings” link in the website footer.",
        "Vložený obsah z dalších webů": "Embedded content from other websites",
        "Některé stránky (zejména profily umělců) mohou obsahovat vložená videa ze služby YouTube. Tato videa načteme až poté, co s tím vyjádříte souhlas. Při jejich načtení nebo přehrání může poskytovatel (Google LLC) nastavit vlastní cookies a zpracovávat údaje podle svých vlastních zásad. Doporučujeme seznámit se se zásadami ochrany soukromí společnosti Google:": "Some pages (especially artist profiles) may contain embedded YouTube videos. We only load these videos after you give your consent. When they are loaded or played, the provider (Google LLC) may set its own cookies and process data under its own policies. We recommend reading Google's privacy policy:",
        "Jaká máte práva": "Your rights",
        "V souvislosti se zpracováním osobních údajů máte právo:": "In connection with the processing of personal data, you have the right:",
        "na přístup ke svým údajům a na jejich kopii,": "to access your data and obtain a copy,",
        "na opravu nepřesných nebo neúplných údajů,": "to have inaccurate or incomplete data rectified,",
        "na výmaz údajů („právo být zapomenut“),": "to erasure of your data (the “right to be forgotten”),",
        "na omezení zpracování,": "to restriction of processing,",
        "vznést námitku proti zpracování,": "to object to processing,",
        "na přenositelnost údajů,": "to data portability,",
        "podat stížnost u Úřadu pro ochranu osobních údajů (": "to lodge a complaint with the Czech Office for Personal Data Protection (",
        "Pro uplatnění kteréhokoliv z práv nás kontaktujte na": "To exercise any of these rights, contact us at",
        "Kontaktní údaje": "Contact details",
        "E-mail:": "Email:",
        "© 2026 Live District — všechna práva vyhrazena.": "© 2026 Live District — all rights reserved."
    };

    var lang = 'cs';
    try {
        var saved = localStorage.getItem(KEY);
        if (saved === 'en') lang = 'en';
    } catch (e) {}

    function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

    function t(s) {
        if (lang === 'cs') return s;
        return T[norm(s)] || s;
    }

    // Přeloží text a popisky uvnitř root; mezery kolem textu zůstanou kvůli návaznosti na odkazy
    function translate(root) {
        if (lang === 'cs') return;
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        var nodes = [], node;
        while ((node = walker.nextNode())) nodes.push(node);
        nodes.forEach(function (n) {
            var parent = n.parentNode;
            if (parent && /^(SCRIPT|STYLE)$/.test(parent.nodeName)) return;
            var text = T[norm(n.nodeValue)];
            if (!text) return;
            n.nodeValue = n.nodeValue.replace(/\S(?:[\s\S]*\S)?/, function () { return text; });
        });
        ['placeholder', 'aria-label', 'alt'].forEach(function (attr) {
            root.querySelectorAll('[' + attr + ']').forEach(function (el) {
                el.setAttribute(attr, t(el.getAttribute(attr)));
            });
        });
    }

    function pick(code) {
        try { localStorage.setItem(KEY, code); } catch (e) {}
        location.reload();
    }

    // Tlačítka jazyků; useCode = zkratka (patička), jinak celý název (mobilní menu)
    function addOptions(box, className, useCode) {
        LANGS.forEach(function (item) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = className + (item[0] === lang ? ' is-active' : '');
            b.lang = item[0];
            b.textContent = useCode ? item[1] : item[2];
            if (useCode) b.setAttribute('aria-label', item[2]);
            if (item[0] === lang) b.setAttribute('aria-current', 'true');
            b.addEventListener('click', function () { if (item[0] !== lang) pick(item[0]); });
            box.appendChild(b);
        });
    }

    // Výběr jazyka v patičce pod odkazy, aktivní jazyk tmavý
    function footerSwitch(nav) {
        var box = document.createElement('div');
        box.className = 'footer-lang';
        addOptions(box, 'footer-lang-option', true);
        nav.appendChild(box);
    }

    // Výběr jazyka pro mobilní menu (to vzniká až v animations.js)
    function mobileSwitch() {
        var box = document.createElement('div');
        box.className = 'mobile-lang';
        addOptions(box, 'lang-option', false);
        return box;
    }

    window.ldT = t;
    window.ldI18n = { translate: translate, mobileSwitch: mobileSwitch };

    translate(document.body);
    if (lang !== 'cs') {
        var parts = document.title.split(' — ');
        if (parts[1]) document.title = parts[0] + ' — ' + t(parts[1]);
        // Nadpis na homepage je česky v obrázku, v ostatních jazycích ho nahradí text
        var hero = document.querySelector('img.hero-title');
        if (hero) {
            var h1 = document.createElement('h1');
            h1.className = 'hero-title-text';
            var line = document.createElement('span');
            var sub = document.createElement('span');
            line.textContent = t('BOOKING A MANAGEMENT');
            sub.textContent = t('SOUČASNÝCH UMĚLCŮ');
            h1.appendChild(line);
            h1.appendChild(sub);
            hero.parentNode.replaceChild(h1, hero);
        }
    }

    var footerNav = document.querySelector('.site-footer .footer-nav');
    if (footerNav) footerSwitch(footerNav);

    document.documentElement.classList.remove('i18n-pending');
})();
