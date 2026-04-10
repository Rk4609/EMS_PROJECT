import { Router } from "express";
import { employeeRegister } from "../controllers/employee.controller.js";

const router = Router()

router.route("/register").post(employeeRegister)
export default router