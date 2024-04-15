import { UserService } from "../Services/users.service.js";
import mongoose from "mongoose";
import { CustomError } from "../Utils/CustomErros.js";
import { TIPOS_ERROR } from "../Utils/TypesErros.js";
import { errorIdMongoose } from "../Utils/Errors.js";
import { verifyToken } from "../utils.js";

import fs from 'fs'
import path from "path";


export class UserController {
    constructor() { }


    static async putChangeRol(req, res) {

        let uid = req.params.uid


        let { rol } = req.body

        let user

        try {

            user = await UserService.getOneUser({ _id: uid })


        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })

        }


        let { _id, first_name, last_name, email, age, password, cart } = user

        let userEmail = user.email

        let resultado = await UserService.updateOneUser({ _id: uid }, { _id, first_name, last_name, email, age, password, cart, rol })

        return res.redirect(`/?mensaje=Cambiaste el rol del usuario con email ${userEmail} al rol ${rol}  `)

















    }


    static async postDocument(req, res) {


        let usuarioCookie = req.cookies.coderCookie
        usuarioCookie = verifyToken(usuarioCookie)

        let id = usuarioCookie._id

        let archivoSubido = req.file
        let destino = req.body.tipoDocumento


        if (destino == '' || archivoSubido == undefined || archivoSubido == null) {

            const carpetaAEliminar = './garbage';
            let archivos
            try {
                archivos = fs.readdirSync(carpetaAEliminar);

            } catch (error) {
                console.error('Error al leer la carpeta:', error);
            }

            archivos.forEach((archivo) => {
                const rutaArchivo = path.join(carpetaAEliminar, archivo);

                try {
                    fs.unlinkSync(rutaArchivo);

                } catch (error) {
                    console.error(`Error al eliminar el archivo ${archivo}:`, error);
                }
            });


            return res.redirect('/api/users/' + id + '/documents/?error=Error! fallo seleccionar documento o no se ingreso un archivo')

        } else {
            res.redirect('/api/users/' + id + '/documents/?mensaje=El Archivo se cargo correctamente')
        }


    }

    static async getDocument(req, res) {

        let { error, mensaje } = req.query
        let usuarioCookie = req.cookies.coderCookie
        usuarioCookie = verifyToken(usuarioCookie)

        let id = usuarioCookie._id

        const esSolicitudJSON = req.headers['content-type'] === 'application/json';

        if (esSolicitudJSON) {
            res.status(200).json({ archivoOne });
        } else {


            res.status(201).render('documents', { usuarioCookie, id, error, mensaje })
        }


    }


}

