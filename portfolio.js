const PROJECTS = [
  {
    id: 1,
    title: "Privater Finanz-Tracker (Web-Demo)",
    description: "Desktop-App (Electron) zur Haushaltsverwaltung, umgebaut zur Web-Demo mit LocalStorage. Zeigt Login, Budgetierung und Transaktionsverwaltung.",
    screenshot: "img/finanztracker.png",
    liveUrl: "Finanz-Tracker-Demo/index.html",
    downloadUrl: "",
    techTags: ["Electron", "Node.js", "JavaScript", "Tailwind CSS"]
  },
  {
    id: 2,
    title: "BlogConnect",
    description: "Eine moderne, reaktionsschnelle Blog-Plattform (SPA) mit vollständigem Content Management System (CRUD) für Posts und Kommentare. Beinhaltet eine Benutzerauthentifizierung, Tag-Filterung, einen personalisierten Feed sowie eine Author-Follow-Funktion. (Bei Klick auf Live Demo kann es bis zu 1 Minute dauern bis der Render-Dienst aufwacht)",
    screenshot: "img/blogconnect.png",
    liveUrl: "https://tinyurl.com",
    downloadUrl: "",
    techTags: ["JavaScript (Vanilla)", "HTML5", "Tailwind CSS", "SPA", "Node.js (Impl. API)"]
  },
  {
    id: 3,
    title: "Zentrale Einkaufsliste",
    description: "Eine Android-App zur Verwaltung von Einkaufslisten. Unterstützt automatische Mengenzusammenführung, Live-Updates, Artikelkategorien und ein einfaches UI mit Checkboxen zum Abhaken von Artikeln. Alles läuft offline mit Room-Datenbank und MVVM-Architektur.",
    screenshot: "img/zentraleeinkaufsliste.png",
    liveUrl: "Zentrale Einkaufsliste Demo",
    downloadUrl: "https://google.com",
    techTags: ["Java", "Android Studio", "Room Database", "MVVM", "LiveData", "RecyclerView", "ViewBinding"]
  }
];

const projectCardsContainer = document.getElementById("projectCardsContainer");
const modal = document.getElementById("projectModal");
const modalContent = document.getElementById("modalContent");

function renderProjects() {
    projectCardsContainer.innerHTML = PROJECTS.map(project => `
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer group flex flex-col h-full"
            data-id="${project.id}">

            <!-- Bild-Container mit modernem, weichgezeichnetem Hintergrund-Effekt für alle Bildgrößen -->
            <div class="relative w-full h-56 bg-gray-100 dark:bg-gray-900/60 overflow-hidden flex justify-center items-center">
                <div 
                    class="absolute inset-0 bg-cover bg-center blur-md opacity-20 scale-110 pointer-events-none"
                    style="background-image: url('${project.screenshot}')">
                </div>
                <img
                    src="${project.screenshot}"
                    alt="${project.title}"
                    class="relative z-10 h-full w-auto max-w-full object-contain p-2 transition duration-300 group-hover:scale-105" 
                />
            </div>

            <!-- Inhalts-Bereich -->
            <div class="p-6 flex flex-col flex-grow justify-between">
                <div>
                    <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        ${project.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        ${project.description}
                    </p>
                </div>

                <!-- Tech Tags -->
                <div class="flex flex-wrap gap-1.5 mt-auto">
                    ${project.techTags.map(tag => `
                        <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[11px] font-medium tracking-wide">
                            \${tag}
                        </span>
                    `).join("")}
                </div>
            </div>
        </div>
    `).join("");
}

function openProject(id) {
    const project = PROJECTS.find(p => p.id == id);
    if (!project) return;

    modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 max-h-[85vh] overflow-y-auto">
            
            <!-- Linke Spalte: Der Screenshot als elegantes Smartphone-Mockup zentriert -->
            <div class="md:col-span-5 w-full bg-gray-100/50 dark:bg-gray-900/40 rounded-2xl flex justify-center items-center p-6 min-h-[400px] md:min-h-[520px]">
                <div class="relative max-w-[240px] w-full aspect-[9/19] rounded-[2.5rem] ring-4 ring-gray-300 dark:ring-gray-700 overflow-hidden shadow-2xl bg-black flex justify-center items-center">
                    <img
                        src="${project.screenshot}"
                        alt="${project.title}"
                        class="w-full h-full object-cover image-render-crisp" 
                    />
                </div>
            </div>
            
            <!-- Rechte Spalte: Die Projektdetails -->
            <div class="md:col-span-7 flex flex-col justify-between py-2">
                <div>
                    <div class="flex justify-between items-start gap-4">
                        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            ${project.title}
                        </h2>
                        <button
                            id="closeModal"
                            class="text-3xl text-gray-400 hover:text-red-500 transition p-1 leading-none"
                            aria-label="Schließen">
                            &times;
                        </button>
                    </div>

                    <p class="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        ${project.description}
                    </p>

                    <!-- Tech Tags (Fehler mit Backslash komplett behoben!) -->
                    <div class="flex flex-wrap gap-2 mt-6">
                        ${project.techTags.map(tag => `
                            <span class="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide">
                                \${tag}
                            </span>
                        `).join("")}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3 mt-8">
                    ${project.liveUrl ? `
                        <a
                            href="\${project.liveUrl}"
                            target="_blank"
                            class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition shadow-md hover:shadow-lg">
                            🌐 Live Demo
                        </a>
                    ` : ""}

                    ${project.downloadUrl ? `
                        <a
                            href="\${project.downloadUrl}"
                            target="_blank"
                            class="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-xl text-sm transition shadow-md hover:shadow-lg">
                            💾 Download
                        </a>
                    ` : ""}
                </div>
            </div>

        </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    document.getElementById("closeModal").onclick = closeModal;
}

function closeModal() {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
}

projectCardsContainer.addEventListener("click", e => {
    const card = e.target.closest("[data-id]");
    if (!card) return;
    openProject(card.dataset.id);
});

modal.addEventListener("click", e => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeModal();
    }
});

document.addEventListener("DOMContentLoaded", renderProjects);
