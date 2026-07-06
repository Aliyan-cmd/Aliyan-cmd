function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const store = window.PortfolioStore;
const data = store ? store.loadPortfolioData() : null;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function renderHero(hero) {
  if (!hero) return;
  const typedText = document.getElementById("typed-text");
  if (typedText) typedText.dataset.text = hero.availabilityText || "available for opportunities";

  const heading = document.getElementById("hero-heading");
  if (heading) {
    heading.innerHTML = `Hi, I'm <span class="highlight">${escapeHtml(hero.nameHighlight || "Aliyan")}</span><br>${escapeHtml(hero.nameLine2 || "Abdulraheem Mulla")}`;
  }

  setText("hero-desc", hero.description || "");

  const primaryBtn = document.getElementById("hero-btn-primary");
  if (primaryBtn) {
    primaryBtn.textContent = hero.primaryCta?.text || "⚡ Get In Touch";
    primaryBtn.href = hero.primaryCta?.href || "#contact";
  }

  const secondaryBtn = document.getElementById("hero-btn-secondary");
  if (secondaryBtn) {
    secondaryBtn.textContent = hero.secondaryCta?.text || "↓ View My Work";
    secondaryBtn.href = hero.secondaryCta?.href || "#projects";
  }

  const stats = document.getElementById("hero-stats");
  if (!stats) return;
  stats.innerHTML = "";
  (hero.stats || []).forEach((item) => {
    const value = Number(item.value) || 0;
    const suffix = item.suffix || "";
    const label = escapeHtml(item.label || "");
    stats.insertAdjacentHTML(
      "beforeend",
      `<div class="stat-item">
        <h3 data-count="${value}" data-suffix="${escapeHtml(suffix)}">0</h3>
        <p>${label}</p>
      </div>`
    );
  });
}

function renderAbout(about) {
  if (!about) return;
  const heading = document.getElementById("about-heading");
  if (heading) heading.innerHTML = about.heading || "";

  const paragraphs = document.getElementById("about-paragraphs");
  if (paragraphs) {
    paragraphs.innerHTML = "";
    (about.paragraphs || []).forEach((text) => {
      paragraphs.insertAdjacentHTML("beforeend", `<p>${escapeHtml(text)}</p>`);
    });
  }

  const tags = document.getElementById("about-tags");
  if (tags) {
    tags.innerHTML = "";
    (about.tags || []).forEach((tag) => {
      tags.insertAdjacentHTML("beforeend", `<span>${escapeHtml(tag)}</span>`);
    });
  }
}

function renderSkills(skills) {
  const container = document.getElementById("skills-grid");
  if (!container) return;
  container.innerHTML = "";
  (skills || []).forEach((skill) => {
    const items = (skill.items || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="skill-card reveal">
        <div class="skill-icon">${escapeHtml(skill.icon || "💻")}</div>
        <h3>${escapeHtml(skill.title || "")}</h3>
        <div class="skill-list">${items}</div>
      </div>`
    );
  });
}

function renderProjects(projects) {
  const container = document.getElementById("projects-grid");
  if (!container) return;
  container.innerHTML = "";
  (projects || []).forEach((project) => {
    const tech = (project.tech || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    const href = project.linkHref || "#";
    const linkText = escapeHtml(project.linkText || "View Project");
    container.insertAdjacentHTML(
      "beforeend",
      `<article class="project-card reveal">
        <h3>${escapeHtml(project.title || "")}</h3>
        <p>${escapeHtml(project.description || "")}</p>
        <div class="project-tech">${tech}</div>
        <a href="${escapeHtml(href)}" class="project-link"${href.startsWith("http") ? ' target="_blank" rel="noreferrer noopener"' : ""}>${linkText}</a>
      </article>`
    );
  });
}

function renderExperience(experience) {
  const container = document.getElementById("experience-list");
  if (!container) return;
  container.innerHTML = "";
  (experience || []).forEach((job) => {
    const points = (job.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("");
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="timeline-item reveal">
        <p class="timeline-date">${escapeHtml(job.date || "")}</p>
        <h3>${escapeHtml(job.title || "")}</h3>
        <h4>${escapeHtml(job.company || "")}</h4>
        <ul>${points}</ul>
      </div>`
    );
  });
}

function renderEducation(education) {
  const container = document.getElementById("education-list");
  if (!container) return;
  container.innerHTML = "";
  (education || []).forEach((item) => {
    const tags = (item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="edu-card reveal">
        <span class="badge">${escapeHtml(item.badge || "")}</span>
        <h3>${escapeHtml(item.title || "")}</h3>
        <h4>${escapeHtml(item.school || "")}</h4>
        <div class="edu-tags">${tags}</div>
      </div>`
    );
  });
}

function renderContact(contact) {
  if (!contact) return;
  setText("contact-intro", contact.intro || "");

  const links = document.getElementById("contact-links");
  if (links) {
    links.innerHTML = "";
    (contact.links || []).forEach((item) => {
      links.insertAdjacentHTML(
        "beforeend",
        `<a href="${escapeHtml(item.href || "#")}" class="contact-card">
          <span class="icon">${escapeHtml(item.icon || "•")}</span>
          <span>${escapeHtml(item.text || "")}</span>
        </a>`
      );
    });
  }

  const langs = document.getElementById("contact-languages");
  if (langs) {
    langs.innerHTML = "";
    (contact.languages || []).forEach((lang) => {
      langs.insertAdjacentHTML("beforeend", `<span>${escapeHtml(lang)}</span>`);
    });
  }
}

if (data) {
  renderHero(data.hero);
  renderAbout(data.about);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderExperience(data.experience);
  renderEducation(data.education);
  renderContact(data.contact);
}

const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: 0, y: 0 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
        this.opacity = Math.min(this.opacity + 0.02, 0.8);
      }
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,200,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,200,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

const nav = document.querySelector(".nav");
if (nav) {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });
}

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

const reveals = document.querySelectorAll(".reveal");
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  }, { threshold: 0.1 });
  reveals.forEach((el) => observer.observe(el));
}

const typeEl = document.getElementById("typed-text");
const text = (typeEl?.dataset.text || "available for opportunities").trim();
let idx = 0;
function typeWriter() {
  if (!typeEl) return;
  if (idx < text.length) {
    typeEl.textContent += text.charAt(idx);
    idx++;
    setTimeout(typeWriter, 60);
  }
}
setTimeout(typeWriter, 1000);

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 40);
  });
}

const statsSection = document.querySelector(".hero-stats");
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statsSection && statsObserver.observe(statsSection);
}
