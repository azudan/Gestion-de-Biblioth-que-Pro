/* ========================================================
   Gestion de Bibliothèque – script.js
   Compétences évaluées :
     • Manipulation du DOM
     • Gestion des événements
     • CRUD en JavaScript
     • Chargement XML (XMLHttpRequest)
     • Logique applicative front-end
   ======================================================== */

// ─── STATE ───────────────────────────────────────────────
let books = [];        // tableau principal de données
let editingIndex = -1; // index du livre en cours de modification

// ─── INIT ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadXML();

  // Recherche en temps réel (keyup)
  document.getElementById('search-input')
    .addEventListener('keyup', filterBooks);
});

// ─── CHARGEMENT XML ───────────────────────────────────────
function loadXML() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'books.xml', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      parseXML(xhr.responseXML);
    } else {
      console.warn('books.xml introuvable – démarrage avec liste vide.');
      renderTable(books);
    }
  };

  xhr.onerror = function () {
    // Sur file://, XMLHttpRequest échoue – on charge des données démo
    console.warn('Erreur réseau – données démo chargées.');
    loadDemoData();
  };

  xhr.send();
}

function parseXML(xmlDoc) {
  const bookNodes = xmlDoc.getElementsByTagName('book');
  books = [];

  Array.from(bookNodes).forEach(node => {
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

// Données démo si books.xml inaccessible (ouverture directe sans serveur)
function loadDemoData() {
  books = [
    { title: 'JavaScript Avancé',  author: 'Tuteur Mouhamed M. Diouf', year: '2020', price: '5000 FCFA', cover: 'images/js-avance.png' },
    { title: 'Apprendre le DOM',   author: 'Tuteur Mouhamed M. Diouf', year: '2022', price: '7000 FCFA', cover: 'images/dom.jpg' },
    { title: 'Maîtriser les Événements JavaScript', author: 'Khadim DIOP', year: '2024', price: '6000 FCFA', cover: 'images/khadim-diop.png' },
    { title: 'Algorithmes et Structures de Données', author: 'Azubuike Daniel EZEADIM', year: '2024', price: '8500 FCFA', cover: 'images/azubuike-ezeadim.png' },
    { title: 'Développement Web Moderne avec HTML5', author: 'Abdallah NDIAYE', year: '2023', price: '7500 FCFA', cover: 'images/abdallah-ndiaye.png' },
    { title: 'Introduction au XML et aux Web Services', author: 'Yero Gallo SENE', year: '2023', price: '6500 FCFA', cover: 'images/yerogallo-sene.png' },
    { title: 'CSS3 Avancé et Design Responsive', author: 'Mouhamadou Lamine Bamba THIAM', year: '2024', price: '7000 FCFA', cover: 'images/laminebamba-thiam.png' },
    { title: 'Gestion de Projets Web et Bases de Données', author: 'Saïkou Oumar THIOUNE', year: '2024', price: '9000 FCFA', cover: 'images/saikou-thioune.png' },
  ];
  renderTable(books);
}

// ─── RENDU DU TABLEAU ─────────────────────────────────────
function renderTable(list) {
  const tbody  = document.getElementById('books-tbody');
  const empty  = document.getElementById('empty-msg');
  tbody.innerHTML = '';

  if (list.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.forEach((book) => {
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
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const filtered = query
    ? books.filter(b =>
     b.title .toLowerCase().includes(query) ||
     b.author.toLowerCase().includes(query) ||
     b.year  .includes(query)
   ) : books;
  renderTable(filtered);
}

// ─── VOIR (MODAL) ─────────────────────────────────────────
function viewBook(index) {
  const b = books[index];

  document.getElementById('modal-title').textContent  = b.title;
  document.getElementById('modal-author').textContent = b.author;
  document.getElementById('modal-year').textContent   = b.year;
  document.getElementById('modal-price').textContent  = b.price;

  const img = document.getElementById('modal-img');
  img.src   = b.cover || 'https://placehold.co/160x220?text=No+Cover';;
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

  document.getElementById('f-title').value  = b.title;
  document.getElementById('f-author').value = b.author;
  document.getElementById('f-year').value   = b.year;
  document.getElementById('f-price').value  = b.price;
  document.getElementById('f-cover').value  = b.cover;

  // Le titre du formulaire reste "Ajouter un livre" (conforme aux captures)
  // mais le bouton change pour indiquer la sauvegarde
  document.getElementById('submit-btn').textContent = 'Modifier';
  document.getElementById('cancel-btn').style.display = 'inline-block';

  document.querySelector('.form-fields').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  editingIndex = -1;
  resetForm();
}

// ─── SOUMETTRE (AJOUT / MODIFICATION) ────────────────────
function submitForm() {
  const title  = document.getElementById('f-title').value.trim();
  const author = document.getElementById('f-author').value.trim();
  const year   = document.getElementById('f-year').value.trim();
  const price  = document.getElementById('f-price').value.trim();
  const cover  = document.getElementById('f-cover').value.trim();

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

  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const list  = query ? books.filter(b => b.title.toLowerCase().includes(query)) : books;
  renderTable(list);
}

function resetForm() {
  ['f-title', 'f-author', 'f-year', 'f-price', 'f-cover'].forEach(id => {
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

  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const list  = query ? books.filter(b => b.title.toLowerCase().includes(query)) : books;
  renderTable(list);
}

// ─── UTILITAIRE ───────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
