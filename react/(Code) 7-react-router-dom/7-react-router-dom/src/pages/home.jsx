import {NavLink, Outlet} from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="header">
        <NavLink to={"/auth/login"}>Login</NavLink>
        <NavLink to={"/auth/signup"}>Signup</NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Home;
