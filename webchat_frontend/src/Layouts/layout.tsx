import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <nav>Navbar</nav>

      <main>
        <Outlet />
      </main>

      <footer>Footer</footer>
    </>
  );
}

export default Layout;