# Secure login for Juice-Shop (SQL injection prevention)

<h2>HTML:</h2> 
This file implements a simple HTML form to simulate Juice Shop’s login page.

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

<h2>JavaScript:</h2> 
The file includes a JavaScript code to provide basic security functions on client's side. This JavaScript handles three distinct phases: Interception, Validation, and Secure Transmission, and starts by "listening" for the submit event.

<h3>1. Event Interception (addEventListener)</h3>

By default, HTML forms try to send data via the URL (GET request) and refresh the page. This behavior is modified using ${\color{red}e.preventDefault()}\space$ in order to keep the credentials out of the browser history and to run the security validation process. Both email and password data are obtained using ${\color{red}document.getElementById().value}\space$ function from input fields.

<h3>2. Client-Side Validation Logic - First line of defense</h3>

Although a client-side validation can not fully stop a hacker because he/she can bypass the browser, this step provides a first line of defense and ensures Data Integrity regarding the authentication process.

* The @ Check: The expression ${\color{red}!email.includes('@')}\space$ performs a basic structural check to ensure that the data "looks" like an email before the data is sent to the server.

* Length Constraint: The expression ${\color{red}password.length < 8}\space$ enforces the minimum length of the server.

&rarr; User feedback (UX). If these conditions are not met, the script updates the DOM (the visible webpage) to show an error message without a page reload, creating a smooth "Single Page Application" (SPA) feel.

<h3>3. The fetch API and Asynchronous communication</h3>

Modern JavaScript uses async/await with the fetch function to talk to the backend.

* JSON Encapsulation: Instead of sending a string with the raw data, the expression ${\color{red}JSON.stringify({ email, password })}\space$ is used to package the data into a structured object.

* Headers: The expression ${\color{red}'Content-Type': 'application/json'}\space$ tells the server how to parse the incoming data.

* The "Wait" State: Because network requests can take time, await pauses the function execution (but not the browser) allowing a "Processing..." message to the user.

```JavaScript
const loginForm = document.getElementById('secureLoginForm');
const statusMessage = document.getElementById('statusMessage');
const submitBtn = loginForm.querySelector('button[type="submit"]'); // Grab the button

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 1. Basic Validation
    if (!email.includes('@') || password.length < 8) {
        updateStatus("Invalid email or password too short.", "error");
        return;
    }

    // 2. UI State: Loading
    statusMessage.textContent = "Processing...";
    statusMessage.className = "status-msg";
    submitBtn.disabled = true; // Prevent double-clicks

    try {
        const response = await fetch('/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            updateStatus("Login successful!", "success");
            // Redirect user or store token here
        } else {
            // This message avoid being too specific about WHY it failed (security best practice)
            updateStatus("Invalid credentials. Please try again.", "error");
        }
    } catch (err) {
        console.error("Connection error:", err);
        updateStatus("Unable to connect to server!", "error");
    } finally {
        submitBtn.disabled = false; // Re-enable button
    }
});

function updateStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = `status-msg ${type}`;
}
```

The JavaScript code prevents SQL Injection by acting as a basic entry barrier.
If a user types the expression ' OR 1=1-- to bypass the authentication process, the JavaScript treats it as a Literal String. By sending it as a JSON property, it arrives at the server as a single value.

A basic concatenation with this entry might materialize the exploit. This JavaScript code ensures that the malicious string is sent as one unit to the Parameterized Query on the backend, where it is safely compared against the database.

<h2>CSS:</h2> 
Finally, the file includes a CSS to emulate the original form provided in https://preview.owasp-juice.shop/#/login

```CSS
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1e1e1e; color: #cfcfcf; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
.login-container { background: #2d2d2d; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); width: 320px; }
h2 { text-align: center; color: #fff; margin-bottom: 20px; }
input { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #444; border-radius: 4px; background: #3c3c3c; color: #fff; box-sizing: border-box; }
button { width: 100%; padding: 12px; background-color: #5c6bc0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.3s; }
button:hover { background-color: #7986cb; }
.status-msg { font-size: 0.85rem; margin-top: 15px; text-align: center; min-height: 1.2em; }
.error { color: #ff5252; }
.success { color: #4caf50; }
```
