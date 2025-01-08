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

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    reset: false // Animation repeat
})
  
sr.reveal(`.main`, {transition: 500, origin: 'left', duration: 500})
sr.reveal(`.footer_container`, {transition: 500, origin:'bottom', delay: 100})