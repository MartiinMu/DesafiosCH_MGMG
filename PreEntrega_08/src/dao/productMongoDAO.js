
import { productosModelo } from "./models/products.model.js"

export class productDAO {

  
    async get(filter){
        return productosModelo.find(filter).lean()
    }
  
    async getOneProd(filter){
        return await productosModelo.findOne(filter)
    }

    async getOneWithPopulate(filter, populate){
        return productosModelo.findOne(filter).populate(populate)
    }

    async getWithPaginate(){
        return productosModelo.paginate()
    }

    
    async create (cart) {
        return await productosModelo.create(cart)
    }

    async updateOne(filter,update,option){
        return await productosModelo.updateOne(filter,update,option)
    }


    async findAndUpdate(filter,update,option){
        return await productosModelo.findOneAndUpdate(filter,update,option)
    }
    
    async deleted(filter){
        return await productosModelo.deleteOne(filter)
    }
    

}




