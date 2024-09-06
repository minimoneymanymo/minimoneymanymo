import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/header/Navbar";

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className=" bg-black w-[1140px] mx-auto flex">
        <Outlet></Outlet>
      </main>
    </>
  );
};

export default Layout;
