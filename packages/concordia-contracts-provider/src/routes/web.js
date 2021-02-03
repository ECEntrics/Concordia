import express from 'express';
import downloadContracts from '../controllers/download';
import uploadContracts from '../controllers/upload';

const router = express.Router();

const routes = (app) => {
  router.get('/contracts/:hash', downloadContracts);
  router.post('/contracts/:hash', uploadContracts);

  return app.use('/', router);
};

export default routes;
