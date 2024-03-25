
import { productosModelo } from '../models/products.model.js'
import fs from 'fs'

export default class ProductManager {

    async getProducts() {

        try {
           return await productosModelo.find({ status: true }).lean()
        } catch (error) {
            console.log(error)
            return null
        }









    }

    async saveProducts(Prod) {
        await fs.promises.writeFile(this.path, JSON.stringify(Prod, null, 5))
    }



    async getProductById(id) {

        let searchId = await productosModelo.find({ status: true, id:id }).lean()



        

        if (searchId) {
            console.log(searchId)
        } else {
            console.log(`Not Found`)
        }
    }

    async deleteProduct(delId) {

        let products = this.getProducts()
        const delSearchId = products.findIndex((Prod) => Prod.id === delId)

        if (delSearchId === -1) {
            console.log(`Error al intentar eliminar el producto con Id: ${delId}. No exite en la Base de Datos.`)
            return
        } else {
            products.splice(delSearchId, 1)
            await fs.promises.writeFileSync(this.path, JSON.stringify(products, null, 5))
            console.log(`El producto con el Id: ${delId} fue borrado exitosamente`)
        }





    }



    async addProduct(title, description, price, thumbnail, code, stock) {

        let products = await this.getProducts()

        if (!title || !description || !thumbnail || !code || !stock) {
            console.log(`Exisite un campo vacio, debes completar todos`)
            return
        }


        let existCode = products.find(v => v.code === code)
        if (existCode) {
            console.log(`El codigo: ${code} existente!`)
            return
        }


        let id = 1
        if (products.length > 0) {
            id = products[products.length - 1].id + 1
        }

        let newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        products.push(newProduct)



        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))

    }




    async updateProduct(id, objeto) {
        let productos = await this.getProducts()

        //____Validar si el indice existe

        let indice = productos.findIndex(p => p.id === id)
        if (indice === -1) {
            console.log(`El producto con id ${id} no existe en BD`)
            return
        }

        //___Validar si es un objeto _____

        const esObjeto = typeof objeto

        if (esObjeto !== 'object') {
            console.log("El valor ingresado no es un Objeto!. Intente nuevamente")
            return
        }



        //___Valida que no se repita el codigo ___

        let existCode = productos.find(v => v.code === objeto.code)

        if (existCode) {
            console.log(`El codigo: ${objeto.code} existente!. Corresponde al producto con id ` + existCode.id)
            return
        }


        // _____Validacion - Agregar solo elementos correctos____

        const claveDefault = Object.keys(productos[0]);
        const claveObjeto = Object.keys(objeto);



        try {
            claveObjeto.forEach((datoObjeto) => {

                let dato = claveDefault.includes(datoObjeto)

                if (!dato) {
                    console.log(`NO EXISTE EL CAMPO ${datoObjeto}`);
                    throw `Error de campo`

                }
            })
        } catch (error) {
            console.log(error.message)
            return
        }



        // ____ Validacion de `Tdos los campos correspondan a su tipo de dato`

        if (typeof objeto.title === `string`) {
            objeto.title
        } else {
            objeto.title = productos[indice].title

        }
        if (typeof objeto.description === `string`) {
            objeto.description
        } else {
            objeto.description = productos[indice].description

        }
        if (typeof objeto.price === `number`) {
            objeto.price
        } else {
            objeto.price = productos[indice].price

        }
        if (typeof objeto.thumbnail === `string`) {
            objeto.thumbnail
        } else {
            objeto.thumbnail = productos[indice].thumbnail

        }
        if (typeof objeto.code === `number`) {
            objeto.code
        } else {
            objeto.code = productos[indice].code

        }
        if (typeof objeto.stock === `number`) {
            objeto.stock
        } else {
            objeto.stock = productos[indice].stock

        }





        // validar que dentro del objeto no llegue nada raro

        productos[indice] = {
            ...productos[indice],
            ...objeto,
            id
        }

        await fs.promises.writeFileSync(this.path, JSON.stringify(productos, null, 5))

    }



}




