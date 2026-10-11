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
    downloadUrl: "https://drive.google.com/uc?export=download&id=1kDhrEdGKTPVD9hM74f66MxWKVFAMYAWD",
    techTags: ["Java", "Android Studio", "Room Database", "MVVM", "LiveData", "RecyclerView", "ViewBinding"]
  }
];

const projectCardsContainer = document.getElementById("projectCardsContainer");
const modal = document.getElementById("projectModal");
const modalContent = document.getElementById("modalContent");

function renderProjects() {

    projectCardsContainer.innerHTML = PROJECTS.map(project => `

        <div
            class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer group"
            data-id="${project.id}">

            <img
                src="${project.screenshot}"
                alt="${project.title}"
                class="w-full h-56"

            <div class="p-6">

                <h3 class="text-2xl font-bold mb-3 dark:text-white">

                    ${project.title}

                </h3>

                <p class="text-gray-600 dark:text-gray-400 line-clamp-3">

                    ${project.description}

                </p>

                <div class="flex flex-wrap gap-2 mt-5">

                    ${project.techTags.map(tag=>`

                        <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold">

                            ${tag}

                        </span>

                    `).join("")}

                </div>

            </div>

        </div>

    `).join("");

}

function openProject(id){

    const project = PROJECTS.find(p=>p.id==id);

    modalContent.innerHTML=`

        <img
            src="${project.screenshot}"
            class="w-full h-80 object-cover">

        <div class="p-8">

            <div class="flex justify-between items-start">

                <h2 class="text-3xl font-bold dark:text-white">

                    ${project.title}

                </h2>

                <button
                    id="closeModal"
                    class="text-4xl text-gray-500 hover:text-red-500">

                    &times;

                </button>

            </div>

            <p class="mt-6 text-lg text-gray-600 dark:text-gray-300">

                ${project.description}

            </p>

            <div class="flex flex-wrap gap-2 mt-8">

                ${project.techTags.map(tag=>`

                    <span class="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">

                        ${tag}

                    </span>

                `).join("")}

            </div>

            <div class="flex gap-4 mt-10">

                ${project.liveUrl ? `

                    <a
                        href="${project.liveUrl}"
                        target="_blank"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">

                        🌐 Live Demo

                    </a>

                ` : ""}

                ${project.downloadUrl ? `

                    <a
                        href="${project.downloadUrl}"
                        target="_blank"
                        class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl">

                        💾 Download

                    </a>

                ` : ""}

            </div>

        </div>

    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    document.getElementById("closeModal").onclick = closeModal;

}

function closeModal(){

    modal.classList.remove("flex");
    modal.classList.add("hidden");

}

projectCardsContainer.addEventListener("click", e=>{

    const card = e.target.closest("[data-id]");

    if(!card) return;

    openProject(card.dataset.id);

});

modal.addEventListener("click", e=>{

    if(e.target===modal){

        closeModal();

    }

});

document.addEventListener("keydown", e=>{

    if(e.key==="Escape"){

        closeModal();

    }

});

document.addEventListener("DOMContentLoaded", renderProjects);
