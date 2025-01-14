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

        sr.reveal(`.form`, {transition:1000, origin: 'left'});
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');

        sr.reveal(`.hidden`, {transition:1000, origin: 'left'});
    });
});
function showPopup(message, isSuccess) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.animation = 'slideIn 0.3s ease-out';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.color = 'white';
    popup.style.backgroundColor = isSuccess ? 'green' : 'red';
    popup.style.zIndex = '1000';
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.remove();
    }, 3000);
  }

function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  if (username && email && password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.email === email)) {
      showPopup('User already exists!', false);
    } else {
      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      showPopup('Signup successful!', true);
      signupForm.reset();
    }
  } else {
    showPopup('Please fill in all fields', false);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (email && password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      showPopup('Login successful!', true);
      loginForm.reset();
      // Redirect to a dashboard or home page
    } else {
      showPopup('Invalid credentials', false);
    }
  } else {
    showPopup('Please fill in all fields', false);
  }
}


// Add event listeners for form submissions
signupForm.addEventListener('submit', handleSignup);
loginForm.addEventListener('submit', handleLogin);

// Function to check if user is logged in
function checkLoggedInUser() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    // User is logged in, you can update UI accordingly
    console.log('Logged in as:', currentUser.username);
  }
}

// Call this function when the page loads
checkLoggedInUser();



/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1000,
    reset: true // Animation repeat
  })
  
sr.reveal(`.footer_container`, {transition: 500, origin:'bottom', delay: 100})