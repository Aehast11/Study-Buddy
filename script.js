// Data Structure for Study Sets
const studySets = [
    {
        id: "carbon-cycle-test-prep",
        title: "Carbon Cycle Test Prep",
        description: "Complete study guide covering leaf stomata, plant adaptations, chemical equations, carbon sinks, paleoclimatology, and positive feedback loops.",
        cards: [
            // Stomata & Plant Adaptations
            { 
                term: "Stomata Purpose & Mechanism", 
                definition: "Stomata are microscopic pores on leaves for gas exchange (taking in CO2, releasing O2). When guard cells swell with water, stomata open; when dehydrated, guard cells shrink and stomata close to prevent water loss." 
            },
            { 
                term: "Plant Adaptations to Reduce Water Loss", 
                definition: "Some plants (e.g., corn, crabgrass) close stomata during peak heat. Plants in desert environments (e.g., pineapple, cacti) only open stomata at night to minimize evaporation." 
            },
            { 
                term: "Guard Cells", 
                definition: "Jelly bean-shaped cells surrounding stomatal pores that control opening and closing based on water absorption and dehydration." 
            },
            { 
                term: "Stomata Distribution Across Species", 
                definition: "Most plants have stomata on lower leaf surfaces; corn has them on both sides; water lilies have them only on upper leaf surfaces." 
            },

            // Chemistry & Equations
            { 
                term: "Atomic Structure of Carbon", 
                definition: "6th element with 6 protons, 6 neutrons, and 6 electrons (2 in inner shell, 4 in valence shell). It needs 4 electrons to become stable, allowing it to bond with up to 4 atoms to create complex molecules like DNA, fats, and proteins." 
            },
            { 
                term: "Photosynthesis Balanced Equation", 
                definition: "6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2\n(Carbon Dioxide + Water + Light → Glucose + Oxygen)" 
            },
            { 
                term: "Cellular Respiration Balanced Equation", 
                definition: "C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy (ATP)\n(Glucose + Oxygen → Carbon Dioxide + Water + ATP)" 
            },
            { 
                term: "Reactants vs. Products Definition", 
                definition: "Reactants = starting materials on the left side of the arrow.\nProducts = resulting substances created on the right side of the arrow." 
            },
            { 
                term: "Photosynthesis: Reactants & Products", 
                definition: "Reactants: 6CO2 + 6H2O (and Light)\nProducts: C6H12O6 + 6O2" 
            },
            { 
                term: "Respiration: Reactants & Products", 
                definition: "Reactants: C6H12O6 + 6O2\nProducts: 6CO2 + 6H2O + ATP" 
            },

            // Earth Systems & Carbon Cycle
            { 
                term: "Atmospheric Carbon Gasses", 
                definition: "Carbon exists mainly as methane (CH4) and carbon dioxide (CO2). Both are greenhouse gases that trap heat in the atmosphere." 
            },
            { 
                term: "Fossil Fuel Formation", 
                definition: "Crude oil, coal, and natural gas are concentrated carbon-hydrogen bonds formed from organic material decomposed under earth over millions of years." 
            },
            { 
                term: "Diffusion & Ocean Carbon Sinks", 
                definition: "Carbon dioxide dissolves into ocean waters via diffusion. Oceans absorb about half of human CO2 emissions, but increased absorption raises ocean acidity and weakens shells." 
            },

            // Climate History & Feedback Loops
            { 
                term: "Pollen Cores & Sporopollenin", 
                definition: "Paleoclimatologists drill sediment cylinders from lake beds. Pollen survives for millions of years due to a durable outer coating made of sporopollenin." 
            },
            { 
                term: "Law of Superposition & Climate Reconstruction", 
                definition: "Deeper sediment layers represent older time periods. Shifting plant pollen (e.g., subarctic spruce shifting to oak/grass) reveals historical temperature changes." 
            },
            { 
                term: "Positive Feedback Loop: Ocean CO2 Release", 
                definition: "Cool water holds more CO2. As global temperatures rise, warmer ocean waters release stored CO2 back into the atmosphere, causing further warming and additional CO2 release." 
            },

        ]
    }
];

let currentSetIndex = 0;
let currentCardIndex = 0;

// Learn Mode State
let learnQueue = [];
let correctCount = 0;
let currentQuestion = null;

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("practice-grid");
    const modal = document.getElementById("study-modal");
    const closeBtn = document.getElementById("close-modal");
    
    // Elements for Flashcards
    const flashcard = document.getElementById("flashcard");
    const cardFront = document.getElementById("card-front");
    const cardBack = document.getElementById("card-back");
    const cardCounter = document.getElementById("card-counter");
    const setTitle = document.getElementById("modal-set-title");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const flashcardControls = document.querySelector(".modal-controls");

    // Dynamic Learn Mode Container Setup
    const modalContent = document.querySelector(".modal-content");
    
    // Remove existing mode selectors if re-initializing
    const existingSelector = document.querySelector(".mode-selector");
    if (existingSelector) existingSelector.remove();
    const existingLearn = document.getElementById("learn-container");
    if (existingLearn) existingLearn.remove();

    // Inject Mode Selector Switcher
    const modeSwitchHtml = `
        <div class="mode-selector">
            <button id="mode-flashcards" class="mode-btn active">Flashcards</button>
            <button id="mode-learn" class="mode-btn">Learn Mode</button>
        </div>
        <div id="learn-container" class="learn-container hidden">
            <div class="learn-progress">
                <span id="learn-score">Mastered: 0</span>
                <span id="learn-remaining">Remaining: 0</span>
            </div>
            <div id="learn-prompt" class="learn-prompt">Prompt Question</div>
            <div id="learn-options" class="learn-options"></div>
            <button id="learn-next-btn" class="study-nav-btn hidden">Next Question &rarr;</button>
        </div>
    `;
    
    setTitle.insertAdjacentHTML("afterend", modeSwitchHtml);

    const btnFlashcardsMode = document.getElementById("mode-flashcards");
    const btnLearnMode = document.getElementById("mode-learn");
    const learnContainer = document.getElementById("learn-container");
    const learnPrompt = document.getElementById("learn-prompt");
    const learnOptions = document.getElementById("learn-options");
    const learnNextBtn = document.getElementById("learn-next-btn");
    const learnScore = document.getElementById("learn-score");
    const learnRemaining = document.getElementById("learn-remaining");

    // Render Cards in Main Grid
    function renderPracticeCards() {
        if (!grid) return;
        grid.innerHTML = "";
        studySets.forEach((set, index) => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("practice-card");
            cardDiv.innerHTML = `
                <h3>${set.title}</h3>
                <p>${set.description}</p>
                <div class="card-footer">
                    <span>${set.cards.length} Terms</span>
                    <span class="hover-action">Click to Study &rarr;</span>
                </div>
            `;
            cardDiv.addEventListener("click", () => openStudyMode(index));
            grid.appendChild(cardDiv);
        });
    }

    // Open Fullscreen Study Mode
    function openStudyMode(setIndex) {
        currentSetIndex = setIndex;
        currentCardIndex = 0;
        setTitle.textContent = studySets[currentSetIndex].title;
        
        switchMode("flashcards");
        modal.classList.remove("hidden");
        
        if (modal.requestFullscreen) {
            modal.requestFullscreen().catch(() => {});
        }
    }

    // Mode Switcher Logic
    function switchMode(mode) {
        if (mode === "flashcards") {
            btnFlashcardsMode.classList.add("active");
            btnLearnMode.classList.remove("active");
            
            // Show Flashcards, Hide Learn
            flashcard.style.display = "block";
            flashcardControls.style.display = "flex";
            learnContainer.style.display = "none";
            
            updateCardContent();
        } else {
            btnLearnMode.classList.add("active");
            btnFlashcardsMode.classList.remove("active");
            
            // Hide Flashcards, Show Learn
            flashcard.style.display = "none";
            flashcardControls.style.display = "none";
            learnContainer.style.display = "flex";
            
            initLearnMode();
        }
    }

    btnFlashcardsMode.addEventListener("click", () => switchMode("flashcards"));
    btnLearnMode.addEventListener("click", () => switchMode("learn"));

    // --- FLASHCARD LOGIC ---
    function updateCardContent() {
        const currentCards = studySets[currentSetIndex].cards;
        const activeCard = currentCards[currentCardIndex];
        
        flashcard.classList.remove("flipped");
        setTimeout(() => {
            cardFront.textContent = activeCard.term;
            cardBack.textContent = activeCard.definition;
            cardCounter.textContent = `${currentCardIndex + 1} / ${currentCards.length}`;
        }, 150);
    }

    if (flashcard) {
        flashcard.addEventListener("click", () => {
            flashcard.classList.toggle("flipped");
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                updateCardContent();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentCardIndex < studySets[currentSetIndex].cards.length - 1) {
                currentCardIndex++;
                updateCardContent();
            }
        });
    }

    // --- LEARN MODE LOGIC ---
    function initLearnMode() {
        const allCards = studySets[currentSetIndex].cards;
        learnQueue = [...allCards];
        learnQueue.sort(() => Math.random() - 0.5);
        correctCount = 0;
        nextLearnQuestion();
    }

    function nextLearnQuestion() {
        learnNextBtn.style.display = "none";
        learnOptions.innerHTML = "";
        
        if (learnQueue.length === 0) {
            learnPrompt.textContent = "🎉 Outstanding! You have mastered all terms in this set!";
            learnScore.textContent = `Mastered: ${studySets[currentSetIndex].cards.length}`;
            learnRemaining.textContent = `Remaining: 0`;
            return;
        }

        currentQuestion = learnQueue[0];
        learnPrompt.textContent = currentQuestion.definition;

        const allCards = studySets[currentSetIndex].cards;
        let distractors = allCards
            .filter(c => c.term !== currentQuestion.term)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(c => c.term);

        let options = [...distractors, currentQuestion.term].sort(() => Math.random() - 0.5);

        options.forEach(optText => {
            const optBtn = document.createElement("button");
            optBtn.classList.add("learn-opt-btn");
            optBtn.textContent = optText;
            optBtn.addEventListener("click", () => checkLearnAnswer(optBtn, optText));
            learnOptions.appendChild(optBtn);
        });

        learnScore.textContent = `Mastered: ${correctCount}`;
        learnRemaining.textContent = `Remaining: ${learnQueue.length}`;
    }

    function checkLearnAnswer(selectedBtn, selectedText) {
        const allButtons = learnOptions.querySelectorAll(".learn-opt-btn");
        allButtons.forEach(btn => btn.disabled = true);

        if (selectedText === currentQuestion.term) {
            selectedBtn.classList.add("correct");
            correctCount++;
            learnQueue.shift();
        } else {
            selectedBtn.classList.add("incorrect");
            allButtons.forEach(btn => {
                if (btn.textContent === currentQuestion.term) {
                    btn.classList.add("correct");
                }
            });
            const missed = learnQueue.shift();
            learnQueue.push(missed);
        }

        learnNextBtn.style.display = "inline-block";
    }

    learnNextBtn.addEventListener("click", nextLearnQuestion);

    // Close Fullscreen Study Mode
    function closeStudyMode() {
        modal.classList.add("hidden");
        flashcard.classList.remove("flipped");
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeStudyMode);
    }

    renderPracticeCards();
});