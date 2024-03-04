import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import winston from 'winston'
import { config } from './config/config.js';




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



const logger=winston.createLogger(
  {
    levels:{debug:5,http:4,info:3,warning:2,error:1,fatal:0},
    transports:[
      new winston.transports.Console(
        {
          level:"info",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple()
          )

        }
      ),
      new winston.transports.File(
        {
          level:"error",
          filename: "../src/logs/errors.log",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }
      )
    ]
  }
)



const loggerProduccion=winston.createLogger(
  {
    levels:{debug:5,http:4,info:3,warning:2,error:1,fatal:0},
    transports:[
      new winston.transports.Console(
        {
          level:"error",
          format:winston.format.combine(
            winston.format.colorize({
              colors:{error:"red",fatal:"red"}
              
            }),
            winston.format.simple()

          )
        }
      )
    ]
  }
)



let loggers
if(config.MODE==="produccion"){
 loggers=loggerProduccion
 
}
else if(config.MODE==="desarrollo"){
  loggers=logger
  
}





export const middLog=(req,res,next)=>{
  req.logger=loggers
  next()
}