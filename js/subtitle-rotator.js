// Subtitle Rotator for STESA
// Displays a random subtitle from a predefined list on page load with typewriter effect

// Array of subtitles in both Romanian and English
const subtitles = [
    {
        ro: "Inițiative interdisciplinare în domenii de expresie și creație umană",
        en: "Interdisciplinary initiatives in fields of human expression and creativity"
    },
    {
        ro: "Platformă pentru proiecte emergente în expresie, relaționare și inovație",
        en: "A platform for emerging projects in expression, connection, and innovation"
    },
    {
        ro: "Cultivăm noi forme de exprimare, creație și relaționare autentică",
        en: "We cultivate new forms of expression, creativity, and authentic connection"
    },
    {
        ro: "Inițiative care susțin gesturi umane semnificative în contexte emergente",
        en: "Initiatives that support meaningful human gestures in emerging contexts"
    },
    {
        ro: "Un spațiu deschis pentru expresii umane în transformare continuă",
        en: "An open space for human expressions in continuous transformation"
    },
    {
        ro: "Explorăm expresii și relații umane în ritmul lumii digitale",
        en: "We explore human expressions and relationships in the rhythm of the digital world"
    },
    {
        ro: "Susținem creația, mișcarea și reflecția în forme contemporane de viață",
        en: "Supporting creation, movement, and reflection in contemporary forms of life"
    },
    {
        ro: "Proiecte care reactivează creativitatea, corpul și comunitatea",
        en: "Projects that reactivate creativity, the body, and community"
    },
    {
        ro: "Un cadru pentru noi ritualuri expresive în societatea conectată",
        en: "A framework for new expressive rituals in the connected society"
    },
    {
        ro: "Articulăm noi moduri de relaționare, creație și prezență umană",
        en: "We articulate new ways of relating, creating, and being present"
    },
    {
        ro: "Practici emergente pentru un viitor al expresiei și conectării",
        en: "Emerging practices for a future of expression and connection"
    },
    {
        ro: "Spațiu de cercetare și creație în jurul gesturilor care ne definesc",
        en: "A space for research and creation around the gestures that define us"
    }
];

// Global variable to store the currently selected subtitle
let currentSubtitle = null;

// Typewriter helper: writes text char-by-char with cursor
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);
    const interval = setInterval(() => {
        if (i < text.length) {
            cursor.insertAdjacentText('beforebegin', text.charAt(i));
            i++;
        } else {
            clearInterval(interval);
            cursor.classList.add('blink');
        }
    }, speed);
}

// Function to set a random subtitle with typewriter effect
function setRandomSubtitle() {
    // Get a random subtitle from the array
    const randomIndex = Math.floor(Math.random() * subtitles.length);
    currentSubtitle = subtitles[randomIndex];
    
    // Get the subtitle element
    const subtitleElement = document.getElementById('random-subtitle');
    if (!subtitleElement) return;
    
    // Get the current language (default to Romanian if not set)
    const currentLang = localStorage.getItem('stesa-language') || 'ro';
    
    // Clear content and start typewriter effect
    subtitleElement.innerHTML = '';
    const typewriterSpan = document.createElement('span');
    typewriterSpan.className = 'typewriter-text';
    subtitleElement.appendChild(typewriterSpan);
    typeWriter(typewriterSpan, currentSubtitle[currentLang], 50);
    
    // Remove the data-translate attribute to prevent the language switcher from overriding it
    subtitleElement.removeAttribute('data-translate');
    
    // Store the subtitle data for language switching
    subtitleElement.dataset.subtitleRo = currentSubtitle.ro;
    subtitleElement.dataset.subtitleEn = currentSubtitle.en;
}

// Function to update subtitle based on language
function updateSubtitleLanguage(lang) {
    if (!currentSubtitle) return;
    
    const subtitleElement = document.getElementById('random-subtitle');
    if (!subtitleElement) return;
    
    // Clear and run typewriter effect for new language
    subtitleElement.innerHTML = '';
    const typewriterSpan = document.createElement('span');
    typewriterSpan.className = 'typewriter-text';
    subtitleElement.appendChild(typewriterSpan);
    typeWriter(typewriterSpan, currentSubtitle[lang], 50);
}

// Make the update function globally accessible
window.updateSubtitleLanguage = updateSubtitleLanguage;

// Function to set a new random subtitle that's different from the current one
function setNewRandomSubtitle() {
    // Store the current subtitle to avoid repeating it
    const previousSubtitle = currentSubtitle;
    
    // Keep selecting a random subtitle until we get a different one
    let randomIndex;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop if there's only one subtitle
    
    do {
        randomIndex = Math.floor(Math.random() * subtitles.length);
        attempts++;
    } while (
        previousSubtitle && 
        subtitles[randomIndex] === previousSubtitle && 
        attempts < maxAttempts
    );
    
    // Set the new subtitle
    currentSubtitle = subtitles[randomIndex];
    
    // Get the subtitle element
    const subtitleElement = document.getElementById('random-subtitle');
    if (!subtitleElement) return;
    
    // Get the current language (default to Romanian if not set)
    const currentLang = localStorage.getItem('stesa-language') || 'ro';
    
    // Clear and start typewriter effect for next subtitle
    subtitleElement.innerHTML = '';
    const typewriterSpan = document.createElement('span');
    typewriterSpan.className = 'typewriter-text';
    subtitleElement.appendChild(typewriterSpan);
    typeWriter(typewriterSpan, currentSubtitle[currentLang], 50);
    
    // Remove the data-translate attribute to prevent the language switcher from overriding it
    subtitleElement.removeAttribute('data-translate');
    
    // Store the subtitle data for language switching
    subtitleElement.dataset.subtitleRo = currentSubtitle.ro;
    subtitleElement.dataset.subtitleEn = currentSubtitle.en;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial random subtitle
    setRandomSubtitle();
    
    // Add click event to the hero area to cycle subtitles
    const heroDefault = document.querySelector('.hero-default');
    if (heroDefault) {
        heroDefault.addEventListener('click', function(e) {
            // Only trigger if clicking directly on the hero area, not on child elements
            if (e.target === this || e.target.classList.contains('subtitle-container') || 
                e.target.id === 'random-subtitle' || e.target.classList.contains('typewriter-text')) {
                setNewRandomSubtitle();
            }
        });
    }
});
