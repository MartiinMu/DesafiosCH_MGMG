import { CartService } from "../Services/carts.service.js";
import { productService } from "../Services/products.service.js";
import { TicketService } from "../Services/tickets.service.js";
import nodemailer from 'nodemailer'



import { cartsModelo } from "../dao/models/carts.model.js";
import { productosModelo } from "../dao/models/products.model.js";


export class CartController {
    constructor() { }

    static async createCarts(req, res) {


        let listaProductos = await CartService.getCart()


        //Incrementar el id
        let id = 1
        if (listaProductos.length > 0) {
            id = listaProductos[listaProductos.length - 1].id + 1
        }



        let products = []



        try {
            let nuevoProduct = await CartService.creatCart({ id, products })
     
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: nuevoProduct });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }







    }


    static async getCarts(req, res) {


        let archivoOne = await CartService.getCart()


        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ archivoOne });




    }

    static async getCartFilter(req, res) {







        let id = req.params.cid






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


        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ archivoOne });

    }


    static async getPurchase(req, res) {

        let id = req.params.cid



        let existProductsInCart = await CartService.getOneCart({ _id: id })
        existProductsInCart = existProductsInCart.products.length
        if (existProductsInCart == 0 || existProductsInCart == undefined || existProductsInCart == null) {
            const esSolicitudJSON = req.headers['content-type'] === 'application/json';
            if (esSolicitudJSON) {
                return res.status(200).json('NO EXISTE PRODUCTOS EN EL CARRITO');
            } else {
                return res.redirect('/products')
            }
        }




        let carritos = await CartService.getOneCart({ _id: id })

        let qProd = carritos.products

        let usuario = req.session.usuario




        let CartsConStock = []
        let CartsSinStock = []
        let precios = []


        for (let i = 0; i < carritos.products.length; i++) {

            let ProductoSolicitado = qProd[i].product
            let QprodSolicitado = qProd[i].quantity

            let stockDisponible = await productService.getOneProduct({ _id: ProductoSolicitado })
            stockDisponible = stockDisponible.stock


            if (QprodSolicitado < stockDisponible) {
             

                let prodConStock = await productService.getOneProduct({ _id: ProductoSolicitado })
                CartsConStock.push(prodConStock)

                let precio = await prodConStock.price
         
                precios.push(precio)
 
            } else {
                let prodSinStock = await productService.getOneProduct({ _id: ProductoSolicitado })
                CartsSinStock.push(prodSinStock)
        
            }



        }

        if (CartsConStock.length == 0 && CartsSinStock.length > 0) {
            const esSolicitudJSON = req.headers['content-type'] === 'application/json';
            if (esSolicitudJSON) {
                return res.status(200).json('TODAVIA NO HAY STOCK DE LOS PRODUCTOS. PORFAVOR CONTACTESE CON NOSOTROS PARA MAYOR INFORMACION');
            }
            let sinStock = true
           return res.status(201).render('purchase', { titulo: 'Ticket', sinStock })


        }



        let CartstoDelete = CartsConStock
       

        for (let i = 0; i < CartstoDelete.length; i++) {

            let idDelete = CartstoDelete[i]._id

            await CartService.findUpdate(
                {
                    _id: id
                }, {
                $pull: { products: { product: idDelete } }
            }

            )
        }

        function generarCodigo(longitud) {
            let codigo = '';
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            for (let i = 0; i < longitud; i++) {
                const indice = Math.floor(Math.random() * caracteres.length);
                codigo += caracteres.charAt(indice);
            }

            return codigo;
        }
        const codigoAleatorio = generarCodigo(6);
  
        let existCode = await TicketService.getOneticket({ codigoAleatorio })

        if (existCode) {
            return codigoAleatorio = generarCodigo(6)
        }



        let code = codigoAleatorio


     
        let amount = precios.reduce((total, precio) => total + precio, 0);

        let compraTicket = {
            code,
            amount, 
            purchaser: usuario.email,
            products: CartsConStock

        }
        




        try {
       
            let nuevoticket = await TicketService.creatticket(compraTicket)
    
        } catch (e) {
            console.log(e.menssage)
        }





        let ticket = await TicketService.getOneticket({ code: code })




        const transport=nodemailer.createTransport( 
            {
                service: 'gmail',
                port: 587, 
                auth: {
                    user: "munozmartin.dev@gmail.com", 
                    pass: "oqcd isbp dftr cflt" 
                }
            }
        )
        
        const enviar=()=>{
            return transport.sendMail(
                { 
                    from: "Martin G. Muñoz munozmartin.dev@gmail.com",
                    to: "munozmartin.dev@gmail.com",
                    subject: "Felicitaciones por la compra realizada",
                    html: ` 
        <h3 style="color:blue;">Felicitaciones por la compra realizada</h3>
        <h1 style="color:red;">Compraste muchas cosas</h1>
        Prueba...
        <p>Prueba... texto...!!!</p>
        ` 
                }
            )
        }
        
        enviar() 





        const esSolicitudJSON = req.headers['content-type'] === 'application/json';

        if (esSolicitudJSON) {
            res.status(200).json({ CartsConStock, carritos });
        } else {
           
            res.status(201).render('purchase', { titulo: 'Ticket', CartsConStock, carritos, usuario, ticket })
        }






    }

    static async addProduct(req, res) {



        let cid = req.params.cid

        let archivo
        try {
            archivo = await CartService.getOneCart({_id : cid})
            

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }




        if (!archivo) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${cid} no existe` })
        }






        let pid = req.params.pid
        


        let archivoPM
        try {

            archivoPM = await productService.getOneProduct({ status: true, _id: pid })

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }




        if (!archivoPM) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${pid} no existe` })
        }





        if (archivoPM) {

            archivo = await CartService.getOneCart({ _id: cid })
            archivo = archivo.products


            let prodFind = await CartService.getOneCart({ _id: cid })
            
            prodFind = prodFind.products.find(product => product.product.toString() === pid)

            let findQuantity
            if (prodFind == undefined) {
                let product = pid
                let quantity = 1
                let CreateProduct = await CartService.updateOneCart({ _id: cid }, { $push: { products: { product, quantity } } })



            } else {

                findQuantity = await CartService.getOneCart({ _id: cid })
                findQuantity = findQuantity.products
                findQuantity = findQuantity.find(product => product.product.toString() === pid)
                findQuantity = findQuantity.quantity
                findQuantity = findQuantity + 1




                await CartService.updateOneCart(
                    {
                        _id: cid
                    },
                    {
                        "$set": {
                            "products.$[elemX].quantity": findQuantity
                        }
                    },
                    {
                        "arrayFilters": [{ "elemX.product": pid }]
                    })


                

            }


            let CarritoActualizado

            if (prodFind == null) {
                CarritoActualizado = `Se Creo los campos product y quantity. Product = ${pid} y Quantity = 1`
            } else {
                CarritoActualizado = await CartService.getOneCart({ _id: cid })
            }


            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ CarritoActualizado });


        }



    }


    static async updateCart(req, res) {



        let idParam = req.params.cid


        let archivoOne
        try {

            archivoOne = await CartService.getPaginate({ _id: idParam })


        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }


        if (!archivoOne) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${idParam} no existe` })
        }











        let llavesEjemplos = {
            _id: "ejemplo",
            id: 1,
            products: [
                {
                    product: "ejemplo",
                    quantity: 123
                }
            ]
        }
        let llavesBody = Object.keys(req.body)
        llavesEjemplos = Object.keys(llavesEjemplos)


        const cotejoArrays = llavesBody.every((llaves) => llavesEjemplos.includes(llaves))

        if (!cotejoArrays) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Alguna/as de las propiedas no son permitidas` })
        }





        let objetoBody = req.body

        let ProductoEliminado = await CartService.findUpdate(
            { _id: idParam },
            { $set: { id: objetoBody.id, _id: objetoBody._id, products: objetoBody.products } }

        )


        const esSolicitudJSON = req.headers['content-type'] === 'application/json';

        if (esSolicitudJSON) {


            res.status(200).json({
                ProductoEliminado
            })
        }
    }



    static async updateCartProduct(req, res) {



        let idParam = req.params.cid


        let archivoOne
        try {

            archivoOne = await CartService.getPaginate({ _id: idParam })
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }


        if (!archivoOne) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${idParam} no existe` })
        }



        let pid = req.params.pid

        let archivoPM
        try {
   
            archivoPM = await productService.getOneProduct({ status: true, _id: pid })
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }




        if (!archivoPM) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${pid} no existe` })
        }




        let llavesEjemplos = { quantity: 123 }
        let llavesBody = Object.keys(req.body)
        llavesEjemplos = Object.keys(llavesEjemplos)


        const cotejoArrays = llavesBody.every((llaves) => llavesEjemplos.includes(llaves))

        if (!cotejoArrays) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Alguna/as de las propiedas no son permitidas` })
        }



        let bodyQuantity = req.body
        bodyQuantity = Object.values(bodyQuantity)
        bodyQuantity = bodyQuantity[0]


        let ProductoOriginal = await CartService.getPaginate({ _id: idParam })


        try {

            await CartService.findUpdate(
                {
                    _id: idParam
                },
                {
                    "$set": {
                        "products.$[elemX].quantity": bodyQuantity
                    }
                },
                {
                    "arrayFilters": [{ "elemX.product": pid }]
                })


        } catch (err) {
            console.log(err.message)
        }



        let ProductoActualizado = await CartService.getPaginate({ _id: idParam })



        const esSolicitudJSON = req.headers['content-type'] === 'application/json';

        if (esSolicitudJSON) {


            res.status(200).json({
                ProductoOriginal: ProductoOriginal.docs, ProductoActualizado: ProductoActualizado.docs
            })
        }






    }


    static async deleteProduct(req, res) {



        let id = req.params.cid
        let archivo
        try {
            archivo = await CartService.getOneCart({ _id: id })

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }




        if (!archivo) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${id} no existe` })
        }





        let pid = req.params.pid



        let archivoPM
        try {

            archivoPM = await productService.getOneProduct({ status: true, _id: pid })
           
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }




        if (!archivoPM) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${pid} no existe` })
        }





        if (archivoPM) {


            archivo = await CartService.getOneCart({ _id: id })
            archivo = archivo.products

            let prodFind = await CartService.getOneCart({ _id: id })



            let ProductoEliminado

            if (prodFind == undefined) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `El id ${pid} no existe` })
            } else {


                ProductoEliminado = await CartService.findUpdate(
                    { _id: id },
                    { $pull: { products: { product: pid } } }

                );
            }


            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ ProductoEliminado });

        }
    }


    static async deleteCart(req, res) {



        let id = req.params.cid
        let archivo
        try {
            archivo = await CartService.getOneCart({ _id: id })

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }




        if (!archivo) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${id} no existe` })
        }



        let ProductoEliminado = await CartController.findUpdate(
            { _id: id },
            { $set: { products: [] } },
        );



        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ ProductoEliminado });

    }



}