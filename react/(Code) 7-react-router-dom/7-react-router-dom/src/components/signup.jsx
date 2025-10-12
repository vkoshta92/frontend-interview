import {useNavigate} from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(e.target.email.value, e.target.password.value);
    if (e.target.email.value && e.target.password.value) {
      navigate("/posts");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Enter Name" />
        <input type="email" name="email" placeholder="Enter Email" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Signup;
