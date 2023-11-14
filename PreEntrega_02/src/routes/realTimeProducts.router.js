import { Router } from 'express';
export const router=Router()


import ProductManager from '../Managers/ProductManager.js';
import { Producto } from './productos.router.js';







router.get('/',async (req,res)=>{

    let products= await Producto.getProducts()

    res.status(200).render('home', {
        products, titulo: 'Home'})
})




router.get('/realtimeproducts',async (req,res)=>{

    let products= await Producto.getProducts()

    res.status(200).render('realTimeProducts', {
        products, titulo:'Real Time Products'
    })
})