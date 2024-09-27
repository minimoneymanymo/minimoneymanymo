import { Routes, Route } from "react-router-dom"
import ChildPage from "@/pages/chlid/ChildPage"
import LoginPage from "@/pages/main/LoginPage"
import MainPage from "@/pages/main/MainPage"
import ParentPage from "@/pages/parent/ParentPage"
import SignUpPage from "@/pages/main/SignUpPage"
import NewsPage from "@/pages/main/NewsPage"
import Temp from "@/components/common/Temp"
import ParentPageLayout from "@/layouts/ParentPageLayout"
import ParentChildrenPageLayout from "@/layouts/ParentChildrenPageLayout"
import ChildPageLayout from "@/layouts/ChildPageLayout"
import MainPageLayout from "@/layouts/MainLayout"
import MyChildrenPage from "./pages/parentchildren/MyChildrenPage"
import MyChildFinancePage from "./pages/parentchildren/MyChildFinancePage"
import StockPageLayout from "./layouts/StockPageLayout"
import ChartPage from "./pages/stock/ChartPage"
import MyDairy from "./components/diary/Calender"
import ChildDairyPage from "./pages/chlid/ChildDairyPage"
import MyChildDiaryCheckPage from "./pages/parentchildren/MyChildDiaryCheckPage"
import ParentAccountPage from "./pages/parent/ParentAccountPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="/stocks" element={<StockPageLayout />} />

        <Route path="/news" element={<NewsPage />} />
        <Route path="/parent" element={<ParentPageLayout />}>
          <Route path="my-wallet" element={<ParentAccountPage />} />
          <Route path="my-info" element={<ParentPage />} />
          <Route path="my-children" element={<MyChildrenPage />} />
          <Route
            path="my-child/:childId"
            element={<ParentChildrenPageLayout />}
          >
            <Route path="finance" element={<MyChildFinancePage />} />
            <Route path="invest-style" element={<Temp />} />
            <Route path="diary" element={<MyChildDiaryCheckPage />} />
          </Route>
        </Route>
        <Route path="/my-info" element={<ChildPageLayout />}>
          <Route index element={<ChildPage />} />
          <Route path="wallet" element={<Temp />} />
          <Route path="finance" element={<Temp />} />
          <Route path="invest-style" element={<Temp />} />
          <Route path="diary" element={<ChildDairyPage />} />
        </Route>
        <Route path="/stock" element={<StockPageLayout />}>
          <Route path=":stockCode" element={<ChartPage />} />{" "}
        </Route>
      </Route>
    </Routes>
  )
}

export default App
