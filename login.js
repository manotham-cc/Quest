const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    const data = await response.json();
    alert('Login successful!');
    // Redirect to another page if needed
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid username or password');
  }
});
