import React, { useState } from "react";
import { signUp } from "../Servicios/AuthService";

const SignUpPage = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password1 !== password2) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await signUp(fullname, email, password1);
      setSuccess(response.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error during sign up");
      setSuccess("");
    }
  };

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <form onSubmit={handleSubmit} className="card card-body bg-dark text-white p-5">
            <h3 className="text-center fw-bold mb-4">Sign Up</h3>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <label htmlFor="fullname">Write your fullname:</label>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              className="form-control mb-3"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              autoFocus
            />

            <label htmlFor="email">Write your Email:</label>
            <input
              type="email"
              name="email"
              placeholder="youremail@mail.com"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password1">Write your password:</label>
            <input
              type="password"
              name="password1"
              placeholder="Password"
              className="form-control mb-3"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />

            <label htmlFor="password2">Confirm your password:</label>
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              className="form-control mb-3"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />

            <button className="btn btn-success btn-block">
              Register
            </button>
          </form>

          <p className="fs-5 text-center text-white mt-3">
            Do you already have an account?{" "}
            <a href="/signin" className="text-info">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
