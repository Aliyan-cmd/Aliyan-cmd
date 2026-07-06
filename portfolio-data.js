(function (global) {
  const DATA_KEY = "portfolio_data_v1";
  const AUTH_KEY = "portfolio_admin_auth_v1";

  const defaultData = {
    hero: {
      availabilityText: "available for opportunities",
      nameHighlight: "Aliyan",
      nameLine2: "Abdulraheem Mulla",
      description:
        "Full-Stack Developer & Computer Science student who lives in the terminal. Arch Linux + Hyprland daily driver. Building clean, efficient solutions from backend to frontend.",
      primaryCta: { text: "⚡ Get In Touch", href: "#contact" },
      secondaryCta: { text: "↓ View My Work", href: "#projects" },
      stats: [
        { value: 20, suffix: "%", label: "Cost Reduction" },
        { value: 25, suffix: "%", label: "Efficiency Boost" },
        { value: 4, suffix: "+", label: "Languages Spoken" },
      ],
    },
    about: {
      heading: "Developer by passion,<br>engineer by education.",
      paragraphs: [
        "I completed a Software Engineering Internship at Crawlers Technologies, Hubli-Dharwad, working on web development projects using PHP and MySQL. I contributed to building a college management website with MVC architecture, handling database operations and backend logic.",
        "When I'm not coding, I'm ricing my Hyprland setup or diving into open-source projects. I believe in writing clean, efficient code and continuously learning new technologies.",
      ],
      tags: ["🌐 Full-Stack", "🐧 Linux Enthusiast", "⚡ Problem Solver", "👥 Team Leader", "🏅 SIH Participant"],
    },
    skills: [
      { icon: "💻", title: "Frontend Development", items: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"] },
      { icon: "⚙", title: "Backend Development", items: ["PHP", "MySQL", "PostgreSQL", "MVC", "REST APIs"] },
      { icon: "🚀", title: "Programming Languages", items: ["C", "C++", "Java", "Python", "Kotlin"] },
      { icon: "🐧", title: "Linux & DevOps", items: ["Arch Linux", "Hyprland", "Bash", "Git", "CLI Tools"] },
      { icon: "📚", title: "CS Fundamentals", items: ["DSA", "DBMS", "OS", "Software Design"] },
      { icon: "🤝", title: "Soft Skills", items: ["Leadership", "Project Mgmt", "Problem Solving", "Adaptability"] },
    ],
    projects: [
      {
        title: "College Management System",
        description: "Web platform built with MVC architecture for college workflows, student records, and admin operations.",
        tech: ["PHP", "MySQL", "MVC", "JavaScript"],
        linkText: "View Details",
        linkHref: "#",
      },
      {
        title: "Portfolio Website",
        description: "Interactive personal portfolio with smooth animations and clean terminal-inspired UI.",
        tech: ["HTML", "CSS", "JavaScript"],
        linkText: "Live Preview",
        linkHref: "#",
      },
    ],
    experience: [
      {
        date: "Jan 2025 — Present",
        title: "Full-Stack Developer",
        company: "Crawlers Technologies, Hubli-Dharwad",
        points: [
          "Implemented cost-effective solutions, resulting in a 20% reduction in project expenses",
          "Streamlined project workflows, enhancing overall efficiency by 25%",
          "Led a team in successfully delivering a complex engineering project on time and within budget",
          "Developed college management website using MVC architecture with PHP & MySQL",
          "Implemented database operations and backend functionalities for production systems",
        ],
      },
    ],
    education: [
      {
        badge: "June 2025 — Present",
        title: "Bachelor of Engineering in Computer Science",
        school: "BMS Institute of Technology and Management, Bengaluru",
        tags: ["DSA with C", "DBMS", "OS", "C++", "Arch Linux", "Hyprland"],
      },
      {
        badge: "May 2022 — May 2025",
        title: "Diploma in Computer Science",
        school: "Anjuman E Islam Polytechnic, Gadag",
        tags: ["Java", "Python", "DSA", "DBMS", "HTML/CSS/JS", "PHP", "MySQL", "Tailwind"],
      },
      {
        badge: "Certification",
        title: "Infosys Springboard",
        school: "Professional Development Program",
        tags: ["Software Engineering", "Industry Skills"],
      },
      {
        badge: "Achievement",
        title: "Smart India Hackathon (SIH)",
        school: "National Level Hackathon Participant",
        tags: ["Innovation", "Team Collaboration", "Problem Solving"],
      },
    ],
    contact: {
      intro:
        "I'm always open to new opportunities, collaborations, and interesting conversations. Whether you have a project in mind or just want to say hello — let's talk!",
      links: [
        { icon: "✉", text: "aliyan.abdulraheem.mulla@gmail.com", href: "mailto:aliyan.abdulraheem.mulla@gmail.com" },
        { icon: "📞", text: "+91 7019224898", href: "tel:+917019224898" },
        { icon: "🌐", text: "Bengaluru, India", href: "#" },
      ],
      languages: ["🇮🇳 English", "Urdu", "Hindi", "Kannada"],
    },
  };

  const defaultAuth = { username: "admin", password: "admin123" };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function mergeDeep(base, custom) {
    if (!isObject(base) || !isObject(custom)) return clone(base);
    const result = clone(base);
    Object.keys(custom).forEach((key) => {
      if (!(key in result)) return;
      if (isObject(result[key]) && isObject(custom[key])) {
        result[key] = mergeDeep(result[key], custom[key]);
      } else if (Array.isArray(custom[key])) {
        result[key] = custom[key];
      } else if (custom[key] !== undefined && custom[key] !== null) {
        result[key] = custom[key];
      }
    });
    return result;
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return clone(fallback);
      return JSON.parse(raw);
    } catch (_err) {
      return clone(fallback);
    }
  }

  function loadPortfolioData() {
    const stored = readJSON(DATA_KEY, defaultData);
    return mergeDeep(defaultData, stored);
  }

  function savePortfolioData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  function resetPortfolioData() {
    localStorage.removeItem(DATA_KEY);
    return clone(defaultData);
  }

  function loadAdminAuth() {
    const stored = readJSON(AUTH_KEY, defaultAuth);
    return {
      username: stored.username || defaultAuth.username,
      password: stored.password || defaultAuth.password,
    };
  }

  function saveAdminAuth(auth) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }

  global.PortfolioStore = {
    defaultData: clone(defaultData),
    loadPortfolioData,
    savePortfolioData,
    resetPortfolioData,
    loadAdminAuth,
    saveAdminAuth,
  };
})(window);
