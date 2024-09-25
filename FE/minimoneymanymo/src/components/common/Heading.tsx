import React from "react"

interface TitleProps {
  title: string
  // style?: string
}

const Heading: React.FC<TitleProps> = ({ title }) => {
  return (
    <div
      className={`mt-0 flex h-12 w-full items-center border-b border-gray-300 text-xl font-bold`}
    >
      <span className="p-4">{title}</span>
    </div>
  )
}

export default Heading
