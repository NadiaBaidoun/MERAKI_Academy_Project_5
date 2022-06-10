import { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Redux/reducers/auth";

const Login = () => {
  const [email, setEmail] = useState("null");
  const [password, setPassword] = useState("null");
  const [passwordType, setPasswordType] = useState(false);

  const [focused, setFocused] = useState(false);

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [error, setError] = useState("");
  const [passError, setPassError] = useState("");

  // ===============================
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ==============================

  const handleFocus = (e) => {
    setFocused(true);
  };

  //===============================

  const signIn = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", {
        email,
        password,
      })
      .then((result) => {
        dispatch(login(result.data.token));
        navigate("/home");
      })
      .catch((error) => {
        error.response.data.message.includes("email")
          ? setError(error.response.data.message)
          : setPassError(error.response.data.message);
      });
  };

  return (
    <div>
      <form className="signInput" onSubmit={signIn}>
        <input
          type={"email"}
          placeholder="Email"
          required
          className="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setFocused(false);
            setEmailMessage("");
            setError("");
          }}
          onBlur={() => {
            email !== "null" && email !== "" ? (
              setEmail(email)
            ) : (
              <>
                {setEmail("")} {setEmailMessage("Enter your email !")}
              </>
            );
            handleFocus();
          }}
          focused={email}
        />

        <span className="emailError">{emailMessage}</span>
        <span className={error ? "notExist" : ""}>{error}</span>

        <input
          placeholder="Password"
          required
          type={"password"}
          className="password"
          onChange={(e) => {
            setPassword(e.target.value);
            setFocused(false);
            setPasswordType(false);
            setPasswordMessage("");
            setPassError("");
          }}
          onBlur={() => {
            password !== "null" && password !== "" ? (
              setPassword(password)
            ) : (
              <>
                {setPassword("")} {setPasswordMessage("Enter your password !")}
              </>
            );
            handleFocus();
            setPasswordType(true);
          }}
          focused={passwordType.toString()}
        />
        <span className="passwordError">{passwordMessage}</span>
        <span className={passError ? "notExist" : ""}>{passError}</span>

        <button className="login">Log In</button>
      </form>
    </div>
  );
};

export default Login;
