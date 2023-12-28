
import ProductManager from '../dao/Managers/ProductManagerMONGO.js';
export const Producto = new ProductManager()
import { io } from '../app.js';
import mongoose from 'mongoose';
import { productosModelo } from '../dao/models/products.model.js';




import { Router } from 'express';
export const router = Router()





router.get('/', async (req, res) => {

    let archivo
    try {

        archivo = await Producto.getProducts()



        if (req.query.limit) {
            archivo = archivo.slice(0, req.query.limit)
        }
    } catch (error) {
        console.log(error.message)

    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivo });


})





router.get('/:pid', async (req, res) => {

   
    let idParam = req.params.pid
  


    let archivoOne
    try {
        archivoOne = await productosModelo.findOne({ status: true, _id: idParam })
        console.log(archivoOne)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }






    if (!archivoOne) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${idParam} no existe` })
    }


    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivoOne });
})




router.post('/', async (req, res) => {



    let { title, description, code, price, status, stock, category, thumbnails } = req.body


    // status = true

    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Falta agregar un campo. Todos los campos son obligatorios. ` })
    }






    // Validacion si el codigo no exista





    let existCode = await productosModelo.findOne({ status: true, code })


    if (existCode) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El codigo: ${code} existente!` })
    }




    //Incrementar el id

    let id = 1
    id = parseInt(id)

    let listaProductos = await Producto.getProducts()


    if (listaProductos.length > 0) {
        id = listaProductos[listaProductos.length - 1].id + 1
    }





    // let nuevoProductShow = { id, title, description, code, price, status, stock, category, thumbnails }



  
    io.emit("newProduct", { id, ...req.body })



    try {
        let nuevoProduct = await productosModelo.create({ id, title, description, code, price, status, stock, category, thumbnails })

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: nuevoProduct });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }











}
)

router.put('/:pid', async (req, res) => {


   
   
    let idParam = req.params.pid
  


    let archivoOne
    try {
        archivoOne = await productosModelo.findOne({ status: true, _id: idParam })
        console.log( archivoOne)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }






    if (!archivoOne) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${idParam} no existe` })
    }





    if (req.body._id || req.body.code) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No se pueden modificar la propiedades "_id" y "code"` })
    }




    let resultado
    try {
        resultado = await productosModelo.updateOne({ status: true, _id: idParam }, req.body)
        console.log(resultado)

        if (resultado.modifiedCount > 0) {

        

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Modificacion realizada" });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No se concretó la modificación` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })

    }








});


router.delete('/:pid', async (req, res) => {


    let idParamMongoose= req.params.pid
    console.log('El id MONGOOSE ES:' + idParamMongoose)



  






//___________Funciona ___________ _id  _______________


    let archivoOne
    
    try {
        archivoOne = await productosModelo.findOne({ status: true, _id: idParamMongoose })
        
        console.log('Este es el ARchivoOne '+ archivoOne)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }


    if (!archivoOne) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id ${idParam}  no existe` })
    }





//____________Encontrar posicion para eliminar con el io.emit   ______________

    let codigoProd = archivoOne.code


    let Product = await Producto.getProducts()
    // Product = JSON.stringify(Product)
    let indiceProductos = Product.findIndex(prod => prod.code === codigoProd)
    // let indiceProductos = Product.findIndex(prod => prod._id === idParamMongoose)
    console.log('Este es el indice de los productos :   '+indiceProductos)
    if (indiceProductos === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen usuarios con id ${idParam}` })
    }

    io.emit("removeProduct", indiceProductos)

//_____________________________________________________


    
    
    let resultado
      try {
        resultado = await productosModelo.deleteOne({ status: true, _id: idParamMongoose })
            
        console.log('Resultado con idmongoose' + resultado)
             if (resultado.deletedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Eliminacion realizada" });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No se concretó la eliminacion` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })

    }




    





});