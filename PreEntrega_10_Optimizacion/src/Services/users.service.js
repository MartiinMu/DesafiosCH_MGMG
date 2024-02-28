import { UserDAO as DAO } from "../dao/userMongoDAO.js";



class userService{
    constructor(dao){
    this.dao=new dao()
}

async getUser(){
    return await this.dao.get()
}
async getOneUser(){
    return await this.dao.getOne()
}

async getOneUserPopulate(filter,populate){
    return await this.dao.getOneWithPopulate(filter, populate)
}

async getByIdProjection(filter,projection){
    return await this.dao.getByIdWithProjection(filter, projection)
}

async creatUser(User){
    return await this.dao.create(User)
}

async updateOneUser(filter,update,option){
    return await this.dao.updateOne(filter,update,option)
}
async findUpdate(filter,update,option){
    return await this.dao.findAndUpdate(filter,update,option)
}
async getPaginate(){
    return await this.dao.getWithPaginate()
}

}

export const UserService=new userService(DAO)