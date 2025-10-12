import {NavLink} from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <NavLink
        // className={({isActive, isPending, isTransitioning}) =>
        //   [
        //     isPending ? "pending" : "",
        //     isActive ? "active" : "",
        //     isTransitioning ? "transitioning" : "",
        //   ].join(" ")
        // }

        // style={({isActive, isPending, isTransitioning}) => {
        //   return {
        //     fontWeight: isActive ? "bold" : "",
        //     color: isPending ? "red" : "black",
        //     viewTransitionName: isTransitioning ? "slide" : "",
        //   };
        // }}
        to="/auth"
      >
        Home
      </NavLink>
      <NavLink to="/posts">Posts</NavLink>
    </header>
  );
};

export default Header;
