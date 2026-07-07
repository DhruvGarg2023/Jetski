import api from '@/services/api';
import { RemoteRepo, ConnectRepoPayload, GithubCommit, GithubBranch, GithubPullRequest } from './types';

export const githubService = {
  listRemoteRepos: async (token: string): Promise<RemoteRepo[]> => {
    const { data } = await api.get(`/github/remote-repos`, {
      params: { token }
    });
    return data.data.repos;
  },

  connectRepo: async (payload: ConnectRepoPayload): Promise<any> => {
    const { data } = await api.post(`/github/connect`, payload);
    return data.data.connection;
  },

  getCommits: async (connectionId: string, token: string): Promise<GithubCommit[]> => {
    const { data } = await api.get(`/github/${connectionId}/commits`, {
      params: { token }
    });
    return data.data.commits;
  },

  getBranches: async (connectionId: string, token: string): Promise<GithubBranch[]> => {
    const { data } = await api.get(`/github/${connectionId}/branches`, {
      params: { token }
    });
    return data.data.branches;
  },

  getPullRequests: async (connectionId: string, token: string): Promise<GithubPullRequest[]> => {
    const { data } = await api.get(`/github/${connectionId}/pulls`, {
      params: { token }
    });
    return data.data.pullRequests;
  }
};
