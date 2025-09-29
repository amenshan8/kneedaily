import { SCREENS, UI_TEXTS, ADVICE } from 'data';

// --- Global State ---
const STATE = {
    currentStepIndex: 0,
    language: 'nl', // Default language
    answers: {},
    isUrgent: false,
    ttsEnabled: false
};

const TOTAL_FLOW_STEPS = SCREENS.filter(s => s.type !== 'info').length; 
// TOTAL_FLOW_STEPS is 8 (steps 1 through 8).

// --- DOM Elements ---
const D = {
    appContainer: document.getElementById('app-container'),
    quizArea: document.getElementById('quiz-area'),
    screenContent: document.getElementById('screen-content'),
    stepCounter: document.getElementById('step-counter'),
    progressBar: document.getElementById('progress-bar'),
    backButton: document.getElementById('back-button'),
    nextButton: document.getElementById('next-button'),
    navigationControls: document.getElementById('navigation-controls'),
    globalDisclaimer: document.getElementById('global-disclaimer-footer'),
    designCredit: document.getElementById('design-credit'), // New element
    languageToggle: document.getElementById('language-toggle'),
    contrastToggle: document.getElementById('contrast-toggle'),
    ttsToggle: document.getElementById('tts-toggle'),
    infoButton: document.getElementById('info-button'),
    infoModal: document.getElementById('info-modal'),
    modalDisclaimer: document.getElementById('modal-disclaimer'),
    pdfContainer: document.getElementById('pdf-content-container')
};

/** Initialize Lucide Icons for dynamically inserted content */
function initializeIcons() {
    if (typeof lucide !== 'undefined') {
        // Find newly injected elements that need icons initialized within D.screenContent
        const elements = D.screenContent.querySelectorAll('[data-lucide]');
        elements.forEach(el => lucide.createIcons({ attrs: { name: el.dataset.lucide }, container: el }));
    }
}

// --- Utility Functions ---

/** Copies text to clipboard */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert(T('COPY_SUCCESS'));
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert(T('COPY_FAILURE'));
    }
}


/** Translates a key based on the current state language */
function T(key, ...args) {
    let text = UI_TEXTS[STATE.language][key];
    if (typeof text === 'function') {
        return text(...args);
    }
    return text || `[MISSING TEXT: ${key}]`;
}

/** TTS (Text-to-Speech) Functionality */
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        // Use Dutch voice fallback for NL, English for EN, as specific voice IDs are not used.
        utterance.lang = STATE.language === 'nl' ? 'nl-NL' : 'en-US'; 
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn("TTS not supported in this browser.");
    }
}

function handleTtsClick(text) {
    if (!STATE.ttsEnabled) {
        alert(T('TTS_DISABLED_HINT'));
        return;
    }
    speakText(text);
}

/** Update UI texts for current language */
function updateUiText() {
    document.querySelector('h1').textContent = T('TITLE');
    document.querySelector('.subtitle').textContent = T('SUBTITLE');
    
    // Update navigation controls (only if they are visible and contain <span>)
    if (D.backButton.querySelector('span')) {
        D.backButton.querySelector('span').textContent = T('BACK');
    }

    D.globalDisclaimer.textContent = T('GENERAL_DISCLAIMER');
    D.modalDisclaimer.textContent = T('GENERAL_DISCLAIMER');
    D.designCredit.textContent = T('DESIGN_CREDIT'); // Inject credit line

    D.languageToggle.title = STATE.language === 'nl' ? 'Change Language (English)' : 'Taal wisselen (Nederlands)';
    D.languageToggle.textContent = STATE.language === 'nl' ? 'EN' : 'NL';

    document.getElementById('info-modal-title').textContent = T('INFO_TITLE');
    D.infoModal.querySelector('p:not(#modal-disclaimer)').textContent = T('INFO_BODY');
    D.infoModal.querySelector('.close-modal').textContent = T('CLOSE');


    // Re-render the current screen to ensure question/body text updates
    renderScreen(STATE.currentStepIndex);
}

/** Handle language change */
function toggleLanguage() {
    STATE.language = STATE.language === 'nl' ? 'en' : 'nl';
    D.languageToggle.dataset.lang = STATE.language;
    updateUiText();
}

/** Handle contrast change */
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
}

/** Handle TTS toggle */
function toggleTts() {
    STATE.ttsEnabled = !STATE.ttsEnabled;
    D.ttsToggle.classList.toggle('active', STATE.ttsEnabled);
    if (!STATE.ttsEnabled) {
        window.speechSynthesis.cancel();
    }
}


// --- Rendering Functions ---

function updateProgress() {
    const totalQuestionSteps = TOTAL_FLOW_STEPS; // 8
    const currentStepIndex = STATE.currentStepIndex; 
    
    if (STATE.isUrgent || currentStepIndex > totalQuestionSteps) {
        D.progressBar.style.width = '100%';
        D.stepCounter.textContent = T('RESULT_TITLE');
        D.navigationControls.style.display = 'none';
        return;
    }
    
    if (currentStepIndex === 0) {
        // Landing page
        D.progressBar.style.width = '0%';
        D.stepCounter.textContent = T('START_QUIZ_PROMPT');
        D.navigationControls.style.display = 'none';
        return;
    }

    // Step 1 to 8 (Question flow)
    const stepDisplay = currentStepIndex; 
    
    let progressPercentage = (stepDisplay / totalQuestionSteps) * 100;
    
    D.progressBar.style.width = `${progressPercentage}%`;
    D.stepCounter.textContent = T('STEP_COUNTER', stepDisplay, totalQuestionSteps);
    
    // Update navigation visibility
    D.navigationControls.style.display = 'flex';

    D.backButton.disabled = STATE.currentStepIndex <= 1; // Cannot go back before screening start (Index 1)
    D.nextButton.disabled = !isCurrentStepAnswered();
    
    // Change Next button text/icon for the final question step (Index 8)
    if (STATE.currentStepIndex === TOTAL_FLOW_STEPS) {
        D.nextButton.innerHTML = `
            <span>${T('VIEW_RESULT')}</span>
            <i data-lucide="check-circle" class="lucide-icon"></i>
        `;
        initializeIcons();
    } else {
        D.nextButton.innerHTML = `
            <span>${T('NEXT')}</span>
            <i data-lucide="arrow-right" class="lucide-icon"></i>
        `;
        initializeIcons();
    }
}

function isCurrentStepAnswered() {
    const screen = SCREENS[STATE.currentStepIndex];
    if (screen.type === 'info') return true; 

    // Expecting only one question per screen now
    const q = screen.questions[0];
    return STATE.answers[q.id] !== undefined && STATE.answers[q.id] !== null;
}

function renderScreen(index) {
    if (index >= SCREENS.length) {
        renderResultScreen();
        return;
    }

    const screen = SCREENS[index];
    D.screenContent.innerHTML = ''; // Clear previous content

    D.navigationControls.style.display = 'flex';
    D.backButton.style.display = 'block';
    D.nextButton.style.display = 'block';

    let contentHTML = '';
    const langSuffix = `_${STATE.language}`;

    if (screen.id === 'landing') {
        // Landing page setup (Step 0)
        contentHTML = `
            <div class="question-card">
                <h2>${screen[`title${langSuffix}`] || screen.title}</h2>
                <p>${screen[`body${langSuffix}`]}</p>
                <br>
                <!-- Inject full disclaimer on landing screen -->
                <div class="result-disclaimer-inner" style="text-align: left; padding: 0; font-size: 0.9rem; margin-top: 1rem;">
                    <p><strong>${T('GENERAL_DISCLAIMER')}</strong></p>
                </div>
                
                <div class="navigation-controls center-controls" style="margin-top: 2rem;">
                    <button id="start-button" class="primary">
                        <i data-lucide="play" class="lucide-icon"></i>
                        <span>${T('START_QUIZ')}</span>
                    </button>
                </div>
            </div>
        `;
        D.navigationControls.style.display = 'none';
        
    } else if (screen.type === 'question' || screen.type === 'questions') {
        
        const q = screen.questions[0];
        let screenTitle = screen[`title${langSuffix}`];
        
        const qText = q[`text${langSuffix}`];
        const answer = STATE.answers[q.id];

        contentHTML = `<div class="question-card">
            <h2>${screenTitle}</h2>
            <div class="input-group" id="q-${q.id}">
                <div class="question-text">
                    <p>${qText}</p>
                    <button class="icon-button tts-question-btn" data-tts-text="${qText}" aria-label="${T('TTS_READ_ALOUD')}" title="${T('TTS_READ_ALOUD')}">
                         <i data-lucide="volume-2" class="lucide-icon"></i>
                    </button>
                </div>`;
        
        if (q.type === 'boolean') {
            contentHTML += renderBooleanInput(q.id, answer);
        } else if (q.type === 'scale') {
            contentHTML += renderVASInput(q.id, q.min, q.max, answer);
        }

        contentHTML += `</div>`;
        contentHTML += `</div>`; // Close question-card
    }

    // Inject content for transition
    D.screenContent.innerHTML = contentHTML;
    initializeIcons();
    
    // Reattach listeners after injecting HTML
    attachScreenListeners(screen);
    updateProgress();
}

function renderBooleanInput(id, currentAnswer) {
    const current = currentAnswer !== undefined ? currentAnswer : null;
    const yesClass = current === 'JA' ? 'selected primary' : 'secondary';
    const noClass = current === 'NEE' ? 'selected primary' : 'secondary';
    return `
        <div class="boolean-input" role="radiogroup" aria-labelledby="q-${id}">
            <button type="button" class="boolean-option ${yesClass}" data-answer="JA" data-id="${id}" aria-checked="${current === 'JA'}" role="radio">
                <span>${T('YES')}</span>
                <i data-lucide="check" class="lucide-icon"></i>
            </button>
            <button type="button" class="boolean-option ${noClass}" data-answer="NEE" data-id="${id}" aria-checked="${current === 'NEE'}" role="radio">
                <span>${T('NO')}</span>
                <i data-lucide="x" class="lucide-icon"></i>
            </button>
        </div>
    `;
}

function renderVASInput(id, min, max, currentAnswer) {
    const value = currentAnswer !== undefined ? currentAnswer : min;
    
    return `
        <div class="vas-input-group">
            <div class="vas-value-display" id="${id}-display">${value}</div>
            <input type="range" id="${id}-slider" min="${min}" max="${max}" step="1" value="${value}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${value}" role="slider">
            <div class="vas-scale-labels">
                <span>0 = ${T('NO_PAIN')}</span>
                <span>${max} = ${T('WORST_PAIN')}</span>
            </div>
            <p class="microcopy">${T('VAS_MICROCOPY')}</p>
        </div>
    `;
}

function attachScreenListeners(screen) {
    // 1. TTS listeners
    D.screenContent.querySelectorAll('.tts-question-btn').forEach(button => {
        button.addEventListener('click', () => {
            const questionElement = button.closest('.question-text').querySelector('p');
            const questionText = questionElement.textContent;
            
            // Only read options for boolean inputs
            if (screen.questions[0].type === 'boolean') {
                const optionsText = `. ${T('YES')}. ${T('NO')}.`;
                // Add TTS enablement check inside handleTtsClick
                handleTtsClick(questionText + optionsText);
            } else {
                 handleTtsClick(questionText);
            }
        });
    });

    if (screen.id === 'landing') {
        document.getElementById('start-button').addEventListener('click', () => {
            navigate(1);
        });
        return;
    }

    if (screen.type === 'question' || screen.type === 'questions') {
        // 2. Boolean listeners
        if (screen.questions[0].type === 'boolean') {
            D.screenContent.querySelectorAll('.boolean-option').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.closest('button').dataset.id; // Use closest('button') in case click lands on span/icon
                    const answer = e.target.closest('button').dataset.answer;
                    STATE.answers[id] = answer;
                    
                    // Visual update for selection
                    const parent = e.target.closest('.boolean-input');
                    parent.querySelectorAll('.boolean-option').forEach(btn => {
                        btn.classList.remove('selected', 'primary');
                        btn.classList.add('secondary');
                        btn.setAttribute('aria-checked', 'false');
                    });
                    const targetButton = e.target.closest('button');
                    targetButton.classList.add('selected', 'primary');
                    targetButton.classList.remove('secondary');
                    targetButton.setAttribute('aria-checked', 'true');


                    updateProgress();
                    
                    // CRITICAL: Check for urgent advice immediately after any screening question is answered 'JA'
                    if (screen.stage === 'screening' && answer === 'JA') {
                        STATE.isUrgent = true;
                        // Use timeout to allow UI update to finalize
                        setTimeout(renderResultUrgent, 100); 
                    }
                });
            });
        }

        // 3. VAS listeners
        if (screen.questions[0].type === 'scale') {
            D.screenContent.querySelectorAll('input[type="range"]').forEach(slider => {
                const id = slider.id.replace('-slider', '');
                const display = document.getElementById(`${id}-display`);

                const updateValue = (value) => {
                    STATE.answers[id] = parseInt(value);
                    display.textContent = value;
                    slider.setAttribute('aria-valuenow', value);
                    updateProgress();
                };

                slider.addEventListener('input', (e) => updateValue(e.target.value));
                
                // Set initial state from answers if navigating back or initializing
                if (STATE.answers[id] !== undefined) {
                    updateValue(STATE.answers[id]);
                } else {
                    // Initialize default value and state
                    STATE.answers[id] = parseInt(slider.value);
                    updateValue(slider.value);
                }
            });
        }
    }
}

// --- Navigation Logic ---

function checkUrgentAdvice() {
    // Check if any screening question (s1-s4) answered 'JA'
    return ['s1', 's2', 's3', 's4'].some(id => STATE.answers[id] === 'JA');
}

function navigate(direction) {
    
    if (direction === -1) {
        // Go back
        STATE.currentStepIndex = Math.max(1, STATE.currentStepIndex - 1); // Cannot go back before screening
        STATE.isUrgent = false; 
        renderScreen(STATE.currentStepIndex);
        return;
    }

    // Check if current step is answered before proceeding forward
    if (!isCurrentStepAnswered()) {
        alert(T('FILL_ALL_FIELDS'));
        return;
    }
    
    // Check for urgent advice if we just completed the screening phase (Index 4 is the last screening step)
    if (STATE.currentStepIndex === 4) {
        if (checkUrgentAdvice()) {
            STATE.isUrgent = true;
            renderResultUrgent();
            return;
        }
    }

    // Standard progression
    STATE.currentStepIndex += 1;
    if (STATE.currentStepIndex < SCREENS.length) {
        renderScreen(STATE.currentStepIndex);
    } else {
        // We have passed the last question step (index 8), proceed to result calculation (index 9)
        renderResultScreen();
    }
}

// --- Result Calculation & Rendering ---

function calculateAdvice() {
    const vasNow = STATE.answers.vas_now || 0;
    const vasAfter = STATE.answers.vas_after || 0;
    const maxPain = Math.max(vasNow, vasAfter);

    let adviceType;

    if (maxPain <= 3) {
        adviceType = ADVICE.LOW_PAIN;
    } else if (maxPain <= 5) { // maxPain = 4 or 5
        adviceType = ADVICE.MODERATE_PAIN;
    } else { // maxPain >= 6
        adviceType = ADVICE.HIGH_PAIN;
    }

    // Handle AKNS functional warnings
    let warningText = '';
    const langSuffix = STATE.language.toUpperCase();

    // Check ak1: Worsens with walking/stairs
    if (STATE.answers.ak1 === 'JA') {
        warningText += `<p class="warning-text">${ADVICE[`AKNS_WARNING_WALK_STAIRS_${langSuffix}`]}</p>`;
    }
    // Check ak2: Worsens with jumping/running
    if (STATE.answers.ak2 === 'JA') {
        warningText += `<p class="warning-text">${ADVICE[`AKNS_WARNING_RUN_JUMP_${langSuffix}`]}</p>`;
    }
    
    return {
        maxPain,
        advice: adviceType,
        warningText
    };
}

function renderResultUrgent() {
    const adviceData = ADVICE.URGENT;
    const langSuffix = STATE.language;

    const resultHTML = `
        <div id="result-container" class="question-card urgent-result">
            <h2 class="result-title">${T('RESULT_TITLE')}</h2>
            <p class="result-subtitle-pain">${adviceData[`short_${langSuffix}`]}</p>
            
            <div class="advice-block urgent">
                <h3>${adviceData[`short_${langSuffix}`]}</h3>
                <p>${adviceData[`long_${langSuffix}`]}</p>
                <br>
                <p><strong>${T('SCORE_AKNS')}</strong>: ${T('AKNS_YES')}</p>
            </div>
            
            <div class="footer-disclaimer result-disclaimer-inner">
                <p>${T('GENERAL_DISCLAIMER')}</p>
            </div>
        </div>
    `;

    D.screenContent.innerHTML = resultHTML;
    
    // Add result specific buttons
    const finalNav = document.createElement('div');
    finalNav.className = 'navigation-controls result-controls';
    finalNav.id = 'final-result-controls';
    finalNav.innerHTML = `
        <button id="download-pdf-button-urgent" class="primary">
            <i data-lucide="download" class="lucide-icon"></i>
            <span>${T('DOWNLOAD_PDF')}</span>
        </button>
        <button id="share-result-button-urgent" class="secondary">
            <i data-lucide="share-2" class="lucide-icon"></i>
            <span>${T('SHARE_RESULT')}</span>
        </button>
        <button id="call-gp-button" class="secondary">
            <i data-lucide="phone" class="lucide-icon"></i>
            <span>${T('CALL_GP')}</span>
        </button>
    `;
    
    D.screenContent.querySelector('.urgent-result').appendChild(finalNav);


    D.navigationControls.style.display = 'none'; // Hide standard nav

    D.stepCounter.textContent = T('RESULT_TITLE');
    D.progressBar.style.width = '100%';

    initializeIcons();
    setupResultListeners(true);
    updatePDFContainer(resultHTML, T('RESULT_TITLE') + " (" + T('URGENT') + ")");
}


function renderResultScreen() {
    const { maxPain, advice, warningText } = calculateAdvice();
    const langSuffix = STATE.language;
    
    // Helper to find question text by ID.
    const getQuestionTextById = (id) => {
        const screen = SCREENS.find(s => s.questions && s.questions.length > 0 && s.questions[0].id === id);
        return screen ? screen.questions[0][`text_${langSuffix}`] : id; 
    };

    const akns1Answer = STATE.answers.ak1 === 'JA' ? T('AKNS_YES') : T('AKNS_NO');
    const akns2Answer = STATE.answers.ak2 === 'JA' ? T('AKNS_YES') : T('AKNS_NO');
    
    const ak1Text = getQuestionTextById('ak1');
    const ak2Text = getQuestionTextById('ak2');
    
    const resultHTML = `
        <div id="result-container" class="question-card">
            <h2 class="result-title">${T('RESULT_TITLE')}</h2>
            <p class="result-subtitle-pain">${T('RESULT_SUBTITLE_PAIN', maxPain)}</p>
            
            <div class="advice-block">
                <h3>${advice[`short_${langSuffix}`]}</h3>
                <p>${advice[`long_${langSuffix}`]}</p>
                ${warningText}
            </div>

            <div class="score-breakdown">
                <h4>${T('RESULT_BREAKDOWN')}</h4>
                <p><strong>${T('SCORE_NOW')}</strong> ${STATE.answers.vas_now}</p>
                <p><strong>${T('SCORE_AFTER')}</strong> ${STATE.answers.vas_after}</p>
                
                <br>
                <p><strong>${ak1Text}</strong>: ${akns1Answer}</p>
                <p><strong>${ak2Text}</strong>: ${akns2Answer}</p>
            </div>
            
            <div class="footer-disclaimer result-disclaimer-inner">
                <p>${T('GENERAL_DISCLAIMER')}</p>
            </div>
        </div>
    `;
    
    D.screenContent.innerHTML = resultHTML;

    // Add result specific buttons
    const finalNav = document.createElement('div');
    finalNav.className = 'navigation-controls result-controls';
    finalNav.id = 'final-result-controls';
    finalNav.innerHTML = `
        <button id="download-pdf-button" class="primary">
            <i data-lucide="download" class="lucide-icon"></i>
            <span>${T('DOWNLOAD_PDF')}</span>
        </button>
        <button id="share-result-button-final" class="secondary">
            <i data-lucide="share-2" class="lucide-icon"></i>
            <span>${T('SHARE_RESULT')}</span>
        </button>
        <button id="start-over-button-2" class="secondary">
            <i data-lucide="rotate-ccw" class="lucide-icon"></i>
            <span>${T('START_OVER')}</span>
        </button>
    `;
    
    D.screenContent.appendChild(finalNav);
    D.navigationControls.style.display = 'none'; 

    initializeIcons();
    setupResultListeners(false);
    updatePDFContainer(resultHTML, T('RESULT_TITLE'));
}

function updatePDFContainer(contentHTML, headingOverride) {
    // Clean up content, especially for inner disclaimer that might mess up formatting
    const cleanedContent = contentHTML.replace(/<div class="footer-disclaimer result-disclaimer-inner">[\s\S]*?<\/div>/, '');

    // Wrap the content needed for PDF generation, including header/disclaimer structure
    D.pdfContainer.innerHTML = `
        <div style="padding: 20px; font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.4;">
            <h1 style="color: #0f6fff; font-size: 18pt; margin-bottom: 5px;">${T('TITLE')}</h1>
            <h2 style="font-weight: normal; font-size: 12pt; margin-top: 0; color: #555;">${T('SUBTITLE')}</h2>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <h3 style="font-size: 16pt; margin-bottom: 15px;">${headingOverride}</h3>
            
            <div class="pdf-main-content">${cleanedContent}</div>

            <div style="font-size: 8pt; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; color: #777;">
                <p>${T('GENERAL_DISCLAIMER')}</p>
                <p style="text-align: right; margin-top: 5px; color: #999;">${T('DESIGN_CREDIT')}</p>
            </div>
        </div>
    `;
}

// --- Event Listeners and Initialization ---

function setupResultListeners(isUrgent) {
    // PDF Download
    const downloadButtonId = isUrgent ? 'download-pdf-button-urgent' : 'download-pdf-button';
    document.getElementById(downloadButtonId).addEventListener('click', downloadPDF);
    
    // Share Result
    const shareButtonId = isUrgent ? 'share-result-button-urgent' : 'share-result-button-final';
    document.getElementById(shareButtonId).addEventListener('click', generateAndShareResult);

    if (isUrgent) {
        // Call GP button (placeholder functionality)
        document.getElementById('call-gp-button').addEventListener('click', () => {
            alert("Aanname: Hier zou een telefoonnummer naar de huisartsenpost komen.");
        });
    } else {
        // Start Over button for non-urgent result
        document.getElementById('start-over-button-2').addEventListener('click', restartApp);
    }
}

function generateAndShareResult() {
    const resultElement = document.getElementById('result-container');
    if (!resultElement) return;

    // Extract text content cleanly for sharing
    let shareText = T('TITLE') + " - " + T('SUBTITLE') + "\n\n";

    const title = resultElement.querySelector('.result-title')?.textContent || '';
    const subtitle = resultElement.querySelector('.result-subtitle-pain')?.textContent || '';
    
    shareText += title + "\n" + subtitle + "\n\n";

    const adviceBlock = resultElement.querySelector('.advice-block');
    if (adviceBlock) {
        const h3 = adviceBlock.querySelector('h3')?.textContent || '';
        const p = adviceBlock.querySelector('p')?.textContent || '';
        shareText += h3 + "\n" + p + "\n\n";
    }

    const warnings = resultElement.querySelectorAll('.warning-text');
    warnings.forEach(w => {
        shareText += w.textContent + "\n";
    });
    shareText += "\n";
    
    const breakdown = resultElement.querySelector('.score-breakdown');
    if (breakdown) {
        shareText += T('RESULT_BREAKDOWN') + "\n";
        breakdown.querySelectorAll('p').forEach(p => {
            // Use inner text for score breakdown
            shareText += p.textContent.trim() + "\n";
        });
    }

    shareText += "\n---\n" + T('GENERAL_DISCLAIMER');

    copyToClipboard(shareText);
}

function saveResult() {
    // Kept for backward compatibility/optional admin feature, though not explicitly linked in the final UI flow.
    const adviceCalculation = STATE.isUrgent ? {} : calculateAdvice();
    const result = {
        timestamp: new Date().toISOString(),
        language: STATE.language,
        answers: STATE.answers,
        advice_short: STATE.isUrgent ? ADVICE.URGENT[`short_${STATE.language}`] : adviceCalculation.advice[`short_${STATE.language}`],
        isUrgent: STATE.isUrgent
    };
    
    let savedResults = JSON.parse(localStorage.getItem('knieCompasResults') || '[]');
    savedResults.push(result);
    localStorage.setItem('knieCompasResults', JSON.stringify(savedResults));
    
    alert(`Resultaat anoniem opgeslagen op ${new Date().toLocaleDateString(STATE.language)}.`);
}

function downloadPDF() {
    const element = D.pdfContainer;
    
    if (window.html2pdf) {
        const opt = {
            margin: 10,
            filename: `KnieBelastingCompas_Advies_${new Date().toISOString().substring(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        window.html2pdf().set(opt).from(element).save();
    } else {
        alert(T('PDF_LOAD_ERROR'));
    }
}

function restartApp() {
    STATE.currentStepIndex = 0;
    STATE.answers = {};
    STATE.isUrgent = false;
    
    // Clean up dynamic result controls
    const finalNav = document.getElementById('final-result-controls');
    if(finalNav) finalNav.remove();
    
    renderScreen(STATE.currentStepIndex);
}


function initApp() {
    // Initial UI setup
    updateUiText();
    
    // General Navigation Handlers
    D.backButton.addEventListener('click', () => navigate(-1));
    D.nextButton.addEventListener('click', () => navigate(1));
    
    // Settings Handlers
    D.languageToggle.addEventListener('click', toggleLanguage);
    D.contrastToggle.addEventListener('click', toggleContrast);
    D.ttsToggle.addEventListener('click', toggleTts);

    // Info Modal Handler
    D.infoButton.addEventListener('click', () => D.infoModal.style.display = 'flex');
    D.infoModal.querySelector('.close-modal').addEventListener('click', () => D.infoModal.style.display = 'none');
    
    // Start rendering at step 0
    renderScreen(STATE.currentStepIndex);
}

document.addEventListener('DOMContentLoaded', initApp);
