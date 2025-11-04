// ---- TABS ----
const tabs = document.querySelectorAll(".tab");
const panels = {
  books: document.getElementById("booksPanel"),
  quotes: document.getElementById("quotesPanel"),
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.dataset.tab;
    Object.values(panels).forEach((p) => p.classList.remove("active"));
    panels[target].classList.add("active");
  });
});

// ---- BOOKS ----
const booksList = document.getElementById("booksList");

// 1) load from localStorage (if exists)
function loadBooksFromStorage() {
  const saved = localStorage.getItem("books");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not parse saved books, using defaults.");
    }
  }
  // fallback sample data
  return [
    { title: "A little book", status: "Reading", rating: 10 },
    { title: "A", status: "Completed", rating: 9 },
    { title: "dsfsdf", status: "To Read", rating: 4 },
    { title: "dsfsdf", status: "To Read", rating: 6 },
  ];
}

// this is our main data
let books = loadBooksFromStorage();

// 2) save to localStorage
function saveBooksToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function renderBooks() {
  booksList.innerHTML = "";
  books.forEach((book, idx) => {
    const row = document.createElement("div");
    row.className = "book-row";

    // index
    const index = document.createElement("div");
    index.className = "book-index";
    index.textContent = idx + 1;

    // title
    const title = document.createElement("div");
    title.className = "book-title";
    title.textContent = book.title;

    // status select
    const status = document.createElement("select");
    status.className = "status-select";
    ["Reading", "Completed", "To Read"].forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if (book.status === opt) o.selected = true;
      status.appendChild(o);
    });
    status.addEventListener("change", (e) => {
      books[idx].status = e.target.value;
      saveBooksToStorage(); // save change
    });

    // rating (just display)
    const rating = document.createElement("div");
    rating.className = "rating";
    for (let i = 0; i < 10; i++) {
      const dot = document.createElement("div");
      dot.className = "rating-dot";
      if (i < book.rating) dot.classList.add("filled");
      rating.appendChild(dot);
    }

    // actions
    const actions = document.createElement("div");
    actions.className = "book-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn edit";
    editBtn.innerHTML = "✏";
    editBtn.title = "Edit (not implemented)";

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn delete";
    delBtn.innerHTML = "🗑";
    delBtn.title = "Delete";
    delBtn.addEventListener("click", () => {
      books.splice(idx, 1);
      saveBooksToStorage(); // save after delete
      renderBooks();
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    row.appendChild(index);
    row.appendChild(title);
    row.appendChild(status);
    row.appendChild(rating);
    row.appendChild(actions);

    booksList.appendChild(row);
  });
}

renderBooks();

// ---- ADD BOOK MODAL ----
const modalBackdrop = document.getElementById("modalBackdrop");
const addBookBtn = document.getElementById("addBookBtn");
const cancelModal = document.getElementById("cancelModal");
const saveBook = document.getElementById("saveBook");

addBookBtn.addEventListener("click", () => {
  modalBackdrop.classList.add("show");
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookStatus").value = "Reading";
});

cancelModal.addEventListener("click", () => {
  modalBackdrop.classList.remove("show");
});

saveBook.addEventListener("click", () => {
  const title = document.getElementById("bookTitle").value.trim();
  const status = document.getElementById("bookStatus").value;
  if (!title) return;
  books.push({ title, status, rating: 5 });
  saveBooksToStorage(); // save after add
  renderBooks();
  modalBackdrop.classList.remove("show");
});

// close modal if click outside
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) {
    modalBackdrop.classList.remove("show");
  }
});
