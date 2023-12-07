import { Router } from 'express';
export const router=Router()

import ProductManager from '../dao/Managers/ProductManagerMONGO.js';


const productoManager = new ProductManager()








router.get('/',(req,res)=>{


    res.status(200).render('home', {titulo: 'Home'})
})




router.get('/realtimeproducts',async (req,res)=>{




    let products= await productoManager.getProducts()
    console.log(products)

    res.status(200).render('realTimeProducts', {
        products, titulo:'Real Time Products'
    })
})