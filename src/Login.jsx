import { login } from "./Services/User.service.js";
import * as Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const schema = Joi.object({
  user_email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "Please Provide Email Id",
      "string.email": "Email Id must be valid",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    // 'string.pattern.base': 'Password Contain only uppercase letters, lowercase letters and digits.',
  }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: joiResolver(schema) });

  const handleLogin = async (data) => {
    try {
      const originalPassword = data.password;
      const encodedPassword = window.btoa(originalPassword);
      const payload = {
        useremail: data.user_email,
        password: encodedPassword,
      };
      const newLogin = await login(payload);
      console.log(newLogin);
      // alert(newLogin.message);
      localStorage.setItem("Token", newLogin.token);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error", error);
      alert("LogIn Failed.Email Id or Password does not Match...");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Log In</h2>

          <Form onSubmit={handleSubmit(handleLogin)}>
            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label>Email Id</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="email"
                  {...register("user_email")}
                  isInvalid={!!errors?.useremail}
                  size="lg" // Large size input field
                />
                <Form.Control.Feedback type="invalid">{errors?.useremail?.message}</Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="password"
                  {...register("password")}
                  isInvalid={!!errors?.password}
                  size="lg" // Large size input field
                />
                <Form.Control.Feedback type="invalid">{errors?.password?.message}</Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Submit Button */}
            <Form.Group as={Row} className="mb-3">
              <Col sm={{ span: 9, offset: 3 }}>
                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="primary" className="me-2" size="lg">
                    Log In
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} size="lg">
                    Cancel
                  </Button>
                </div>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
