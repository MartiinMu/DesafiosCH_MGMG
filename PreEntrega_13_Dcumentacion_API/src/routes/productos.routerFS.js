
import ProductManager from '../dao/Managers/ProductManagerFS.js';
export const Producto = new ProductManager('./Archivos/Products.json')
import { io } from '../app.js';



import { Router } from 'express';
export const router = Router()





router.get('/', async (req, res) => {

    let archivo = await Producto.getProducts()

    if (req.query.limit) {
        archivo = await archivo.slice(0, req.query.limit)
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivo });


})


router.get('/:pid', async (req, res) => {

    let archivo = await Producto.getProducts()
    let id = req.params.pid
    id = parseInt(id)
    if (isNaN(id)) {

        return res.status(400).json({ error: "Error, ingrese un argumento id numerico" })
    }


    archivo = archivo.find((prod) => prod.id === id)


    if (!archivo) return res.status(400).json({ error: `El id ${id} no existe` })


    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ archivo });
})



router.post('/', async (req, res) => {

    const llaves = {
        title: "ejemplo",
        description: "ejemplo",
        code: "Wade Wilson",
        stock: "1313",
        price: "",
        status: true,
        category: "",
        thumbnails: ["Regenerative healing", "Expert marksman", "Fourth wall breaking"],
    }



    let { title, description, code, price, status, stock, category, thumbnails } = req.body


    status = true

    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Falta agregar un campo. Todos los campos son obligatorios. ` })
    }



   


    // Validacion si el codigo no exista

    let listaProductos = await Producto.getProducts()

    let existCode = await listaProductos.find(v => v.code === code)
    if (existCode) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El codigo: ${code} existente!` })
    }



    //validacion: Todos son correctos

    let propiedadesBody = Object.keys(req.body)
    console.log(propiedadesBody)           //chequear
    let llavesMaestras = Object.keys(llaves)
    console.log("llavesMaestras: " + llavesMaestras)


    try {
        propiedadesBody.forEach((datoObjeto) => {

            let dato = llavesMaestras.includes(datoObjeto)

            if (!dato) {
                console.log(`NO EXISTE EL CAMPO ${datoObjeto}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No se aceptan algunas propiedades. NO EXISTE EL CAMPO ${datoObjeto}`, propiedadesBody, llavesMaestras })

            }
        })
    } catch (error) {
        console.log(error.message)
        return
    }





    // ____ Validacion de `Tdos los campos correspondan a su tipo de dato`

    try {

        if (typeof title !== `string`) return res.status(400).json({ error: `La propiedad title ingresada debe ser de tipo string ` })

        if (typeof description !== `string`) return res.status(400).json({ error: `La propiedad description ingresada debe ser de tipo string ` })

        if (typeof category !== `string`) return res.status(400).json({ error: `La propiedad category ingresada debe ser de tipo string ` })

        if (typeof price !== `number`) return res.status(400).json({ error: `La propiedad price ingresada debe ser de tipo number ` })

        //chequear

        if (Array.isArray(thumbnails)) {
            thumbnails
        } else if (thumbnails == undefined) {
            thumbnails
        }
        else {
            res.status(400).json({ error: `La propiedad thumbnail ingresada debe ser de tipo array ` })

        }


        if (typeof code !== `string`) return res.status(400).json({ error: `La propiedad code ingresada debe ser de tipo string ` })

        if (typeof stock !== `number`) return res.status(400).json({ error: `La propiedad stock ingresada debe ser de tipo number ` })


        // VERIFICAR ESTA MIERDA
        if (typeof status !== `boolean`) return res.status(400).json({ error: `La propiedad status ingresada debe ser de tipo boolean ` })



    } catch (error) {
        console.log(error.message)
        return
    }



    //Incrementar el id
    let id = 1
    if (listaProductos.length > 0) {
        id = listaProductos[listaProductos.length - 1].id + 1
    }

    let nuevoProduct = {
        id, title, description, code, price, status, stock, category, thumbnails
    }

    listaProductos.push(nuevoProduct)


    io.emit("newProduct", {id, ...req.body}  )


    await Producto.saveProducts(listaProductos)

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ nuevoProduct });

}
)

router.put('/:pid', async (req, res) => {
    let { pid } = req.params
    // let id=req.params.id
    let id = parseInt(pid)
    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Indique un id numérico` })
    }

    let Product = await Producto.getProducts()
    let indiceProductos = Product.findIndex(prod => prod.id === id)
    if (indiceProductos === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen usuarios con id ${id}` })
    }


    //validacion: Todos son correctos
    const llaves = {
        title: "ejemplo",
        description: "ejemplo",
        code: "Wade Wilson",
        stock: "1313",
        price: "",
        status: true,
        category: "",
        thumbnails: ["Regenerative healing", "Expert marksman", "Fourth wall breaking"],
    }
    let propiedadesBody = Object.keys(req.body)
    let llavesMaestras = Object.keys(llaves)
    


    try {
        propiedadesBody.forEach((datoObjeto) => {

            let dato = llavesMaestras.includes(datoObjeto)

            if (!dato) {
                console.log(`NO EXISTE EL CAMPO ${datoObjeto}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No se aceptan algunas propiedades. NO EXISTE EL CAMPO ${datoObjeto}`, propiedadesBody, llavesMaestras })

            }
        })
    } catch (error) {
        console.log(error.message)
        return
    }




    let productoModificado = {
        ...Product[indiceProductos],    // ... es el operador spread
        ...req.body,
        id
    }



    Product[indiceProductos] = productoModificado

    await Producto.saveProducts(Product)
    

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        productoModificado
    });
});


router.delete('/:pid',async(req,res)=>{
    let {pid}=req.params
    // let id=req.params.id
    let id=parseInt(pid)
    if(isNaN(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Indique un id numérico`})
    }

    let Product = await Producto.getProducts()
    let indiceProductos = Product.findIndex(prod => prod.id === id)
    if (indiceProductos === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen usuarios con id ${id}` })
    }

   

    let productoEliminado=Product.splice(indiceProductos,1)

    await Producto.saveProducts(Product)

    io.emit("removeProduct", indiceProductos)
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        productoEliminado
    });
});