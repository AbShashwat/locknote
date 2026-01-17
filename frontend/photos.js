// ---------- AUTH CHECK ----------
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

// ---------- UPLOAD PHOTO ----------
async function uploadPhoto() {
    const name = document.getElementById("photoName").value;
    const file = document.getElementById("photoFile").files[0];

    if (!file) {
        alert("Please select a photo");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", file);

    const response = await fetch(
        "https://locknote-backend.onrender.com/photos",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        }
    );

    const result = await response.json();
    alert(result.message);

    loadPhotos();
}

// ---------- LOAD PHOTOS ----------
async function loadPhotos() {
    const response = await fetch(
        "https://locknote-backend.onrender.com/photos",
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const photos = await response.json();

    const grid = document.getElementById("photoGrid");
    grid.innerHTML = "";

    photos.forEach(photo => {
        const div = document.createElement("div");
        div.className = "photo-card";
        div.innerHTML = `
            <img src="https://locknote-backend.onrender.com/${photo.imagePath}" />
            <p>${photo.name}</p>
        `;
        grid.appendChild(div);
    });
}

// ---------- INITIAL LOAD ----------
loadPhotos();
