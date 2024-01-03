import { Router } from 'express'
import { usuariosModelo} from '../dao/models/usuarios.modelo.js'
// import crypto from 'crypto'
import { creaHash,validaPassword } from '../utils.js'
export const router = Router()
import passport from 'passport'







router.get('/errorLogin',(req,res)=>{
    return res.redirect('/registro?error=Error en el proceso de registro')
})


router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), async(req, res)=>{

    // let {email, password}=req.body

 


    // if(!email || !password){
      
    //     return res.redirect('/?error=Complete todos los datos')
      
    // }

    

    

    // if (email=="adminCoder@coder.com" && password== "adminCod3r123"){
      
    //     // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex") // encriptar clave
    //     password = creaHash(password)
    //     let usuario = {
    //         nombre:"admin", email: email, rol:"admin"
    //     }
             
      
    //     req.session.usuario={
    //         nombre:"admin", email: email, rol:"admin"
            
    //     }
      


    // } else {
        
       
     



    //     let usuario=await usuariosModelo.findOne({email})

    //     if(!usuario){
        
    //         return res.redirect(`/?error=credenciales incorrectas`)
    //     }

    //     if(!validaPassword(usuario, password)){
        
    //         return res.redirect(`/?error=credenciales incorrectas`)
    //     }




    //     req.session.usuario={
    //         nombre:usuario.nombre, email:usuario.email, rol:'usuario'
    //     }
        
    // }


    

    req.session.usuario={
                nombre:req.user.nombre, email:req.user.email, rol:req.user.rol
            }
            






    

    res.redirect('/products')

})






router.get('/errorRegistro',(req,res)=>{
    return res.redirect('/registro?error=Error en el proceso de registro')
})

router.post('/registro',passport.authenticate('registro', {failureRedirect:'/api/sessions/errorRegistro'}),async(req,res)=>{


    let {email} = req.body
    // let {nombre, email, password}=req.body
    // if(!nombre || !email || !password){
    //     return res.redirect('/registro?error=Complete todos los datos')
    // }

    // let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
    // console.log(regMail.test(email))
    // if(!regMail.test(email)){
    //     return res.redirect('/registro?error=Mail con formato incorrecto...!!!')
    // }

    // let existe=await usuariosModelo.findOne({email})
    // if(existe){
    //     return res.redirect(`/registro?error=Existen usuarios con email ${email} en la BD`)
    // }
    
    
    
    
    
    
    // if (email=="adminCoder@coder.com"){
        


    //     return res.redirect(`/registro?error=Ingrese otro email - email invalido`)

        

    // } else {
    //    let usuario
    //    let rol = "usuario"
    //     try {
    //         // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")
    //         password=creaHash(password) 
    //         console.log('hash nuevooooooooo ' + password)
    //         usuario=await usuariosModelo.create({nombre, email, password, rol})
    //         res.redirect(`/?mensaje=Usuario ${email} registrado correctamente`)
            
    //     } catch (error) {
    //         res.redirect('/registro?error=Error inesperado. Reintente en unos minutos')
    //     }

    // }
    
    
    res.redirect(`/?mensaje=Usuario ${email} registrado correctamente`)
    
    
})







router.get('/logout',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/?error=fallo en el logout')
        }
    })

    res.redirect('/')

});



router.get('/github',passport.authenticate('github',{}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/session/errorGithub"}),(req,res)=>{

    console.log(req.user)
    req.session.usuario=req.user
  

    res.redirect('/products')

})

router.get('/errorGithub',(req,res)=>{

    res.setHeader('Content-type', 'application/json');
    res.status(200).json({
        error:"Error al autenticar con Github"
    });

    

});