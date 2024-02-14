export class UsuariosReadDTO{
    constructor(usuario){
        this.first_name=usuario.nombre.toUpperCase()
        this.last_name=usuario.apellido.toUpperCase()
        this.email=usuario.email.toUpperCase()
        this.age=usuario.edad
        this.rol=usuario.rol.toUpperCase()
        this.carts=usuario.carts?usuario.carts.toUpperCase():[]
    }
}