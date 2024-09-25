import React, { useState } from "react"

const RegisterAccount: React.FC = () => {
  const [checkAuth, setCheckAuth] = useState(false) // 상태 관리

  const handleAuthClick = () => {
    // 인증 버튼 클릭 시 checkAuth 값을 true로 설정 (임시로 처리)
    setCheckAuth(true)
  }

  return (
    <div>
      <div className="flex w-full">
        <div className="flex flex-1 flex-col space-y-4 pr-2">
          {/* 계좌번호 입력란 */}
          <div className="flex items-center space-x-2">
            <span className="w-20">계좌번호</span>
            <input
              type="text"
              placeholder="계좌번호를 입력하세요"
              className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          {/* 은행 선택란 */}
          <div className="flex items-center space-x-2">
            <span className="w-20">은행</span>
            <select className="flex-1 rounded-md border border-gray-300 p-2 text-gray-500 focus:outline-none focus:ring focus:ring-gray-300">
              <option value="" disabled selected className="text-gray-500">
                은행
              </option>
              <option value="은행1">은행1</option>
              <option value="은행2">은행2</option>
              <option value="은행3">은행3</option>
            </select>
          </div>
        </div>

        {/* 인증 버튼 */}
        <div className="ml-2 flex w-1/5 items-center">
          <button
            className="mt-2 rounded bg-secondary-600-m2 px-5 py-2 text-white"
            onClick={handleAuthClick} // 인증 버튼 클릭 시 checkAuth 값 변경
          >
            인증
          </button>
        </div>
      </div>

      {/* 1원 인증 검증 */}
      {checkAuth && ( // checkAuth가 true일 때만 표시
        <div className="ml-20 mt-2 text-gray-700">
          <div className="p-2">
            <p>
              고객님의 계좌 인증을 위해 <b>1원을 입금</b>하였습니다.
            </p>
            <p>입금자명을 확인한 후, 숫자 4개를 입력해주세요.</p>
          </div>
          <div className="p-2">
            <input
              type="text"
              placeholder="인증 번호"
              className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-gray-300"
            />
            <button className="ml-2 rounded bg-secondary-600-m2 px-5 py-2 text-white">
              인증
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegisterAccount
