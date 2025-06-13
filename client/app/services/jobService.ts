// ~/services/jobService.ts
import type { JobOffer, getJobById, getAllJobs } from "~/data/jobsData";

// Interfaces spécifiques au service (pour éviter les conflits)
export interface JobServiceCreateRequest {
  title: string;
  type: 'Recrutement' | 'Stage' | 'Freelance';
  contract?: string;
  location: string;
  salary?: string;
  mission: string;
  skills: string[];
  requirements: string[];
  status: 'active' | 'archived' | 'draft';
}

export interface JobServiceUpdateRequest extends Partial<JobServiceCreateRequest> {
  id: string;
}

// Interface étendue pour le service avec les nouveaux champs
export interface ExtendedJobOffer extends JobOffer {
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// Données simulées en localStorage pour persistance temporaire
const STORAGE_KEY = 'scar_soft_jobs';

// Données initiales
const initialJobs: ExtendedJobOffer[] = [
  {
    id: '1',
    title: 'Développeur Full Stack React/Node.js',
    type: 'Recrutement',
    contract: 'CDI',
    location: 'Cotonou, Bénin',
    salary: '800 000 - 1 200 000 FCFA',
    mission: 'Rejoignez notre équipe de développement pour concevoir et développer des applications web modernes et performantes. Vous travaillerez sur des projets variés allant des sites vitrine aux applications métier complexes.',
    skills: [
      'React.js et écosystème (Redux, Context API)',
      'Node.js et Express.js',
      'TypeScript',
      'Base de données (MongoDB, PostgreSQL)',
      'Git et méthodologies Agile'
    ],
    requirements: [
      'Diplôme en informatique ou équivalent',
      'Minimum 3 ans d\'expérience en développement web',
      'Maîtrise de JavaScript/TypeScript',
      'Expérience avec les frameworks modernes',
      'Autonomie et esprit d\'équipe'
    ],
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Designer UI/UX',
    type: 'Recrutement',
    contract: 'CDD',
    location: 'Cotonou, Bénin',
    salary: '600 000 - 900 000 FCFA',
    mission: 'Créez des expériences utilisateur exceptionnelles pour nos clients. Vous serez responsable de la conception d\'interfaces intuitives et esthétiques pour nos applications web et mobiles.',
    skills: [
      'Figma, Adobe XD, Sketch',
      'Principes de design UX/UI',
      'Prototypage et wireframing',
      'Design system et atomic design',
      'HTML/CSS (notions de base)'
    ],
    requirements: [
      'Portfolio démontrant votre expertise',
      'Minimum 2 ans d\'expérience en UI/UX',
      'Maîtrise des outils de design',
      'Sens artistique développé',
      'Capacité à travailler en équipe'
    ],
    status: 'active',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z'
  }
];

// Utilitaires pour localStorage
const getJobsFromStorage = (): ExtendedJobOffer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialJobs;
  } catch {
    return initialJobs;
  }
};

const saveJobsToStorage = (jobs: ExtendedJobOffer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving jobs to localStorage:', error);
  }
};

// Simulation de délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service API simulé
export const jobService = {
  // Récupérer toutes les offres
  async getAllJobs(): Promise<ExtendedJobOffer[]> {
    await delay(500);
    return getJobsFromStorage();
  },

  // Récupérer les offres actives (pour la page publique)
  async getActiveJobs(): Promise<ExtendedJobOffer[]> {
    await delay(300);
    const jobs = getJobsFromStorage();
    return jobs.filter(job => job.status === 'active');
  },

  // Récupérer une offre par ID
  async getJobById(id: string): Promise<ExtendedJobOffer | null> {
    await delay(300);
    const jobs = getJobsFromStorage();
    return jobs.find(job => job.id === id) || null;
  },

  // Créer une nouvelle offre
  async createJob(data: JobServiceCreateRequest): Promise<ExtendedJobOffer> {
    await delay(800);
    const jobs = getJobsFromStorage();
    
    const newJob: ExtendedJobOffer = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    saveJobsToStorage(jobs);
    
    return newJob;
  },

  // Mettre à jour une offre
  async updateJob(data: JobServiceUpdateRequest): Promise<ExtendedJobOffer> {
    await delay(700);
    const jobs = getJobsFromStorage();
    const index = jobs.findIndex(job => job.id === data.id);
    
    if (index === -1) {
      throw new Error('Offre non trouvée');
    }
    
    const updatedJob: ExtendedJobOffer = {
      ...jobs[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    jobs[index] = updatedJob;
    saveJobsToStorage(jobs);
    
    return updatedJob;
  },

  // Archiver une offre
  async archiveJob(id: string): Promise<void> {
    await delay(500);
    const jobs = getJobsFromStorage();
    const index = jobs.findIndex(job => job.id === id);
    
    if (index === -1) {
      throw new Error('Offre non trouvée');
    }
    
    jobs[index] = {
      ...jobs[index],
      status: 'archived',
      updatedAt: new Date().toISOString()
    };
    
    saveJobsToStorage(jobs);
  },

  // Réactiver une offre archivée
  async reactivateJob(id: string): Promise<void> {
    await delay(500);
    const jobs = getJobsFromStorage();
    const index = jobs.findIndex(job => job.id === id);
    
    if (index === -1) {
      throw new Error('Offre non trouvée');
    }
    
    jobs[index] = {
      ...jobs[index],
      status: 'active',
      updatedAt: new Date().toISOString()
    };
    
    saveJobsToStorage(jobs);
  },

  // Supprimer définitivement une offre
  async deleteJob(id: string): Promise<void> {
    await delay(600);
    const jobs = getJobsFromStorage();
    const filteredJobs = jobs.filter(job => job.id !== id);
    
    if (filteredJobs.length === jobs.length) {
      throw new Error('Offre non trouvée');
    }
    
    saveJobsToStorage(filteredJobs);
  }
};

// Export des types pour utilisation dans les composants
// export { JobOffer } from "~/data/jobsData";
// export type { JobServiceCreateRequest, JobServiceUpdateRequest, ExtendedJobOffer };