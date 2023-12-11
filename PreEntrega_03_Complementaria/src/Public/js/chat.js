console.log("Chat conectado")

const socket=io()

let divMensaje=document.getElementById('mensaje')
let inputNombre=document.getElementById('nombre')
let inputEmail=document.getElementById('email')
let btnSubmit=document.getElementById('btnSubmit')











// socket.on("newProduct",Prod=>{
//     console.log("Producto agregado:",Prod)
    
  
//    let nuevoProductoTexto = 
   
//    `<strong>Id:</strong> ${Prod.id} <br>
//    <strong>Title:</strong> ${Prod.title} <br>
//    <strong>Description:</strong> ${Prod.description}<br>
//    <strong>Code:</strong> ${Prod.code}<br>
//    <strong>Price: </strong> ${Prod.price}<br>
//    <strong>Status: </strong>${Prod.status}<br>
//    <strong>Stock: </strong> ${Prod.stock}<br>
//    <strong>Category: </strong>${Prod.category}<br>
//    <strong>Thumbnails: </strong> ${Prod.thumbnails}<br>`
   

//     let ulProd=document.querySelector('ul')
//     let liNuevoProducto=document.createElement('li')
//     liNuevoProducto.innerHTML=nuevoProductoTexto
//     ulProd.append(liNuevoProducto)
// })


// socket.on("removeProduct",Prod=>{
//     console.log("El producto eliminado es el de la posicion:",Prod)
//     let id=parseInt(Prod)
//     let removProd = document.querySelectorAll('li')[id]
//     removProd.remove();

// })

