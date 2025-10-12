import {Outlet, useNavigation} from "react-router-dom";
import Header from "./header";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="p-6">
      <Header />

      {isLoading && <div>Loading...</div>}

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
