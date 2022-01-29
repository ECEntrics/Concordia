import express from 'express';
import asyncHandler from 'express-async-handler';
import downloadContracts from '../controllers/download';
import uploadContracts from '../controllers/upload';

const router = express.Router();

const routes = (app) => {
  router.get('/contracts/:hash', asyncHandler(downloadContracts));
  router.post('/contracts/:hash', asyncHandler(uploadContracts));

  return app.use('/', router);
};

export default routes;
