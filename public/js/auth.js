const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");


if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const users =
            JSON.parse(localStorage.getItem("fintrack_users")) || [];

        const existingUser =
            users.find(user => user.email === email);

        if (existingUser) {

            alert("An account with this email already exists.");

            return;
        }

        const user = {
            id: Date.now(),
            name,
            email,
            password
        };

        users.push(user);

        localStorage.setItem(
            "fintrack_users",
            JSON.stringify(users)
        );

        alert("Account created successfully!");

        window.location.href = "login.html";

    });

}


if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const users =
            JSON.parse(localStorage.getItem("fintrack_users")) || [];

        const user = users.find(
            user =>
                user.email === email &&
                user.password === password
        );

        if (!user) {

            alert("Invalid email or password.");

            return;
        }

        localStorage.setItem(
            "fintrack_currentUser",
            JSON.stringify(user)
        );

        window.location.href = "dashboard.html";

    });

}