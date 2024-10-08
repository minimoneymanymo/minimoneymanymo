import React, { useState } from "react"
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

interface ToggleListProps {
  title: string
  children: React.ReactNode
}

const ToggleList: React.FC<ToggleListProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-50 shadow-md">
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between bg-white p-2 focus:outline-none"
      >
        <span className="p-2">{title}</span>
        <span>{isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
      </button>

      {/* 들여쓰기 및 배경색 추가 */}
      {isOpen && <div>{children}</div>}
    </div>
  )
}

export default ToggleList
