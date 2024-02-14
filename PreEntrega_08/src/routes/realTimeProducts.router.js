import { Router } from 'express';
export const router = Router()
import { ViewsController } from '../Controller/views.controller.js';





router.get('/home', ViewsController.home)

router.get('/realtimeproducts', ViewsController.realTimeproducts)

router.get('/carts/:cid', ViewsController.getCartById) //---> Falta agregar vista, del carrito donde se agrega el producto

router.get('/products', ViewsController.Products)

router.get('/products/:pid', ViewsController.getProductsById)

router.get('/registro', ViewsController.getRegistro)

router.get('/', ViewsController.getLogin)






