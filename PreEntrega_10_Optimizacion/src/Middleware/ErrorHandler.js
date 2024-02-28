import { CustomError } from "../Utils/CustomErros.js";

export const errorHandler = (error, req, res, next)=>{
    if(error){
        if(error instanceof CustomError){ // --------------> Si el error es instancia de CustomError. Osea si es this.codigo, this.name, this.descrip. This es error
            console.log(`CustomError detectado: (${error.codigo}) - ${error.name}`)
            res.setHeader('Content-Type','application/json');
            return res.status(error.codigo).json({
                error:`${error.name}: ${error.message}`,
                detalle: error.descrip?error.descrip:"Error inesperado en el servidor - Intente más tarde, o contacte a su administrador"
            })
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: error.message
            })
        }
    }

    next()
}