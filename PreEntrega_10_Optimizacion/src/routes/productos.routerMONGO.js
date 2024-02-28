import { ProductsController } from '../Controller/products.controller.js';
import { Router } from 'express';
import { Acceso } from '../utils.js';
export const router = Router()



router.get('/', Acceso(["ADMIN"]),ProductsController.getProducts)


router.get('/:pid',Acceso(["ADMIN"]), ProductsController.getProduct)


router.post('/',Acceso(["ADMIN"]), ProductsController.postProduct)


router.put('/:pid',Acceso(["ADMIN"]), ProductsController.productUpdate)


router.delete('/:pid',Acceso(["ADMIN"]), ProductsController.deleteProduct)



