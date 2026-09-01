// js/config.js
// Set your master registration URL here
const REGISTRATION_URL = "https://www.google.com/"; // Replace with your actual live registration URL

// Set your master logo URL here
const LOGO_URL = "assets/images/AI_AVLOKAN_LOGO.jpeg"; // Replace with your actual logo URL

// Set your master General Rules PDF URL here
const GENERAL_RULES_URL = "assets/events/rulebook/GENERAL_RULES.pdf"; // Replace with your actual general rules PDF URL

document.addEventListener("DOMContentLoaded", () => {
    // Find all elements with the registration-btn class
    const regButtons = document.querySelectorAll('.registration-btn');

    // Update the href attribute for each button
    regButtons.forEach(btn => {
        btn.href = REGISTRATION_URL;
        // Optionally, make it open in a new tab
        btn.target = "_blank";
    });

    // Update dynamic logos
    const dynamicLogos = document.querySelectorAll('.dynamic-logo');
    dynamicLogos.forEach(logo => {
        logo.src = LOGO_URL;
    });

    // Update general rules button
    const generalRulesBtn = document.querySelector('.general-rules-btn');
    if (generalRulesBtn) {
        generalRulesBtn.href = "#";
        generalRulesBtn.onclick = (e) => {
            e.preventDefault();
            if (typeof window.openPDF === 'function') {
                window.openPDF(GENERAL_RULES_URL);
            } else {
                window.open(GENERAL_RULES_URL, '_blank');
            }
        };
    }
});
