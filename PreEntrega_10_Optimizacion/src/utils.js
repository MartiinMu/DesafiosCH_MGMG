import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
export const SECRET="Coder12345"






export const creaHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10)) 
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password)







export const passportCall=(estrategia)=>{
    return function(req, res, next) {
        passport.authenticate(estrategia, function(err, user, info, status) {
          if (err) { return next(err) }
          if (!user) {
                return res.errorCliente(info.message?info.message:info.toString())
          }
          req.user=user
          return next()
        })(req, res, next);
      }
}

export const generaToken=(usuario)=>jwt.sign({...usuario}, SECRET, {expiresIn: "1h"})





export const auth = (req, res, next) => {

  if (!req.cookies.coderCookie) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: `Usuario no autenticado` })
  }

  let token = req.cookies.coderCookie
  

  try {
      let usuario = jwt.verify(token, SECRET)
      req.user = usuario
      next()
  } catch (error) {
      return res.status(401).json({ error })
  }

}



export const Acceso=(permisos=[]) => {
  return (req,res,next) =>{
    permisos=permisos.map(p=>p.toLowerCase())

            if(permisos.includes("public")){
                return next()
            }

           if(!req.user || !req.user.rol){
                return res.status(403).json({ message: "No hay usuarios logueados" }) 
            }

            if(!permisos.includes(req.user.rol.toLowerCase())){ 
                return res.status(403).json({ message:"No tiene privilegios suficientes para acceder a este recurso."})
            }

            return next()
  }
}

