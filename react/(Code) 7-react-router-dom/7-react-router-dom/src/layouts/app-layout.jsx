import {Outlet, useNavigation} from "react-router-dom";
import Header from "../components/header";

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div>
      React Router Dom Tutorial
      {/* Header */}
      <Header />
      {/* loading */}
      {isLoading && <div>Loading...</div>}
      {/* pages */}
      <Outlet />
    </div>
  );
};

export default AppLayout;
