import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Employee } from "../models/auth.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const employeeRegister = asyncHandler(async (req, res) => {
  //get frontend data
  const { fullname, email, password } = req.body;
  //validation -not empty

  if ([fullname, email, password].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  //check employee already registerd
  const existedEmployee = await Employee.findOne({
    $or: [{ email }],
  });

  if (existedEmployee) {
    throw new ApiError(409, "Employee with email already existed");
  }

  //create user object -- create  entry in DB
  const employee = await Employee.create({
    fullname,
    email,
    password,
  });

  //remove password and refreshToken field from response
  const createdEmployee = await Employee.findById(employee._id).select(
    "-password -refreshToken",
  );

  //    check for employee creation
  if (!createdEmployee) {
    throw new ApiError(
      500,
      "Something went wrong while registering the employee ",
    );
  }

  //return response
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdEmployee, "Employee created Successfully")
    );
});

export { employeeRegister };
