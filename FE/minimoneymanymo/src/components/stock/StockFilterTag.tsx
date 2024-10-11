import React from "react"

interface StockFilterTagProps {
  label: string
}

const StockFilterTag: React.FC<StockFilterTagProps> = ({ label }) => {
  return (
    <span className="flex h-8 items-center rounded-full bg-secondary-100 px-4 py-2.5 text-sm font-bold text-gray-800">
      {label}
    </span>
  )
}

export default StockFilterTag
