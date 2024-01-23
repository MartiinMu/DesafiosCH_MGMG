import { Router } from 'express';
export const router = Router()

import ProductManager from '../dao/Managers/ProductManagerMONGO.js';
import { Producto } from './productos.routerMONGO.js';
import { productosModelo } from '../dao/models/products.model.js';
import passport from 'passport';


const productoManager = new ProductManager()



router.get('/home', (req, res) => {


    res.status(200).render('home', { titulo: 'Home' })
})



router.get('/realtimeproducts', async (req, res) => {







    let { limit, page, category, precio } = req.query;
    const Filtro = req.query.filtro;
    const Valor = req.query.valor;
   

    //________________________FILTRO - LIMITE - PAGE ________

    if (limit) {
        limit = limit
    } else {
        limit = 4
    }

    if (page) {
        page = page
    } else {
        page = 1
    }






    //_____________________ FILTRO DE CATEGORIA _____________
    let optionFilter = {}



    if (category) {

        optionFilter = { category: category }

   } else if (Filtro && Valor) {

       
        optionFilter[Filtro] = Valor

       
    }












    //__________________FILTRO - SORT_____________________________________






    let options = {

        lean: true,
        limit: limit,
        page: page,


    }



    //__________________FILTRO - SORT_____________________________________

    if (precio == 'asc') {
        
        precio = 1
        options.sort = { precio: precio }
    } else if (precio == 'desc') {
        precio = -1
        options.sort = { precio: precio }
    }






    let products
    try {







        products = await productosModelo.paginate(optionFilter, options)



    } catch (error) {
        console.log(error)

    }

    let { prevlink, nextLink, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
    
    




    //____________ ENVIAR JSON para POSTMAN ___ ENVIA HTML para HANDELBARS __________


    const esSolicitudJSON = req.headers['content-type'] === 'application/json';

    if (esSolicitudJSON) {
        let status
        if (products) {
            status = "success"

        } else {
            status = "error"
        }

        if (hasPrevPage) {
            prevlink = "http://localhost:8080/realTimeProducts?page=" + prevPage
        } else {
            prevlink = null
        }
        if (hasNextPage) {
            nextLink = "http://localhost:8080/realTimeProducts?page=" + nextPage
        } else {
            nextLink = null
        }

        res.status(200).json({
            status,
            products: products.docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevlink,
            nextLink,
        })
    } else {

        res.status(201).render('realTimeProducts', { titulo: 'realTimeProducts', products: products.docs, prevlink, nextLink, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage })
    }







})



router.get('/carts/:cid', async (req, res) => {


    let id = req.params.cid




    let archivoOne
    try {
        archivoOne = await cartsModelo.findOne({ _id: id }).populate('products.product')
            
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }






    if (!archivoOne) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${id} no existe` })
    }


    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivoOne });


    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::







    let selectCart = cartsModelo.findOne({ _id: id }).projection({ _id: 0, id: 0, createdAt: 0, updatedAt: 0 })
    
   

    const esSolicitudJSON = req.headers['content-type'] === 'application/json';

    if (esSolicitudJSON) {
        res.status(200).json({ archivoOne });
    } else {

        res.status(201).render('cartId', { titulo: 'Producto cId', selectCart })
    }


})





router.get('/products', async (req, res) => {




    let usuarioCookie = req.session.usuario
    


    let { limit, page, category, precio } = req.query;
    const Filtro = req.query.filtro;
    const Valor = req.query.valor;
    



    //________________________FILTRO - LIMITE - PAGE ________

    if (limit) {
        limit = limit
    } else {
        limit = 4
    }

    if (page) {
        page = page
    } else {
        page = 1
    }






    //_____________________ FILTRO DE CATEGORIA _____________
    let optionFilter = {}



    if (category) {

        optionFilter = { category: category }

    } else if (Filtro && Valor) {

        optionFilter[Filtro] = Valor
    }




    //__________________FILTRO - SORT_____________________________________


    let options = {

        lean: true,
        limit: limit,
        page: page,
    }



    //__________________FILTRO - SORT_____________________________________

    if (precio == 'asc') {
        
        precio = 1
        options.sort = { precio: precio }
    } else if (precio == 'desc') {
        precio = -1
        options.sort = { precio: precio }
    }






    let products
    try {


        products = await productosModelo.paginate(optionFilter, options)



    } catch (error) {
        console.log(error)

    }

    let { prevlink, nextLink, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
    




    //____________ ENVIAR JSON para POSTMAN ___ ENVIA HTML para HANDELBARS __________


    const esSolicitudJSON = req.headers['content-type'] === 'application/json';

    if (esSolicitudJSON) {
        let status
        if (products) {
            status = "success"

        } else {
            status = "error"
        }

        if (hasPrevPage) {
            prevlink = "http://localhost:8080/realTimeProducts?page=" + prevPage
        } else {
            prevlink = null
        }
        if (hasNextPage) {
            nextLink = "http://localhost:8080/realTimeProducts?page=" + nextPage
        } else {
            nextLink = null
        }

        res.status(200).json({
            status,
            products: products.docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevlink,
            nextLink,
            
        })
    } else {

        res.status(201).render('products', { titulo: 'Products', products: products.docs, prevlink, nextLink, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage,usuarioCookie, estilo: "Button" })
    }







})





router.get('/products/:pid', async (req, res) => {


    let idParam = req.params.pid

    
    let archivoOne
    try {
        archivoOne = await productosModelo.findOne({ status: true, _id: idParam }).lean()
           } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }






    if (!archivoOne) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${idParam} no existe` })
    }




    let { id, title, description, code, price, status, stock, category, thumbnails } = archivoOne





    res.status(200).render('product', { titulo: 'product', id, idParam, title, description, code, price, status, stock, category, thumbnails, estilo: 'Product.css' });





})


router.get('/registro',(req,res)=>{

    let {error}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('registro', {error})
})




router.get('/',(req,res)=>{

    let {error, mensaje}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, mensaje})
})




