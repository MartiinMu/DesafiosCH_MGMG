import { CartService } from "../Services/carts.service.js";
import { productService } from "../Services/products.service.js";


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
            // cartsModelo.create({ id, products })


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


    static async addProduct(req, res) {



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






        // _____________________VALIDAR QUE EL PRODUCTO EXISTA _________________




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
            prodFind = prodFind.products.find(product => product.product.toString() === pid)

            let findQuantity
            if (prodFind == undefined) {
                let product = pid
                let quantity = 1
                let CreateProduct = await CartService.updateOneCart({ _id: id }, { $push: { products: { product, quantity } } })



            } else {

                findQuantity = await CartService.getOneCart({ _id: id })
                findQuantity = findQuantity.products
                findQuantity = findQuantity.find(product => product.product.toString() === pid)
                findQuantity = findQuantity.quantity
                findQuantity = findQuantity + 1




                await CartService.updateOneCart(
                    {
                        _id: id
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
                // CarritoActualizado = await cartsModelo.findOne({ _id: id })
                CarritoActualizado = await CartService.getOneCart({ _id: id })
            }


            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ CarritoActualizado });


        }



    }



    static async updateCart(req, res) {



        let idParam = req.params.cid


        let archivoOne
        try {
        
            archivoOne = await CartService.getPaginate({_id: idParam})


        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }


        if (!archivoOne) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El id ${idParam} no existe` })
        }












        // ----> VERIFICAR que las LLAVES  ________________________-




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





        //__________________________________________________

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
        
            archivoOne = await CartService.getPaginate({_id: idParam})
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
            // archivoPM = await productosModelo.findOne({ status: true, _id: pid })
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





        //__________________________________________________

        let bodyQuantity = req.body
        bodyQuantity = Object.values(bodyQuantity)
        bodyQuantity = bodyQuantity[0]
    

        let ProductoOriginal = await CartService.getPaginate({_id: idParam})
    
        // let ProductoOriginal = await cartsModelo.paginate({ _id: idParam })
    
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
    
    
    
        let ProductoActualizado = await CartService.getPaginate({_id: idParam})
    
    
        
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






        // _____________________VALIDAR QUE EL PRODUCTO EXISTA _________________




        let pid = req.params.pid



        let archivoPM
        try {

            archivoPM = await productService.getOneProduct({ status: true, _id: pid })
            // archivoPM = await productosModelo.findOne({ status: true, _id: pid })
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
    
    
                ProductoEliminado =  await CartService.findUpdate(
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