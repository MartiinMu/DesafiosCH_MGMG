class ProductManager{
    constructor(){
    this.products = []
    }

    getProducts(){
        return this.products
    }
    
  
   getProductById(id){

      const searchId = this.products.find((Prod)=>Prod.id === id)
      
      
      if (searchId){
        console.log(searchId)
      } else {
        console.log(`Not Found`)
      }
    }




    
    addProduct(title,description,price,thumbnail,code,stock){
        
        if (!title || !description || !thumbnail || !code || !stock){
            console.log(`Exisite un campo vacio, debes completar todos`)
            return
        }


        let existCode = this.products.find(v=>v.code === code)
        if (existCode){
            console.log(`El codigo: ${code} existente!`)
            return
        }


        let id=1
        if(this.products.length>0){
            id=this.products[this.products.length-1].id +1 
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

        this.products.push(newProduct)
    



        

    }
    

}

Producto = new ProductManager()

                    //PRODUCTOS AGREGADOS


    //__Agrega producto sin errores ____
Producto.addProduct("Licuadora","Alta revoluciones","$50","https://e7.pngegg.com/pngimages/936/911/png-clipart-blender-black-decker-cleaver-kitchen-toaster-kitchen-miscellaneous-glass.png",10001001,10)
Producto.addProduct("Lavarropas","Hasta 50 kg","$500","https://e7.pngegg.com/pngimages/998/363/png-clipart-washing-machine-washing-machine.png",50006001,5)
Producto.addProduct("TV OLED","55 pulgadas","$750","https://w7.pngwing.com/pngs/610/183/png-transparent-led-backlit-lcd-computer-monitors-lcd-television-smart-tv-lg-55c7v-55-ultra-hd-4k-oled-hdr-wifi-s0405045-lg-tv-television-electronics-gadget.png",70005001,8)


    //___No muestra el producto porque los campos son obligatorio -> Muestra "Exisite un campo vacio, debes completar todos"
Producto.addProduct("tostadora","Con temporizador","$40","https://e7.pngegg.com/pngimages/605/854/png-clipart-toaster-toaster.png",30001001)

    //___Codigo repetido, no lo muesta. Muestra "El codigo: ${code} existente!"
Producto.addProduct("frezzer","No frost","$200","https://w7.pngwing.com/pngs/110/257/png-transparent-freezers-refrigerator-laboratory-vestfrost-ult-freezer-freezer-electronics-kitchen-appliance-laboratory-thumbnail.png",10001001,15)






                    //METODOS

    //___Muesta el array completo
console.log(Producto.getProducts())

    //__Muestra el id buscado ____
Producto.getProductById(2)
    
    // ____NOT FOUND____
Producto.getProductById(50)