// ---------- Get elements ----------
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const submitBtn = document.getElementById("submitBtn");
const subtitle = document.getElementById("subtitle");
const terms = document.getElementById("terms");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const username = document.getElementById("username");
const password = document.getElementById("password");
const authForm = document.getElementById("authForm");

let isLogin = false;

// ---------- Toggle Login / Signup ----------
toggleLink.addEventListener("click", (e) => {
    e.preventDefault();

    isLogin = !isLogin;

    if (isLogin) {
        submitBtn.innerText = "Log In";
        toggleText.innerText = "Don't have an account?";
        toggleLink.innerText = "Sign up";
        subtitle.innerText = "Log in to access your notes and images.";
        terms.style.display = "none";

        firstName.style.display = "none";
        lastName.style.display = "none";
    } else {
        submitBtn.innerText = "Sign Up";
        toggleText.innerText = "Have an account?";
        toggleLink.innerText = "Log in";
        subtitle.innerText = "Sign up to securely store notes and images.";
        terms.style.display = "block";

        firstName.style.display = "block";
        lastName.style.display = "block";
    }
});

// ---------- Form Submit (ONLY ONE) ----------
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
        password: password.value,
        mode: isLogin ? "login" : "signup"
    };

    console.log("Sending data to backend:", data);

    try {
        const response = await fetch("http://localhost:5000/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Backend response:", result);

        alert(result.message);

        if (result.message === "Login successful") {
            localStorage.setItem("username", username.value);
            window.location.href = "dashboard.html";
            }


    } catch (error) {
        console.error("Backend connection error:", error);
        alert("Error connecting to server");
    }
});
