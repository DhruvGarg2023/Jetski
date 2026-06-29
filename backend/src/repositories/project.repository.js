import prisma from '../config/prisma.js';

export const createProject = async (userId, name) => {
  return prisma.project.create({
    data: {
      userId,
      name,
    },
  });
};

export const getProjectsByUser = async (userId) => {
  return prisma.project.findMany({
    where: { userId },
    include: {
      repositories: true,
    },
  });
};
