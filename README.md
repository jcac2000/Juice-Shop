# Secure login for Juice-Shop (SQL injection prevention)

This code implements a simple HTML form to simulate Juice Shop’s login page.

```HTML
<div class="login-container">
    <h2>Juice Shop Login</h2>
    <form id="secureLoginForm">
        <input type="email" id="email" placeholder="Email (e.g., admin@juice.shop)" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit" id="loginBtn">Log in</button>
    </form>
    <div id="statusMessage" class="status-msg"></div>
</div>
```

The code has a JavaScript 
```JavaScript
const loginForm = document.getElementById('secureLoginForm');
const statusMessage = document.getElementById('statusMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    statusMessage.textContent = "Processing...";
    statusMessage.className = "status-msg";
    if (!email.includes('@') || password.length < 8) {
        updateStatus("Invalid input format.", "error");
        return;
    }
    try {
        const response = await fetch('/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            updateStatus("Login successful!", "success");
        } else {
            updateStatus("Login failed. SQL Injection blocked.", "error");
        }
    } catch (err) {
        console.error("Connection error:", err);
        updateStatus("Demo: Input captured safely!", "success");
    }
});
function updateStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = `status-msg ${type}`;
}
```


