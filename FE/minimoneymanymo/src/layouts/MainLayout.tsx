import React from "react"
import {Outlet} from "react-router-dom"
import Navbar from "../components/common/header/Navbar"

const MainPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto mt-5 flex h-full w-[1140px] border">
        <Outlet></Outlet>
      </main>
    </div>
  )
}

export default MainPageLayout
