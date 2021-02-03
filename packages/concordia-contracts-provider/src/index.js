import express from 'express';
import cors from 'cors';
import initRoutes from './routes/web';
import { API_HOST, API_PORT } from './constants';

const app = express();

const corsOptions = {
  origin: ['localhost:7000', '127.0.0.1:7000', 'http://localhost:7000'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

initRoutes(app);
app.listen(API_PORT, () => {
  console.log(`Contracts provider listening at http://${API_HOST}:${API_PORT}`);
});
