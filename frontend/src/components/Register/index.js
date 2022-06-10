import { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div>
      <form className="formInput" onSubmit={createUser}>
        <h1>Sign Up</h1>
        <input
          placeholder="First name"
          required
          className="firstName"
          onChange={(e) => {
            setFirstName(e.target.value);
            setFocused(false);
          }}
          onBlur={() => {
            handleFocus();
            firstName !== "null" ? setFirstName(firstName) : setFirstName("");
          }}
          focused={firstName}
        />
        <span className="firstNameError">What's your first name?</span>
        <input
          placeholder="Last name"
          required
          className="lastName"
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

        <input
          placeholder="Country"
          onChange={(e) => {
            setCountry(e.target.value);
          }}
        />

        <input
          placeholder="Birthday"
          type={"date"}
          required
          className="birthdate"
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
          className="email"
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
          className="password"
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
          className={"repeatPassword"}
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
        <button className="signUp">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
