/*

================================================================================================================================================================================================================================================
                                RENDIMIENTO EN PRODUCCION
================================================================================================================================================================================================================================================








:::::::::::::::⬜⬜⬜⬜⬜ ⬜⬜⬜⬜⬜ COMPRESION ⬜⬜⬜⬜⬜ ⬜⬜⬜⬜⬜ :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::





los navegadores modernos pueden aceptar contendio codificado en tres (3) algoritmos principales:
                1) Deflate
                2) Gzip (Deflate + alguna cosas adicionales)
                3) Brotli




⬜⬜⬜⬜⬜ ___________-->  ZLIB  <--_____________⬜⬜⬜⬜⬜

✔ Se comprime para que se tarde menos en cargar

* ZLIB: Esta integrado a node.js -> se importa de la siguiente forma
                                --> import 'zlib' from 'zlib'

* Sirve para comprimir

* Comprimir sirve para que no se ocupe tanto ancho de banda al cargar la info


CASOS:

let texto="Texto muuuuuuuuuuuuuuuuuuuuuuuuuuuy largo...".repeat(100000)

        1) ⚪GZIP⚪se pone:
                    -> let textoComprimido=zlib.gzipSync(texto, {}) // -------------> funcion para comprimir . Tiene el 1er parametro lo q se comprimer y el 2do de opcion. Si no se pone el header se va a bajar, si se pone se carga en la pantalla
                    -> res.setHeader('Content-Encoding','gzip');     --------------------------> ESte header se usa para que el archivo comprimido se cargue en la panta. Si no se pone cuando se ejecuta se baja.    
                    -> nota: usar esto hace que se tarde en comprimir y descomprimir. hay que saber usarlo

        2) ⚪DEFLATE⚪se pone:
                    -> let textoComprimido=zlib.deflateSync(texto, {}) // ------> Practicamente igual al gzip
                    -> res.setHeader('Content-Encoding','deflate');// ------> Practicamente igual al gzip

        3) ⚪BROTLI⚪se pone:
                    -> textoComprimido=zlib.brotliCompressSync(texto, {}) // ------------------------> Comprime muchisimo mas que los anteriore
                    -> res.setHeader('Content-Encoding','br');


            3.1) comprimir hyml:
                            -> html=zlib.brotliCompressSync(html)
                            -> res.setHeader('Content-Type','text/html');
                            -> res.setHeader('Content-Encoding','br');

        4) ⚪EXPRESS COMPRESSION⚪se pone:

                                    -> instalacion:         npm install express-compression

                                    -> se importa  import compression from 'express-compression'
                                    -> se pone en el app.use app.use(compression({brotli:{enabled:true}}))
                             nota 1: Se encarga de comprimir tanto texto como imagenes, ademas que no hace falta poner los header porque ya los trae en si mismo








:::::::::::::::⬜⬜⬜⬜⬜ ⬜⬜⬜⬜⬜ ERROR - HANDLER ⬜⬜⬜⬜⬜ ⬜⬜⬜⬜⬜ :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::




1) Crear una carpeta UTILIS
        i)      Crear CustomError.js -> Crear una clase. las propiedades de la clase van a lllegar desde el router.
        ii)     Errores.js      ----> Descripcion de algunos errores. Una plantilla para que se guarde la descrip del error
        iii)    tiposError.js   ----> Es una tabla de codigos que nos va a permitir saber que nos paso

2) Para ver el error se crea un middleware, creando la carpeta MIDDLEWARE
        i)      errorHandle     ---> 


EJEMPLO de donde viene el reemplazo del status.

        a) Normal seria :
                        res.setHeader('Content-Type','application/json');
                        return res.status(400).json({})
        b) Se reemplaza por:
                        res.setHeader('Content-Type','application/json');
                        return res.status(error.codigo).json({error:`${error.name}: ${error.message}`})
      
        c) Esto viene de (-->)
                El error.codigo -> CustomsError/error.codigo=statusCode -> tiposError.js/ STATUS_CODES (aca estan los numero de status de error)
















*/