import { cartsModelo } from "./models/carts.model.js";

export class cartDAO{
    async get(){
        return cartsModelo.find()
    }
    async getOne(){
        return cartsModelo.findOne()
    }
    async getOneWithPopulate(filter, populate){
        return cartsModelo.findOne(filter).populate(populate)
    }

    async getWithPaginate(){
        return cartsModelo.paginate()
    }

    
    async create (cart) {
        return await cartsModelo.create(cart)
    }

    async updateOne(filter,update,option){
        return await cartsModelo.updateOne(filter,update,option)
    }


    async findAndUpdate(filter,update,option){
        return await cartsModelo.findOneAndUpdate(filter,update,option)
    }



}