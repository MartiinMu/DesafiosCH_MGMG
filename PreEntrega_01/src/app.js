
import express from 'express';
import {router as routerProductos} from './routes/productos.router.js'
import {router as routerCarts} from './routes/carts.router.js'



const PORT = 8080
const app = express()


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', routerProductos)
app.use('/api/carts', routerCarts)


app.get('/', async (req, res) => {

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`Bienvenidos! - Desafios: Product Manager`);
})



const server = app.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`)
})




















