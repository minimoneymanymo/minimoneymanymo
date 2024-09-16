import React from "react"
import {Outlet} from "react-router-dom"

const ParentChildrenPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex h-full w-[1140px] border">
        ParentChildrenPageLayout
        <Outlet></Outlet>
      </main>
    </div>
  )
}

export default ParentChildrenPageLayout
