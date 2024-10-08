import React, { useEffect, useState } from "react"
import { Element, scroller } from "react-scroll"

// 페이지 내용 컴포넌트들
const Page1Content = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-blue-400 text-white">
    <h1 className="text-6xl font-bold">Welcome to Our Site!</h1>
  </div>
)
const Page2Content = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-green-400">
    <h1 className="text-6xl font-bold text-white">
      Discover Amazing Features!
    </h1>
  </div>
)
const Page3Content = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-purple-400">
    <h1 className="text-6xl font-bold text-white">Get Started Now!</h1>
  </div>
)

const pages = [
  { id: "page1", component: <Page1Content /> },
  { id: "page2", component: <Page2Content /> },
  { id: "page3", component: <Page3Content /> },
]

const App: React.FC = () => {
  const [currentPageId, setCurrentPageId] = useState(pages[0].id)
  const handleScroll = (event: WheelEvent) => {
    event.preventDefault()
    const direction = event.deltaY > 0 ? "down" : "up"
    const currentIndex = pages.findIndex((page) => page.id === currentPageId)
    if (direction === "down") {
      if (currentIndex < pages.length - 1) {
        const nextPage = pages[currentIndex + 1].id
        setCurrentPageId(nextPage)
        scroller.scrollTo(nextPage, {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
        })
      } else {
        const firstPage = pages[0].id
        setCurrentPageId(firstPage)
        scroller.scrollTo(firstPage, {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
        })
      }
    } else if (direction === "up" && currentIndex > 0) {
      const prevPage = pages[currentIndex - 1].id
      setCurrentPageId(prevPage)
      scroller.scrollTo(prevPage, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      })
    }
  }
  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleScroll)
    }
  }, [currentPageId])
  return (
    <div>
      {pages.map((page, index) => (
        <Element
          key={index}
          name={page.id}
          className={`flex h-screen items-center justify-center`}
        >
          {page.component}
        </Element>
      ))}
    </div>
  )
}

export default App
