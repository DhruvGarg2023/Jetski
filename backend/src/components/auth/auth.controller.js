import * as authService from './auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    // Note: In a later phase, we will validate this body with Zod
    const data = await authService.registerService(email, password, name);

    res.status(201).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error); // Passes to global error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginService(email, password);

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  // `req.user` is injected by the `protect` middleware
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
};
