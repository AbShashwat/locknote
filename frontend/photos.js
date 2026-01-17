const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "index.html";
}


async function uploadPhoto() {
    const name = document.getElementById("photoName").value;
    const file = document.getElementById("photoFile").files[0];

    if (!file) {
        alert("Please select a photo");
        return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("photo", file);

    const response = await fetch("http://localhost:5000/photos", {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    alert(result.message);
    loadPhotos();
}

async function loadPhotos() {
    const response = await fetch(`http://localhost:5000/photos/${username}`);
    const photos = await response.json();

    const grid = document.getElementById("photoGrid");
    grid.innerHTML = "";

    photos.forEach(photo => {
        const div = document.createElement("div");
        div.className = "photo-card";
        div.innerHTML = `
            <img src="http://localhost:5000/${photo.imagePath}">
            <p>${photo.name}</p>
        `;
        grid.appendChild(div);
    });
}

loadPhotos();
