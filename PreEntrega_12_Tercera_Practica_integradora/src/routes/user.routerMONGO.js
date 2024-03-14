import { Router } from "express";
import { Acceso } from "../utils.js";
import { UserController } from "../Controller/user.controller.js";
export const router = Router()


router.post('/premium/:user',Acceso(["ADMIN"]),UserController.putChangeRol)