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


