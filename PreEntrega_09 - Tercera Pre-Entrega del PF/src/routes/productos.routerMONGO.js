
import ProductManager from '../dao/Managers/ProductManagerMONGO.js';
export const Producto = new ProductManager()
import { io } from '../app.js';
import mongoose from 'mongoose';
import { productosModelo } from '../dao/models/products.model.js';
import { ProductsController } from '../Controller/products.controller.js';



import { Router } from 'express';
export const router = Router()



router.get('/', ProductsController.getProducts)


router.get('/:pid', ProductsController.getProduct)


router.post('/', ProductsController.postProduct)


router.put('/:pid', ProductsController.productUpdate)


router.delete('/:pid', ProductsController.deleteProduct)



