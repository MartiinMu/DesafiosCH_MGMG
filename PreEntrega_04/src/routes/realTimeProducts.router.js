import { Router } from 'express';
export const router = Router()

import ProductManager from '../dao/Managers/ProductManagerMONGO.js';
import { Producto } from './productos.routerMONGO.js';
import { productosModelo } from '../dao/models/products.model.js';


const productoManager = new ProductManager()








router.get('/', (req, res) => {


    res.status(200).render('home', { titulo: 'Home' })
})



router.get('/realtimeproducts', async (req, res) => {







let {limit, page,category,precio} = req.query;
const Filtro = req.query.filtro;
const Valor = req.query.valor; 
console.log('El Filtro es' + Filtro + '       El valor es:  ' + Valor)


console.log('Esto es el category: ****||||||||||||||||||||||******** ' + precio)



//________________________FILTRO - LIMITE - PAGE ________

if (limit) {
    limit = limit
} else {
    limit = 4
}

if (page){
    page = page
}else {
    page = 1
}






//_____________________ FILTRO DE CATEGORIA _____________
let optionFilter ={}


    
    if (category){
    
        optionFilter = { category:category}
        
      
        console.log('Esto es el category: ****||||||||||||||||||||||******** ' + optionFilter)
    
    } else  if (Filtro && Valor) {
    
        console.log('El Filtro es----->' + Filtro + '       El valor es: ------> ' + Valor)
        console.log(typeof Filtro)
        
        // optionFilter = {Filto:Valor}
      
    
    
       
        optionFilter[Filtro] = Valor
        
        console.log('FILTRO OPTION ===== ' + optionFilter)
      }

      
      
    








//__________________FILTRO - SORT_____________________________________






    let options ={

        lean:true,
        limit: limit, 
        page: page,
       
       
    }

     

//__________________FILTRO - SORT_____________________________________

if(precio == 'asc'){
    console.log('Esto es el category: ****||||||||||||||||||||||******** ' + precio)
        precio = 1
        options.sort = { precio: precio }
    } else if (precio =='desc') {
        precio = -1
        options.sort = { precio: precio }
    }






let products 
    try {







products = await productosModelo.paginate(optionFilter, options)
    


    } catch (error) {
        console.log(error)
      
    }

    let {prevlink, nextLink,totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
    console.log('ACA EMPIEZA EL CONSOLO LOG DE ================================================================================================================================================================')
    console.log(prevlink, nextLink,totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, page)




//____________ ENVIAR JSON para POSTMAN ___ ENVIA HTML para HANDELBARS __________


 const esSolicitudJSON = req.headers['content-type'] === 'application/json';
      
 if (esSolicitudJSON) {
    let status
            if (products) {
                status = "success"

            }else {
                status = "error"
            }

            if (hasPrevPage){
                prevlink = "http://localhost:8080/realTimeProducts?page="+prevPage
            } else {prevlink=null
            }
            if (hasNextPage){
                nextLink = "http://localhost:8080/realTimeProducts?page="+nextPage
            } else {nextLink=null
            }
  
    res.status(200).json({  
        status,
        products: products.docs, 
        totalPages, 
        prevPage, 
        nextPage,
        page,
        hasPrevPage,
        hasNextPage, 
        prevlink, 
        nextLink,  })
  } else {

    res.status(201).render('realTimeProducts', { titulo: 'realTimeProducts', products: products.docs, prevlink, nextLink,totalPages, hasNextPage, hasPrevPage, prevPage, nextPage })
  }
      
      





})




