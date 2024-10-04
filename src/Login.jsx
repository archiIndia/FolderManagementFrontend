import { login } from './Services/User.service.js';
import * as Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import {useNavigate} from 'react-router-dom';

const schema = Joi.object({
  user_email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.empty': 'Please Provide Email Id',
      'string.email': 'Email Id must be valid',
    }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password must contain one lowercase letter, one uppercase letter, one number',
  }),
});

const SignIn = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: joiResolver(schema) });
  const navigate= useNavigate();

  const handleLogin = async (data) => {
    try {
      const originalPassword= data.password;
      const encodedPassword = window.btoa(originalPassword);
      const payload = {
        useremail: data.user_email,
        password: encodedPassword,
      };
      const newLogin = await login(payload);
      console.log(newLogin);
      // alert(newLogin.message);
      localStorage.setItem('Token', newLogin.token);
      navigate("/dashboard");

    } catch (error) {
    //   console.log("Error",error);
      alert("LogIn Failed.Email Id or Password does not Match...");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="">
        <h2>Log In</h2>
        <div>
          <label>Email Id</label>
          <input {...register('user_email')} />
          <p>{errors?.useremail?.message}</p>
        </div>
        <div>
          <label>Password</label>
          <input {...register('password')} />
          <p>{errors?.password?.message}</p>
        </div>
        <button type="submit">Log In</button>
      </div>
    </form>
  );
};

export default SignIn;
