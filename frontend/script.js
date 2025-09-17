const apiUrl = 'http://localhost:5000/api/notes';

async function fetchNotes() {
    const res = await fetch(apiUrl);
    const notes = await res.json();
    const list = document.getElementById('noteList');
    list.innerHTML = '';
    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong>${note.title}</strong><br>${note.content}
            </div>
            <div>
                <button class="btn btn-sm btn-warning" onclick="editNote('${note.id}','${note.title}','${note.content}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteNote('${note.id}')">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value
    };
    await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(note)
    });
    document.getElementById('noteForm').reset();
    fetchNotes();
});

async function deleteNote(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchNotes();
}

function editNote(id, title, content) {
    const newTitle = prompt("Edit Title:", title);
    const newContent = prompt("Edit Content:", content);
    if (newTitle && newContent) {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ title: newTitle, content: newContent })
        }).then(fetchNotes);
    }
}

fetchNotes();
