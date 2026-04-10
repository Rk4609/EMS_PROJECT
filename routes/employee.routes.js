import { Router } from "express";
import { employeeRegister,employeeLogin } from "../controllers/employee.controller.js";

const router = Router()

router.route("/register").post(employeeRegister)
router.route("/login").post(employeeLogin)
export default router