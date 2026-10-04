// ==========================================
// Select HTML Elements
// ==========================================

const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");


// ==========================================
// Update Character and Word Counts
// ==========================================

function updateCounts() {

    const text = noteText.value;

    // Count characters
    const characters = text.length;

    // Count words
    let words = 0;

    if (text.trim() !== "") {
        words = text.trim().split(/\s+/).length;
    }

    // Update character counter
    charCount.textContent = `${characters} / 200 characters`;

    // Update word counter
    wordCount.textContent = `${words} words`;


    // Remove previous warning classes
    charCount.classList.remove("warning");
    charCount.classList.remove("over");


    // Add warning when over 180 characters
    if (characters > 180 && characters <= 200) {
        charCount.classList.add("warning");
    }


    // Add over class when over 200 characters
    if (characters > 200) {
        charCount.classList.add("over");
    }
}


// ==========================================
// Save Draft
// ==========================================

function saveDraft() {

    localStorage.setItem("noteDraft", noteText.value);
}


// ==========================================
// Restore Draft
// ==========================================

function restoreDraft() {

    const savedDraft = localStorage.getItem("noteDraft");

    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }
}


// ==========================================
// Clear Note
// ==========================================

function clearNote() {

    noteText.value = "";

    localStorage.removeItem("noteDraft");

    updateCounts();

    noteText.focus();
}


// ==========================================
// Theme
// ==========================================

function updateThemeButton() {

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
}


function restoreTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    updateThemeButton();
}


function toggleTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");
    }

    updateThemeButton();
}


// ==========================================
// Input Event
// ==========================================

noteText.addEventListener("input", function () {

    updateCounts();

    saveDraft();

});


// ==========================================
// Clear Button
// ==========================================

clearBtn.addEventListener("click", function () {

    clearNote();

});


// ==========================================
// Escape Key
// ==========================================

noteText.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        clearNote();
    }

});


// ==========================================
// Theme Toggle Button
// ==========================================

themeToggle.addEventListener("click", function () {

    toggleTheme();

});


// ==========================================
// Page Load
// ==========================================

restoreDraft();

restoreTheme();

updateCounts();