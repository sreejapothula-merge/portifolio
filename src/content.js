// ─────────────────────────────────────────────────────────────
// EDIT ME: this is the only file you should need to touch to
// update your portfolio's content.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Sreeja",
  role: "Research & Development Software Engineer, Siemens Energy",
  tagline:
    "I build secure, scalable software — from customer-facing UIs to backend systems — and I'm now bringing that to R&D at Siemens Energy.",
  location: "Lincoln, UK",
  email: "sreeja.pothula@gmail.com",
  linkedin: "https://www.linkedin.com/in/sreeja-pothula-830b25220",
};

export const projects = [
  {
    title: "Performance Data Explorer (PDE)",
    tag: "R&D · Siemens Energy",
    year: "Jul 2026 – Present",
    blurb:
      "A WPF/.NET 8 desktop app for exploring engine performance data — analysts pick an engine type, core, and build, then plot parameters across date ranges with synced zoom, crosshairs, and an inspection line on ScottPlot charts, alongside event log review, scan-point overlays, and data export.",
    stack: ["C#", ".NET 8", "WPF", "ScottPlot"],
    color: "pink",
    link: "#",
  },
  {
    title: "CSRF Protection for iMonitor",
    tag: "Security · OpenText",
    year: "2025",
    blurb:
      "Designed and implemented CSRF protection for iMonitor, evaluating and shipping the double-submit cookie pattern to close token-exposure gaps without breaking existing GET-based workflows.",
    stack: ["C/C++", "Security", "Fortify"],
    color: "coral",
    link: "#",
  },
  {
    title: "iPrintNext",
    tag: "Full-stack · OpenText",
    year: "2023–2024",
    blurb:
      "Built the front-end interface in Angular and TypeScript, unit tested with Jest, and contributed to the backend deployed in Docker and Kubernetes, backed by OrientDB and PostgreSQL.",
    stack: ["Angular", "TypeScript", "Docker", "Kubernetes"],
    color: "teal",
    link: "#",
  },
  {
    title: "Snowflake → Microsoft Fabric Migration",
    tag: "Data Analyst Intern · MAF Group",
    year: "2023–2024",
    blurb:
      "Used Snowflake and Power BI to track down dashboard and data-source issues, then led the QA and migration of databases and Dataiku projects from Snowflake to Microsoft Fabric — documenting the process end to end.",
    stack: ["Snowflake", "Power BI", "Azure Data Factory"],
    color: "pink",
    link: "#",
  },
  {
    title: "Mortgage & Pawnbroker Web App",
    tag: "Learnathon · KL University",
    year: "2023",
    blurb:
      "A responsive full-stack Django app for an online pawning and mortgaging system, built in a 3-day skill development learnathon and hosted on an S3 bucket.",
    stack: ["Python", "Django", "PostgreSQL"],
    color: "yellow",
    link: "#",
  },
];

export const education = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    school: "Koneru Lakshmaiah (KL University), Vijayawada, India",
    date: "Jun 2024",
    detail: "Specialization: Software Modelling & DevOps · GPA 8.86",
  },
  {
    degree: "Intermediate Education",
    school: "Sri Chaitanya Junior College",
    date: "Apr 2020",
    detail: "GPA 9.8",
  },
  {
    degree: "Secondary Education",
    school: "Bhashyam Blooms Global School, Guntur, AP",
    date: "Mar 2018",
    detail: "89%",
  },
];

export const skills = [
  "C",
  "C++",
  "TypeScript",
  "Angular",
  "Python",
  "Django",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "Jest",
  "SQL",
  "CI/CD",
];
