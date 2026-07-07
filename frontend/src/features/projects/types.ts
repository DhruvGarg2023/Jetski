export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  repositories?: Repository[];
}

export interface Repository {
  id: string;
  projectId: string;
  githubRepoId: string;
  fullName: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  repositoryId: string;
  commitHash: string;
  branchName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  report?: any; // To be refined later
  createdAt: string;
  updatedAt: string;
}
