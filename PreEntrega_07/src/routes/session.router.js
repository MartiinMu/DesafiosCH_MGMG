import { Router } from 'express'
import { usuariosModelo } from '../dao/models/user.modelo.js'
import { creaHash, validaPassword,generaToken } from '../utils.js'
export const router = Router()
import passport from 'passport'







router.get('/errorLogin', (req, res) => {
    return res.redirect('/?error=Error en el proceso de registro')
})


router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/errorLogin' }), async (req, res) => {


    req.session.usuario = {
        nombre: req.user.nombre, email: req.user.email, rol: req.user.rol
    }

    let token=generaToken(req.user)
    res.cookie("coderCookie", token, {httpOnly:true, maxAge: 1000*60*60})

    

    res.redirect('/products')

})






router.get('/errorRegistro', (req, res) => {
    return res.redirect('/registro?error=Error en el proceso de registro')
})

router.post('/registro', passport.authenticate('registro', { failureRedirect: '/api/sessions/errorRegistro' }), async (req, res) => {


    let { email } = req.body


    res.redirect(`/?mensaje=Usuario ${email} registrado correctamente`)


})







router.get('/logout', (req, res) => {

    req.session.destroy(error => {
        if (error) {
            res.redirect('/?error=fallo en el logout')
        }
    })

    res.redirect('/')

});



router.get('/github', passport.authenticate('github', {}), (req, res) => { })

router.get('/callbackGithub', passport.authenticate('github', { failureRedirect: "/api/sessions/errorGithub" }), (req, res) => {


    req.session.usuario = req.user


    res.redirect('/products')

})

router.get('/errorGithub', (req, res) => {

    return res.redirect('/?error=Configurar Github con un email publico')



});