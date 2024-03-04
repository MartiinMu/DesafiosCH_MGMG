import { productService } from "../Services/products.service.js";
import { CartService } from "../Services/carts.service.js";
import { generaProducto } from "../Mocks/products.mocks.js";



export class ViewsController {
    constructor() { }

    static async home(req, res) {

        res.status(200).render('home', { titulo: 'Home' })

    }


    static async realTimeproducts(req, res) {


        let { limit, page, category, precio } = req.query;
        const Filtro = req.query.filtro;
        const Valor = req.query.valor;


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


        let optionFilter = {}

        if (category) {

            optionFilter = { category: category }

        } else if (Filtro && Valor) {


            optionFilter[Filtro] = Valor


        }


        let options = {

            lean: true,
            limit: limit,
            page: page,


        }


        if (precio == 'asc') {

            precio = 1
            options.sort = { precio: precio }
        } else if (precio == 'desc') {
            precio = -1
            options.sort = { precio: precio }
        }


        let products
        try {


            products = await productService.getPaginate(optionFilter, options)





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




    }


    static async getCartById(req, res) {


        let id = req.params.cid

        let existProductsInCart = await CartService.getOneCart({ _id: id })
        existProductsInCart = existProductsInCart.products.length

        if (existProductsInCart == 0 || existProductsInCart == undefined || existProductsInCart == null) {


            const esSolicitudJSON = req.headers['content-type'] === 'application/json';

            if (esSolicitudJSON) {
                return res.status(200).json('NO EXISTE PRODUCTOS EN EL CARRITO');
            } else {
                let mensaje = 'NO EXISTE PRODUCTOS EN EL CARRITO'
              return  res.status(201).render('cart', { titulo: 'Producto cId', mensaje })
            }
        }



        let usuarioCookie = req.session.usuario




        let archivoOne
        try {

            archivoOne = await CartService.getOneCartPopulate({ _id: id }, 'products.product')

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }






        if (!archivoOne) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${id} no existe` })
        }




        let selectCart = await CartService.getByIdProjection({ _id: id }, { _id: 0, id: 0, createdAt: 0, updatedAt: 0 })



        let cartArray = []

        let cart = await CartService.getOneCart({ _id: id })
        let longitud = cart.products.length
       

        let idProduct
        for (let i = 0; i < longitud; i++) {
            idProduct = cart.products[i].product

            let Product = await productService.getOneProduct({ _id: idProduct })

      



            cartArray.push({ _id: idProduct })


        }





        cartArray = await productService.getPaginate({ cartArray })



        const esSolicitudJSON = req.headers['content-type'] === 'application/json';

        if (esSolicitudJSON) {
            res.status(200).json({ archivoOne });
        } else {
            

            res.status(201).render('cart', { titulo: 'Producto cId', cartArray, usuarioCookie, selectCart, cart: cart.products })
        }



    }


    static async Products(req, res) {



        let usuarioCookie = req.session.usuario



        let { limit, page, category, precio } = req.query;
        const Filtro = req.query.filtro;
        const Valor = req.query.valor;



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


        let optionFilter = {}


        if (category) {

            optionFilter = { category: category }

        } else if (Filtro && Valor) {

            optionFilter[Filtro] = Valor
        }


        let options = {

            lean: true,
            limit: limit,
            page: page,
        }



        if (precio == 'asc') {

            precio = 1
            options.sort = { precio: precio }
        } else if (precio == 'desc') {
            precio = -1
            options.sort = { precio: precio }
        }






        let products
        try {


            products = await productService.getPaginate(optionFilter, options)


        } catch (error) {
            console.log(error)

        }

        let { prevlink, nextLink, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products




        res.status(201).render('products', { titulo: 'Products', products: products.docs, prevlink, nextLink, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, usuarioCookie, estilo: "Button" })

    }


    static async getProductsById(req, res) {



        let idParam = req.params.pid


        let archivoOne
        try {
            archivoOne = await productService.getOneProduct({ status: true, _id: idParam })

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }

        if (!archivoOne) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${idParam} no existe` })
        }

        let { id, title, description, code, price, status, stock, category, thumbnails } = archivoOne

        res.status(200).render('product', { titulo: 'product', id, idParam, title, description, code, price, status, stock, category, thumbnails, estilo: 'Product' });

    }

    static async getRegistro(req, res) {

        let { error } = req.query

        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('registro', { error })
    }


    static async getLogin(req, res) {
        let { error, mensaje } = req.query

        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('login', { error, mensaje })
    }


    static async mockingProducts(req,res){
        

        let fakerProducts = []
        for (let i=0; i < 101 ; i++){

            let fakeProduct = generaProducto()
            fakerProducts.push(fakeProduct)

        }

        
        
        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('mockingProducts', {fakerProducts })
        

    }


    static async loggerTest(req,res){

        
        

        req.logger.error("LOGGER TIPO ERROR")
        req.logger.debug('LOGGER TIPO DEBUG')
        req.logger.http('LOGGER TIPO HTTP')
        req.logger.info('LOGGER TIPO INFO')
        req.logger.warning('LOGGER TIPO WARNING')
        req.logger.error('LOGGER TIPO ERROR')
        req.logger.fatal('LOGGER TIPO FATAL')


        res.status(200).render('home')

    }





}