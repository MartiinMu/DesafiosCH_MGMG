
import fs from 'fs'

export default class CartsManager{
    constructor(rutaDeArchivo){
    this.path = rutaDeArchivo
    
    }

     async getProdCarts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path,"utf-8"))
        }else{
            return []
        }
    }

    async saveProducts(Prod) {
       await fs.promises.writeFile(this.path, JSON.stringify(Prod, null, 5))
    }
    
  

}



   
