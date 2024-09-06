import React from "react"
import {Outlet} from "react-router-dom"
import Navbar from "../components/common/header/Navbar"

const MainPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className=" border w-[1140px]  h-full mx-auto flex">
        <Outlet></Outlet>
      </main>
    </div>
  )
}

export default MainPageLayout
