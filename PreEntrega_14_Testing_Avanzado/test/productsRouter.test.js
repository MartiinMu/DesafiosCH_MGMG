// import mongoose from "mongoose";
// import { expect } from "chai";
// import supertest from "supertest";
// import { describe, it } from "mocha";

// import { config } from "../config/config.js";
// import { verifyToken } from "../utils.js";


// try {
//     // await mongoose.connect(config.MONGO_URL,{dbName: config.DBNAME})
//     await mongoose.connect('mongodb+srv://martingustavom:Coderhouse2023@cluster0.czbpnhg.mongodb.net/?retryWrites=true&w=majority',{dbName: 'ecommerces'})
    
//     console.log('DB Online 2...!!!')
// } catch (error) {
//     console.log(error.message)
// }

// const requester=supertest("http://localhost:8080")

// describe("Prueba del modulo Products", async function(){

//     this.timeout(5000)

//     // after(async()=>{
//     //     let resultado = await mongoose.connection.collection("products").deleteMany({email:"testing@gmail.com"})
//     // })

//     let cookie

//     it("Endpoint /api/products/, metodo GET, muestra todos los productos o algunos con query limit", async()=>{

//         // let usuario = { first_name:"nombreTest", last_name:"apellidoTest", age:41, email:"testing@gmail.com",password:"123" }

        
//         let {statusCode, body, ok,redirect,headers, ...resto}=await requester.get("/api/products")
//             .set("Cookie",)
//             .set("Authorization", "Bearer Token...!!!!")

//         console.log(resto)

//         // expect(statusCode).to.be.equal(200)
//         // expect(redirect).to.be.true


//         cookie=headers["set-cookie"][0].split("=")
//         let nombreCookie=cookie[0]
//         cookie=cookie[1].split(";")[0]
//         console.log(`EMPIEZA ACA :::::::::::::::::::::`)
//         console.log(cookie)
//         console.log(`TERMINA ACA :::::::::::::::::::::`)

        
//     })
  
    

// })