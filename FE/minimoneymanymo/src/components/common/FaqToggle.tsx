import React, { useState } from "react"
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

interface ToggleListProps {
  title: string
  children: React.ReactNode
}

const FaqToggle: React.FC<ToggleListProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="overflow-hidden rounded-2xl p-2">
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between"
      >
        <span className={`p-2 ${isOpen ? "font-bold" : ""}`}>{title}</span>
        <span>{isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
      </button>

      {isOpen && <div>{children}</div>}
    </div>
  )
}

export default FaqToggle
