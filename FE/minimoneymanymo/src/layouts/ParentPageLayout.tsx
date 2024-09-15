import React from "react"
import {Outlet} from "react-router-dom"

const ParentPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex h-full w-[1140px] border">
        ParentPageLayout
        <Outlet></Outlet>
      </main>
    </div>
  )
}

export default ParentPageLayout
