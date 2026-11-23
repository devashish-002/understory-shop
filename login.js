const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const loginStatus = document.getElementById('loginStatus');
const loginTitle = document.getElementById('loginTitle');
const loginIntro = document.querySelector('.login-intro');
const submitButton = loginForm.querySelector('[type="submit"]');
const authModePrompt = document.getElementById('authModePrompt');
const authModePromptText = document.getElementById('authModePromptText');
const authModeToggle = document.getElementById('authModeToggle');
const accountPanel = document.getElementById('accountPanel');
const accountEmail = document.getElementById('accountEmail');
const accountLogoutButton = document.getElementById('accountLogoutBtn');
const accountStatus = document.getElementById('accountStatus');
let isRegistering = false;

function setMode(registering) {
  isRegistering = registering;
  loginTitle.textContent = registering ? 'Create your account' : 'Welcome back to your corner.';
  loginIntro.textContent = registering
    ? 'Create an account to keep your orders together.'
    : 'Sign in to pick up where your plants left off.';
  passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
  passwordInput.minLength = registering ? 10 : 0;
  submitButton.textContent = registering ? 'Create account' : 'Sign in';
  authModePromptText.textContent = registering ? 'Already have an account?' : 'New to Understory?';
  authModeToggle.textContent = registering ? 'Sign in instead' : 'Create an account';
  loginStatus.textContent = '';
}

function showAccount(user) {
  loginForm.hidden = true;
  authModePrompt.hidden = true;
  accountPanel.hidden = false;
  loginTitle.textContent = 'Your account';
  loginIntro.textContent = 'Your Understory account is ready.';
  accountEmail.textContent = user.email;
}

passwordToggle.addEventListener('click', () => {
  const shouldShowPassword = passwordInput.type === 'password';
  passwordInput.type = shouldShowPassword ? 'text' : 'password';
  passwordToggle.textContent = shouldShowPassword ? 'Hide' : 'Show';
  passwordToggle.setAttribute('aria-pressed', String(shouldShowPassword));
});

authModeToggle.addEventListener('click', () => {
  setMode(!isRegistering);
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginStatus.textContent = '';
  submitButton.disabled = true;

  UnderstoryAPI.request(isRegistering ? '/api/auth/register' : '/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: passwordInput.value
    })
  })
    .then(() => window.location.assign('index.html'))
    .catch((error) => {
      loginStatus.textContent = error.message;
      submitButton.disabled = false;
    });
});

accountLogoutButton.addEventListener('click', async () => {
  accountLogoutButton.disabled = true;
  try {
    await UnderstoryAPI.request('/api/auth/logout', { method: 'POST' });
    accountPanel.hidden = true;
    authModePrompt.hidden = false;
    loginForm.hidden = false;
    setMode(false);
    accountStatus.textContent = 'You have signed out.';
  } catch (error) {
    accountStatus.textContent = error.message;
  } finally {
    accountLogoutButton.disabled = false;
  }
});

UnderstoryAPI.request('/api/auth/me')
  .then(({ user }) => {
    if (user) showAccount(user);
  })
  .catch(() => {});
