
import CartsManager from '../dao/Managers/CartsManagerMONGO.js';
const ProductoCM = new CartsManager()

import ProductManager from '../dao/Managers/ProductManagerMONGO.js';
const Producto = new ProductManager()


import { Router } from 'express';
import { cartsModelo } from '../dao/models/carts.model.js';
import { productosModelo } from '../dao/models/products.model.js';
export const router = Router()






router.post('/', async (req, res) => {

    let listaProductos = await ProductoCM.getProdCarts()


    //Incrementar el id
    let id = 1
    if (listaProductos.length > 0) {
        id = listaProductos[listaProductos.length - 1].id + 1
    }

    let products = []

    let nuevoProduct = {
        id, products
    }


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
        console.log( archivoPM)
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
   
    let codigoProd = archivoPM.code
   
   
    let Product = await Producto.getProducts()
    // Product = JSON.stringify(Product)
    let indicePCM = Product.findIndex(prod => prod.code === codigoProd)
    // let indiceProductos = Product.findIndex(prod => prod._id === idParamMongoose)
    console.log('Este es el indice de los productos :   '+indicePCM)
    if (indicePCM === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen usuarios con id ${idParam}` })
    }
   
   
   
   
   
   
   
   
   
   
   
   
    // let indicePCM = archivoCM.findIndex(prod => prod._id === id)







 //____ ArchivoPM = true -> el producto en producot.json existe

    if (archivoPM) {
                            // archivo carts, busca el carrito, ahi el porduct y ahi quantity
        


        let prodFind = archivoCM[indicePCM].products.find((prod) => prod.product === pid)

        if (prodFind){
            if (!prodFind.quantity) {
                prodFind.quantity = 0
            }
            prodFind.quantity = prodFind.quantity + 1
        } else {
            let product = archivoPM._id
            let quantity = 1
            archivoCM[indicePCM].products.create({ product, quantity })

        }



        let ProductAdd =  archivoCM[indicePCM]
         

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ archivoCM, ProductAdd });
        // return res.status(201).json({ archivoPM, product, archivoCM });
        


        


    }

}

)


