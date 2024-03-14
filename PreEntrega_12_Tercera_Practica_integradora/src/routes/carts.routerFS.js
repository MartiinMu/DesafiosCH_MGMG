
import CartsManager from '../Managers/CartsManager.js';
const ProductoCM = new CartsManager('./Archivos/carrito.json')

import ProductManager from '../Managers/ProductManager.js'
import { Producto } from './productos.routerFS.js';


import { Router } from 'express';
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

    listaProductos.push(nuevoProduct)

    await ProductoCM.saveProducts(listaProductos)

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ nuevoProduct });

}
)



router.get('/:cid', async (req, res) => {

    let archivo = await ProductoCM.getProdCarts()
    let id = req.params.cid
    id = parseInt(id)
    if (isNaN(id)) {

        return res.status(400).json({ error: "Error, ingrese un argumento id numerico" })
    }


    archivo = archivo.find((prod) => prod.id === id)


    if (!archivo) return res.status(400).json({ error: "El id ${id} no existe" })


    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivo });
})







router.post('/:cid/product/:pid', async (req, res) => {


    // _______________VALIDAR QUE EXISTA EL CARRITO ________________

    let archivoCM = await ProductoCM.getProdCarts()
    let archivo = archivoCM
    let id = req.params.cid
    id = parseInt(id)
    if (isNaN(id)) {

        return res.status(400).json({ error: "Error, ingrese un argumento id numerico" })
    }

    archivo = archivo.find((prod) => prod.id === id)

    if (!archivo) return res.status(400).json({ error: `El id ${id} no existe` })








    // _____________________VALIDAR QUE EL PRODUCTO EXISTA _________________

    // Validar pid sea numerico


    let pid = req.params.pid
    pid = parseInt(pid)
    if (isNaN(pid)) return res.status(400).json({ error: "Error, ingrese un argumento id numerico" })



    let archivoPM = await Producto.getProducts()
    archivoPM = archivoPM.find((prod) => prod.id === pid)

    if (!archivoPM) return res.status(400).json({ error: `El producto con el id ${pid} no existe` })




      




    // MUESTRA EL ID del producto selecionado /:pid


    // indice del producto _________________________________________________
    let indicePCM = archivoCM.findIndex(prod => prod.id === id)







 //____ ArchivoPM = true -> el producto en producot.json existe

    if (archivoPM) {
                            // archibo carts, busca el carrito, ahi el porduct y ahi quantity
        


        let prodFind = archivoCM[indicePCM].products.find((prod) => prod.product === pid)

        if (prodFind){
            if (!prodFind.quantity) {
                prodFind.quantity = 0
            }
            prodFind.quantity = prodFind.quantity + 1
        } else {
            let product = archivoPM.id
            let quantity = 1
            await archivoCM[indicePCM].products.push({ product, quantity })

        }



        let ProductAdd =  archivoCM[indicePCM]
         await ProductoCM.saveProducts(archivoCM)

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ archivoCM, ProductAdd });
        // return res.status(201).json({ archivoPM, product, archivoCM });
        


        


    }

}

)


