import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import logo from "../assets/images/instalogo.jpg";
import Swal from "sweetalert2";
import { forgotPassSchema } from "./Validations";
import "../assets/css/forgotpass.css"
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPassSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/forgetpassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const response = await res.json();

        if (response.message === "User not registered!") {
          formik.setFieldError("email", response.message);
          setLoading(false);
        } else if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Check your email for reset password",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            navigate("/login");
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoading(false);
      }
    },
  });

  return (
    <div className="signIn">
      <div>
        <div className="forgot-form">
          <img className="signUp-logo" src={logo} alt="" />
          <form onSubmit={formik.handleSubmit}>
            <div className="input-control">
              <input
                type="email"
                className="form-control form-control-sm"
                id="exampleInputEmail1"
                placeholder="Enter Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                name="email"
                style={{ padding: "7px" }}
              />
            </div>

            {formik.touched.email && formik.errors.email && (
              <p className="err-msg-register">{formik.errors.email}</p>
            )}

            <button
            style={{width:"100%"}}
              id="clk"
              type="submit"
              className={`btn btn-primary mt-2 ${loading ? "disabled" : ""}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
