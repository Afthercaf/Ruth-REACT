 

import express from 'express';
import morgan from 'morgan';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import expressMySQLSession from 'express-mysql-session';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { TOKEN_SECRET, database,PORT} from './Database/config.js';
import { pool } from './Database/database.js';
import './lib/passport.js';
import cors from 'cors';

const app = express();

// CORS Middleware
app.use(cors({
  origin: 'https://ruth-react.vercel.app/', // Cambia esto a la URL de tu frontend en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MySQLStore = expressMySQLSession(session);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser("faztmysqlnodemysql"));

app.use(session({
  secret: TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore({}, pool),
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Rutas
app.use(routes);

// Ruta de prueba
app.get("/", (req, res) => {
  const htmlResponse = `
    <html>
      <head>
        <title>NodeJs y Express en Vercel</title>
      </head>
      <body>
        <h1>Soy un proyecto Back end en vercel</h1>
      </body>
    </html>
  `;
  res.send(htmlResponse);
});

// Manejo de errores
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

export default app;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
