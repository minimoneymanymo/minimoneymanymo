import { Outlet } from "react-router-dom"

function StockPageLayout(): JSX.Element {

  return (
    <div className="">
      <Outlet/>
    </div>
  )
}

export default StockPageLayout
