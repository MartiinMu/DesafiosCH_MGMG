import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io'



import {router as routerProductos} from './routes/productos.router.js'
import {router as routerCarts} from './routes/carts.router.js'
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

















