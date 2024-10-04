import { signUp } from '../src/Services/User.service';
import { useForm } from 'react-hook-form';
import './App.css';
import joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

const Schema = joi.object({
  user_name: joi.string().trim().required().messages({
    'string.empty': 'Please enter a name',
  }),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.empty': 'Enter Email address',
      'string.email': 'Please Provide valid Email Id',
    }),
  gender: joi.string().required().valid('Male', 'Female', 'Other').messages({
    'any.only': 'Please provide valid Gender',
  }),
  mobileNumber: joi.string().length(10).required().messages({
    'string.empty': 'Invalid Phone Number.Please provide a valid Phone Number',
    'string.length': 'Phone number must be 10 digits',
  }),
  language: joi.string().required().valid('English', 'Arabic').messages({
    'any.only': 'Please provide required Language',
  }),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
  }),
  confirm_password: joi.string().valid(joi.ref('password')).required().messages({
    'string.empty': 'Confirm Password is required',
    'any.only': 'Password do not match',
  }),
});

const SignUpForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    
  } = useForm({ resolver: joiResolver(Schema) });

  const onFormSubmit = async (data) => {
    try {
      console.log('user Data', data);
      const originalPassword = data.password;
      const encodedString = window.btoa(originalPassword);
      console.log(encodedString);
      // prepare payload and call api
      const payload = {
        user_name: data.user_name,
        email: data.email,
        gender: data.gender,
        phone: data.mobileNumber,
        language: data.language,
        password: encodedString,
      };
      const result= await signUp(payload);
      console.log(result);
      alert('Sign Up Sucessful')
    } catch (error) {
      console.log(error);
      alert(error.response.data.message ?? error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div>
        <div>
          {' '}
          <label>Name</label>
          <input {...register('user_name')} />
          <p>{errors.user_name?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <input {...register('email')} />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          {' '}
          <label>Phone</label>
          <input {...register('mobileNumber')} />
          <p>{errors.mobileNumber?.message}</p>
        </div>
        <div>
          <label>Gender</label>
          <select {...register('gender')}>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
          <p>{errors.gender?.message}</p>
        </div>
        <div>
          <label>Language </label>
          <label> English</label>
          <input {...register('language')} type="radio" value="English" />
          <label> Arabic</label>
          <input {...register('language')} type="radio" value="Arabic" />
        </div>
        <p>{errors.language?.message}</p>
        <div>
          <label>Password</label>
          <input {...register('password')} />
        </div>
        <p>{errors.password?.message}</p>
        <div>
          <label>Confirm Password</label>
          <input {...register('confirm_password')} />
        </div>
        <p>{errors.confirm_password?.message}</p>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default SignUpForm;
