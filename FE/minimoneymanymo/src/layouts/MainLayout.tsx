import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/common/header/Navbar"
import Modal from "@/components/common/ExplainModal"

const MainPageLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태

  const handleChatbotClick = () => {
    setIsModalOpen(true) // 모달 열기
  }

  const closeModal = () => {
    setIsModalOpen(false) // 모달 닫기
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto mt-5 flex h-full w-[1140px]">
        <Outlet />
      </main>
      <button
        onClick={handleChatbotClick}
        className="fixed bottom-4 right-4 rounded-full bg-white p-3 shadow-[0px_3px_10px_rgba(0,0,0,0.3)] transition duration-300"
      >
        <img src="/images/question.png" alt="Help" className="h-8 w-8" />
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} /> {/* 모달 렌더링 */}
    </div>
  )
}

export default MainPageLayout
