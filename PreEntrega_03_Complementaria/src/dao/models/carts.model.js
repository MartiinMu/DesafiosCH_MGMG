import mongoose from "mongoose";



const cartsColeccion = 'carts'
const cartsEsquema = new mongoose.Schema(
    {

        id:{
            type: Number,
        },
        products: [
            {
                product: String,
                quantity: Number,
            }]

    },

    {
        timestamps: true,
        // collection: 'bigUsers',
        strict: false
    }
)



export const cartsModelo = mongoose.model(cartsColeccion, cartsEsquema)