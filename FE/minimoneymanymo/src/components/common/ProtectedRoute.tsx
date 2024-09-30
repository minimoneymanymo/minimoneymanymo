import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/store/hooks"
import { selectParent } from "@/store/slice/parent"
import { selectChild } from "@/store/slice/child"
import ParentPageLayout from "@/layouts/ParentPageLayout"
import ChildPageLayout from "@/layouts/ChildPageLayout"

interface ProtectedRouteProps {
  requiredRole: "parent" | "child"
}

// requiredRole에 따라 부모/자식 페이지 보호하는 컴포넌트
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const parent = useAppSelector(selectParent)
  const child = useAppSelector(selectChild)

  // 부모 페이지 접근 시
  if (requiredRole === "parent") {
    if (parent.userId) {
      return <ParentPageLayout />
    }
    return (
      <Navigate
        to="/unauthorized"
        state={{ isLoggedIn: true, isParent: false }}
      />
    ) // 자식이 아닌 경우
    // return parent.userId ? <ParentPageLayout /> : <Navigate to="/login" />
  }

  // 자식 페이지 접근 시
  if (requiredRole === "child") {
    if (child.userId) {
      return <ChildPageLayout />
    }
    // return child.userId ? <ChildPageLayout /> : <Navigate to="/login" />
    return (
      <Navigate
        to="/unauthorized"
        state={{ isLoggedIn: true, isParent: true }}
      />
    ) // 자식이 아닌 경우
  }

  return <Navigate to="/unauthorized" /> // 기본적으로 로그인 페이지로 리디렉션
}

export default ProtectedRoute
