import {Outlet} from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const AppLayout = () => {
  return (
    <div>
      <div className="p-6">
        <Header />

        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
