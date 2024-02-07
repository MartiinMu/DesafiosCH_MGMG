import { cartDAO as DAO } from "../dao/cartsMongoDAO.js";



class cartService{
    constructor(dao){
    this.dao=new dao()
}

async getCart(){
    return await this.dao.get()
}
async getOneCart(){
    return await this.dao.getOne()
}

async getOneCartPopulate(filter,populate){
    return await this.dao.getOneWithPopulate(filter, populate)
}

async creatCart(cart){
    return await this.dao.create(cart)
}

async updateOneCart(filter,update,option){
    return await this.dao.updateOne(filter,update,option)
}
async findUpdate(filter,update,option){
    return await this.dao.findAndUpdate(filter,update,option)
}
async getPaginate(){
    return await this.dao.getWithPaginate()
}

}

export const CartService=new cartService(DAO)