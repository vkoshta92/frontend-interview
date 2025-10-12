import {Outlet} from "react-router-dom";
import Header from "./header";

const AppLayout = () => {
  return (
    <div className="p-6">
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
