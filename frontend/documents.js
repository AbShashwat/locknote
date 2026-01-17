// ---------- AUTH CHECK ----------
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

// ---------- SAVE DOCUMENT ----------
async function saveDocument() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title || !content) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch(
        "https://locknote-backend.onrender.com/documents",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        }
    );

    const result = await response.json();
    alert(result.message);

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    loadDocuments();
}

// ---------- LOAD DOCUMENTS ----------
async function loadDocuments() {
    const response = await fetch(
        "https://locknote-backend.onrender.com/documents",
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const documents = await response.json();

    const docList = document.getElementById("docList");
    docList.innerHTML = "";

    documents.forEach(doc => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${doc.title}</strong><br>
            <small>${doc.content}</small>
        `;

        docList.appendChild(li);
    });
}

// ---------- INITIAL LOAD ----------
loadDocuments();
