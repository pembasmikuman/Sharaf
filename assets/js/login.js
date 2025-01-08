document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const Popup = document.getElementById('Popup');
    const closePopupButton = document.getElementById('closePopup');

    switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission
    
        // Show the popup
        Popup.classList.remove('hidden');
        sr.reveal(`.popup`, {transition: 500, origin:'bottom'})

        closePopupButton.addEventListener('click', () => {
            Popup.classList.add('hidden');
        });
    });
});


let sr = new ScrollReveal({
    reset: false,
    distance: '60px',
    duration: 1000,
    delay: 400
})


sr.reveal(`.footer_container`, {transition: 500, origin:'bottom'})