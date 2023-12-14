
import CartsManager from '../dao/Managers/CartsManagerMONGO.js';
const ProductoCM = new CartsManager()

import ProductManager from '../dao/Managers/ProductManagerMONGO.js';
const Producto = new ProductManager()


import { Router } from 'express';
import { cartsModelo } from '../dao/models/carts.model.js';
import { productosModelo } from '../dao/models/products.model.js';
export const router = Router()






router.post('/', async (req, res) => {
    // let listaProductos = await cartsModelo.findOnd().lean()

    let listaProductos = await ProductoCM.getProdCarts()
    console.log(listaProductos)


    //Incrementar el id
    let id = 1
    if (listaProductos.length > 0) {
        id = listaProductos[listaProductos.length - 1].id + 1
    }



    let products = []

    console.log(id + products)


    try {
        let nuevoProduct = await cartsModelo.create({ id, products })


        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: nuevoProduct });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }




}
)

router.get('/', async (req, res) => {


    let archivoOne = await ProductoCM.getProdCarts()

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivoOne });

})


router.get('/:cid', async (req, res) => {


    let id = req.params.cid




    let archivoOne
    try {
        archivoOne = await cartsModelo.findOne({ _id: id })
        console.log(archivoOne)
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








})




router.post('/:cid/product/:pid', async (req, res) => {


    // _______________VALIDAR QUE EXISTA EL CARRITO ________________

    let archivoCM = await ProductoCM.getProdCarts()

    let id = req.params.cid





    let archivo
    try {
        archivo = await cartsModelo.findOne({ _id: id })
        console.log(archivo)
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
        archivoPM = await productosModelo.findOne({ status: true, _id: pid })
        console.log(archivoPM)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }




    if (!archivoPM) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${pid} no existe` })
    }





    if (archivoPM) {



        archivo = await cartsModelo.findOne({ _id: id })
        archivo = archivo.products
        console.log('VER QUE ONDA CON EL PRODUCTS')
        console.log(archivo)
        // 
        // let prodFind = await cartsModelo.findOne({ _id: id }).products
        let prodFind = await cartsModelo.findOne({ _id: id, products: { $elemMatch: { product: pid } } })
        console.log('comienza el prodfind')
        console.log(prodFind)
        console.log('Termina el prodfind')

        let findQuantity
        //___________ Si PRODUCTS no tiene PRODUCT __________
        if (prodFind == undefined) { // --> Si no tiene product SE CREA
            console.log('PASO ALGO EN EL UNDEFINED ')
            let product = pid
            let quantity = 1
            let CreateProduct = await cartsModelo.updateOne({ _id: id }, { $push: { products: { product, quantity } } })



            console.log(CreateProduct)

        } else {

            findQuantity = await cartsModelo.findOne({ _id: id })
            findQuantity = findQuantity.products.find((prod) => prod.product === pid)
            findQuantity = findQuantity.quantity

            findQuantity = findQuantity + 1


            await cartsModelo.updateOne(
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
            CarritoActualizado = `Se Creo los campos product y quantity. Product = ${pid} y Quantity = ${findQuantity}`
        } else {
            CarritoActualizado = await cartsModelo.findOne({ _id: id })
        }






        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ CarritoActualizado });







    }

}

)



router.put('/:cid', async (req, res) => {




    let idParam = req.params.cid

    // ---> SI existe el CART 

    let archivoOne
    try {
        archivoOne = await cartsModelo.paginate({ _id: idParam })
        console.log(archivoOne)
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



    let ProductoEliminado = await cartsModelo.findOneAndUpdate(
        { _id: idParam },
        { $set: { id: objetoBody.id, _id: objetoBody._id, products: objetoBody.products } }

    )










    const esSolicitudJSON = req.headers['content-type'] === 'application/json';

    if (esSolicitudJSON) {


        res.status(200).json({
            ProductoEliminado
        })
    }


    //  else {

    //    res.status(201).render('realTimeProducts', { titulo: 'realTimeProducts', products: products.docs, prevlink, nextLink,totalPages, hasNextPage, hasPrevPage, prevPage, nextPage })
    //  }









})



router.put('/:cid/product/:pid', async (req, res) => {




    let idParam = req.params.cid

    // ---> SI existe el CART 

    let archivoOne
    try {
        archivoOne = await cartsModelo.paginate({ _id: idParam })
        // console.log( archivoOne)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }


    if (!archivoOne) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${idParam} no existe` })
    }




    //____________Verificar que exista el PRODUCTO ______



    let pid = req.params.pid

    let archivoPM
    try {
        archivoPM = await productosModelo.findOne({ status: true, _id: pid })
        // console.log(archivoPM)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }




    if (!archivoPM) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${pid} no existe` })
    }











    // ----> VERIFICAR que las LLAVES  ________________________-




    let llavesEjemplos = { quantity: 123 }
    let llavesBody = Object.keys(req.body)
    llavesEjemplos = Object.keys(llavesEjemplos)


    const cotejoArrays = llavesBody.every((llaves) => llavesEjemplos.includes(llaves))
    console.log(cotejoArrays)
    if (!cotejoArrays) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Alguna/as de las propiedas no son permitidas` })
    }





    //__________________________________________________

    let bodyQuantity = req.body
    bodyQuantity = Object.values(bodyQuantity)
    bodyQuantity = bodyQuantity[0]
    console.log(bodyQuantity)


    let ProductoOriginal = await cartsModelo.paginate({ _id: idParam })

    try {

        await cartsModelo.updateOne(
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



    let ProductoActualizado = await cartsModelo.paginate({ _id: idParam })









    const esSolicitudJSON = req.headers['content-type'] === 'application/json';

    if (esSolicitudJSON) {


        res.status(200).json({
            ProductoOriginal: ProductoOriginal.docs, ProductoActualizado: ProductoActualizado.docs
        })
    }


    //  else {

    //    res.status(201).render('realTimeProducts', { titulo: 'realTimeProducts', products: products.docs, prevlink, nextLink,totalPages, hasNextPage, hasPrevPage, prevPage, nextPage })
    //  }









})



router.delete('/:cid/product/:pid', async (req, res) => {


    // _______________VALIDAR QUE EXISTA EL CARRITO ________________

    let archivoCM = await ProductoCM.getProdCarts()

    let id = req.params.cid





    let archivo
    try {
        archivo = await cartsModelo.findOne({ _id: id })
        console.log(archivo)
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
        archivoPM = await productosModelo.findOne({ status: true, _id: pid })
        console.log(archivoPM)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }




    if (!archivoPM) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${pid} no existe` })
    }












    // _______SI EL PRODUCTO EXISTE ______________________



    if (archivoPM) {


        // ---> Se busca el CARRITO
        archivo = await cartsModelo.findOne({ _id: id })
        archivo = archivo.products
        console.log('VER QUE ONDA CON EL PRODUCTS')
        console.log(archivo)
        // 
        // let prodFind = await cartsModelo.findOne({ _id: id }).products







        //---> Se busca el carrito que coincida con el ID PRODUCTO
        let prodFind = await cartsModelo.findOne({ _id: id, products: { $elemMatch: { product: pid } } })
        console.log('comienza el prodfind')
        console.log(prodFind)
        console.log('Termina el prodfind')

        let findQuantity




        //___________ Si PRODUCTS no tiene PRODUCT __________


        let ProductoEliminado

        if (prodFind == undefined) {
            console.log('EL PRODUCTO NO EXISTE  UNDEFINED::::::::::::::::::::::::::::::::::::::::::: ')

        } else {


            ProductoEliminado = await cartsModelo.updateOne(
                { _id: id },
                { $pull: { products: { product: pid } } }, // $pull para eliminar el objeto del array
                // (err) => {
                //     if (err) {
                //         console.log('Ocurrio un error al eliminar  ' + err.message)
                //     } else {
                //         console.log(`Porducto con el ${pid} Eliminado correctamente`)
                //     }
                // }
            );




        }









        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ ProductoEliminado });







    }

}

)



router.delete('/:cid', async (req, res) => {


    // _______________VALIDAR QUE EXISTA EL CARRITO ________________

    let id = req.params.cid





    let archivo
    try {
        archivo = await cartsModelo.findOne({ _id: id })
       console.log('::::::::::::::::::::::::::::::::::::::::::::::::::::')
        console.log(archivo)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }






    if (!archivo) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${id} no existe` })
    }





    let ProductoEliminado = await cartsModelo.updateOne(
        { _id: id },
        { $set: { products: [] } },
    );









    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ ProductoEliminado });









}

)
