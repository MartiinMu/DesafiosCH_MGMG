import ProductManager from "./ProductManager.js";
const Producto = new ProductManager("./Products.json")
import express from 'express';

const PORT = 3000
const app = express()


// const entorno=async()=>{

//     try {
//         await Producto.addProduct("Licuadora","Alta revoluciones",50,"https://e7.pngegg.com/pngimages/936/911/png-clipart-blender-black-decker-cleaver-kitchen-toaster-kitchen-miscellaneous-glass.png",10001001,10)
//         await Producto.addProduct("Lavarropas","Hasta 50 kg",500,"https://e7.pngegg.com/pngimages/998/363/png-clipart-washing-machine-washing-machine.png",50006001,5)
//         await Producto.addProduct("TV OLED","55 pulgadas",750,"https://w7.pngwing.com/pngs/610/183/png-transparent-led-backlit-lcd-computer-monitors-lcd-television-smart-tv-lg-55c7v-55-ultra-hd-4k-oled-hdr-wifi-s0405045-lg-tv-television-electronics-gadget.png",70005001,8)
//         await Producto.addProduct("Monitor","22 pulgadas",750,"https://images.fravega.com/f500/32397e21c5240c13f2d32ad3842cd3e8.jpg",11005201,3)
//         await Producto.addProduct("plachita","mini",750,"https://tccommercear.vtexassets.com/arquivos/ids/156177/HP8401-1tc.jpg?v=637968838552130000",10205003,11)
//         await Producto.addProduct("cafetera","1 litro",750,"https://store.midea.com.ar/media/catalog/product/cache/c2d06e7a46e62a2ec6c07878d86a4143/c/m/cm-m112bar1_a.jpg",11305002,67)
//         await Producto.addProduct("micomponente","1200 watts",750,"https://images.fravega.com/f1000/7579807ef6a784424b516fd9de20555a.jpg",70405006,2)
//         await Producto.addProduct("termotanque","50 litros",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7ScSzTTFJ5OBKZ63kdEjVMe3z5fccn332yPkH2PbjCKRoQMHMRWClPbOu_YM4Bz9Ry8&usqp=CAU",80785001,56)
//         await Producto.addProduct("bicicleta","electrica",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ-JK19XlNnQ3cgiNMCEUQWzF-daYPBKrPzJn4ckG6lkai7WJzXJQDaXZqVsZPfx1_LOA&usqp=CAU",90565006,65)
//         await Producto.addProduct("monopatin","verde",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrFqxnxLVurZnD9erfBITPd4_ED70ouFLInuXpZFPg7MnGPkuKOv2M96yfio8ENFhp9s4&usqp=CAU",34505003,3)
//         await Producto.addProduct("playstation 5","con 1 juego",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQijrBanIqcx1mKnSQaNzax66SHJK-uLUJw-YCVWaaIH-NTaXYR_BP--_hqhrUo3PhhyZw&usqp=CAU",67605002,22)
//         await Producto.addProduct("playstation 4","con 5 jugos",750,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGpLbfqrEoOIvlZ6lEXjOhhMxRA3-_W-t65w&usqp=CAU",66005045,10)


//     } catch (error) {
//         console.log(error.message)
//     }

// }

// entorno()





app.get('/', async (req, res) => {

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`Bienvenidos! - Desafios: Product Manager`);
})



app.get('/Products', async (req, res) => {
    let archivo = await Producto.getProducts()

    if (req.query.limit) {
        archivo = await archivo.slice(0, req.query.limit)
    } 
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(archivo);
})

app.get('/products/:pid', async (req, res) => {

    let archivo = await Producto.getProducts()
    let id = req.params.pid
    id = parseInt(id)
    if (isNaN(id)) {

        return res.status(400).json({ error: "Error, ingrese un argumento id numerico" })
    }


    archivo = archivo.find((prod) => prod.id === id)


    if (!archivo) return res.status(400).json({ error: "El id ${id} no existe" })


    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivo });
})





const server = app.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`)
})


