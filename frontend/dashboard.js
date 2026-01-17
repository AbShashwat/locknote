const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
}
