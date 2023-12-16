import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2'



const cartsColeccion = 'carts'
const cartsEsquema = new mongoose.Schema(
    {

        id:{
            type: Number,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number,
            }]

    },

    {
        timestamps: true,
        // collection: 'bigUsers',
        strict: false
    }
)

cartsEsquema.plugin(paginate)


// cartsEsquema.pre("findOne", function(){
//     this.populate({
//         path: 'products.product',
//     }).lean()
// })


// cartsEsquema.pre("find", function(){
//     this.populate({
//         path: 'products.product',
//     }).lean()
// })



export const cartsModelo = mongoose.model(cartsColeccion, cartsEsquema)