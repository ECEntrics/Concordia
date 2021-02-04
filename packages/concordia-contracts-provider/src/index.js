import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import initRoutes from './routes/web';
import constants from './constants';

const PROVIDER_PORT = process.env.CONTRACTS_PROVIDER_PORT || constants.port;
const ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(';')
  : constants.corsAllowedOrigins;

const app = express();

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());

initRoutes(app);

app.listen(PROVIDER_PORT, () => {
  console.log(`Contracts provider listening at http://127.0.0.1:${PROVIDER_PORT}`);
});
