document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if(email && password){
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        window.location.href = "shop.html";
    } else {
        alert("Invalid login credentials");
    }
});
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignUp = document.getElementById('switchToSignUp');
const switchToLogin = document.getElementById('switchToLogin');

loginBtn.addEventListener('click', () => {
  loginForm.classList.add('active'); signupForm.classList.remove('active');
  loginBtn.classList.add('active'); signupBtn.classList.remove('active');
});
signupBtn.addEventListener('click', () => {
  signupForm.classList.add('active'); loginForm.classList.remove('active');
  signupBtn.classList.add('active'); loginBtn.classList.remove('active');
});
switchToSignUp.addEventListener('click', e => { e.preventDefault(); signupBtn.click(); });
switchToLogin.addEventListener('click', e => { e.preventDefault(); loginBtn.click(); });

// Password visibility toggle
function togglePassword(id, el) {
  const input = document.getElementById(id);
  if(input.type === "password") { input.type = "text"; el.textContent = "🙈"; }
  else { input.type = "password"; el.textContent = "👁️"; }
}

// Password strength
const passwordInput = document.getElementById('password');
const strengthMessage = document.getElementById('strengthMessage');
passwordInput.addEventListener('input', () => {
  const val = passwordInput.value;
  let strength='', className='';
  if(val.length < 6) { strength='Too short'; className='weak'; }
  else if(/[A-Z]/.test(val)&&/[0-9]/.test(val)&&/[!@#$%^&*]/.test(val)&&val.length>=8) { strength='Strong'; className='strong'; }
  else if(/[A-Za-z]/.test(val)&&/[0-9]/.test(val)) { strength='Medium'; className='medium'; }
  else { strength='Weak'; className='weak'; }
  strengthMessage.textContent = strength;
  strengthMessage.className = `feedback ${className}`;
});

// Password match
const confirmPasswordInput = document.getElementById('confirmPassword');
const matchMessage = document.getElementById('matchMessage');
function checkPasswordMatch() {
  if(confirmPasswordInput.value===''){ matchMessage.textContent=''; return; }
  if(passwordInput.value===confirmPasswordInput.value){
    matchMessage.textContent='Passwords match';
    matchMessage.className='feedback match';
  } else {
    matchMessage.textContent='Passwords do not match';
    matchMessage.className='feedback no-match';
  }
}
confirmPasswordInput.addEventListener('input', checkPasswordMatch);
passwordInput.addEventListener('input', checkPasswordMatch);

// Email validation
const signupEmail = document.getElementById('signupEmail');
const emailFeedback = document.getElementById('emailFeedback');
signupEmail.addEventListener('input', () => {
  const email = signupEmail.value;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(regex.test(email)) {
    emailFeedback.textContent = 'Valid Email';
    emailFeedback.className = 'feedback valid-email';
  } else {
    emailFeedback.textContent = 'Invalid Email';
    emailFeedback.className = 'feedback invalid-email';
  }
});

const loginEmail = document.getElementById('loginEmail');
const loginEmailFeedback = document.getElementById('loginEmailFeedback');
loginEmail.addEventListener('input', () => {
  const email = loginEmail.value;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(regex.test(email)) {
    loginEmailFeedback.textContent = 'Valid Email';
    loginEmailFeedback.className = 'feedback valid-email';
  } else {
    loginEmailFeedback.textContent = 'Invalid Email';
    loginEmailFeedback.className = 'feedback invalid-email';
  }
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginEmail.value;
  const password = document.getElementById('loginPassword').value;

  if(email && password){
    window.location.href = "main.html";
  } else {
    alert("Please enter valid credentials.");
  }
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupEmail.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if(password !== confirmPassword){
    matchMessage.textContent = "Passwords do not match!";
    matchMessage.className = 'feedback no-match';
    return;
  }

  if(email && password){
    alert("Sign up successful! Redirecting to login...");
    loginBtn.click(); 
  }
});
