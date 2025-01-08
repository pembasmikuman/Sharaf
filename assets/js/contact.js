// Select form, popup, and close button
const contactForm = document.getElementById('contactForm');
const thankYouPopup = document.getElementById('thankYouPopup');
const closePopupButton = document.getElementById('closePopup');

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent actual form submission

    // Show the popup
    thankYouPopup.classList.remove('hidden');
});

// Close the popup
closePopupButton.addEventListener('click', () => {
    thankYouPopup.classList.add('hidden');
});
