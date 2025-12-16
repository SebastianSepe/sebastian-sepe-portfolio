"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function loadCV() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("data.json");
        const data = yield response.json();
        renderProfile(data.profile);
        renderExperience(data.experience);
        renderSkills(data.skills);
        renderContact(data.contact);
    });
}
function renderProfile(profile) {
    const container = document.getElementById("profile");
    profile.forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        container.appendChild(p);
    });
}
function renderExperience(experience) {
    const container = document.getElementById("experience");
    experience.forEach((exp) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
      <strong>${exp.company} — ${exp.role}</strong><br>
      <small>${exp.period}</small>
      <ul>
        ${exp.tasks.map((task) => `<li>${task}</li>`).join("")}
      </ul>
    `;
        container.appendChild(div);
    });
}
function renderSkills(skills) {
    const container = document.getElementById("skills");
    skills.forEach((skill) => {
        const div = document.createElement("div");
        div.innerHTML = `
      ${skill.name}
      <div class="bar">
        <span data-level="${skill.level}"></span>
      </div>
    `;
        container.appendChild(div);
    });
    document.querySelectorAll(".bar span").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
    });
}
function renderContact(contact) {
    const container = document.getElementById("contact");
    container.innerHTML = `
    📅 ${contact.birth}<br>
    📞 ${contact.phone}<br>
    ✉️ ${contact.email}
  `;
}
loadCV();
