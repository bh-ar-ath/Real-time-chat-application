document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        // Get input values
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Dummy authentication (replace with real authentication logic)
        if (email && password) {
            localStorage.setItem("userEmail", email); // Store email in local storage (optional)
            window.location.href = "chat.html"; // Redirect to chatbox
        } else {
            alert("Please enter valid credentials.");
        }
    });
});
