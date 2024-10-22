import { signUp } from "../src/Services/User.service";
import { useForm } from "react-hook-form";
import "./App.css";
import joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Schema = joi.object({
  user_name: joi.string().trim().required().messages({
    "string.empty": "Please enter a name",
  }),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "Enter Email address",
      "string.email": "Please Provide valid Email Id",
    }),
  gender: joi.string().required().valid("Male", "Female", "Other").messages({
    "any.only": "Please provide valid Gender",
  }),
  mobileNumber: joi.string().length(10).required().messages({
    "string.empty": "Invalid Phone Number.Please provide a valid Phone Number",
    "string.length": "Phone number must be 10 digits",
  }),
  language: joi.string().required().valid("English", "Arabic").messages({
    "any.only": "Please provide required Language",
  }),
  password: joi.string().required().messages({
    "string.empty": "Password is required",
    // "string.pattern.base": "Password Contain only uppercase letters, lowercase letters and digits.",
  }),
  confirm_password: joi.string().valid(joi.ref("password")).required().messages({
    "string.empty": "Confirm Password is required",
    "any.only": "Password do not match",
  }),
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: joiResolver(Schema) });

  const onFormSubmit = async (data) => {
    try {
      console.log("user Data", data);
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
      const result = await signUp(payload);
      console.log(result);
      alert("Sign Up Sucessful");
    } catch (error) {
      console.log(error);
      alert(error.response.data.message ?? error.message);
    }
  };

  const handleCancel = () => {
    navigate("/"); // Redirect to the home page
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <h2>User Credentials</h2>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Name
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="text" {...register("user_name")} isInvalid={errors.user_name} />
          <Form.Control.Feedback type="invalid">{errors.user_name?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Email
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="email" {...register("email")} isInvalid={errors.email} />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Phone
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="text" {...register("mobileNumber")} isInvalid={errors.mobileNumber} />
          <Form.Control.Feedback type="invalid">{errors.mobileNumber?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Gender
        </Form.Label>
        <Col sm={9}>
          <Form.Select {...register("gender")} isInvalid={errors.gender}>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.gender?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Language
        </Form.Label>
        <Col sm={9}>
          <Form.Check inline type="radio" label="English" {...register("language")} value="English" isInvalid={errors.language} />
          <Form.Check inline type="radio" label="Arabic" {...register("language")} value="Arabic" isInvalid={errors.language} />
          <Form.Control.Feedback type="invalid">{errors.language?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Password
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="password" {...register("password")} isInvalid={errors.password} />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Confirm Password
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="password" {...register("confirm_password")} isInvalid={errors.confirm_password} />
          <Form.Control.Feedback type="invalid">{errors.confirm_password?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      {/* Submit Button */}
      <Form.Group as={Row} className="mb-3">
        <Col sm={{ span: 9, offset: 3 }}>
          <div className="d-flex justify-content-between">
            <Button type="submit" variant="primary">
              Log In
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default SignUpForm;
