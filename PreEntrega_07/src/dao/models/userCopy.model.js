
import mongoose from "mongoose";




const userEsquema=new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email: {
            type: String, unique: true
        },
        age:Number,
        password: String,
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        },
        rol: String,
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta"
        }
    }
)











export const userModelo=mongoose.model("user", userEsquema)