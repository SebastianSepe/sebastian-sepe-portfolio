interface Experience {
    company: string;
    role: string;
    period: string;
    tasks: string[];
}

interface Skill {
    name: string;
    level: number;
}

interface Education {
    institution: string;
    degree: string;
    period: string;
}

interface OtherStudy {
    course: string;
    institution: string;
    period: string;
}

interface CVData {
    profile: string[];
    education: Education[];
    otherStudies: OtherStudy[];
    experience: Experience[];
    skills: Skill[];
    contact: {
        email: string;
    };
}

const translations = {
    es: {
        profileTitle: "PERFIL PROFESIONAL",
        educationTitle: "EDUCACIÓN",
        otherStudiesTitle: "OTROS ESTUDIOS",
        experienceTitle: "EXPERIENCIA LABORAL",
        skillsTitle: "CONOCIMIENTOS TÉCNICOS",
        contactTitle: "CONTACTO",
        footerText: "¡Presiona una opción para contactar!",
        headerSubtitle: "QA Sr · Developer Jr"
    },
    en: {
        profileTitle: "PROFESSIONAL PROFILE",
        educationTitle: "EDUCATION",
        otherStudiesTitle: "OTHER STUDIES",
        experienceTitle: "WORK EXPERIENCE",
        skillsTitle: "TECHNICAL SKILLS",
        contactTitle: "CONTACT",
        footerText: "Press one option to contact!",
        headerSubtitle: "QA Sr · Developer Jr"
    }
};

let currentLang: 'es' | 'en' = 'es';

async function loadCV() {
    const response = await fetch("data.json");
    const allData = await response.json();
    const data: CVData = allData[currentLang];

    updateStaticTexts();
    renderProfile(data.profile);
    renderEducation(data.education);
    renderOtherStudies(data.otherStudies);
    renderExperience(data.experience);
    renderSkills(data.skills);
    setupEmailIcon(data.contact.email);
}

function updateStaticTexts() {
    const trans = translations[currentLang];
    document.querySelector('h2')!.textContent = trans.headerSubtitle;
    document.querySelector('section h3')!.textContent = trans.experienceTitle;
    document.querySelector('footer p')!.textContent = trans.footerText;
    document.documentElement.lang = currentLang;
}

function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    const toggleBtn = document.getElementById('lang-toggle') as HTMLButtonElement;
    toggleBtn.textContent = currentLang.toUpperCase();
    loadCV();
}

document.getElementById('lang-toggle')!.addEventListener('click', toggleLanguage);

function renderProfile(profile: string[]) {
    const container = document.getElementById("profile")!;
    container.innerHTML = '';

    const card = document.createElement("div");
    card.className = "profile-card";

    const frontTitle = translations[currentLang].profileTitle;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <h4>${frontTitle}</h4>
            </div>
            <div class="card-back">
                ${profile.map(text => `<p>${text}</p>`).join('')}
            </div>
        </div>
    `;

    container.appendChild(card);
}

function renderEducation(education: Education[]) {
    const container = document.getElementById("education")!;
    container.innerHTML = '';

    const card = document.createElement("div");
    card.className = "education-card";

    const frontTitle = translations[currentLang].educationTitle;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <h4>${frontTitle}</h4>
            </div>
            <div class="card-back">
                <div class="education-list">
                    ${education.map(edu => `
                        <div>
                            <strong>${edu.institution}</strong><br>
                            ${edu.degree}<br>
                            <small>${edu.period}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    container.appendChild(card);
}

function renderOtherStudies(otherStudies: OtherStudy[]) {
    const container = document.getElementById("other-studies")!;
    container.innerHTML = '';

    const card = document.createElement("div");
    card.className = "other-studies-card";

    const frontTitle = translations[currentLang].otherStudiesTitle;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <h4>${frontTitle}</h4>
            </div>
            <div class="card-back">
                ${otherStudies.map(study => `
                    <div>
                        <strong>${study.course}</strong><br>
                        ${study.institution}<br>
                        <small>${study.period}</small>
                    </div>
                `).join('<hr>')}
            </div>
        </div>
    `;

    container.appendChild(card);
}

function renderExperience(experience: Experience[]) {
    const container = document.getElementById("experience")!;
    container.innerHTML = '';

    experience.forEach((exp) => {
        const card = document.createElement("div");
        card.className = "experience-card";

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <h4>${exp.company}</h4>
                    <h2>${exp.role}</h2>
                    <small>${exp.period}</small>
                </div>
                <div class="card-back">
                    <ul>
                        ${exp.tasks.map((task) => `<li>${task}</li>`).join("")}
                    </ul>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    console.log("Experiences rendered with flip effect");
}

function renderSkills(skills: Skill[]) {
    const container = document.getElementById("skills")!;
    container.innerHTML = '';

    const card = document.createElement("div");
    card.className = "skills-card";

    const frontTitle = translations[currentLang].skillsTitle;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <h4>${frontTitle}</h4>
            </div>
            <div class="card-back">
                <div class="skills-grid">
                    ${skills.map(skill => `
                        <div>
                            ${skill.name}
                            <div class="bar">
                                <span data-level="${skill.level}"></span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    container.appendChild(card);

    document.querySelectorAll<HTMLElement>(".bar span").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
    });
}

function setupEmailIcon(email: string) {
    const emailIcon = document.getElementById("email-icon") as HTMLElement;
    if (emailIcon) {
        emailIcon.style.fontSize = "24px";
        emailIcon.style.cursor = "pointer";
        emailIcon.style.color = "var(--primary)";
        emailIcon.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(email);
                showPopup("Email copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy: ", err);
                const textArea = document.createElement("textarea");
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                showPopup("Email copied to clipboard!");
            }
        });
    }
}

function showPopup(message: string) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "var(--card)";
    popup.style.color = "var(--primary)";
    popup.style.border = "2px solid var(--primary)";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 20px rgba(0, 255, 204, 0.5)";
    popup.style.fontFamily = "'Press Start 2P', cursive";
    popup.style.fontSize = "12px";
    popup.style.zIndex = "1000";
    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 5000);
}

loadCV();
