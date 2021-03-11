const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
  usernameField: 'codigo',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, codigo, password, done) =>{
 const rows = await pool.query('SELECT * FROM usuario_web WHERE codigo= ?',[codigo]);
 if(rows.length > 0){
   const user = rows[0];
   const validPassword = await helpers.matchPassword(password,user.password);
   if(validPassword){
     done(null,user,req.flash('Bienvenido '+user.email));
   }
   else{
     done(null,false,req.flash('Contraseña Invalida'));
   }

 }
 else{
   return done(null,false,req.flash('El codigo ingresado no existe'));
 }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'codigo',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, codigo, password, done) => {
    const {email}=req.body;
    const newUser={
        codigo,
        email,
        password
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuario_web SET ?',[newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
  }));

passport.serializeUser((user,done)=>{
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuario_web WHERE id = ?', [id]);
  done(null, rows[0]);
});