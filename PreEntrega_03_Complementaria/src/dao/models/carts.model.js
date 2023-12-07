import mongoose from "mongoose";



const cartsColeccion = 'carts'
const cartsEsquema = new mongoose.Schema(
    {

        id: Number,
        products: [
            {
                product: Number,
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