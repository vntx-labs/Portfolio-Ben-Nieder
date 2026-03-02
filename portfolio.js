const PROJECTS = [
  {
    id: 1,
    title: "Privater Finanz-Tracker (Web-Demo)",
    description: "Desktop-App (Electron) zur Haushaltsverwaltung, umgebaut zur Web-Demo mit LocalStorage. Zeigt Login, Budgetierung und Transaktionsverwaltung.",
    screenshot: "img/finanztracker.png",
    liveUrl: "Finanz-Tracker-Demo/index.html",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1jfd5TEIRjK1lPOXpUrhTXqLLWQdghilf",
    techTags: ["Electron", "Node.js", "JavaScript", "Tailwind CSS"]
  },
  {
    id: 2,
    title: "BlogConnect",
    description: "Eine moderne, reaktionsschnelle Blog-Plattform (SPA) mit vollständigem Content Management System (CRUD) für Posts und Kommentare. Beinhaltet eine Benutzerauthentifizierung, Tag-Filterung, einen personalisierten Feed sowie eine Author-Follow-Funktion. (Bei Klick auf Live Demo kann es bis zu 1 Minute dauern bis der Render-Dienst aufwacht)",
    screenshot: "img/blogconnect.png",
    liveUrl: "https://tinyurl.com/BlogConnect",
    downloadUrl: "",
    techTags: ["JavaScript (Vanilla)", "HTML5", "Tailwind CSS", "SPA", "Node.js (Impl. API)"]
  },
  {
    id: 3,
    title: "Zentrale Einkaufsliste",
    description: "Eine Android-App zur Verwaltung von Einkaufslisten. Unterstützt automatische Mengenzusammenführung, Live-Updates, Artikelkategorien und ein einfaches UI mit Checkboxen zum Abhaken von Artikeln. Alles läuft offline mit Room-Datenbank und MVVM-Architektur.",
    screenshot: "img/zentraleeinkaufsliste.png",
    liveUrl: "Zentrale Einkaufsliste Demo",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1z9tL0imNCx0H3_V9DhkTYg82O0NXKw1j",
    techTags: ["Java", "Android Studio", "Room Database", "MVVM", "LiveData", "RecyclerView", "ViewBinding"]
  }
];

const projectCardsContainer = document.getElementById('projectCardsContainer');

function renderSingleProject(index, zaehler) {
  const project = PROJECTS[index];
  projectCardsContainer.innerHTML = `
    <div class="card active p-8 rounded-xl shadow-lg border-t-4 border-blue-600 dark:border-blue-500 text-center">
      <img src="${project.screenshot}" alt="${project.title}" class="mb-6">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${project.title}</h3>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">${project.description}</p>
      <div class="flex flex-wrap justify-center gap-2 pt-2 mb-4">
        ${project.techTags.map(tag=>`
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">${tag}</span>
        `).join('')}
      </div>
      <div class="flex justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4 mb-4">
        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition text-sm">Live Demo 🌐</a>` : ""}
        ${project.downloadUrl ? `<a href="${project.downloadUrl}" target="_blank" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition text-sm">Download 💾</a>` : ""}
      </div>
      <div class="indicators mb-4"></div>
      <div class="controls mt-2 flex justify-center gap-4">
        <button class="prev bg-gray-200 px-3 py-1">Zurück</button>
        <button class="pause bg-gray-200 px-3 py-1">Stopp</button>
        <button class="next bg-gray-200 px-3 py-1">Nächstes</button>
        <label class="zaehler bg-gray-200 px-3 py-1">Noch <span id="zaehler">${zaehler}</span> Sekunden bis zum nächsten Projekt</label>
      </div>
    </div>
  `;
  applySlimIfNeeded(project);
}

function applySlimIfNeeded(project) {
  const card = projectCardsContainer.querySelector('.card');
  if (!card) return;
  const img = card.querySelector('img');
  const src = img ? img.getAttribute('src') || '' : '';
  const isEinkauf = /zentraleeinkaufsliste/i.test(src);

  if (isEinkauf) {
    card.classList.add('slim');

    // dynamisch Breite auf +20% setzen (begrenzen auf 95vw)
    const parentWidth = document.documentElement.clientWidth;
    const currentWidth = card.getBoundingClientRect().width || Math.min(parentWidth * 0.8, parseFloat(getComputedStyle(card).maxWidth) || parentWidth * 0.8);
    const target = Math.min(parentWidth * 0.95, Math.round(currentWidth * 1.2));
    card.style.width = target + 'px';
  } else {
    card.classList.remove('slim');
    card.style.width = ''; // zurücksetzen auf CSS-Default
  }
}

function initCarousel() {
  let currentIndex = 0;
  let interval = null;
  let countdownInterval = null;
  let isPaused = false;
  let zaehler = 60; // Sekunden bis zum nächsten Projekt

  function updateZaehlerLabel() {
    const zaehlerSpan = document.getElementById('zaehler');
    if (zaehlerSpan) zaehlerSpan.textContent = zaehler;
  }

  function startIntervals() {
    clearInterval(interval);
    clearInterval(countdownInterval);
    interval = setInterval(nextProject, 60000);
    countdownInterval = setInterval(() => {
      if (!isPaused) {
        zaehler--;
        updateZaehlerLabel();
        if (zaehler <= 0) zaehler = 60;
      }
    }, 1000);
  }

  function nextProject() {
    currentIndex = (currentIndex+1) % PROJECTS.length;
    zaehler = 60;
    renderSingleProject(currentIndex, zaehler);
    updateZaehlerLabel();
  }
  function prevProject() {
    currentIndex = (currentIndex-1+PROJECTS.length) % PROJECTS.length;
    zaehler = 60;
    renderSingleProject(currentIndex, zaehler);
    updateZaehlerLabel();
  }

  renderSingleProject(currentIndex, zaehler);
  startIntervals();

  projectCardsContainer.addEventListener('click', e=>{
    if(e.target.classList.contains('next')) {
      nextProject();
      zaehler = 60;
      updateZaehlerLabel();
    }
    if(e.target.classList.contains('prev')) {
      prevProject();
      zaehler = 60;
      updateZaehlerLabel();
    }
    if(e.target.classList.contains('pause')){
      if(isPaused){
        startIntervals();
        e.target.textContent="Stopp";
      } else {
        clearInterval(interval);
        clearInterval(countdownInterval);
        e.target.textContent="Start";
      }
      isPaused=!isPaused;
    }
  });
}

document.addEventListener('DOMContentLoaded', initCarousel);