import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import AOS from "aos"
import "aos/dist/aos.css"
// 페이지 내용 컴포넌트들
const Page1Content = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-blue-400 text-white">
    <motion.h1
      initial={{ opacity: 0, y: "50px" }}
      animate={{ opacity: 1, y: "0px", transition: { duration: 1 } }}
      className="text-center text-6xl font-bold leading-normal tracking-wide"
    >
      청소년 경제 교육의 모든 것 <br />
      미니머니마니모 에서 <br />
      유용하고 편리하게
    </motion.h1>
  </div>
)
const Page2Content = () => (
  <div className="flex h-[600px] w-screen items-center justify-center bg-green-400">
    <h1 className="text-center text-4xl font-bold leading-normal tracking-wide text-white">
      용돈으로 주식을 투자하며 돈의 가치를 배워보세요. <br /> 다양한 콘텐츠로
      경제를 이해하고 실력을 키우는 서비스, <br />
      용돈을 불리며 얻는 재미를 미니머니마니모에서 시작해보세요.
    </h1>
    <h1 className="text-6xl font-bold text-white"></h1>
  </div>
)
//**** 매매 설명 ****
const Page3Content = () => {
  const [imageSrc, setImageSrc] = useState("/meme.gif") // 초기 이미지

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 4000) {
        setImageSrc("/퀴즈.gif") // 원래 이미지 경로
      } else if (window.scrollY >= 3202) {
        setImageSrc("/투자일기.gif") // 변경할 이미지 경로
      } else {
        setImageSrc("/meme.gif") // 원래 이미지 경로
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="relative flex h-[4500px] w-full justify-center gap-8 bg-white">
      <div className="absolute z-10 flex w-full flex-col items-start gap-[400px] ps-24 pt-[250px]">
        <h1 className="ml-[120px] mt-[70px] w-[600px] text-5xl font-bold leading-snug tracking-wide">
          어렵게만 느껴졌던 주식투자
          <br />
          매수부터 매도까지 <br />
          간단하게
        </h1>
        <h1 className="ml-[120px] mt-[120px] text-4xl font-bold tracking-wider">
          높은 금액대의 주식도 소수점 매매로 <br />
          원하는 만큼 매수해요.
        </h1>
        <h1 className="ml-[120px] mt-[320px] text-4xl font-bold tracking-wider">
          매매 시 반드시 투자 이유를 작성해 <br />
          충동적인 결정을 방지하고 <br />
          선택에 명확한 근거를 남겨요.
        </h1>
        <h1 className="ml-[120px] mt-[320px] text-4xl font-bold tracking-wider">
          마이페이지에서 투자 기록을 확인하고 <br />
          부모님과 자녀가 피드백을 주고 받아요.
        </h1>
        <h1 className="ml-[120px] mt-[320px] text-4xl font-bold tracking-wider">
          어려운 용어는 설명을, <br />
          투자에 도움을 주는 뉴스기사까지
        </h1>
      </div>
      <div className="sticky right-0 top-12 ml-auto mt-[750px] h-screen">
        {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("meme.gif")',
          width: "1200px",
          height: "100vh",
        }}
      /> */}

        <img className="h-[80%]" src={imageSrc} alt="아이 호버 이미지" />
      </div>
    </div>
  )
}

const Page4Content = () => (
  <div className="flex h-[2000px] w-full flex-col items-center justify-center gap-16 bg-primary-50">
    {/* <h1 className="text-6xl font-bold text-white">투자 성향 분석</h1> */}
    <h1 className="w-[80%] text-5xl font-bold leading-snug tracking-wide">
      나의 투자 성향이 <br />
      어떤지 궁금하신가요?
    </h1>
    <div
      className="mt-[200px] flex w-[90%] flex-nowrap items-center space-x-24"
      data-aos="fade-up"
    >
      <img
        src="/투자분석.JPG"
        className="w-[700px] rounded-3xl shadow-md"
        alt="투자분석"
      />
      <h1 className="w-[1000px] text-3xl font-bold leading-snug tracking-wide">
        투자결과를 바탕으로 한 투자 분석이 그래프로 (나타나요.)
        <br />
        다른 사용자와 비교하며 나의 위치를 알 수 있어요.
      </h1>
    </div>
    <div
      className="mt-[120px] flex w-[90%] flex-nowrap items-center space-x-24"
      data-aos="fade-up"
    >
      <h1 className="ml-[120px] w-[1000px] text-3xl font-bold leading-snug tracking-wide">
        투자 성향을 통해 <br />
        부모님은 자녀 투자 교육 방향에 조언을 얻어요.
      </h1>
      <img
        src="/투자성향.JPG"
        className="w-[700px] rounded-3xl shadow-md"
        alt="투자성향"
      />
    </div>
  </div>
)
const Page5Content = () => (
  <div className="flex h-screen w-screen items-start justify-center gap-16 bg-secondary-m2 pt-[300px]">
    <img className="w-[50%]" src="/퀴즈.gif" alt="아이 호버 이미지" />
    <div className="flex w-[40%] flex-col space-y-10">
      <h1 className="text-6xl font-bold text-white">경제 교육</h1>
      <h1 className="text-2xl  text-white">
        매일 업데이트되는 <br />
        경제 뉴스를 <br />
        확인해 보세요.
        <br />
      </h1>
      <h1 className="text-4xl font-bold text-white">
        뉴스를 보며 경제시사상식을 쌓고
        <br />
        {/* (뉴스를 보며 경제시사상식을 쌓아 시장을 보는 눈을 넓혀요.) */}
        <br />
        퀴즈를 풀며 보너스 머니를 얻어요
        <br />
      </h1>
    </div>
  </div>
)
const Page6Content = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center gap-16 bg-primary-200">
    <div className="flex flex-col items-center gap-16" data-aos="zoom-out">
      <h1 className="text-6xl font-bold text-white">꼭 필요했던 서비스</h1>
      <h1 className="text-6xl font-bold text-white">미니머니마니모</h1>
    </div>
  </div>
)
const Page7Content = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center gap-16 bg-black">
    <h1 className="text-6xl font-bold text-white">footer</h1>
  </div>
)

const pages = [
  { id: "page1", component: <Page1Content /> },
  { id: "page2", component: <Page2Content /> },
  { id: "page3", component: <Page3Content /> },
  { id: "page4", component: <Page4Content /> },
  { id: "page5", component: <Page5Content /> },
  { id: "page6", component: <Page6Content /> },
  { id: "page7", component: <Page7Content /> },
]

const App: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    AOS.init()
  }, [])
  return (
    <div>
      {pages.map((page, index) => (
        <div
          key={index}
          id={page.id} // 각 페이지에 id 추가
          className={`flex items-center justify-center`}
        >
          {page.component}
        </div>
      ))}
    </div>
  )
}

export default App
