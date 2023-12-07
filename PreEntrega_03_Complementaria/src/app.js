import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io'
import mongoose from 'mongoose'





import {router as routerProductos} from './routes/productos.routerMONGO.js'
import {router as routerCarts} from './routes/carts.routerMONGO.js'
import { router as routerRealTimeProducts } from './routes/realTimeProducts.router.js';




const PORT = 8080
const app = express()


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));



app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/', routerRealTimeProducts)
app.use('/api/products', routerProductos)
app.use('/api/carts', routerCarts)

app.use(express.static(path.join(__dirname,'/public')));



const server = app.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`)
})


export const io=new Server(server)



io.on("connection", socket => {    
    console.log(`cliente conectado`)
})


try {
    await mongoose.connect('mongodb+srv://martingustavom:Coderhouse2023@cluster0.czbpnhg.mongodb.net/?retryWrites=true&w=majority',{dbName: 'ecommerces'})
    
    console.log('DB Online...!!!')
} catch (error) {
    console.log(error.message)
}













