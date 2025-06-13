// src/data/jobsData.ts

export interface JobOffer {
  id: string;
  title: string;
  type: string;
  mission: string;
  skills: string[];
  requirements: string[];
  location: string;
  salary?: string;
  contract?: string;
}

export const jobsData: JobOffer[] = [
  {
    id: "1",
    title: "Développeur Full-Stack Expérimenté H/F à Cotonou",
    type: "Recrutement",
    mission: "Nous recherchons un développeur full-stack senior et rigoureux pour contribuer aux projets de fintech. En charge de certaines de nos fonctionnalités, vous organiserez votre expertise pour en garantir la qualité d'exécution et encadrez les développeurs junior qui contribuent au projet.",
    skills: [
      "Django / Django-Rest-Framework",
      "Node.js",
      "Vue.js",
      "React.js / Next",
      "Android (Java/Kotlin)",
      "HTML/CSS"
    ],
    requirements: [
      "Avoir au moins 3 ans d'expériences en tant que développeur Full-Stack",
      "Habiter Cotonou ou environs"
    ],
    location: "Agla, Cotonou",
    salary: "À négocier selon expérience",
    contract: "CDI"
  },
  {
    id: "2",
    title: "Community Manager à Cotonou",
    type: "Recrutement",
    mission: "Nous recherchons un community manager créatif et dynamique pour gérer nos réseaux sociaux et développer notre présence en ligne. Vous serez responsable de la création de contenu engageant et de l'animation de nos communautés digitales sur différentes plateformes.",
    skills: [
      "Maîtrise des réseaux sociaux (Facebook, Instagram, LinkedIn, TikTok)",
      "Création de contenu visuel et rédactionnel",
      "Canva / Photoshop / Adobe Creative Suite",
      "Stratégie digitale et marketing",
      "Rédaction web et storytelling",
      "Analytics et reporting"
    ],
    requirements: [
      "Avoir au moins 2 ans d'expérience en community management",
      "Être créatif et avoir un excellent sens de la communication",
      "Maîtriser parfaitement le français",
      "Habiter Cotonou ou environs"
    ],
    location: "Agla, Cotonou",
    salary: "À négocier selon profil",
    contract: "CDI"
  },
  {
    id: "3",
    title: "Designer UI/UX à Cotonou",
    type: "Recrutement",
    mission: "Rejoignez notre équipe créative pour concevoir des interfaces utilisateur intuitives et attrayantes pour nos applications fintech. Vous travaillerez en étroite collaboration avec les équipes de développement et produit pour créer des expériences utilisateur exceptionnelles.",
    skills: [
      "Figma / Adobe XD / Sketch",
      "Photoshop / Illustrator",
      "Prototypage et wireframing",
      "Design system et atomic design",
      "User research et testing",
      "HTML/CSS (notions appréciées)"
    ],
    requirements: [
      "3+ ans d'expérience en design UI/UX",
      "Portfolio démontrant des projets web et mobile",
      "Connaissance des principes d'accessibilité",
      "Capacité à collaborer avec les développeurs",
      "Habiter Cotonou ou environs"
    ],
    location: "Agla, Cotonou",
    salary: "À négocier selon expérience",
    contract: "CDI"
  },
  {
    id: "4",
    title: "Développeur Mobile React Native H/F à Cotonou",
    type: "Recrutement",
    mission: "Intégrez notre équipe mobile pour développer des applications innovantes dans le secteur fintech. Vous serez responsable du développement d'applications mobiles performantes et user-friendly pour iOS et Android.",
    skills: [
      "React Native",
      "JavaScript / TypeScript",
      "Redux / Context API",
      "API REST integration",
      "Firebase / Push notifications",
      "App Store / Google Play deployment"
    ],
    requirements: [
      "2+ ans d'expérience en développement mobile",
      "Au moins 1 application publiée sur les stores",
      "Connaissance des guidelines iOS et Android",
      "Expérience avec les services de paiement mobile (un plus)",
      "Habiter Cotonou ou environs"
    ],
    location: "Agla, Cotonou",
    salary: "Compétitif selon expérience",
    contract: "CDI"
  },
  {
    id: "5",
    title: "Chef de Projet Digital à Cotonou",
    type: "Recrutement",
    mission: "Nous recherchons un chef de projet digital expérimenté pour coordonner nos projets de développement et assurer la liaison entre les équipes techniques et les clients. Vous piloterez les projets de la conception à la livraison.",
    skills: [
      "Gestion de projet (Scrum, Kanban)",
      "Outils de gestion (Jira, Trello, Monday)",
      "Connaissance technique (développement web/mobile)",
      "Communication client et présentation",
      "Analyse des besoins et rédaction de cahiers des charges"
    ],
    requirements: [
      "5+ ans d'expérience en gestion de projet digital",
      "Certification PMP ou équivalent appréciée",
      "Excellentes capacités de communication",
      "Expérience dans le secteur fintech (un plus)",
      "Habiter Cotonou ou environs"
    ],
    location: "Agla, Cotonou",
    salary: "Selon expérience",
    contract: "CDI"
  },
  {
    id: "6",
    title: "Stagiaire Développeur Web à Cotonou",
    type: "Stage",
    mission: "Stage de 6 mois pour étudiant en informatique passionné par le développement web. Vous serez intégré dans notre équipe de développement et participerez à des projets réels sous la supervision de développeurs seniors.",
    skills: [
      "HTML / CSS / JavaScript",
      "Frameworks JS (React, Vue.js ou Angular)",
      "Git / Version control",
      "Bases de données (MySQL, PostgreSQL)",
      "Notions de backend (Node.js, Python ou PHP)",
      "Motivation et envie d'apprendre"
    ],
    requirements: [
      "Étudiant en informatique (Bac+2 minimum)",
      "Projets personnels ou académiques à présenter",
      "Passion pour la programmation",
      "Esprit d'équipe et curiosité",
      "Habiter Cotonou ou environs"
    ],
    location: "Agla, Cotonou",
    salary: "Indemnité de stage",
    contract: "Stage 6 mois"
  }
];

// Fonctions utilitaires
export const getAllJobs = (): JobOffer[] => {
  return jobsData;
};

export const getJobById = (id: string): JobOffer | undefined => {
  return jobsData.find(job => job.id === id);
};

export const getJobsByType = (type: string): JobOffer[] => {
  return jobsData.filter(job => job.type === type);
};