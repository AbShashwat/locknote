let documents = JSON.parse(localStorage.getItem("documents")) || [];
let editIndex = -1;

// Save or Update document
function saveDocument() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title === "" || content === "") {
        alert("Please fill all fields");
        return;
    }

    if (editIndex === -1) {
        // Save new document
        documents.push({ title, content });
    } else {
        // Update existing document
        documents[editIndex] = { title, content };
        editIndex = -1;
    }

    localStorage.setItem("documents", JSON.stringify(documents));
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    displayDocuments();
}

// Display documents
function displayDocuments() {
    const docList = document.getElementById("docList");
    docList.innerHTML = "";

    documents.forEach((doc, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${doc.title}</strong>
            <br>
            <small>${doc.content}</small>
            <br><br>
            <button onclick="editDocument(${index})">Edit</button>
            <button onclick="deleteDocument(${index})">Delete</button>
        `;

        docList.appendChild(li);
    });
}

// Edit document
function editDocument(index) {
    document.getElementById("title").value = documents[index].title;
    document.getElementById("content").value = documents[index].content;
    editIndex = index;
}

// Delete document
function deleteDocument(index) {
    if (confirm("Are you sure you want to delete this document?")) {
        documents.splice(index, 1);
        localStorage.setItem("documents", JSON.stringify(documents));
        displayDocuments();
    }
}

// Load documents on page load
displayDocuments();
