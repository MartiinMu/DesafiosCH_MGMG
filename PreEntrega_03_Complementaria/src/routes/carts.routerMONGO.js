
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






    // archivoPM = archivoPM.find((prod) => prod.id === pid)

    if (!archivoPM) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${pid} no existe` })
    }











    // MUESTRA EL ID del producto selecionado /:pid


    // indice del producto _________________________________________________

    // let codigoProd = archivoPM.code


    // let Product = await Producto.getProducts()      // Todos los productos 
    // // Product = JSON.stringify(Product)
    // let indicePCM = Product.findIndex(prod => prod.code === codigoProd)     // ---> Indice del producto ID
    // // let indiceProductos = Product.findIndex(prod => prod._id === idParamMongoose)
    // console.log('Este es el indice de los productos :   '+indicePCM)
    // if (indicePCM === -1) {
    //     res.setHeader('Content-Type', 'application/json');
    //     return res.status(400).json({ error: `No existen usuarios con id ${idParam}` })
    // }












    // let indicePCM = archivoCM.findIndex(prod => prod._id === id)







    //____ ArchivoPM = true -> el producto en producot.json existe



    if (archivoPM) {

        // updateRegistroCliente()


        // updateRegistroCliente(clienteID, registroObject) {
        //     const updatedObject= ClienteModel.findByIdAndUpdate(clienteID,
        //         { $push: { 'registros': registroObject} },
        //         { strict: false },
        //         (err, managerparent) => {
        //             if (err) {
        //                 return err.message;
        //             }
        //         }
        //     );
        //     return updatedObject;











        // archivo carts, busca el carrito, ahi el porduct y ahi quantity

        archivo = await cartsModelo.findOne({ _id: id})
        archivo = archivo.products
        console.log('VER QUE ONDA CON EL PRODUCTS')
        console.log(archivo)
        // 
        // let prodFind = await cartsModelo.findOne({ _id: id }).products
        let prodFind = await cartsModelo.findOne({_id:id,products:{$elemMatch:{product:pid}}})
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
            findQuantity =  findQuantity.products.find((prod) => prod.product === pid)
            findQuantity = findQuantity.quantity
           
            findQuantity = findQuantity + 1 


            let Romita = await cartsModelo.updateOne(
                { 
                     _id: id 
                },
                {
                    "$set":{
                        "products.$[elemX].quantity":findQuantity
                    }
                },
                { 
                    "arrayFilters":[{"elemX.product":pid}]
                } )

            

        
          
        }


        let CarritoActualizado

        if (prodFind == null) {
            CarritoActualizado = `Se Creo los campos product y quantity. Product = ${pid} y Quantity = ${findQuantity}`
        } else {
            CarritoActualizado = await cartsModelo.findOne({ _id: id })
        }






        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ CarritoActualizado});
        // return res.status(201).json({ archivoPM, product, archivoCM });






    }

}

)


