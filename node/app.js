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
import { TOKEN_SECRET, database } from './Database/config.js';
import { pool } from './Database/database.js';
import './lib/passport.js';
import cors from 'cors';

const app = express();

// Agrega esta línea antes de las rutas
app.use(cors({
  origin: 'http://localhost:3000', // Ajusta esto según la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MySQLStore = expressMySQLSession(session);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser("faztmysqlnodemysql"));
console.log(database);

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);


// Serve static files from the "public" directory
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle all routes by serving the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

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
