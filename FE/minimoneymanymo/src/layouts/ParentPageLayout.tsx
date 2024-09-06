import React from "react"
import {Outlet} from "react-router-dom"

const ParentPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className=" border w-[1140px]  h-full mx-auto flex">
        ParentPageLayout
        <Outlet></Outlet>
      </main>
    </div>
  )
}

export default ParentPageLayout
