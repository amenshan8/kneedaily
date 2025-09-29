export const LANGUAGES = ['nl', 'en'];

// --- Advice Texts ---
const ADVICE = {
    URGENT: {
        short_nl: "Advies: Neem contact op met uw huisarts of fysiotherapeut.",
        long_nl: "Advies: Neem contact op met uw huisarts of fysiotherapeut voor advies. Door de verandering in uw situatie en/ of uw klachten is het advies uit deze app niet meer relevant voor uw situatie.",
        short_en: "Advice: Contact your GP or physiotherapist.",
        long_en: "Advice: Contact your GP or physiotherapist immediately for advice. Due to the change in your situation and/or symptoms, the advice from this app is no longer relevant for you."
    },
    LOW_PAIN: { // Max Pain <= 3
        short_nl: "Advies: Doe rustig aan vandaag.",
        long_nl: "Probeer te bewegen op een manier waarbij u de knie niet veel belast. Denk hierbij aan fietsen op een lage versnelling of korte stukjes wandelen. Als de pijn hierdoor toeneemt neem dan rust. Vermijd explosieve bewegingen zoals hardlopen of springen waar mogelijk. Bij lang aanhoudende pijn neemt contact op met een fysiotherapeut.",
        short_en: "Advice: Take it easy today.",
        long_en: "Try moving in ways that do not stress the knee much. Consider cycling at a low gear or taking short walks. If pain increases, rest. Avoid explosive movements like running or jumping where possible. If pain persists for a long time, contact a physiotherapist."
    },
    MODERATE_PAIN: { // Max Pain 4-5
        short_nl: "Advies: U kunt vandaag uw belastende activiteiten opbouwen.",
        long_nl: "Probeer over te gaan op rust of niet belastende vormen van bewegingen als de pijn een score van 6 of hoger krijgt. Vermijd nu nog explosieve bewegingen zoals sprinten of springen waar mogelijk. Bij lang aanhoudende pijn neemt contact op met een fysiotherapeut.",
        short_en: "Advice: You can gradually increase your load-bearing activities today.",
        long_en: "Try switching to rest or low-impact movements if the pain reaches a score of 6 or higher. Avoid explosive movements like sprinting or jumping for now where possible. If pain persists for a long time, contact a physiotherapist."
    },
    HIGH_PAIN: { // Max Pain >= 6
        short_nl: "Advies: U kunt vandaag uw belastende activiteiten opbouwen. U kunt ook uw explosieve oefeningen opbouwen zolang dit geen pijn veroorzaakt.",
        long_nl: "U kunt ook uw explosieve oefeningen opbouwen zolang dit geen pijn veroorzaakt. Probeer over te gaan op rust of niet belastende vormen van bewegingen als de pijn een score van 6 of hoger krijgt.",
        short_en: "Advice: You can gradually increase your load-bearing activities today. You can also build up your explosive exercises as long as they do not cause pain.",
        long_en: "You can also build up your explosive exercises as long as they do not cause pain. Try switching to rest or low-impact movements if the pain reaches a score of 6 or higher."
    },
    AKNS_WARNING_RUN_JUMP_NL: "Let op: uw pijn wordt duidelijk erger bij springen of rennen. Pas activiteiten extra aan en overleg bij aanhoudende klachten.",
    AKNS_WARNING_WALK_STAIRS_NL: "Let op: uw pijn wordt duidelijk erger bij lopen of traplopen. Pas activiteiten extra aan en overleg bij aanhoudende klachten.",
    AKNS_WARNING_RUN_JUMP_EN: "Note: your pain clearly worsens with jumping or running. Adjust activities additionally and consult if symptoms persist.",
    AKNS_WARNING_WALK_STAIRS_EN: "Note: your pain clearly worsens with walking or stair climbing. Adjust activities additionally and consult if symptoms persist.",
};

// --- General UI Text & Translations ---
const UI_TEXTS = {
    nl: {
        TITLE: "Knie belasting compas",
        SUBTITLE: "ADVISEREND hulpmiddel bij patello femoraal pijnsyndroom",
        GENERAL_DISCLAIMER: "De informatie in deze app is niet bedoeld als medisch advies en vervangt geen consult bij een arts of fysiotherapeut. Gebruik van deze app is op eigen risico. Bij twijfel, verandering of verergering van klachten wordt geadviseerd direct contact op te nemen met een huisarts of fysiotherapeut. De ontwikkelaars aanvaarden geen aansprakelijkheid voor enige schade voortvloeiend uit het gebruik van deze app.",
        YES: "JA",
        NO: "NEE",
        NEXT: "Volgende",
        BACK: "Terug",
        STOP_SAVE: "Stop & Sla resultaat op",
        DOWNLOAD_PDF: "Download PDF",
        CALL_GP: "Bel huisarts",
        SAVE_RESULT: "Sla resultaat op",
        START_OVER: "Start opnieuw",
        TTS_READ_ALOUD: "Lees voor",
        STEP_COUNTER: (current, total) => `Stap ${current}/${total}`,
        VAS_MICROCOPY: "Zet de slider of tik een getal. Score 0 = geen pijn, 10 = ergste pijn.",
        RESULT_TITLE: "Uw advies",
        RESULT_SUBTITLE_PAIN: (score) => `Gebaseerd op uw hoogste pijnscore: ${score}`,
        RESULT_BREAKDOWN: "Score overzicht:",
        SCORE_NOW: "Pijn nu (VAS):",
        SCORE_AFTER: "Pijn na activiteit (VAS):",
        SCORE_AKNS: "Screening/Functionele klachten:",
        AKNS_YES: "Ja, klachten nemen toe.",
        AKNS_NO: "Nee, klachten nemen niet toe.",
        LANGUAGE_TOGGLE_TITLE: "Change Language (English)",
        LANGUAGE_TOGGLE_TEXT: "EN",
        INFO_TITLE: "Informatie",
        INFO_BODY: "Deze tool is ontworpen om u te helpen een advies te geven over de belasting van uw knie bij PFPS. Het is een hulpmiddel, GEEN medisch advies.",
        CLOSE: "Sluit",
        FILL_ALL_FIELDS: "Vul alle antwoorden in voordat u verder gaat.",
        URGENT: "Urgent",
        VAS_SCALE_HINT: "0 = Geen pijn, 10 = Ergste pijn",
        NO_PAIN: "Geen pijn",
        WORST_PAIN: "Ergste pijn",
        START_QUIZ_PROMPT: "Welkom. Klik 'Volgende' om te starten.",
        VIEW_RESULT: "Bekijk resultaat",
        START_QUIZ: "Start Compas",
        SHARE_RESULT: "Deel resultaat",
        COPY_SUCCESS: "Resultaat gekopieerd naar klembord.",
        COPY_FAILURE: "Kon resultaat niet kopiëren. Probeer handmatig te kopiëren.",
        TTS_DISABLED_HINT: "Schakel de leeshulp in via de speakerknop in de header.",
        PDF_LOAD_ERROR: "PDF generator kon niet laden.",
        DESIGN_CREDIT: "Ontworpen en gebouwd door Sija Van Den Heuvel."
    },
    en: {
        TITLE: "Knee Load Compass",
        SUBTITLE: "ADVISORY tool for Patellofemoral Pain Syndrome",
        GENERAL_DISCLAIMER: "The information in this app is not intended as medical advice and does not replace consultation with a doctor or physiotherapist. Use of this app is at your own risk. If in doubt, or if symptoms change or worsen, it is advised to contact a general practitioner or physiotherapist immediately. The developers accept no liability for any damage resulting from the use of this app.",
        YES: "YES",
        NO: "NO",
        NEXT: "Next",
        BACK: "Back",
        STOP_SAVE: "Stop & Save Result",
        DOWNLOAD_PDF: "Download PDF",
        CALL_GP: "Call GP",
        SAVE_RESULT: "Save Result",
        START_OVER: "Start Over",
        TTS_READ_ALOUD: "Read aloud",
        STEP_COUNTER: (current, total) => `Step ${current}/${total}`,
        VAS_MICROCOPY: "Set the slider or tap a number. Score 0 = no pain, 10 = worst pain.",
        RESULT_TITLE: "Your Advice",
        RESULT_SUBTITLE_PAIN: (score) => `Based on your highest pain score: ${score}`,
        RESULT_BREAKDOWN: "Score Breakdown:",
        SCORE_NOW: "Pain now (VAS):",
        SCORE_AFTER: "Pain after activity (VAS):",
        SCORE_AKNS: "Screening/Functional complaints:",
        AKNS_YES: "Yes, symptoms increase.",
        AKNS_NO: "No, symptoms do not increase.",
        LANGUAGE_TOGGLE_TITLE: "Change Language (Dutch)",
        LANGUAGE_TOGGLE_TEXT: "NL",
        INFO_TITLE: "Information",
        INFO_BODY: "This tool is designed to help provide advice on the loading of your knee with PFPS. It is a tool, NOT medical advice.",
        CLOSE: "Close",
        FILL_ALL_FIELDS: "Please fill in all answers before proceeding.",
        URGENT: "Urgent",
        VAS_SCALE_HINT: "0 = No pain, 10 = Worst pain",
        NO_PAIN: "No pain",
        WORST_PAIN: "Worst pain",
        START_QUIZ_PROMPT: "Welcome. Click 'Next' to start.",
        VIEW_RESULT: "View Result",
        START_QUIZ: "Start Compas",
        SHARE_RESULT: "Share Result",
        COPY_SUCCESS: "Result copied to clipboard.",
        COPY_FAILURE: "Failed to copy result. Try copying manually.",
        TTS_DISABLED_HINT: "Enable Text-to-Speech using the speaker button in the header.",
        PDF_LOAD_ERROR: "PDF generator failed to load.",
        DESIGN_CREDIT: "Designed and built by Sija Van Den Heuvel."
    }
};

// --- Screen Definitions ---
const SCREENS = [
    // 0: Landing
    {
      "id": "landing",
      "type": "info",
      "title": "knie belasting compas",
      "body_nl": "Welkom — deze tool helpt u advies te geven bij PFPS. De informatie is geen medisch advies.",
      "body_en": "Welcome — this tool helps provide advice regarding PFPS. The information provided is not medical advice."
    },
    // 1-4: Screening (4 steps, one question per screen)
    {
      "id": "screening_s1",
      "type": "question",
      "stage": "screening",
      "title_nl": "Screening (1/4)",
      "title_en": "Screening (1/4)",
      "questions": [
        {"id":"s1","type":"boolean","text_nl":"Zijn uw klachten veranderd sinds het krijgen van de diagnose PFPS?","text_en":"Have your symptoms changed since being diagnosed with PFPS?"}
      ]
    },
    {
      "id": "screening_s2",
      "type": "question",
      "stage": "screening",
      "title_nl": "Screening (2/4)",
      "title_en": "Screening (2/4)",
      "questions": [
        {"id":"s2","type":"boolean","text_nl":"Heeft u recent een val of ander trauma gehad wat uw kniepijn beïnvloed heeft?","text_en":"Have you recently had a fall or other trauma affecting your knee pain?"}
      ]
    },
    {
      "id": "screening_s3",
      "type": "question",
      "stage": "screening",
      "title_nl": "Screening (3/4)",
      "title_en": "Screening (3/4)",
      "questions": [
        {"id":"s3","type":"boolean","text_nl":"Is uw knie opgezwollen, blauw of ziet er anders uit dan normaal?","text_en":"Is your knee swollen, bruised, or does it look different than normal?"}
      ]
    },
    {
      "id": "screening_s4",
      "type": "question",
      "stage": "screening",
      "title_nl": "Screening (4/4)",
      "title_en": "Screening (4/4)",
      "questions": [
        {"id":"s4","type":"boolean","text_nl":"Heeft u naast kniepijn nog andere aandoeningen of klachten?","text_en":"Do you have other conditions or complaints besides knee pain?"}
      ]
    },
    // 5-6: Pain VAS (2 steps, one question per screen)
    {
      "id": "pain_vas_now",
      "type": "question",
      "stage": "pain",
      "title_nl": "Pijnmeting (1/2)",
      "title_en": "Pain Measurement (1/2)",
      "questions": [
        {"id":"vas_now","type":"scale","min":0,"max":10,
         "text_nl":"Als u een cijfer van 0 t/m 10 moet geven aan de pijn die u nu ervaart, waarbij 0 geen pijn is en 10 de ergste pijn die u zich kunt voorstellen, welk cijfer zou dat zijn?",
         "text_en":"If you had to give a number from 0 to 10 for the pain you are currently experiencing, where 0 is no pain and 10 is the worst pain imaginable, what number would that be?"}
      ]
    },
    {
      "id": "pain_vas_after",
      "type": "question",
      "stage": "pain",
      "title_nl": "Pijnmeting (2/2)",
      "title_en": "Pain Measurement (2/2)",
      "questions": [
        {"id":"vas_after","type":"scale","min":0,"max":10,
         "text_nl":"Als u een cijfer van 0 t/m 10 moet geven aan de pijn die u ervaarde, waarbij 0 geen pijn is en 10 de ergste pijn die u zich kunt voorstellen, na de laatste keer dat u iets actiefs gedaan had welk cijfer zou dat zijn?",
         "text_en":"If you had to give a number from 0 to 10 for the pain you experienced after the last time you did something active, what number would that be?"}
      ]
    },
    // 7-8: AKNS / Functional Questions (2 steps, one question per screen)
    {
      "id":"akns_ak1",
      "type":"question",
      "stage": "akns",
      "title_nl": "Activiteiten & Functie (1/2)",
      "title_en": "Activities & Function (1/2)",
      "questions":[
        {"id":"ak1","type":"boolean",
         "text_nl":"Wordt de pijn erger bij lopen of traplopen of andere matige inspanning?",
         "text_en":"Does the pain worsen with walking, climbing stairs, or other moderate exertion?"}
      ]
    },
    {
      "id":"akns_ak2",
      "type": "question",
      "stage": "akns",
      "title_nl": "Activiteiten & Functie (2/2)",
      "title_en": "Activities & Function (2/2)",
      "questions":[
        {"id":"ak2","type":"boolean", 
         "text_nl":"Wordt de pijn erger bij springen, rennen of andere activiteiten waarbij u de knie veel gebruikt?",
         "text_en":"Does the pain worsen with jumping, running, or other activities where you use your knee extensively?"}
      ]
    }
];

export { SCREENS, UI_TEXTS, ADVICE };
