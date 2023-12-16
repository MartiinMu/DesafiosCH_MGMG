
import { cartsModelo } from '../models/carts.model.js'
import fs from 'fs'

export default class CartsManager{
  
    

     async getProdCarts(){
        try {
            return await cartsModelo.find()
         } catch (error) {
             console.log(error)
             return null
         }
 
    }

   
  

}



   
