import mongoose from "mongoose";
import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";

import { config } from "../config/config.js";
import { verifyToken } from "../utils.js";


try {
    // await mongoose.connect(config.MONGO_URL,{dbName: config.DBNAME})
    await mongoose.connect('mongodb+srv://martingustavom:Coderhouse2023@cluster0.czbpnhg.mongodb.net/?retryWrites=true&w=majority',{dbName: 'ecommerces'})
    
    console.log('DB Online 2...!!!')
} catch (error) {
    console.log(error.message)
}

const requester=supertest("http://localhost:8080")

describe("Prueba del modulo Sessions", async function(){

    this.timeout(20000)

    after(async()=>{
        let resultado = await mongoose.connection.collection("usuarios").deleteMany({email:"testing@gmail.com"})
    })

    let cookie

    it("Endpoint /api/sessions/registro, metodo POST, crea un usuario", async()=>{

        let usuario = { first_name:"nombreTest", last_name:"apellidoTest", age:41, email:"testing@gmail.com",password:"123" }

        
        let {statusCode, body, ok,redirect, ...resto}=await requester.post("/api/sessions/registro").send(usuario)

        // console.log(resto)

        expect(statusCode).to.be.equal(302)
        expect(redirect).to.be.true

        
    })


    it("Endpoint /api/sessions/login, metodo POST, se ingreso correctamente", async()=>{

        let usuario = { email:"testing@gmail.com",password:"123" }

        let {statusCode, body, ok,redirect, headers,res, ...resto}=await requester.post("/api/sessions/login").send(usuario)

        // console.log(resto)

        expect(statusCode).to.be.equal(302)
        expect(redirect).to.be.true
        cookie=headers["set-cookie"][0].split("=")
        let nombreCookie=cookie[0]
        cookie=cookie[1].split(";")[0]
        // console.log(cookie)
        
        expect(nombreCookie).to.be.equal("coderCookie")
        
        
    })
    
    
    
    
    
    
    it("Endpoint /api/sessions/current, metodo GET, devuleve datos del perfil del usuario correctamente", async()=>{
        cookie=`coderCookie=`+cookie
        
        
        let {body, ...resto}=await requester.get("/api/sessions/current")
        
        .set("cookie", cookie)

        console.log(body)

        console.log(resto)
        

     

    })
    

    
    
    
    // it("Endpoint /api/sessions/logout, metodo GET, se deslogueo correctamente", async()=>{
        
    //     let {statusCode, body, ok,redirect, headers,res, ...resto}=await  requester.get("/api/sessions/logout")
        
    //     let cookieValue = verifyToken(cookie)

    //     // console.log(resto,cookieValue)


    //     // let existCookie = headers["set-cookies"][0].split("=")[1]
    //     // // .split(";")[0]
    //     // console.log(`EL VALOR DEL COOKIES ES ::::::::::::::    ` + existCookie)

    // })
    
    
    

})