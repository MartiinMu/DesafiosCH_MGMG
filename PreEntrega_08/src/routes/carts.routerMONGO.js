import { CartController } from '../Controller/cart.controller.js';
import { Router } from 'express';
export const router = Router()





router.post('/',CartController.createCarts)


router.get('/', CartController.getCarts)


router.get('/:cid', CartController.getCartFilter)


router.post('/:cid/product/:pid',CartController.addProduct)


router.put('/:cid',CartController.updateCart)


router.put('/:cid/product/:pid',CartController.updateCartProduct)


router.delete('/:cid/product/:pid',CartController.deleteProduct)


router.delete('/:cid', CartController.deleteCart)


