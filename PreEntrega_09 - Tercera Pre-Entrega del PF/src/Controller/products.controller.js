import { productService } from "../Services/products.service.js";
import { io } from "../app.js";


export class ProductsController {
    constructor() { }



    static async getProducts(req, res) {

        let archivo
        try {

            archivo = await productService.getProduct({ status: true })

            // productosModelo.find({ status: true }).lean()

            // archivo = await Producto.getProducts()

            if (req.query.limit) {
                archivo = archivo.slice(0, req.query.limit)
            }
        } catch (error) {
            console.log(error.message)

        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ archivo });
    }



    static async getProduct(req, res) {


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
    
    
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ archivoOne });

    }


    static async postProduct(req, res){


        
    let { title, description, code, price, status, stock, category, thumbnails } = req.body




    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Falta agregar un campo. Todos los campos son obligatorios. ` })
    }






    let existCode = await productService.getOneProduct({ status: true, code })

    if (existCode) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El codigo: ${code} existente!` })
    }




  




    io.emit("newProduct", { ...req.body })



    try {
        // let nuevoProduct = await productosModelo.create({ id, title, description, code, price, status, stock, category, thumbnails })

        let nuevoProduct = await productService.createProduct({ title, description, code, price, status, stock, category, thumbnails })


        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: nuevoProduct });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
    }











    }



    static async productUpdate(req, res){

       

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


    if (req.body._id || req.body.code) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No se pueden modificar la propiedades "_id" y "code"` })
    }


    let resultado
    try {
        resultado = await productService.updateOneProduct({ status: true, _id: idParam }, req.body)
        console.log(resultado)
        if (resultado.modifiedCount > 0) {



            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Modificacion realizada" });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No se concretó la modificación`, detalle: error.message })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })

    }

    }


    static async deleteProduct(req, res){

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





        

   

    let codigoProd = archivoOne.code


    let Product = await productService.getProduct()
   

    let indiceProductos = Product.findIndex(prod => prod.code === codigoProd)

    console.log('INDICE DE PRODUCTO:    ' + indiceProductos)

    if (indiceProductos === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen usuarios con id ${idParam}` })
    }

    io.emit("removeProduct", indiceProductos)







    

    let resultado
    try {
        resultado = await productService.deletedProduct({ status: true, _id: idParam })
        // productosModelo.deleteOne({ status: true, _id: idParamMongoose })


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






    }






}