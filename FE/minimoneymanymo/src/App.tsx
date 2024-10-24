import { Routes, Route } from "react-router-dom"
import ChildPage from "@/pages/chlid/ChildPage"
import LoginPage from "@/pages/main/LoginPage"
import MainPage from "@/pages/main/MainPage"
import ParentPage from "@/pages/parent/ParentPage"
import SignUpPage from "@/pages/main/SignUpPage"
import NewsPage from "@/pages/main/NewsPage"
import ParentChildrenPageLayout from "@/layouts/ParentChildrenPageLayout"
import MainPageLayout from "@/layouts/MainLayout"
import MyChildrenPage from "./pages/parentchildren/MyChildrenPage"
import MyChildFinancePage from "./pages/parentchildren/MyChildFinancePage"
import StockPageLayout from "./layouts/StockPageLayout"
import StockDetailPage from "./pages/stock/StockDetailPage"
import ChildDairyPage from "./pages/chlid/ChildDairyPage"
import MyChildDiaryCheckPage from "./pages/parentchildren/MyChildDiaryCheckPage"
import ParentAccountPage from "./pages/parent/ParentAccountPage"
import MyChildInvestStylePage from "./pages/parentchildren/MyChildInvestStylePage"
import ChildInvestStylePage from "./pages/chlid/ChildInvestStylePage"
import ChildWalletPage from "./pages/chlid/ChildWalletPage"
import NewsDetail from "./pages/News/NewsDetail"
import ChildStockPage from "./pages/chlid/ChildStockPage"
import UnauthorizedPage from "./components/common/mypage/UnauthorizedPage"
import ProtectedRoute from "./components/common/ProtectedRoute"
import NewsListPage from "./pages/News/NewsListPage"
import { useLocation } from "react-router-dom"

import IntroPage from "./pages/main/IntroPage"

function App() {
  const location = useLocation()
  const shouldApplyMargin =
    !location.pathname.includes("/stock/") &&
    !location.pathname.includes("/main")

  return (
    <div className={shouldApplyMargin ? "mb-16" : ""}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/" element={<MainPageLayout />}>
          <Route path="main" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/newslist" element={<NewsListPage />} />
          <Route path="news/:newsId" element={<NewsDetail />} />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/parent"
            element={<ProtectedRoute requiredRole="parent" />}
          >
            <Route path="my-wallet" element={<ParentAccountPage />} />
            <Route path="my-info" element={<ParentPage />} />
            <Route path="my-children" element={<MyChildrenPage />} />
            <Route
              path="my-child/:childId"
              element={<ParentChildrenPageLayout />}
            >
              <Route path="finance" element={<MyChildFinancePage />} />
              <Route path="invest-style" element={<MyChildInvestStylePage />} />
              <Route path="diary" element={<MyChildDiaryCheckPage />} />
            </Route>
          </Route>
          <Route
            path="/my-info"
            element={<ProtectedRoute requiredRole="child" />}
          >
            <Route index element={<ChildPage />} />
            <Route path="wallet" element={<ChildWalletPage />} />
            <Route path="finance" element={<ChildStockPage />} />
            <Route path="invest-style" element={<ChildInvestStylePage />} />
            <Route path="diary" element={<ChildDairyPage />} />
          </Route>
          <Route path="/stock" element={<StockPageLayout />}>
            <Route path=":stockCode" element={<StockDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
