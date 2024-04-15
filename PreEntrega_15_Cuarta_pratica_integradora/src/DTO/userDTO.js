export class UsuariosReadDTO{
    constructor(usuario){
        this.nombre=usuario.first_name.toUpperCase()
        this.apellido=usuario.last_name.toUpperCase()
        this.email=usuario.email.toUpperCase()
        this.edad=usuario.age
        this.rol=usuario.rol.toUpperCase()
        this.cart=usuario.cart?usuario.cart.toUpperCase():[]
    }
}


export class UsuariosReadDTOesToen{
    constructor(usuario){
        this.first_name=usuario.nombre.toUpperCase()
        this.last_name=usuario.apellido?usuario.apellido.toUpperCase():"Campo vacio"
        this.email=usuario.email.toUpperCase()
        this.age=usuario.edad
        this.rol=usuario.rol.toUpperCase()
        this.cart=usuario.cart?usuario.cart.toUpperCase():[]
    }
}