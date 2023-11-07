

const fs=require(`fs`)


class ProductManager{
    constructor(rutaDeArchivo){
    this.path = rutaDeArchivo
    
    }

     getProducts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(fs.readFileSync(this.path,"utf-8"))
        }else{
            return []
        }
    }
    
    

   getProductById(id){

    let products = this.getProducts()



      const searchId = products.find((Prod)=>Prod.id === id)
           
      if (searchId){
        console.log(searchId)   
      } else {
        console.log(`Not Found`)
      }
    }

    deleteProduct(delId){
    
    let products = this.getProducts()
    const delSearchId = products.findIndex((Prod)=>Prod.id === delId)

    if (delSearchId === -1){
        console.log(`Error al intentar eliminar el producto con Id: ${delId}. No exite en la Base de Datos.`)
        return
    } else {
        products.splice(delSearchId,1)
        fs.writeFileSync(this.path, JSON.stringify(products,null, 5))
        console.log(`El producto con el Id: ${delId} fue borrado exitosamente`)
    } 

    
    
    

    }


    
    addProduct(title,description,price,thumbnail,code,stock){

        let products = this.getProducts()
        
        if (!title || !description || !thumbnail || !code || !stock){
            console.log(`Exisite un campo vacio, debes completar todos`)
            return
        }


        let existCode = products.find(v=>v.code === code)
        if (existCode){
            console.log(`El codigo: ${code} existente!`)
            return
        }


        let id=1
        if(products.length>0){
            id=products[products.length-1].id +1 
        }
        
        let newProduct={
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        products.push(newProduct)
    


        fs.writeFileSync(this.path, JSON.stringify(products,null, 5))
        
    }
    



    updateProduct(id, objeto){
        let productos=this.getProducts()

        //____Validar si el indice existe

        let indice = productos.findIndex(p => p.id === id)
        if (indice === -1) {
            console.log(`El producto con id ${id} no existe en BD`)
            return
        }

        //___Validar si es un objeto _____

        const esObjeto = typeof objeto
        
        if (esObjeto !== 'object'){
            console.log("El valor ingresado no es un Objeto!. Intente nuevamente")
            return
        }



        //___Valida que no se repita el codigo ___

        let existCode = productos.find(v=>v.code === objeto.code)
               
        if (existCode){
            console.log(`El codigo: ${objeto.code} existente!. Corresponde al producto con id ` + existCode.id)
             return
        }


        // _____Validacion - Agregar solo elementos correctos____

        const claveDefault = Object.keys(productos[0]);
        const claveObjeto = Object.keys(objeto);

        

        try {
            claveObjeto.forEach((datoObjeto)=>{
        
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

        if ( typeof objeto.title === `string`) {
             objeto.title
        }else {
            objeto.title = productos[indice].title
            
        }
        if ( typeof objeto.description === `string`) {
            objeto.description
        }else {
            objeto.description = productos[indice].description
            
        }
        if ( typeof objeto.price === `number`) {
            objeto.price
        }else {
            objeto.price = productos[indice].price
            
        }
        if ( typeof objeto.thumbnail === `string`) {
            objeto.thumbnail
        }else {
            objeto.thumbnail = productos[indice].thumbnail
            
        }
        if ( typeof objeto.code === `number`) {
            objeto.code
        }else {
            objeto.code = productos[indice].code
            
        }
        if ( typeof objeto.stock === `number`) {
            objeto.stock
        }else {
            objeto.stock = productos[indice].stock
            
        }
        
        
        
      

        // validar que dentro del objeto no llegue nada raro

        productos[indice]={
            ...productos[indice],
            ...objeto,
            id
        }

        fs.writeFileSync(this.path, JSON.stringify(productos, null, 5))

    }



}




Producto = new ProductManager("./Products.json")

                    //PRODUCTOS AGREGADOS


    //__Agrega producto sin errores ____
Producto.addProduct("Licuadora","Alta revoluciones",50,"https://e7.pngegg.com/pngimages/936/911/png-clipart-blender-black-decker-cleaver-kitchen-toaster-kitchen-miscellaneous-glass.png",10001001,10)
Producto.addProduct("Lavarropas","Hasta 50 kg",500,"https://e7.pngegg.com/pngimages/998/363/png-clipart-washing-machine-washing-machine.png",50006001,5)
Producto.addProduct("TV OLED","55 pulgadas",750,"https://w7.pngwing.com/pngs/610/183/png-transparent-led-backlit-lcd-computer-monitors-lcd-television-smart-tv-lg-55c7v-55-ultra-hd-4k-oled-hdr-wifi-s0405045-lg-tv-television-electronics-gadget.png",70005001,8)
Producto.addProduct("Monitor","22 pulgadas",750,"https://images.fravega.com/f500/32397e21c5240c13f2d32ad3842cd3e8.jpg",11005201,3)
Producto.addProduct("plachita","mini",750,"https://tccommercear.vtexassets.com/arquivos/ids/156177/HP8401-1tc.jpg?v=637968838552130000",10205003,11)
Producto.addProduct("cafetera","1 litro",750,"https://store.midea.com.ar/media/catalog/product/cache/c2d06e7a46e62a2ec6c07878d86a4143/c/m/cm-m112bar1_a.jpg",11305002,67)
Producto.addProduct("micomponente","1200 watts",750,"https://images.fravega.com/f1000/7579807ef6a784424b516fd9de20555a.jpg",70405006,2)
Producto.addProduct("termotanque","50 litros",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7ScSzTTFJ5OBKZ63kdEjVMe3z5fccn332yPkH2PbjCKRoQMHMRWClPbOu_YM4Bz9Ry8&usqp=CAU",80785001,56)
Producto.addProduct("bicicleta","electrica",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ-JK19XlNnQ3cgiNMCEUQWzF-daYPBKrPzJn4ckG6lkai7WJzXJQDaXZqVsZPfx1_LOA&usqp=CAU",90565006,65)
Producto.addProduct("monopatin","verde",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrFqxnxLVurZnD9erfBITPd4_ED70ouFLInuXpZFPg7MnGPkuKOv2M96yfio8ENFhp9s4&usqp=CAU",34505003,3)
Producto.addProduct("playstation 5","con 1 juego",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQijrBanIqcx1mKnSQaNzax66SHJK-uLUJw-YCVWaaIH-NTaXYR_BP--_hqhrUo3PhhyZw&usqp=CAU",67605002,22)
Producto.addProduct("playstation 4","con 5 jugos",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGpLbfqrEoOIvlZ6lEXjOhhMxRA3-_W-t65w&usqp=CAU",66005045,10)


    //___No muestra el producto porque los campos son obligatorio -> Muestra "Exisite un campo vacio, debes completar todos"
Producto.addProduct("tostadora","Con temporizador",40,"https://e7.pngegg.com/pngimages/605/854/png-clipart-toaster-toaster.png",30001001)

    //___Codigo repetido, no lo muesta. Muestra "El codigo: ${code} existente!"
Producto.addProduct("frezzer","No frost",200,"https://w7.pngwing.com/pngs/110/257/png-transparent-freezers-refrigerator-laboratory-vestfrost-ult-freezer-freezer-electronics-kitchen-appliance-laboratory-thumbnail.png",10001001,15)






                    //METODOS


    //___Muesta el array completo
console.log(Producto.getProducts())

    //__Muestra el id buscado ____
Producto.getProductById(2)
    
    // ____NOT FOUND____
Producto.getProductById(50)
    
    // ____Producto no encontrado para eliminar____
Producto.deleteProduct(50)

 // ____Producto se elimina____
    Producto.deleteProduct(2)





    //__Actualiza los Productos ____ 

    // ... MAl title
Producto.updateProduct(1,{title:9912312399, description:"juego de nintendo"})
    //   MAL description
Producto.updateProduct(1,{title:"Super Mario Bros", description:54654564, price: "ochenta" , id:99999})
    // -... BIEN TODO
Producto.updateProduct(1,{title:"Super Mario Bros", description:"54654564", price: 1525 })

    // -... BIEN TODO - menos ROMA
Producto.updateProduct(1,{title:"Super Mario Bros 500", description:"54654564", price: 1525, Firulais: "Perrito" })

// -... BIEN TODO
Producto.updateProduct(1,{title:"Super Mario Bros", description:"54654564", price: 1525, code: 70005001 })

// ---- MAL - no es un Objeto
Producto.updateProduct(1,"title:Super Mario Bros")

    

module.exports=ProductManager
