/* ========================================================
   Gestion de Bibliothèque – script.js
   ======================================================== */

// ─── STATE ────────────────────────────────────────────────
let books        = [];
let editingIndex = -1;

// ─── INIT ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadXML();

  // Recherche en temps réel sur les 3 champs (keyup)
  document.getElementById('search-title') .addEventListener('keyup', filterBooks);
  document.getElementById('search-author').addEventListener('keyup', filterBooks);
  document.getElementById('search-year')  .addEventListener('keyup', filterBooks);
});

// ─── CHARGEMENT XML ───────────────────────────────────────
function loadXML() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'books.xml', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      parseXML(xhr.responseXML);
    } else {
      console.warn('books.xml introuvable.');
    }
  };

  xhr.onerror = function () {
    console.warn('Erreur réseau – utilisez un serveur local (ex: Live Server).');
  };

  xhr.send();
}

function parseXML(xmlDoc) {
  books = [];
  Array.from(xmlDoc.getElementsByTagName('book')).forEach(node => {
    books.push({
      title:  getText(node, 'title'),
      author: getText(node, 'author'),
      year:   getText(node, 'year'),
      price:  getText(node, 'price'),
      cover:  getText(node, 'cover'),
    });
  });
  renderTable(books);
}

function getText(node, tag) {
  const el = node.getElementsByTagName(tag)[0];
  return el ? el.textContent.trim() : '';
}

// ─── RENDU DU TABLEAU ─────────────────────────────────────
function renderTable(list) {
  const tbody = document.getElementById('books-tbody');
  const empty = document.getElementById('empty-msg');
  tbody.innerHTML = '';

  if (list.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.forEach(book => {
    const realIndex = books.indexOf(book);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(book.title)}</td>
      <td>${escapeHtml(book.author)}</td>
      <td>${escapeHtml(book.year)}</td>
      <td>${escapeHtml(book.price)}</td>
      <td>
        <div class="actions">
          <button class="btn btn-voir"      onclick="viewBook(${realIndex})">Voir</button>
          <button class="btn btn-modifier"  onclick="editBook(${realIndex})">Modifier</button>
          <button class="btn btn-supprimer" onclick="deleteBook(${realIndex})">Supprimer</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ─── RECHERCHE / FILTRE ───────────────────────────────────
function filterBooks() {
  const qTitle  = document.getElementById('search-title') .value.trim().toLowerCase();
  const qAuthor = document.getElementById('search-author').value.trim().toLowerCase();
  const qYear   = document.getElementById('search-year')  .value.trim();

  const filtered = books.filter(b =>
    b.title .toLowerCase().includes(qTitle)  &&
    b.author.toLowerCase().includes(qAuthor) &&
    b.year  .includes(qYear)
  );

  renderTable(filtered);
}

// ─── VOIR (MODAL) ─────────────────────────────────────────
function viewBook(index) {
  const b = books[index];
  document.getElementById('modal-title') .textContent = b.title;
  document.getElementById('modal-author').textContent = b.author;
  document.getElementById('modal-year')  .textContent = b.year;
  document.getElementById('modal-price') .textContent = b.price;

  const img = document.getElementById('modal-img');
  img.src   = b.cover || '';
  img.style.display = b.cover ? 'block' : 'none';

  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── MODIFIER ─────────────────────────────────────────────
function editBook(index) {
  const b = books[index];
  editingIndex = index;

  document.getElementById('f-title') .value = b.title;
  document.getElementById('f-author').value = b.author;
  document.getElementById('f-year')  .value = b.year;
  document.getElementById('f-price') .value = b.price;
  document.getElementById('f-cover') .value = b.cover;

  document.getElementById('submit-btn').textContent   = 'Modifier';
  document.getElementById('cancel-btn').style.display = 'inline-block';

  document.querySelector('.form-fields').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  editingIndex = -1;
  resetForm();
}

// ─── SOUMETTRE (AJOUT / MODIFICATION) ─────────────────────
function submitForm() {
  const title  = document.getElementById('f-title') .value.trim();
  const author = document.getElementById('f-author').value.trim();
  const year   = document.getElementById('f-year')  .value.trim();
  const price  = document.getElementById('f-price') .value.trim();
  const cover  = document.getElementById('f-cover') .value.trim();

  if (!title || !author || !year || !price) {
    alert('Veuillez remplir les champs : Titre, Auteur, Année et Prix.');
    return;
  }

  const bookData = { title, author, year, price, cover };

  if (editingIndex >= 0) {
    books[editingIndex] = bookData;
  } else {
    books.push(bookData);
  }

  resetForm();
  filterBooks(); // re-applique le filtre actif après ajout/modif
}

function resetForm() {
  ['f-title','f-author','f-year','f-price','f-cover'].forEach(id => {
    document.getElementById(id).value = '';
  });
  editingIndex = -1;
  document.getElementById('submit-btn').textContent   = 'Ajouter';
  document.getElementById('cancel-btn').style.display = 'none';
}

// ─── SUPPRIMER ────────────────────────────────────────────
function deleteBook(index) {
  if (!confirm(`Supprimer « ${books[index].title} » ?`)) return;
  if (editingIndex === index) cancelEdit();
  books.splice(index, 1);
  filterBooks();
}

// ─── UTILITAIRE ───────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
