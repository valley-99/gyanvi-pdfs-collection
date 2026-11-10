let data = null;
const app = document.getElementById('app');
const categoryList = document.getElementById('category-list');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menu-btn');

// Mobile Menu Toggle
menuBtn.onclick = () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
};

overlay.onclick = () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
};

// Load Data
fetch('data.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    renderSidebar();
  })
  .catch(err => {
    app.innerHTML = '<p style="color:#ef4444;">Error loading data. Please refresh.</p>';
  });

// Render Sidebar
function renderSidebar() {
  categoryList.innerHTML = '';
  data.categories.forEach((cat, index) => {
    const li = document.createElement('li');
    li.className = 'category-item';
    li.innerHTML = `
      <span>✨ ${cat.name}</span>
      <span class="cat-count">${cat.files.length}</span>
    `;
    li.onclick = () => {
      document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      }
      
      renderFiles(index, cat.name);
    };
    categoryList.appendChild(li);
  });
}

// Render File List
function renderFiles(catIndex, catName) {
  const cat = data.categories[catIndex];
  app.innerHTML = '';

  const title = document.createElement('h2');
  title.className = 'page-title animate-pop';
  title.innerHTML = `📂 ${catName}`;
  app.appendChild(title);

  if (cat.files.length === 0) {
    app.innerHTML += `<p style="color:#94a3b8; font-size: 1.2rem;">Is category mein abhi documents upload nahi hue hain.</p>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'file-grid';

  cat.files.forEach((file, i) => {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.style.animationDelay = `${i * 0.08}s`; 
    card.innerHTML = `
      <span class="file-icon">📄</span>
      <span class="file-title">${file.title}</span>
    `;
    card.onclick = () => renderViewer(file, catIndex, catName);
    grid.appendChild(card);
  });

  app.appendChild(grid);
}

// Render PDF Viewer
function renderViewer(file, catIndex, catName) {
  app.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'viewer-header animate-pop';
  const isMobile = window.innerWidth <= 768;

  header.innerHTML = `
    <button class="back-btn" id="backBtn">← Back to Files</button>
    ${!isMobile ? `<a href="${file.file}" target="_blank" style="color:#06b6d4; font-weight:600; text-decoration:none;">↗ Open in New Tab</a>` : ''}
  `;
  app.appendChild(header);

  const container = document.createElement('div');
  container.className = 'pdf-container animate-pop';
  
  if (isMobile) {
    container.innerHTML = `
      <a href="${file.file}" target="_blank" class="mobile-pdf-btn">🚀 Open / Download PDF</a>
      <p style="text-align:center; color:#94a3b8; font-size:0.9rem; padding: 0 20px; line-height: 1.5;">Mobile device par PDF ko full screen me padhne ke liye upar wale button par click karein.</p>
    `;
  } else {
    container.innerHTML = `<iframe src="${file.file}#toolbar=1"></iframe>`;
  }
  
  app.appendChild(container);

  document.getElementById('backBtn').onclick = () => renderFiles(catIndex, catName);
}