// ─── PLACEHOLDER DATA ──────────────────────────────────────────────────────
// Replace these with your real info

export const personalInfo = {
  name: "Nuthan Murarysetty",
  title: "Programmer | Instructor | Designer | Hodophile",
  tagline: "Engineering business-ready digital products with .NET precision, teach tech, and document my learning journey.",
  itCareerStartDate: "2013-12-01",
  bio: "I bring {yearsExperience} years of hands-on experience building enterprise applications using Microsoft .NET, C#, and SQL Server as my core stack. My mainstream work has focused on designing robust backend systems, building secure and scalable Web APIs, and delivering Azure-driven implementations for performance, reliability, and long-term maintainability. Alongside product delivery, I mentor developers and share practical engineering knowledge through technical content.",
  email: "inbox.nuthan@gmail.com",
  phone: "+91 XXXXXXXXXX", // Keep private or remove
  location: "India",
  photo: "https://avatars.githubusercontent.com/u/29816449?s=400&v=4", // Your GitHub avatar
  resumeUrl: "/NuthanMurarysetty_Resume_CloudEngineer.docx",
  social: {
    github: "https://github.com/nuthanm",
    linkedin: "https://www.linkedin.com/in/nuthanm/?skipRedirect=true",
    twitter: "https://x.com/nuthanmurari",
    medium: "https://nuthanmurarysetty.medium.com/",
    codementor: "https://www.codementor.io/@inboxnuthan",
  },
}

export const githubStats = [
  { label: "Public Repositories", value: "25*" },
  { label: "Contributions (Current Year)", value: "—" },
  { label: "Contributions (So Far)", value: "—" },
  { label: "Years of IT Experience", value: "12.5" },
]

export const uiFlags = {
  showImportantInfoSection: false,
}

export const importantInfo = {
  copyrightNotice:
    "All original text, code, design, and project descriptions on this website are owned by Nuthan Murarysetty unless explicitly marked otherwise.",
  attributionItems: [
    "Project preview screenshots for some portfolio cards are generated through WordPress mShots from publicly accessible URLs.",
    "Technology names and brand names (for example Microsoft, Azure, GitHub, OpenAI, Anthropic, and LinkedIn) belong to their respective owners.",
    "Logo files in this portfolio are simplified visual references created for identification and educational showcase purposes.",
    "The profile image displayed in this portfolio is from the owner's public GitHub profile.",
  ],
  preventionItems: [
    "Do not reuse this portfolio content, images, or code in misleading, fraudulent, or impersonation contexts.",
    "Do not submit spam, abusive, illegal, or phishing-related messages through the contact form.",
    "Contact form input is monitored with server-side validation, rate limiting, and anti-bot checks.",
    "If any owner requests removal or correction of content attribution, updates will be made promptly.",
  ],
  legalDisclaimer:
    "This site references third-party technologies for informational and portfolio demonstration only; it does not imply partnership, sponsorship, or endorsement by the respective trademark owners.",
}

export const aiTools = [
  {
    name: "ChatGPT",
    usage: "Architecture brainstorming, API draft patterns",
    iconKey: "openai",
    logoImage: "/logos/ai-chatgpt.svg",
    website: "https://chatgpt.com/",
  },
  {
    name: "Claude",
    usage: "Long-form analysis, system design comparisons",
    iconKey: "anthropic",
    logoImage: "/logos/ai-claude.svg",
    website: "https://claude.ai/",
  },
  {
    name: "Cursor",
    usage: "Agent-assisted refactoring and implementation",
    logoImage: "/logos/ai-cursor.svg",
    iconUrl: "/logos/cursor-mark.svg",
    website: "https://www.cursor.com/",
  },
  {
    name: "GitHub Copilot",
    usage: "In-editor coding acceleration and test scaffolds",
    iconKey: "copilot",
    logoImage: "/logos/ai-copilot.svg",
    website: "https://github.com/features/copilot",
  },
]

export const aiUsageLogs = [
  "Reduced repetitive coding time by using AI-assisted scaffolding for boilerplate and integration layers.",
  "Used AI copilots to evaluate multiple implementation paths before finalizing production-ready architecture.",
  "Accelerated debugging and documentation quality with structured prompt workflows and review loops.",
]

export const timeline = [
  {
    id: 1,
    year: "Apr 2026 – Present",
    role: "Application Architect",
    company: "KANINI",
    description:
      "Leading architecture for scalable, high-performance enterprise applications with focus on API-first design, modernization strategy, and productivity-driven proof of concepts that improve delivery workflows.",
    tags: [".NET 8", "Application Architecture", "API-First Design", "Scalability", "Performance"],
  },
  {
    id: 2,
    year: "May 2024 – May 2026",
    role: "Associate Architect",
    company: "KANINI",
    description:
      "Worked in a Technical Architect-equivalent role: produced architecture modules, collaborated with enterprise architects, led .NET/C# and Azure POCs, drove code quality through reviews and pair programming, and delivered Azure DevOps PR automation including reviewer assignment and PR insights reporting.",
    tags: ["Solution Architecture", "Azure DevOps", "POC", "Code Review", "Pair Programming", "PR Insights"],
  },
  {
    id: 3,
    year: "Jun 2020 – Apr 2024",
    role: "Lead Associate",
    company: "KANINI",
    description:
      "Delivered Azure-integrated enterprise features through sprint planning, design discussions, coding, peer reviews, and unit testing while mentoring teammates and improving practical cloud adoption in delivery teams.",
    tags: ["Agile Delivery", "Peer Review", "Unit Testing", "Azure Services", "Mentoring"],
  },
  {
    id: 4,
    year: "Apr 2019 – May 2020",
    role: "Senior Software Engineer",
    company: "KANINI",
    description:
      "Contributed across requirement design, sprint execution, implementation, peer reviews, and testing for business-critical modules built on .NET and SQL Server with growing Azure exposure.",
    tags: [".NET", "SQL Server", "Sprint Delivery", "Peer Review", "Testing"],
  },
  {
    id: 5,
    year: "Oct 2018 – Mar 2019",
    role: "Senior Software Engineer",
    company: "CES",
    description:
      "Owned end-to-end module delivery in ASP.NET Web Forms, from requirement clarification and development to local/dev validation and production release support.",
    tags: ["ASP.NET Web Forms", "OOP", "SOLID", "Release Ownership"],
  },
  {
    id: 6,
    year: "Jun 2015 – Oct 2018",
    role: "IT Analyst (Promoted from System Engineer)",
    company: "Tata Consultancy Services (TCS)",
    description:
      "Started as System Engineer on Bank of America project delivering unit tests, Oracle-to-SQL Server migration, and WCF services in ASP.NET MVC with C#. Promoted to IT Analyst and supported Bank of Montreal workloads across production support, monitoring, issue resolution, and SSIS/SSRS reporting.",
    tags: ["ASP.NET MVC", "C#", "WCF", "Oracle Migration", "SQL Server", "SSIS", "SSRS", "Production Support"],
  },
  {
    id: 7,
    year: "Dec 2013 – Jun 2015",
    role: "Senior Software Engineer",
    company: "IGATE",
    description:
      "Built media-domain web applications for NBCU using Microsoft technologies and integrated third-party components such as DHTMLX and LeadTools OCR.",
    tags: [".NET", "C#", "SQL Server", "DHTMLX", "LeadTools OCR", "Media Domain"],
  },
]

export const certifications = [
  {
    id: 1,
    title: "Claude Code 101",
    issuer: "Anthropic Education",
    year: "2026",
    issuedOn: "June 29, 2026",
    credentialUrl: "https://verify.skilljar.com/c/crf8o2iu2vqb",
    logoImage: "/logos/ai-claude.svg",
  },
  {
    id: 2,
    title: "Google Prompting Essentials (Prompt Engineering)",
    issuer: "Google via Coursera",
    year: "2026",
    issuedOn: "Mar 9, 2026",
    credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/0OLAGHH8VXRJ",
    logoImage: "/logos/coursera.svg",
  },
  {
    id: 3,
    title: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    year: "2021",
    issuedOn: "Mar 27, 2021",
    credentialUrl: "https://www.credly.com/badges/b4fde979-bbba-4662-a66b-770452a6b667?source=linked_in_profile",
    logoImage: "/logos/microsoft.svg",
  },
  {
    id: 4,
    title: "Learning Markdown: Formatting Text without the Complexity",
    issuer: "LinkedIn Learning",
    year: "2026",
    issuedOn: "Apr 6, 2026",
    credentialUrl: "https://www.linkedin.com/learning/certificates/634f9dd625899ffd33970c1a8eb0ff3f588206145610ca87519b67240b6f08e4",
    logoImage: "/logos/linkedin-learning.svg",
  },
  {
    id: 5,
    title: "Build with AI: Creating Apps with Cursor 2 Agents",
    issuer: "LinkedIn Learning",
    year: "2026",
    issuedOn: "Apr 3, 2026",
    credentialUrl: "https://www.linkedin.com/learning/certificates/40b583c2a00cc17100513ca26ef61bbefcc3d65de7bd866a2f47a118308f119e",
    logoImage: "/logos/linkedin-learning.svg",
  },
  {
    id: 6,
    title: "AI Agents for Everyday Professionals: Simple Automations to Speed Up Your Work (No Code Required)",
    issuer: "LinkedIn Learning",
    year: "2026",
    issuedOn: "Jan 19, 2026",
    credentialUrl: "https://www.linkedin.com/learning/certificates/08a0bc9c1efeb19e45edbe84d2da2d3eb26c8a63a343a940a031890a0e76d534",
    logoImage: "/logos/linkedin-learning.svg",
  },
  {
    id: 7,
    title: "Learning the OWASP Top 10",
    issuer: "LinkedIn Learning",
    year: "2025",
    issuedOn: "Feb 18, 2025",
    credentialUrl: "https://www.linkedin.com/learning/certificates/ceaecc2fa1d4855582a29a4c915e9165173ca200737d8280e9331d370de31e28",
    logoImage: "/logos/linkedin-learning.svg",
  },
  {
    id: 8,
    title: "Software Architecture: From Developer to Architect",
    issuer: "LinkedIn Learning",
    year: "2025",
    issuedOn: "Feb 19, 2025",
    credentialUrl: "https://www.linkedin.com/learning/certificates/8ed3c6fbceb824f673426aa605ec62834794771d8fde64699fce37deb8499c6b",
    logoImage: "/logos/linkedin-learning.svg",
  },
]

export const skills = [
  {
    category: "Frontend",
    items: ["Blazor", "React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: [".NET Framework", ".NET Core", ".NET 8", "C#", "ASP.NET MVC", "Web API", "WCF", "LINQ", "Microservices"],
  },
  {
    category: "Cloud & DevOps",
    items: ["Azure App Service", "Azure Functions", "Service Bus", "Storage", "Key Vault", "API Management", "Azure DevOps", "CI/CD", "On-Prem to Azure Migration", "Deployment Automation"],
  },
  {
    category: "Database",
    items: ["SQL Server", "Oracle", "MongoDB", "SQLite", "InMemory", "SSIS", "SSRS", "Redis"],
  },
  {
    category: "ORM",
    items: ["EF Core", "Dapper"],
  },
  {
    category: "Tools & Others",
    items: ["Git", "Visual Studio", "VS Code", "Postman", "Jira", "Prompt Engineering", "Data Analysis", "Data Visualization", "Architecture Review", "Code Review", "Debugging"],
  },
  {
    category: "Interests",
    items: ["Open Source", "Teaching", "Photography", "Travel", "Video Editing"],
  },
]

export const portfolio = [
  {
    id: 1,
    name: "Investment Tracker",
    description:
      "Track your investments and monitor portfolio performance with real-time analytics and reports.",
    tech: ["React", "Vercel", "JavaScript"],
    liveUrl: "https://myinvestmenttracker.vercel.app/",
    image: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fmyinvestmenttracker.vercel.app%2F?w=1200",
    category: "Financial",
  },
  {
    id: 2,
    name: "Debt Tracker",
    description:
      "Manage and track your debts efficiently. Monitor payments and get insights into your financial health.",
    tech: ["React", "Vercel", "JavaScript"],
    liveUrl: "http://mydebttracker.vercel.app/",
    image: "https://s.wordpress.com/mshots/v1/http%3A%2F%2Fmydebttracker.vercel.app%2F?w=1200",
    category: "Financial",
  },
  {
    id: 3,
    name: "Private Journal & Todo",
    description:
      "Private journaling and todo management app to capture thoughts, plan tasks, and stay organized securely.",
    tech: ["TypeScript", "React", "Vercel"],
    liveUrl: "https://private-journal.vercel.app/",
    image: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fprivate-journal.vercel.app%2F?w=1200",
    category: "Productivity",
  },
  {
    id: 4,
    name: "MailMind",
    description:
      "Mail management app to organize inbox workflows, classify messages, and surface useful email insights.",
    tech: ["JavaScript", "React", "Vercel"],
    liveUrl: "https://mailmind-for-users.vercel.app/",
    image: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fmailmind-for-users.vercel.app%2F?w=1200",
    category: "Mail",
  },
  {
    id: 5,
    name: "LinkVault",
    description:
      "Centralized link management. Collect, organize, and share your favorite links in one place.",
    tech: ["React", "Vercel", "JavaScript"],
    liveUrl: "https://itsmylinkvault.vercel.app/",
    image: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fitsmylinkvault.vercel.app%2F?w=1200",
    category: "Web App",
  },
  {
    id: 6,
    name: "LearnItHere",
    description:
      "Educational platform for learning programming concepts with interactive tutorials and examples.",
    tech: ["Python", "Streamlit"],
    liveUrl: "https://learnithere.streamlit.app/",
    image: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Flearnithere.streamlit.app%2F?w=1200",
    category: "Educational",
  },
  {
    id: 7,
    name: "Let's Evaluate",
    description:
      "Candidate evaluation tool. Assess profiles and generate comprehensive statistics in one place.",
    tech: ["Python", "Streamlit"],
    liveUrl: "https://lets-evaluate.streamlit.app/",
    image: "/thumbnails/lets-evaluate-v2.svg",
    category: "Interview Evaluation",
  },
]
