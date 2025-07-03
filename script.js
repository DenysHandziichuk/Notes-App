const noteModal = document.getElementById("noteModal");
const addNoteBtn = document.getElementById("addNoteBtn");
const closeModal = document.getElementById("closeModal");
const saveNoteBtn = document.getElementById("saveNoteBtn");

const noteTitle = document.getElementById("noteTitle");
const noteDescription = document.getElementById("noteDescription");

addNoteBtn.addEventListener("click", () => {
  noteModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  noteModal.style.display = "none";
});

let notes = JSON.parse(localStorage.getItem("notes")) || [];

saveNoteBtn.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const description = noteDescription.value.trim();

  if (title && description) {
    notes.push({ title, description });
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    noteTitle.value = "";
    noteDescription.value = "";
    noteModal.style.display = "none";
  } else {
    alert("Please fill in both fields.");
  }
});

function renderNotes() {
  notesGrid.innerHTML = "";
  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `<strong>${note.title}</strong> <br> <p>${note.description}</p>`;
    notesGrid.appendChild(card);
  });
}

function searchNotes() {
  const searchValue = document.getElementById("search");
  const noteCards = document.querySelectorAll('.note-card');

  noteCards.forEach(card => {
    if (noteTitle.includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}


function clearLocalStorage() {
  localStorage.clear()
  location.reload()
};