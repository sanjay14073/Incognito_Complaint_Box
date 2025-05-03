import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { setCredentials } from "../redux/slices/authSlice";
const usersArray = [
  {
    username: "admin_john",
    uuid: "admin-12345",
    previous_complaints: [],
    email: "admin_john@example.com",
    phoneNo: "1234567890",
    password: "Admin@123", // In a real application, passwords should be hashed
    profilePicture:
      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    role: "Admin", // Explicitly setting the role as Admin
  },
  {
    username: "user_doe",
    uuid: "user-67890",
    previous_complaints: ["Complaint about service", "Issue with payment"],
    email: "user_doe@example.com",
    phoneNo: "0987654321",
    password: "User@123", // In a real application, passwords should be hashed
    profilePicture:
      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    role: "User", // Default role is "User"
  },
  {
    username: "user_alice",
    uuid: "user-54321",
    previous_complaints: ["Late delivery"],
    email: "user_alice@example.com",
    phoneNo: "1122334455",
    password: "Alice@123", // In a real application, passwords should be hashed
    profilePicture:
      "https://img.freepik.com/premium-vector/woman-avatar-profile-picture-vector-illustration_268834-541.jpg",
    role: "User", // Default role is "User"
  },
  {
    username: "user_bob",
    uuid: "user-98765",
    previous_complaints: ["Product defect"],
    email: "user_bob@example.com",
    phoneNo: "5566778899",
    password: "Bob@123", // In a real application, passwords should be hashed
    profilePicture:
      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    role: "User", // Default role is "User"
  },
]; 
const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result._doc);
      if (response.ok) {
        dispatch(setCredentials(result._doc));
        navigate("/dashboard");
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("An error occurred during login");
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600'>
              Anonymity at peaks!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Incognito</span>
              <span>Complaint System</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-gray-700 '>
                Keep all your credentials safe.
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                Forget Password?
              </span>

              <Button
                type='submit'
                label='Submit'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;