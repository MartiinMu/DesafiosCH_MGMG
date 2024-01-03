import passport from "passport";
import local from 'passport-local'
import { usuariosModelo } from "../dao/models/usuarios.modelo.js";
import { creaHash, validaPassword } from "../utils.js";
import github from 'passport-github2'



export const inicializarPassport = () => {

    passport.use('registro', new local.Strategy(

        {


            passReqToCallback: true, usernameField:'email'

        },
        async (req, username, password, done) => {


            try {
                console.log("Estrategia local registro de PASSPORT!")

                let { nombre, email} = req.body
                if (!nombre || !email || !password) {
                    return done(null, false)
                }

                let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                console.log(regMail.test(email))
                if (!regMail.test(email)) {
                    return done(null, false)
                }

                let existe = await usuariosModelo.findOne({ email })
                if (existe) {
                    return done(null, false)
                }






                if (email == "adminCoder@coder.com") {



                    // return res.redirect(`/registro?error=Ingrese otro email - email invalido`)
                    return done(null, false)



                } else {
                    let usuario
                    let rol = "usuario"
                    try {
                        // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")
                        password = creaHash(password)
                        console.log('hash nuevooooooooo ' + password)
                        usuario = await usuariosModelo.create({ nombre, email, password, rol })
                        // res.redirect(`/?mensaje=Usuario ${email} registrado correctamente`)
                        return done(null, usuario) 
                    } catch (error) {
                        // res.redirect('/registro?error=Error inesperado. Reintente en unos minutos')
                        return done(null, false)

                    }

                }





            }
            catch (error) {
                return done(error)
            }
        }
    ))


    passport.use('login', new local.Strategy(

        {
            usernameField: 'email'

        },

        async(username,password,done)=> {

            try{



                if(!username || !password){
                  
                    return done(null, false)
                }

                let usuario
            
                if (username=="adminCoder@coder.com" && password== "adminCod3r123"){
                  
                    // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex") // encriptar clave
                    password = creaHash(password)
                    usuario = {
                        nombre:"admin", email: username, rol:"admin", _id: "admin"
                    }
                         
                  
                    // req.session.usuario={
                    //     nombre:"admin", email: username, rol:"admin"
                        
                    // }
                  
            
            
                } else {
 
                    usuario=await usuariosModelo.findOne({email:username}).lean()
            
                    if(!usuario){
                        return done(null, usuario)
                    }
            
                    if(!validaPassword(usuario, password)){
                    
                        return done(null, usuario)

                    }
            
            
                }

                delete usuario.password
                return done(null,usuario)


            }
            catch (error) {
                return done(error)
            }
        }


    ))





    passport.use('github', new github.Strategy(
        {
            clientID: "Iv1.0b70111622068c74", 
            clientSecret: "1e51db436d284959214693844eac70a8ae5c6f7a", 
            callbackURL: "http://localhost:8080/api/sessions/callbackGithub", 

        },
        async (accesToken, refreshToken, profile,done)=>{
            try{

                console.log(profile)

                if (profile._json.email == null){
                    console.log("Configurar Github con un email publico")
                    return done(null, false)
                }

                let usuario=await usuariosModelo.findOne({email: profile._json.email})

                if(!usuario){
                    let nuevoUsuario={
                        nombre: profile._json.name,
                        email: profile._json.email, 
                        rol:"usuario",
                        profile
                    }

                    usuario=await usuariosModelo.create(nuevoUsuario)
                }
                return done(null, usuario)
                


            } catch(error){
                return done(error)
            }
        }
    ))







        // configurar serializador y deserializador
        passport.serializeUser((usuario, done)=>{
            return done(null, usuario._id) 
        })
    
        passport.deserializeUser(async(id, done)=>{
            let usuario
            if (id == "admin"){
                usuario = {
                    nombre:"admin", email: "adminCoder@coder.com", rol:"admin"
                }
                return done(null, usuario)
            } else {

                usuario=await usuariosModelo.findById(id) 
                return done(null, usuario)
            }
        })



}