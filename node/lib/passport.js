import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { pool } from '../Database/database.js';
import { matchPassword } from '../lib/helpers.js';

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await matchPassword(password, user.password);
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.fullname));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/signin");
  return next();
};

export const isAdmin = (req, res, next) => {
  console.log('User:', req.user); // Agrega esta línea para verificar el contenido de req.user
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  return res.redirect('/signin');
};