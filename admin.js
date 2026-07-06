const store = window.PortfolioStore;

if (!store) {
  throw new Error("PortfolioStore is required.");
}

let data = store.loadPortfolioData();
const loginView = document.getElementById("login-view");
const panelView = document.getElementById("panel-view");

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function showPanel() {
  loginView.hidden = true;
  panelView.hidden = false;
  hydrateGeneralForm();
  renderSkillsList();
  renderProjectsList();
  renderExperienceList();
  renderEducationList();
  document.getElementById("raw-json").value = JSON.stringify(data, null, 2);
}

function showLogin() {
  panelView.hidden = true;
  loginView.hidden = false;
}

function saveData() {
  store.savePortfolioData(data);
  document.getElementById("raw-json").value = JSON.stringify(data, null, 2);
}

function hydrateGeneralForm() {
  document.getElementById("g-availability").value = data.hero.availabilityText || "";
  document.getElementById("g-name-highlight").value = data.hero.nameHighlight || "";
  document.getElementById("g-name-line2").value = data.hero.nameLine2 || "";
  document.getElementById("g-hero-desc").value = data.hero.description || "";
  document.getElementById("g-primary-text").value = data.hero.primaryCta?.text || "";
  document.getElementById("g-primary-link").value = data.hero.primaryCta?.href || "";
  document.getElementById("g-secondary-text").value = data.hero.secondaryCta?.text || "";
  document.getElementById("g-secondary-link").value = data.hero.secondaryCta?.href || "";
  document.getElementById("g-about-heading").value = data.about.heading || "";
  document.getElementById("g-about-paragraphs").value = (data.about.paragraphs || []).join("\n\n");
  document.getElementById("g-about-tags").value = (data.about.tags || []).join(", ");
  document.getElementById("g-contact-intro").value = data.contact.intro || "";
  document.getElementById("g-contact-email").value = data.contact.links?.[0]?.text || "";
  document.getElementById("g-contact-phone").value = data.contact.links?.[1]?.text || "";
  document.getElementById("g-contact-location").value = data.contact.links?.[2]?.text || "";
  document.getElementById("g-contact-langs").value = (data.contact.languages || []).join(", ");
}

function renderSkillsList() {
  const list = document.getElementById("skills-list");
  list.innerHTML = "";
  data.skills.forEach((skill, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div>
        <strong>${skill.icon} ${skill.title}</strong>
        <p>${skill.items.join(", ")}</p>
      </div>
      <button type="button" data-remove-skill="${index}">Remove</button>
    `;
    list.appendChild(item);
  });
}

function renderProjectsList() {
  const list = document.getElementById("projects-list");
  list.innerHTML = "";
  data.projects.forEach((project, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div>
        <strong>${project.title}</strong>
        <p>${project.description}</p>
      </div>
      <button type="button" data-remove-project="${index}">Remove</button>
    `;
    list.appendChild(item);
  });
}

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const auth = store.loadAdminAuth();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  if (username !== auth.username || password !== auth.password) {
    alert("Invalid credentials.");
    return;
  }
  sessionStorage.setItem("portfolio_admin_logged_in", "1");
  showPanel();
});

document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("portfolio_admin_logged_in");
  showLogin();
});

document.getElementById("reset-data").addEventListener("click", () => {
  data = store.resetPortfolioData();
  hydrateGeneralForm();
  renderSkillsList();
  renderProjectsList();
  renderExperienceList();
  renderEducationList();
  document.getElementById("raw-json").value = JSON.stringify(data, null, 2);
  alert("Portfolio content reset to default.");
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

document.getElementById("general-form").addEventListener("submit", (event) => {
  event.preventDefault();
  data.hero.availabilityText = document.getElementById("g-availability").value.trim();
  data.hero.nameHighlight = document.getElementById("g-name-highlight").value.trim();
  data.hero.nameLine2 = document.getElementById("g-name-line2").value.trim();
  data.hero.description = document.getElementById("g-hero-desc").value.trim();
  data.hero.primaryCta = {
    text: document.getElementById("g-primary-text").value.trim(),
    href: document.getElementById("g-primary-link").value.trim(),
  };
  data.hero.secondaryCta = {
    text: document.getElementById("g-secondary-text").value.trim(),
    href: document.getElementById("g-secondary-link").value.trim(),
  };
  data.about.heading = document.getElementById("g-about-heading").value.trim();
  data.about.paragraphs = document.getElementById("g-about-paragraphs").value
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  data.about.tags = splitList(document.getElementById("g-about-tags").value);
  data.contact.intro = document.getElementById("g-contact-intro").value.trim();

  const email = document.getElementById("g-contact-email").value.trim();
  const phone = document.getElementById("g-contact-phone").value.trim();
  const location = document.getElementById("g-contact-location").value.trim();
  data.contact.links = [
    { icon: "✉", text: email, href: email ? `mailto:${email}` : "#" },
    { icon: "📞", text: phone, href: phone ? `tel:${phone.replace(/\s+/g, "")}` : "#" },
    { icon: "🌐", text: location, href: "#" },
  ];
  data.contact.languages = splitList(document.getElementById("g-contact-langs").value);

  saveData();
  alert("General content saved.");
});

document.getElementById("skill-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const icon = document.getElementById("skill-icon").value.trim();
  const title = document.getElementById("skill-title").value.trim();
  const items = splitList(document.getElementById("skill-items").value);
  data.skills.push({ icon, title, items });
  saveData();
  renderSkillsList();
  event.target.reset();
});

document.getElementById("skills-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-skill]");
  if (!button) return;
  const index = Number(button.dataset.removeSkill);
  data.skills.splice(index, 1);
  saveData();
  renderSkillsList();
});

document.getElementById("project-form").addEventListener("submit", (event) => {
  event.preventDefault();
  data.projects.push({
    title: document.getElementById("project-title").value.trim(),
    description: document.getElementById("project-desc").value.trim(),
    tech: splitList(document.getElementById("project-tech").value),
    linkText: document.getElementById("project-link-text").value.trim(),
    linkHref: document.getElementById("project-link").value.trim(),
  });
  saveData();
  renderProjectsList();
  event.target.reset();
});

document.getElementById("projects-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-project]");
  if (!button) return;
  const index = Number(button.dataset.removeProject);
  data.projects.splice(index, 1);
  saveData();
  renderProjectsList();
});

document.getElementById("save-json").addEventListener("click", () => {
  try {
    const parsed = JSON.parse(document.getElementById("raw-json").value);
    data = parsed;
    saveData();
    hydrateGeneralForm();
    renderSkillsList();
    renderProjectsList();
    renderExperienceList();
    renderEducationList();
    alert("JSON saved.");
  } catch (_err) {
    alert("Invalid JSON.");
  }
});

document.getElementById("auth-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value;
  if (!username || !password) {
    alert("Username and password are required.");
    return;
  }
  store.saveAdminAuth({ username, password });
  event.target.reset();
  alert("Admin credentials updated.");
});

document.getElementById("experience-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const date = document.getElementById("exp-date").value.trim();
  const title = document.getElementById("exp-title").value.trim();
  const company = document.getElementById("exp-company").value.trim();
  const points = document.getElementById("exp-points").value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!data.experience) data.experience = [];
  data.experience.push({ date, title, company, points });
  saveData();
  renderExperienceList();
  event.target.reset();
});

document.getElementById("experience-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-experience]");
  if (!button) return;
  const index = Number(button.dataset.removeExperience);
  data.experience.splice(index, 1);
  saveData();
  renderExperienceList();
});

document.getElementById("education-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const badge = document.getElementById("edu-badge").value.trim();
  const title = document.getElementById("edu-title").value.trim();
  const school = document.getElementById("edu-school").value.trim();
  const tags = splitList(document.getElementById("edu-tags").value);
  if (!data.education) data.education = [];
  data.education.push({ badge, title, school, tags });
  saveData();
  renderEducationList();
  event.target.reset();
});

document.getElementById("education-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-education]");
  if (!button) return;
  const index = Number(button.dataset.removeEducation);
  data.education.splice(index, 1);
  saveData();
  renderEducationList();
});

if (sessionStorage.getItem("portfolio_admin_logged_in") === "1") {
  showPanel();
} else {
  showLogin();
}
