const noteModal = document.getElementById("noteModal");
const addNoteBtn = document.getElementById("addNoteBtn");
const closeModal = document.getElementById("closeModal");
const saveNoteBtn = document.getElementById("saveNoteBtn");

const noteTitle = document.getElementById("noteTitle");
const noteDescription = document.getElementById("editor");
const notesGrid = document.getElementById("notesGrid");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentFolder = "All";

addNoteBtn.addEventListener("click", () => {
  noteModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  noteModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === noteModal) {
    noteModal.style.display = "none";
  }
});

const folderButtons = document.querySelectorAll(".folders button");
folderButtons.forEach(button => {
  button.addEventListener("click", () => {
    folderButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    currentFolder = button.getAttribute("data-folder");
    renderNotes(currentFolder);
  });
});

saveNoteBtn.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const description = noteDescription.innerHTML.trim();
  const folder = document.getElementById("note-folder").value;

  if (title && description) {
    notes.push({ title, description, folder });
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes(currentFolder);
    noteTitle.value = "";
    noteDescription.innerHTML = "";
    noteModal.style.display = "none";
  } else {
    alert("Please fill in both fields.");
  }
});

function renderNotes(folder = "All") {
  notesGrid.innerHTML = "";

  const filteredNotes = folder === "All"
    ? notes
    : notes.filter(note => note.folder === folder);

  filteredNotes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note-card";

card.innerHTML = `
  <strong>${note.title}</strong><br>
  <div class="note-description">${note.description}</div>
  <div class="note-actions">
    <button class="edit-note" data-index="${index}">
      <span class="material-symbols-outlined">edit</span>
    </button>
    <button class="remove-note" data-index="${index}">
      <span class="material-symbols-outlined">delete</span>
    </button>
    <button class="add-note" data-index="${index}">
      <span class="material-symbols-outlined">add</span>
    </button>
  </div>
`;
 

    notesGrid.appendChild(card);
  });
}

notesGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-note")) {
    const idx = parseInt(e.target.dataset.index);
    notes.splice(idx, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes(currentFolder);
  }
  if (e.target.classList.contains("add-note")) {
    const idx = parseInt(e.target.dataset.index);
    const noteToClone = notes[idx];
    const newNote = {
      title: noteToClone.title + " (copy)",
      description: noteToClone.description,
      folder: noteToClone.folder
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes(currentFolder);
  }
});

notesGrid.addEventListener("change", (e) => {
  if (e.target.classList.contains("select-note")) {
    const idx = parseInt(e.target.dataset.index);
    notes[idx].selected = e.target.checked;
    // You can do something with this selected property if needed
  }
});

function searchNotes() {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const noteCards = document.querySelectorAll('.note-card');

  noteCards.forEach(card => {
    const title = card.querySelector('strong').textContent.toLowerCase();
    const description = card.querySelector('.note-description').textContent.toLowerCase();

    card.style.display = (title.includes(searchValue) || description.includes(searchValue)) ? "block" : "none";
  });
}

document.getElementById("search").addEventListener("input", searchNotes);
document.getElementById("search-button").addEventListener("click", searchNotes);

function clearLocalStorage() {
  localStorage.clear();
  location.reload();
}

// Theme toggle setup
const themeToggleBtn = document.getElementById('theme-toggle');

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Toolbar formatting buttons
const toolbar = document.querySelector('.toolbar');
const editor  = document.getElementById('editor');

toolbar.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const cmd = btn.dataset.cmd;
  document.execCommand(cmd, false, null);
  updateToolbarState();
});

editor.addEventListener('keyup', updateToolbarState);
editor.addEventListener('mouseup', updateToolbarState);

function updateToolbarState() {
  toolbar.querySelectorAll('button').forEach(btn => {
    const cmd = btn.dataset.cmd;
    if (document.queryCommandState(cmd)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
updateToolbarState();

// Initial render
renderNotes(currentFolder);
