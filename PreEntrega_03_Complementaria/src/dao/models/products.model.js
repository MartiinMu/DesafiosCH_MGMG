import mongoose from "mongoose";



const productosColeccion='products'
const productosEsquema=new mongoose.Schema(
    {
       id : {
        type: Number, 
    },

        title: {
            type: String , require: true
        }, 
        description: {
            type: String , require: true
        }, 
        category:{
            type: String , require: true
        }, 
        price:{
            type: Number , require: true
        }, 
        thumbnails: {
            type:Array , require:false
        },
        code:{
            type: String , require: true, unique:true
        }, 
        stock:{
            type: Number , require: true
        }, 
        status:{
            type:Boolean, require: true, default:true
        }, 

  
    },
    {
        timestamps: true,
        // collection: 'bigUsers',
        strict: false
    }
)



export const productosModelo=mongoose.model(productosColeccion, productosEsquema)