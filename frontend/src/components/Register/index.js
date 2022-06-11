import { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { showForm } from "../Redux/reducers/auth";

const Register = () => {
  const [firstName, setFirstName] = useState("null");
  const [lastName, setLastName] = useState("null");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("null");
  const [email, setEmail] = useState("null");
  const [password, setPassword] = useState("null");
  const [passwordType, setPasswordType] = useState(false);

  const [repeatPassword, setRepeatPassword] = useState("null");
  const [focused, setFocused] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==============================

  const role_id = 1;

  const dispatch = useDispatch();

  const { regForm } = useSelector((state) => {
    return {
      regForm: state.auth.regForm,
    };
  });

  // ==============================

  const handleFocus = (e) => {
    setFocused(true);
  };

  //===============================

  const createUser = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/register", {
        firstName,
        lastName,
        country,
        age,
        email,
        password,
        role_id,
      })
      .then((result) => {
        setMessage(result.data.massage);
        // navigate("/login");
      })
      .catch((error) => {
        setError(error.response.data.massage);
      });
  };

  return (
    <div className={regForm ? "form-container" : "hide"}>
      <form className="formInput" onSubmit={createUser}>
        <div className="signup-header">
          <div>
            <h2>Sign Up</h2>
            <p>It’s quick and easy.</p>
          </div>
          <IoCloseSharp
            className="close-btn"
            onClick={() => {
              dispatch(showForm(false));
            }}
          />
        </div>
        <div className="border"></div>
        <div className="all-inputs">
          <div className="user-name">
            <div className="reg-names">
              <input
                placeholder="First name"
                required
                className="firstName regInput"
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFocused(false);
                }}
                onBlur={() => {
                  handleFocus();
                  firstName !== "null"
                    ? setFirstName(firstName)
                    : setFirstName("");
                }}
                focused={firstName}
              />
              <span className="firstNameError">What's your first name?</span>
            </div>
            <div className="reg-names">
              <input
                placeholder="Last name"
                required
                className="lastName regInput"
                onChange={(e) => {
                  setLastName(e.target.value);
                  setFocused(false);
                }}
                onBlur={() => {
                  lastName !== "null" ? setLastName(lastName) : setLastName("");
                  handleFocus();
                }}
                focused={lastName}
              />
              <span className="lastNameError">What's your last name?</span>
            </div>
          </div>

          <div className="input-div">
            <input
              placeholder="Country regInput"
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            />

            <input
              placeholder="Birthday"
              type={"date"}
              required
              className="birthdate regInput"
              onChange={(e) => {
                setAge(e.target.value);
                setFocused(false);
              }}
              onBlur={() => {
                age !== "null" ? setAge(age) : setAge("");
                handleFocus();
              }}
              focused={age}
            />
            <span className="ageError">Enter your birthday</span>

            <input
              type={"email"}
              placeholder="Email"
              required
              className="email regInput"
              onChange={(e) => {
                setEmail(e.target.value);
                setFocused(false);
                setMessage("");
                setError("");
              }}
              onBlur={() => {
                email !== "null" ? (
                  setEmail(email)
                ) : (
                  <>
                    {setEmail("")} {setMessage("should contain @ and .com")}
                  </>
                );
                handleFocus();
              }}
              focused={email}
            />

            <span className="emailError">{message}</span>

            <span className={error ? "notExist" : ""}>{error}</span>

            <input
              placeholder="Password"
              required
              type={"password"}
              className="password regInput"
              onChange={(e) => {
                setPassword(e.target.value);
                setFocused(false);
                setPasswordType(false);
              }}
              onBlur={() => {
                handleFocus();
                setPasswordType(true);
              }}
              pattern={`^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`}
              focused={passwordType.toString()}
            />
            <span className="passwordError">
              should be at least 6 numbers ,letters and include at one special
              character!
            </span>

            <input
              placeholder="Confirm password"
              required
              type={"password"}
              pattern={password}
              className={"repeatPassword regInput"}
              onChange={(e) => {
                setFocused(false);
                setRepeatPassword(e.target.value);
              }}
              onBlur={() => {
                repeatPassword !== "null" && repeatPassword === password
                  ? setRepeatPassword(password)
                  : setRepeatPassword("");
                handleFocus();
              }}
              focused={repeatPassword}
            />
            <span className="repeatPasswordError">Passwords don't match!</span>
          </div>
        </div>
        <button className="signUp">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
