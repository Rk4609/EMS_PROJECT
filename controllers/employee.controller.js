import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Employee } from "../models/auth.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenandRefreshToken = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();

    employee.refreshToken = refreshToken;
    await employee.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error",error)
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and accessToken",
    );
  }
};

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
      new ApiResponse(200, createdEmployee, "Employee created Successfully"),
    );
});

const employeeLogin = asyncHandler(async (req, res) => {
  //req.body--data
  // email and password check
  //find the user
  //password check
  //access and refresh token
  //send cookies

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  const employee = await Employee.findOne({
    $or: [{ email }],
  });

  if (!employee) {
    throw new ApiError(404, "Employee not Found");
  }

  const isPasswordValid = await employee.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Inavlid email or password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenandRefreshToken(employee._id);

  const loggedInEmployee = await Employee.findById(employee._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          employee: loggedInEmployee,
          accessToken,
          refreshToken,
        },
        "Employee Logged in Successfully",
      ),
    );
});

export { employeeRegister, generateAccessTokenandRefreshToken, employeeLogin };
