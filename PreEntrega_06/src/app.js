import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io'
import mongoose from 'mongoose'
import { messagesModelo } from './dao/models/message.model.js';
import sessions from 'express-session'
import mongoStore from 'connect-mongo'






import {router as routerProductos} from './routes/productos.routerMONGO.js'
import {router as routerCarts} from './routes/carts.routerMONGO.js'
import { router as routerRealTimeProducts } from './routes/realTimeProducts.router.js';
import { router as routerMessages } from './routes/messages.router.js';
import { router as sessionRouter } from './routes/session.router.js';

import { inicializarPassport } from './config/config.passport.js';
import passport from 'passport';




const PORT = 8080
const app = express()


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(sessions(
    {
        secret:"codercoderhouse",
        resave: true, saveUninitialized: true,
        store: mongoStore.create(
            {
                mongoUrl:'mongodb+srv://martingustavom:Coderhouse2023@cluster0.czbpnhg.mongodb.net/?retryWrites=true&w=majority',
                mongoOptions:{dbName: 'ecommerces'},
                ttl:3600
            }
        )
    }
))


inicializarPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routerRealTimeProducts)
app.use('/api/products', routerProductos)
app.use('/api/carts', routerCarts)
app.use('/chat', routerMessages)
app.use('/api/sessions',sessionRouter)


app.use(express.static(path.join(__dirname,'/public')));






const server = app.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`)
})


export const io=new Server(server)






try {
    await mongoose.connect('mongodb+srv://martingustavom:Coderhouse2023@cluster0.czbpnhg.mongodb.net/?retryWrites=true&w=majority',{dbName: 'ecommerces'})
    
    console.log('DB Online...!!!')
} catch (error) {
    console.log(error.message)
}


let usuarios=[]
let mensajes=[]









io.on("connection",socket =>{  
    console.log(`Se ha conectado un cliente con id ${socket.id}`)

    
    socket.on('id',nombre=>{

        usuarios.push({nombre, id:socket.id})   
        socket.broadcast.emit('nuevoUsuario',nombre)
        socket.emit("hello",mensajes)
    })

    socket.on('mensaje', datos=>{
        mensajes.push(datos)
        io.emit('nuevoMensaje', datos)


  
    messagesModelo.create({user:datos.emisor,message:datos.mensaje})
        

       


       
    })

    socket.on("disconnect",()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("usuarioDesconectado", usuario.nombre)
        }
    })

})



console.log("El utlima CONSOLE LOG " + mensajes)

