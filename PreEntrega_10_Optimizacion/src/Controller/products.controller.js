import { productService } from "../Services/products.service.js";
import { CustomError } from "../Utils/CustomErros.js";
import { TIPOS_ERROR } from "../Utils/TypesErros.js";
import { errorArgumentos, errorIdMongoose, errorIdNoEnBD, errorUpdate, errorUpdateIDyCODE } from "../Utils/Errors.js";
import mongoose from "mongoose";
import { io } from "../app.js";


export class ProductsController {
    constructor() { }



    static async getProducts(req, res) {

        let archivo
        try {

            archivo = await productService.getProduct({ status: true })


            if (req.query.limit) {
                archivo = archivo.slice(0, req.query.limit)
            }
        } catch (error) {
            console.log(error.message)

        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ archivo });
    }



    static async getProduct(req, res, next) {


        let idParam = req.params.pid

        const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

        try {
            if (!esObjectIdValido(idParam)) {

                try {
                    throw new CustomError("Ingresar Id Mongoose", "No es Id Mongoose", TIPOS_ERROR.ARGUMENTOS, errorIdMongoose(idParam))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }
            }
        } catch (error) {
            return next(error)
        }





        let archivoOne
        try {
            archivoOne = await productService.getOneProduct({ status: true, _id: idParam })


        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })


        }




        try {

            if (!archivoOne) {
                try {
                    throw new CustomError("Ingresar ID", "ID no existe en la BD", TIPOS_ERROR.ARGUMENTOS, errorIdNoEnBD(idParam))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }

            }
        } catch (error) {
            return next(error)
        }




        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ archivoOne });

    }


    static async postProduct(req, res, next) {



        let { title, description, code, price, status, stock, category, thumbnails } = req.body



        try {

            if (!title || !description || !code || !price || !status || !stock || !category) {

                try {
                    throw new CustomError("Ingresar propiedades del Producto", "Falta agregar un producto", TIPOS_ERROR.ARGUMENTOS, errorArgumentos(req.body))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }



            }

        } catch (error) {
            return next(error)
        }





        let existCode = await productService.getOneProduct({ status: true, code })


        try {

            if (existCode) {

                try {
                    throw new CustomError("Ingresar codigo", "Codigo repetido", TIPOS_ERROR.ARGUMENTOS, `El codigo: ${code} existente!`)
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }
            }
        } catch (error) {
            return next(error)
        }











        io.emit("newProduct", { ...req.body })



        try {

            let nuevoProduct = await productService.createProduct({ title, description, code, price, status, stock, category, thumbnails })


            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: nuevoProduct });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }











    }



    static async productUpdate(req, res,next) {



        let idParam = req.params.pid

        const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

        try {
            if (!esObjectIdValido(idParam)) {

                try {
                    throw new CustomError("Ingresar Id Mongoose", "No es Id Mongoose", TIPOS_ERROR.ARGUMENTOS, errorIdMongoose(idParam))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }
            }
        } catch (error) {
            return next(error)
        }




        let archivoOne
        try {
            archivoOne = await productService.getOneProduct({ status: true, _id: idParam })

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }


        try {

            if (!archivoOne) {
                try {
                    throw new CustomError("Ingresar ID", "ID no existe en la BD", TIPOS_ERROR.ARGUMENTOS, errorIdNoEnBD(idParam))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }

            }
        } catch (error) {
            return next(error)
        }






        try {

            if (req.body._id || req.body.code) {
                try {
                    throw new CustomError("No ingresar ID y CODE", `No se pueden modificar la propiedades "_id" y "code"`, TIPOS_ERROR.ARGUMENTOS, errorUpdateIDyCODE(req.body))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }

            }
        } catch (error) {
            return next(error)
        }






        let resultado = await productService.updateOneProduct({ status: true, _id: idParam }, req.body)
            



            try {

                if (!resultado.modifiedCount > 0) {
                    try {
                        throw new CustomError("Modificacion", `No se concreto la modificacion`, TIPOS_ERROR.ARGUMENTOS, errorUpdate(resultado.modifiedCount))
                    } catch (error) {
                        throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                    }
    
                }
            } catch (error) {
                return next(error)
            }


            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Modificacion realizada" });




      

    }


    static async deleteProduct(req, res,next) {

        let idParam = req.params.pid


        const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

        try {
            if (!esObjectIdValido(idParam)) {

                try {
                    throw new CustomError("Ingresar Id Mongoose", "No es Id Mongoose", TIPOS_ERROR.ARGUMENTOS, errorIdMongoose(idParam))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }
            }
        } catch (error) {
            return next(error)
        }





        let archivoOne
        try {
            archivoOne = await productService.getOneProduct({ status: true, _id: idParam })

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
        }



        try {

            if (!archivoOne) {
                try {
                    throw new CustomError("Ingresar ID", "ID no existe en la BD", TIPOS_ERROR.ARGUMENTOS, errorIdNoEnBD(idParam))
                } catch (error) {
                    throw new CustomError(error.name ? error.name : "error generico", error.message, error.codigo ? error.codigo : TIPOS_ERROR.INDETERMINADO, error.descrip ? error.descrip : `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
                }

            }
        } catch (error) {
            return next(error)
        }









        let codigoProd = archivoOne.code


        let Product = await productService.getProduct()


        let indiceProductos = Product.findIndex(prod => prod.code === codigoProd)

        

        if (indiceProductos === -1) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen productos con id ${idParam}` })
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