import { UserService } from "../Services/users.service.js";
import mongoose from "mongoose";
import { CustomError } from "../Utils/CustomErros.js";
import { TIPOS_ERROR } from "../Utils/TypesErros.js";
import { errorIdMongoose } from "../Utils/Errors.js";



export class UserController{
    constructor(){ }


    static async putChangeRol(req,res){
       
        console.log('PASO POR EL PUUUUUTTTTTT')


        let uid = req.params.user
        

        let {rol}= req.body
        
        let user

        try {

            user = await UserService.getOneUser({_id:uid})
            

        }catch(error){
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message })
          
        }


        let {_id, first_name,last_name,email,age,password,cart} = user


        let userEmail = user.email

        let resultado = await UserService.updateOneUser({_id:uid},{_id, first_name,last_name,email,age,password,cart,rol})

        return res.redirect(`/?mensaje=Cambiaste el rol del usuario con email ${userEmail} al rol ${rol}  `)

















    }








}

