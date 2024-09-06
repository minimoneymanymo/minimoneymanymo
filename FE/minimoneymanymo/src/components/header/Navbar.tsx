import React from "react";
import { NavLink } from "react-router-dom";

const NavItemList = (): JSX.Element => {
  let itemId = 0;
  const navItems = [
    {
      id: itemId++,
      category: "main",
      to: "/main",
    },
    {
      id: itemId++,
      category: "login",
      to: "/login",
    },
    {
      id: itemId++,
      category: "child",
      to: "/child",
    },
    {
      id: itemId++,
      category: "parent",
      to: "/parent",
    },
  ];
  return (
    <nav className="flex h-8 items-center">
      {navItems.map((item) => (
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            ` flex h-12 items-center px-2.5 text-xl marker:rounded-xl truncate ${
              isActive ? "bg-yellow-400 font-bold" : "text-gray-300"
            }`
          }
        >
          {item.category}
        </NavLink>
      ))}
    </nav>
  );
};

const Navbar = (): JSX.Element => {
  return (
    <div className="mx-auto flex justify-between items-center border ">
      <NavItemList></NavItemList>
    </div>
  );
};

export default Navbar;
