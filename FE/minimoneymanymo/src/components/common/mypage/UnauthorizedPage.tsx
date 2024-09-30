import React from "react"
import { useLocation, useNavigate } from "react-router-dom"

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // state에서 로그인 여부 및 부모/자식 여부 가져오기
  const { isLoggedIn, isParent } = location.state || {
    isLoggedIn: false,
    isParent: false,
  }

  return (
    <div className="flex min-h-[calc(100vh-105px)] w-full flex-col items-center justify-center space-y-10 text-gray-800">
      <h1 className="text-9xl font-bold text-red-500">😕</h1>
      {/* <h2 className="mt-4 text-3xl font-semibold text-gray-700">
        접근이 거부되었습니다!
      </h2> */}
      <p className="mt-2 px-4 text-center text-2xl text-gray-600">
        {isLoggedIn ? (
          isParent ? (
            <span>
              부모 계정으로 로그인하셨습니다. 자녀 전용 페이지에 접근할 수
              없습니다.
            </span>
          ) : (
            <span>
              자녀 계정으로 로그인하셨네요. 여긴 부모님만 접근할 수 있어요!
            </span>
          )
        ) : (
          <span>로그인이 필요합니다. 로그인 후 다시 시도해주세요.</span>
        )}
      </p>
      <div className="mt-6 space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="rounded bg-primary-m1 px-6 py-3 text-lg text-white shadow transition duration-300 hover:bg-blue-400"
        >
          로그인 하러 가기
        </button>
        <button
          onClick={() => navigate(-1)} // 뒤로가기
          className="rounded bg-gray-200 px-6 py-3 text-lg text-gray-700 shadow transition duration-300 hover:bg-gray-300"
        >
          뒤로가기
        </button>
      </div>
    </div>
  )
}

export default UnauthorizedPage
