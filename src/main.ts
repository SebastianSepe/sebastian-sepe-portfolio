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
        profileTitle: "Perfil Profesional",
        educationTitle: "Educación",
        otherStudiesTitle: "Otros Estudios",
        experienceTitle: "Experiencia Laboral",
        skillsTitle: "Conocimientos Técnicos",
        footerText: "Presiona una opción para contactar",
        headerSubtitle: "QA Sr · Developer Jr"
    },
    en: {
        profileTitle: "Professional Profile",
        educationTitle: "Education",
        otherStudiesTitle: "Other Studies",
        experienceTitle: "Work Experience",
        skillsTitle: "Technical Skills",
        footerText: "Press an option to get in touch",
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
    renderExperience(data.experience);
    renderSkills(data.skills);
    renderEducation(data.education);
    renderOtherStudies(data.otherStudies);
    setupEmailIcon(data.contact.email);
    initScrollObserver();
}

function updateStaticTexts() {
    const t = translations[currentLang];

    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t.headerSubtitle;

    const profileTitle = document.getElementById('profile-title');
    if (profileTitle) profileTitle.textContent = t.profileTitle;

    const experienceTitle = document.getElementById('experience-title');
    if (experienceTitle) experienceTitle.textContent = t.experienceTitle;

    const skillsTitle = document.getElementById('skills-title');
    if (skillsTitle) skillsTitle.textContent = t.skillsTitle;

    const educationTitle = document.getElementById('education-title');
    if (educationTitle) educationTitle.textContent = t.educationTitle;

    const otherStudiesTitle = document.getElementById('other-studies-title');
    if (otherStudiesTitle) otherStudiesTitle.textContent = t.otherStudiesTitle;

    const footerText = document.getElementById('footer-text');
    if (footerText) footerText.textContent = t.footerText;

    document.documentElement.lang = currentLang;
}

function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    const toggleBtn = document.getElementById('lang-toggle') as HTMLButtonElement;
    if (toggleBtn) toggleBtn.textContent = currentLang.toUpperCase();
    loadCV();
}

document.getElementById('lang-toggle')!.addEventListener('click', toggleLanguage);

function renderProfile(profile: string[]) {
    const container = document.getElementById("profile")!;
    container.innerHTML = `
        <div class="profile-block">
            ${profile.map(p => `<p>${p}</p>`).join('')}
        </div>
    `;
}

function renderExperience(experience: Experience[]) {
    const container = document.getElementById("experience")!;
    container.innerHTML = `
        <div class="timeline">
            ${experience.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-left">
                        <span class="timeline-period">${exp.period}</span>
                    </div>
                    <div class="timeline-right">
                        <div class="timeline-company">${exp.company}</div>
                        <div class="timeline-role">${exp.role}</div>
                        <ul class="timeline-tasks">
                            ${exp.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSkills(skills: Skill[]) {
    const container = document.getElementById("skills")!;
    container.innerHTML = `
        <div class="skills-grid">
            ${skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level-text">${skill.level}%</span>
                    </div>
                    <div class="skill-bar-track">
                        <div class="skill-bar-fill" data-level="${skill.level}"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Animate bars after paint
    requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach(bar => {
            bar.style.width = (bar.dataset.level ?? '0') + '%';
        });
    });
}

function renderEducation(education: Education[]) {
    const container = document.getElementById("education")!;
    container.innerHTML = `
        <div class="edu-list">
            ${education.map(edu => `
                <div class="edu-item">
                    <div class="edu-institution">${edu.institution}</div>
                    <div class="edu-degree">${edu.degree}</div>
                    <div class="edu-period">${edu.period}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderOtherStudies(otherStudies: OtherStudy[]) {
    const container = document.getElementById("other-studies")!;
    container.innerHTML = `
        <div class="edu-list">
            ${otherStudies.map(study => `
                <div class="edu-item">
                    <div class="edu-institution">${study.course}</div>
                    <div class="edu-degree">${study.institution}</div>
                    <div class="edu-period">${study.period}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function setupEmailIcon(email: string) {
    const emailIcon = document.getElementById("email-icon");
    if (!emailIcon) return;

    emailIcon.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(email);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = email;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        showPopup("Email copiado · " + email);
    });
}

function showPopup(message: string) {
    const existing = document.getElementById('copy-popup');
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = 'copy-popup';
    popup.textContent = message;
    Object.assign(popup.style, {
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#17171d",
        color: "#ededf0",
        border: "1px solid #2c2c38",
        padding: "12px 20px",
        borderRadius: "8px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        zIndex: "1000",
        opacity: "0",
        transition: "opacity 0.2s ease",
        whiteSpace: "nowrap"
    });

    document.body.appendChild(popup);
    requestAnimationFrame(() => { popup.style.opacity = "1"; });

    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 200);
    }, 3000);
}

function initScrollObserver() {
    const sections = document.querySelectorAll<HTMLElement>('.fade-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(s => observer.observe(s));

    // Show nav name only when hero scrolls out of view
    const heroContent = document.querySelector<HTMLElement>('.hero-content');
    const navName = document.querySelector<HTMLElement>('.nav-name');
    if (heroContent && navName) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                navName.classList.toggle('nav-name--visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        heroObserver.observe(heroContent);
    }
}

loadCV();

