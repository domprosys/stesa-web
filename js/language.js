// Language translations
const translations = {
    en: {
        // Navbar
        'home': 'Home',
        'about': 'About',
        'projects': 'Projects',
        'team': 'Team',
        'contact': 'Contact',
        'back-to-home': 'Back to Home',
        
        // Hero section
        'hero-subtitle': 'Exploring the future at the intersection of technology, society, sports, and arts',
        
        // Feature content
        'society-title': 'Society',
        'society-description': 'STESA\'s Society division explores the intersection of emerging technologies and social structures.',
        'technology-title': 'Technology',
        'technology-description': 'Our Technology division focuses on researching and developing cutting-edge technological solutions.',
        'sports-title': 'Sports',
        'sports-description': 'The Sports division integrates technology with athletic performance and sports experiences.',
        'arts-title': 'Arts',
        'arts-description': 'Our Arts division explores creative expression through technological innovation.',
        
        // Society page
        'society-page-description': 'The Society component of STESA focuses on how emerging technologies impact social structures, communities, and human interaction. We explore the ethical implications, social benefits, and potential challenges of integrating new technologies into society.',
        'society-page-research': 'Our research and projects in this area examine:',
        'society-item1': 'Digital inclusion and accessibility',
        'society-item2': 'Technology ethics and governance',
        'society-item3': 'Community building through technology',
        'society-item4': 'Social impact assessment of emerging tech',
        'society-item5': 'Public engagement with science and technology',
        
        // Technology page
        'technology-page-description': 'The Technology division at STESA explores emerging technologies and their applications across various domains. We focus on both the technical development and the responsible implementation of these technologies in society, sports, and the arts.',
        'technology-page-research': 'Our technological focus areas include:',
        'technology-item1': 'Artificial Intelligence and Machine Learning',
        'technology-item2': 'Extended Reality (VR/AR/MR)',
        'technology-item3': 'Internet of Things and Smart Systems',
        'technology-item4': 'Human-Computer Interaction',
        'technology-item5': 'Sustainable Technology Solutions',
        
        // Sports page
        'sports-page-description': 'The Sports division at STESA explores how emerging technologies can enhance athletic performance, training methodologies, fan engagement, and the overall sporting experience. We work at the intersection of sports science, technology, and innovation.',
        'sports-page-research': 'Our focus areas include:',
        'sports-item1': 'Performance analysis and optimization',
        'sports-item2': 'Immersive training environments',
        'sports-item3': 'Fan engagement technologies',
        'sports-item4': 'Injury prevention and rehabilitation',
        'sports-item5': 'Accessible sports technologies',
        'sports-item6': 'Virtual and augmented sports',
        
        // Arts page
        'arts-page-description': 'The Arts division at STESA explores the creative potential of emerging technologies in visual arts, music, performance, and interactive experiences. We believe that technology can expand artistic expression while preserving the human element that makes art meaningful.',
        'arts-page-research': 'Our arts-focused initiatives include:',
        'arts-item1': 'Digital and interactive art',
        'arts-item2': 'Immersive and spatial experiences',
        'arts-item3': 'AI and generative art',
        'arts-item4': 'Technology-enhanced performance',
        'arts-item5': 'Digital preservation and heritage',
        
        // Projects page
        'projects-title': 'Projects',
        'projects-intro': 'We\'re building the future of human expression, one experiment at a time. Stay tuned — the most exciting collaborations are just beginning.',
        'category-society': 'Society',
        'category-technology': 'Technology',
        'category-sports': 'Sports',
        'category-arts': 'Arts',
        'project1-title': 'Digital Inclusion Initiative',
        'project1-description': 'A program designed to bridge the digital divide by providing technology access and education to underserved communities.',
        'project2-title': 'Tech Ethics Framework',
        'project2-description': 'Developing comprehensive guidelines for ethical technology development and implementation across various sectors.',
        'project3-title': 'Adaptive AI Learning System',
        'project3-description': 'An AI-powered educational platform that adapts to individual learning styles and needs for personalized education.',
        'project4-title': 'XR Cultural Heritage',
        'project4-description': 'Using extended reality technologies to preserve and present cultural heritage in immersive and interactive ways.',
        'project5-title': 'Advanced Motion Analysis',
        'project5-description': 'Cutting-edge motion capture system for athletic performance analysis and injury prevention.',
        'project6-title': 'Immersive Fan Experience',
        'project6-description': 'Creating next-generation viewing experiences that bring fans closer to the action through immersive technologies.',
        'project7-title': 'Digital Canvas',
        'project7-description': 'New digital tools for artists that expand creative possibilities while maintaining intuitive interfaces.',
        'project8-title': 'AI-Artist Collaboration',
        'project8-description': 'Exploring how AI can collaborate with human creators to produce novel artistic works and experiences.',
        
        // About page
        'about-title': 'About STESA',
        'about-intro': 'We are STESA — the Society for Emerging Technologies, Sports, and Arts — and we believe that the future of human expression lives at the intersection of movement, creativity, and technology.',
        'about-vision-title': 'Our Vision',
        'about-vision-p1': 'In an era where artificial intelligence can generate art, where sensors can track every heartbeat, and where digital spaces become venues for performance, we ask: How do emerging technologies reshape the way we move, create, and connect?',
        'about-vision-p2': 'We don\'t see technology as replacing human creativity — we see it as amplifying it. The athlete perfecting their form through motion analysis. The artist collaborating with AI to push creative boundaries. The community gathering around new forms of digital play. These are the stories we\'re here to tell and the futures we\'re here to build.',
        'about-what-we-do-title': 'What We Do',
        'about-what-we-do-p1': 'We curate experiences that reveal technology\'s potential to enrich daily life. From new media art exhibitions and interactive installations to our emerging sports initiatives that bring disc golf and functional fitness to new communities.',
        'about-what-we-do-p2': 'We build bridges between disciplines that have traditionally operated in isolation. Our projects live where code meets canvas, where data meets movement, where innovation meets tradition.',
        'about-what-we-do-p3': 'We democratize access to cutting-edge tools and knowledge. Whether through workshops on digital art creation, research into wellness protocols backed by telemetric data, or educational programs that help young people navigate an AI-augmented world, we believe everyone should have a seat at the table of technological progress.',
        'about-approach-title': 'Our Approach',
        'about-approach-p1': 'We\'re not interested in technology for its own sake. We\'re interested in technology that makes us more human — more creative, more connected, more capable of meaningful expression. Every project we undertake asks the same fundamental question: How can this make life richer, more playful, more authentic?',
        'about-approach-p2': 'From our base in Bucharest, we\'re building a community of artists, athletes, technologists, and curious minds who share this vision. We\'re creating spaces — both physical and digital — where experimentation thrives and where the next generation of creative expression can emerge.',
        'about-approach-p3': 'STESA exists because the future of human expression won\'t be created in isolation. It will be created together, at the edges where disciplines meet and possibilities multiply.',
        
        // Team page
        'team': 'Team',
        'team-description-1': 'We are a collective of forward-thinking individuals who believe the future is built at the edges.',
        'team-description-2': 'From technologists to artists, researchers to athletes — we\'re united by curiosity and a shared conviction that the most interesting work happens where disciplines collide. Our team grows organically as we connect with like-minded pioneers who see possibility where others see boundaries.',
        'team-description-3': 'If you\'re drawn to the spaces between fields, you might just be one of us.',
        
        // Contact page
        'contact-title': 'Contact Us',
        'contact-info': 'Ready to explore what\'s next?',
        'contact-info-2': 'Whether you\'re an artist experimenting with AI, an athlete curious about performance technology, a researcher with an interdisciplinary vision, or simply someone who believes the future should be built together — we want to hear from you.',
        'contact-info-3': 'Got a project idea that doesn\'t fit traditional categories? Perfect. That\'s exactly where we thrive.',
        'contact-info-4': 'Let\'s create something unexpected.',
        'contact-email-title': 'Email',
        // Team member roles
        'president': 'President',
        'vicepresident': 'Vicepresident',
    },
    ro: {
        // Navbar
        'home': 'Acasă',
        'about': 'Despre',
        'projects': 'Proiecte',
        'team': 'Echipă',
        'contact': 'Contact',
        'back-to-home': 'Înapoi la Pagina Principală',
        
        // Hero section
        'hero-subtitle': 'Explorăm viitorul la intersecția dintre tehnologie, societate, sport și arte',
        
        // Feature content
        'society-title': 'Societate',
        'society-description': 'Divizia Societate a STESA explorează intersecția dintre tehnologiile emergente și structurile sociale.',
        'technology-title': 'Tehnologie',
        'technology-description': 'Divizia noastră de Tehnologie se concentrează pe cercetarea și dezvoltarea de soluții tehnologice de ultimă generație.',
        'sports-title': 'Sport',
        'sports-description': 'Divizia Sport integrează tehnologia cu performanța atletică și experiențele sportive.',
        'arts-title': 'Arte',
        'arts-description': 'Divizia noastră de Arte explorează expresia creativă prin inovație tehnologică.',
        
        // Society page
        'society-page-description': 'Componenta Societate a STESA se concentrează pe modul în care tehnologiile emergente influențează structurile sociale, comunitățile și interacțiunea umană. Explorăm implicațiile etice, beneficiile sociale și potențialele provocări ale integrării noilor tehnologii în societate.',
        'society-page-research': 'Cercetarea și proiectele noastre în acest domeniu examinează:',
        'society-item1': 'Incluziunea digitală și accesibilitatea',
        'society-item2': 'Etica tehnologiei și guvernanța',
        'society-item3': 'Construirea comunității prin tehnologie',
        'society-item4': 'Evaluarea impactului social al tehnologiilor emergente',
        'society-item5': 'Implicarea publicului în știință și tehnologie',
        
        // Technology page
        'technology-page-description': 'Divizia de Tehnologie a STESA explorează tehnologiile emergente și aplicările acestora în diverse domenii. Ne concentrăm atât pe dezvoltarea tehnică, cât și pe implementarea responsabilă a acestor tehnologii în societate, sport și arte.',
        'technology-page-research': 'Domeniile noastre tehnologice de interes includ:',
        'technology-item1': 'Inteligentă Artificială și Machine Learning',
        'technology-item2': 'Realitate Extinsă (VR/AR/MR)',
        'technology-item3': 'Internet of Things și Sisteme Inteligente',
        'technology-item4': 'Interacțiunea Om-Calculator',
        'technology-item5': 'Soluții Tehnologice Sustenabile',
        
        // Sports page
        'sports-page-description': 'Divizia Sport a STESA explorează modul în care tehnologiile emergente pot îmbunătăți performanța atletică, metodologiile de antrenament, implicarea fanilor și experiența sportivă generală. Lucrăm la intersecția dintre știința sportului, tehnologie și inovație.',
        'sports-page-research': 'Domeniile noastre de interes includ:',
        'sports-item1': 'Analiza și optimizarea performanței',
        'sports-item2': 'Medii de antrenament imersive',
        'sports-item3': 'Tehnologii de implicare a fanilor',
        'sports-item4': 'Prevenirea și reabilitarea accidentărilor',
        'sports-item5': 'Tehnologii sportive accesibile',
        'sports-item6': 'Sporturi virtuale și augmentate',
        
        // Arts page
        'arts-page-description': 'Divizia de Arte a STESA explorează potențialul creativ al tehnologiilor emergente în artele vizuale, muzică, performanță și experiențe interactive. Credem că tehnologia poate extinde expresia artistică, păstrând în același timp elementul uman care face arta semnificativă.',
        'arts-page-research': 'Inițiativele noastre axate pe arte includ:',
        'arts-item1': 'Artă digitală și interactivă',
        'arts-item2': 'Experiențe imersive și spațiale',
        'arts-item3': 'IA și artă generativă',
        'arts-item4': 'Performanță îmbunătățită tehnologic',
        'arts-item5': 'Conservare digitală și patrimoniu',
        
        // Projects page
        'projects-title': 'Proiecte',
        'projects-intro': 'Construim viitorul expresiei umane, un experiment odată. Rămâneți conectați — cele mai interesante colaborări abia încep.',
        'category-society': 'Societate',
        'category-technology': 'Tehnologie',
        'category-sports': 'Sport',
        'category-arts': 'Arte',
        'project1-title': 'Inițiativa de Incluziune Digitală',
        'project1-description': 'Un program conceput pentru a reduce decalajul digital prin furnizarea de acces la tehnologie și educație pentru comunitățile defavorizate.',
        'project2-title': 'Cadru de Etică Tehnologică',
        'project2-description': 'Dezvoltarea unor ghiduri cuprinzătoare pentru dezvoltarea și implementarea etică a tehnologiei în diverse sectoare.',
        'project3-title': 'Sistem de Învățare Adaptivă cu AI',
        'project3-description': 'O platformă educațională bazată pe inteligență artificială care se adaptează la stilurile și nevoile individuale de învățare pentru educație personalizată.',
        'project4-title': 'Patrimoniu Cultural XR',
        'project4-description': 'Utilizarea tehnologiilor de realitate extinsă pentru a păstra și a face accesibile siturile și artefactele de patrimoniu cultural.',
        'project5-title': 'Analiză Avansată de Mișcare',
        'project5-description': 'Sistem de captare a mișcării de ultimă generație pentru analiza performanței atletice și prevenirea accidentărilor.',
        'project6-title': 'Experiență Imersivă pentru Fani',
        'project6-description': 'Crearea experiențelor de vizionare de ultimă generație care aduc fanii mai aproape de acțiune prin tehnologii imersive.',
        'project7-title': 'Canvas Digital',
        'project7-description': 'Noi instrumente digitale pentru artiști care extind posibilitățile creative, menținând în același timp interfețe intuitive.',
        'project8-title': 'Colaborare AI-Artist',
        'project8-description': 'Explorarea modului în care inteligența artificială poate colabora cu creatorii umani pentru a produce opere și experiențe artistice inovatoare.',
        
        // About page
        'about-title': 'Despre STESA',
        'about-intro': 'Suntem STESA — Societatea pentru Tehnologii Emergente, Sport și Arte — și credem că viitorul expresiei umane trăiește la intersecția mișcării, creativității și tehnologiei.',
        'about-vision-title': 'Viziunea Noastră',
        'about-vision-p1': 'Într-o eră în care inteligența artificială poate genera artă, în care senzorii pot urmări fiecare bătaie a inimii și în care spațiile digitale devin scene pentru performance, ne întrebăm: cum modelează tehnologiile emergente modul în care ne mișcăm, creăm și conectăm?',
        'about-vision-p2': 'Nu vedem tehnologia ca pe un înlocuitor al creativității umane — o vedem ca pe un amplificator. Atletul care își perfecționează forma prin analiza mișcării. Artistul care colaborează cu AI pentru a depăși limitele expresiei. Comunitatea care se adună în jurul noilor forme de joc digital. Acestea sunt poveștile pe care le spunem și viitorurile pe care le construim.',
        'about-what-we-do-title': 'Ce Facem',
        'about-what-we-do-p1': 'Curăm experiențe care dezvăluie potențialul tehnologiei de a îmbogăți viața cotidiană. De la expoziții de artă new media și instalații interactive, până la inițiative sportive emergente care aduc disc golf și fitness funcțional în noi comunități.',
        'about-what-we-do-p2': 'Construim punți între discipline care au tradițional funcționat izolată. Proiectele noastre trăiesc acolo unde codul întâlnește pânza, unde datele întâlnesc mișcarea, unde inovația îmbrățișează tradiția.',
        'about-what-we-do-p3': 'Democratizăm accesul la instrumente și cunoștințe de ultimă generație. Fie prin ateliere de artă digitală, cercetare în protocoale de wellness bazate pe date telemetrice, sau programe educaționale care ajută tinerii să navigheze într-o lume augmentată de AI, credem că fiecare merită un loc la masa progresului tehnologic.',
        'about-approach-title': 'Abordarea Noastră',
        'about-approach-p1': 'Nu ne interesează tehnologia de dragul tehnologiei. Ne interesează tehnologia care ne face mai umani — mai creativi, mai conectați, mai capabili de exprimare autentică. Fiecare proiect pe care îl întreprindem pune aceeași întrebare: cum poate face viața mai bogată, mai jucăușă, mai autentică?',
        'about-approach-p2': 'Din baza noastră din București, creăm o comunitate de artiști, atleți, tehnologi și minți curioase care împărtășesc această viziune. Construim spații — fizice și digitale — unde experimentul prosperă și unde poate apărea următoarea generație de expresie creativă.',
        'about-approach-p3': 'STESA există pentru că viitorul expresiei umane nu se va crea în izolare. Se va crea împreună, la marginile unde disciplinele se întâlnesc și posibilitățile se înmulțesc.',
        
        // Team page
        'team': 'Echipă',
        'team-description-1': 'Suntem un colectiv de persoane cu gândire progresistă care cred că viitorul se construiește la margini.',
        'team-description-2': 'De la tehnologi la artiști, de la cercetători la atleți — suntem uniți de curiozitate și de convingerea comună că cele mai interesante lucrări apar acolo unde disciplinele se ciocnesc. Echipa noastră crește organic pe măsură ce ne conectăm cu pionieri care văd posibilități acolo unde alții văd limite.',
        'team-description-3': 'Dacă ești atras de spațiile dintre domenii, s-ar putea să fii unul dintre noi.',
        
        // Contact page
        'contact-title': 'Contactează-ne',
        'contact-info': 'Gata să explorezi ce urmează?',
        'contact-info-2': 'Fie că ești un artist care experimentează cu AI, un atlet curios despre tehnologia performanței, un cercetător cu o viziune interdisciplinară, sau pur și simplu cineva care crede că viitorul ar trebui construit împreună — vrem să auzim de la tine.',
        'contact-info-3': 'Ai o idee de proiect care nu se încadrează în categorii tradiționale? Perfect. Exact acolo excelăm.',
        'contact-info-4': 'Hai să creăm ceva neașteptat.',
        'contact-email-title': 'Email',
        // Team member roles
        'president': 'Președinte',
        'vicepresident': 'Vicepreședinte',
    }
};

// Default language
let currentLang = 'en';

// Function to update content based on language
function updateLanguage(lang) {
    currentLang = lang;
    
    // Update navbar links
    document.querySelectorAll('.nav-links a').forEach((link, index) => {
        const keys = ['home', 'about', 'projects', 'team', 'contact'];
        if (index < keys.length && translations[lang][keys[index]]) {
            link.textContent = translations[lang][keys[index]];
        }
    });
    
    // Update hero title and subtitle
    const heroTitle = document.querySelector('.hero-default h1');
    const heroSubtitle = document.querySelector('.hero-default p');
    if (heroTitle && heroSubtitle) {
        // Don't update the subtitle text here if it's our random subtitle
        if (heroSubtitle.id !== 'random-subtitle') {
            heroSubtitle.textContent = translations[lang]['hero-subtitle'];
        } else if (window.updateSubtitleLanguage) {
            // Use our custom function to update the random subtitle
            window.updateSubtitleLanguage(lang);
        }
    }
    
    // Update elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            // If it's a paragraph with typewriter effect
            const typewriterSpan = element.querySelector('.typewriter-text');
            if (typewriterSpan) {
                typewriterSpan.textContent = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update language switcher buttons
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
    });
    
    // Save language preference
    localStorage.setItem('stesa-language', lang);
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', () => {
    // Add click event to language switcher buttons
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.textContent.toLowerCase();
            updateLanguage(lang);
        });
    });
    
    // Load saved language preference or use Romanian as default
    const savedLang = localStorage.getItem('stesa-language');
    const initialLang = savedLang || 'ro';
    
    // Set initial active button
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        if (btn.textContent.toLowerCase() === initialLang) {
            btn.classList.add('active');
        }
    });
    
    // Apply initial language
    updateLanguage(initialLang);
});
