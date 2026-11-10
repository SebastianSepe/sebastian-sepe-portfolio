type Lang = 'es' | 'en';
type Tier = 'practice' | 'academic' | 'learning';

interface Job { company: string; role: string; period: string; tasks: string[]; highlight?: string }
interface Project {
    name: string; tagline: string; status: string; statusKey: string;
    context: string; problem: string; solution: string; role: string;
    tech: string[]; links: { label: string; url: string }[]; visual: string;
}
interface SkillGroup { title: string; items: { name: string; tier: Tier }[] }
interface Edu { institution: string; degree: string; period: string; note?: string }
interface Course { course: string; institution: string; period: string }

interface Data {
    ui: Record<string, string>;
    profile: string[];
    focus: string[];
    experience: Job[];
    projects: Project[];
    aiBlock: { title: string; text: string; tags: string[] };
    skills: SkillGroup[];
    education: Edu[];
    otherStudies: Course[];
    contact: { email: string };
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const esc = (s: string) =>
    s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

let cache: Record<Lang, Data> | null = null;
let lang: Lang = (document.documentElement.lang === 'en' ? 'en' : 'es');
try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'es') lang = saved;
} catch { /* storage unavailable */ }

async function load() {
    if (!cache) cache = await (await fetch('data.json')).json();
    render(cache![lang]);
}

function render(d: Data) {
    const u = d.ui;
    document.documentElement.lang = lang;
    $('lang-toggle').textContent = lang === 'es' ? 'EN' : 'ES';

    $('nav').innerHTML = [
        ['about', u.navAbout], ['experience', u.navExperience], ['projects', u.navProjects],
        ['skills', u.navSkills], ['education', u.navEducation]
    ].map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join('');

    $('hero-role').textContent = u.heroRole;
    $('hero-summary').textContent = u.heroSummary;
    $('cta').innerHTML = `
        <a class="btn primary" href="#projects">${esc(u.ctaProjects)}</a>
        <a class="btn" href="#contact">${esc(u.ctaContact)}</a>`;
    $('focus').innerHTML = d.focus.map(f => `<li>${esc(f)}</li>`).join('');

    $('term-body').innerHTML =
`<span class="c-dim">$</span> whoami
sebastian · software engineer
<span class="c-dim">$</span> cat focus.txt
<span class="c-acc">▸</span> qa-automation
<span class="c-acc">▸</span> ai-agents · mcp · skills
<span class="c-acc">▸</span> developer-tools
<span class="c-dim">$</span> status
<span class="c-ok">●</span> building<span class="cursor">_</span>`;

    $('about').innerHTML = `
        ${head('01', u.aboutTitle)}
        <div class="about">${d.profile.map(p => `<p>${esc(p)}</p>`).join('')}</div>`;

    $('experience').innerHTML = `
        ${head('02', u.experienceTitle)}
        <p class="note mono">${esc(u.experienceNote)}</p>
        <ol class="timeline">
            ${d.experience.map((j, i) => `
            <li class="job${i === 0 ? ' current' : ''}">
                <div class="job-meta mono">${esc(j.period)}</div>
                <div class="job-body">
                    <h3>${esc(j.role)} <span class="at">@ ${esc(j.company)}</span></h3>
                    ${j.highlight ? `<p class="highlight">${esc(j.highlight)}</p>` : ''}
                    <ul>${j.tasks.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
                </div>
            </li>`).join('')}
        </ol>`;

    $('projects').innerHTML = `
        ${head('03', u.projectsTitle)}
        <p class="note mono">${esc(u.projectsNote)}</p>
        <div class="projects">${d.projects.map((p, i) => project(p, u, i)).join('')}</div>
        <aside class="ai-block">
            <h3>${esc(d.aiBlock.title)}</h3>
            <p>${esc(d.aiBlock.text)}</p>
            <ul class="tags">${d.aiBlock.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        </aside>`;

    $('skills').innerHTML = `
        ${head('04', u.skillsTitle)}
        <ul class="legend mono">
            <li><i class="dot practice"></i>${esc(u.legendPractice)}</li>
            <li><i class="dot academic"></i>${esc(u.legendAcademic)}</li>
            <li><i class="dot learning"></i>${esc(u.legendLearning)}</li>
        </ul>
        <div class="skills">
            ${d.skills.map(g => `
            <div class="skill-group">
                <h3 class="mono">${esc(g.title)}</h3>
                <ul>${g.items.map(i => `<li class="chip ${i.tier}"><i class="dot ${i.tier}"></i>${esc(i.name)}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>`;

    $('education').innerHTML = `
        ${head('05', u.educationTitle)}
        <div class="edu-cols">
            <ul class="edu">
                ${d.education.map(e => `
                <li>
                    <strong>${esc(e.degree)}</strong>
                    <span>${esc(e.institution)}${e.period ? ' · <span class="mono">' + esc(e.period) + '</span>' : ''}</span>
                    ${e.note ? `<em>${esc(e.note)}</em>` : ''}
                </li>`).join('')}
            </ul>
            <div>
                <h3 class="mono sub">${esc(u.otherStudiesTitle)}</h3>
                <ul class="edu">
                    ${d.otherStudies.map(c => `
                    <li><strong>${esc(c.course)}</strong>
                    <span>${esc(c.institution)} · <span class="mono">${esc(c.period)}</span></span></li>`).join('')}
                </ul>
            </div>
        </div>`;

    $('contact-title').textContent = u.contactTitle;
    const btn = $<HTMLButtonElement>('email-btn');
    btn.textContent = d.contact.email;
    btn.onclick = () => copyEmail(d.contact.email, u.copied);

    observe();
}

const head = (n: string, t: string) =>
    `<h2 class="section-title"><span class="num mono">${n}</span>${esc(t)}</h2>`;

function project(p: Project, u: Record<string, string>, i: number): string {
    const links = p.links.length
        ? p.links.map(l => `<a class="btn small" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`).join('')
        : '';
    const row = (label: string, text: string) =>
        `<div class="row"><dt class="mono">${esc(label)}</dt><dd>${esc(text)}</dd></div>`;
    return `
    <article class="project${i % 2 ? ' flip' : ''}">
        <div class="project-visual">${visual(p.visual)}</div>
        <div class="project-info">
            <div class="project-head">
                <h3>${esc(p.name)}</h3>
                <span class="status ${esc(p.statusKey)} mono">${esc(p.status)}</span>
            </div>
            <p class="tagline mono">${esc(p.tagline)}</p>
            <dl>
                ${row(u.labelContext, p.context)}
                ${row(u.labelProblem, p.problem)}
                ${row(u.labelSolution, p.solution)}
                ${row(u.labelRole, p.role)}
            </dl>
            <ul class="tags" aria-label="${esc(u.labelStack)}">${p.tech.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
            ${links ? `<div class="links">${links}</div>` : ''}
        </div>
    </article>`;
}

// Conceptual schematics (not screenshots): they illustrate the idea of each project.
function visual(kind: string): string {
    const node = (t: string, cls = '') => `<span class="node ${cls}">${t}</span>`;
    const arrow = '<span class="arrow">→</span>';
    const wrap = (inner: string) =>
        `<div class="schematic mono" aria-hidden="true">${inner}<small>schematic</small></div>`;
    switch (kind) {
        case 'retestos':
            return wrap(`<div class="flow">${node('agent', 'hl')}${arrow}${node('skills')}${arrow}${node('MCP tools')}</div>
                <div class="flow">${node('validate', 'hl')}${arrow}${node('report')}</div>`);
        case 'gxsync':
            return wrap(`<div class="list"><span>□ version A</span><span class="sel">▣ version B</span><span>□ version C</span></div>
                <div class="flow">${node('download')}${arrow}${node('install', 'hl')}</div>`);
        case 'android':
            return wrap(`<div class="flow">${node('adb')}${arrow}${node('screenshot', 'hl')}${arrow}${node('diff')}</div>
                <div class="flow">${node('emulator')}${arrow}${node('gRPC · exp.')}</div>`);
        default:
            return '';
    }
}

async function copyEmail(email: string, msg: string) {
    try {
        await navigator.clipboard.writeText(email);
    } catch {
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }
    const t = $('toast');
    t.textContent = `${msg} · ${email}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

let io: IntersectionObserver | null = null;
function observe() {
    io?.disconnect();
    const items = document.querySelectorAll<HTMLElement>('.section');
    if (!('IntersectionObserver' in window)) { items.forEach(s => s.classList.add('in')); return; }
    io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io!.unobserve(e.target); }
    }), { threshold: 0.08 });
    items.forEach(s => io!.observe(s));
}

$('lang-toggle').addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('lang', lang); } catch { /* ignore */ }
    load();
});

load();
