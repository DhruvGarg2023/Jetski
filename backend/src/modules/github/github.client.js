import axios from 'axios';
import AppError from '../../utils/appError.js';

class GitHubClient {
  constructor() {
    this.baseURL = 'https://api.github.com';
  }

  _getHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  _handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) throw new AppError('Unauthorized: Invalid GitHub token', 401);
      if (status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        throw new AppError('GitHub API rate limit exceeded', 429);
      }
      if (status === 404) throw new AppError('GitHub resource not found', 404);
      throw new AppError(`GitHub API Error: ${data?.message || 'Unknown error'}`, status);
    }
    throw new AppError('Failed to connect to GitHub API', 500);
  }

  async getRepositories(token) {
    try {
      const response = await axios.get(`${this.baseURL}/user/repos`, {
        headers: this._getHeaders(token),
        params: { sort: 'updated', per_page: 100 },
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getRepository(token, owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: this._getHeaders(token),
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getBranches(token, owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/branches`, {
        headers: this._getHeaders(token),
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getCommits(token, owner, repo, branch = 'main') {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/commits`, {
        headers: this._getHeaders(token),
        params: { sha: branch, per_page: 30 },
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getPullRequests(token, owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/pulls`, {
        headers: this._getHeaders(token),
        params: { state: 'open', sort: 'updated', direction: 'desc' },
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getCommitDiff(token, owner, repo, ref) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/commits/${ref}`, {
        headers: {
          ...this._getHeaders(token),
          Accept: 'application/vnd.github.v3.diff',
        },
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }
}

export default new GitHubClient();
