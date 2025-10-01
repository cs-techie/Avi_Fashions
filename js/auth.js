// Authentication logic for login and signup

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
});

function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  // Check for admin credentials
  if (email === 'admin@avighna.com' && password === 'admin123') {
    const user = {
      email,
      name: 'Admin',
      role: 'admin',
      loginTime: new Date().toISOString()
    };
    saveUser(user);
    alert('Welcome Admin!');
    window.location.href = 'admin.html';
    return;
  }

  // Check for regular user
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.loginTime = new Date().toISOString();
    saveUser(userWithoutPassword);
    alert('Login successful!');
    window.location.href = 'index.html';
  } else {
    alert('Invalid email or password');
  }
}

function handleSignup(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  // Check if user already exists
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    alert('User with this email already exists');
    return;
  }

  // Create new user
  const newUser = {
    id: 'u' + Date.now(),
    name,
    email,
    password,
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Auto login
  const { password: _, ...userWithoutPassword } = newUser;
  saveUser(userWithoutPassword);

  alert('Account created successfully!');
  window.location.href = 'index.html';
}
