import React, { useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useRef } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion"
import { wrap } from "@motionone/utils"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/common/header/Navbar"

interface ParallaxProps {
  children: string
  baseVelocity: number
}

function ParallaxText({ children, baseVelocity = 10 }: ParallaxProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 10], {
    clamp: false,
  })

  /**
   * This is a magic wrapping for the length of the text - you
   * have to replace for wrapping that works for you or dynamically
   * calculate
   */
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef<number>(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    baseX.set(baseX.get() + moveBy)
  })

  /**
   * The number of times to repeat the child text should be dynamically calculated
   * based on the size of the text and viewport. Likewise, the x motion value is
   * currently wrapped between -20 and -45% - this 25% is derived from the fact
   * we have four children (100% / 4). This would also want deriving from the
   * dynamically generated number of children.
   */
  return (
    <div className="parallax w-full">
      <motion.div className="scroller w-full" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  )
}

// 페이지 내용 컴포넌트들
const Page1Content = () => {
  const navigator = useNavigate()

return(
  
  <div className="relative flex h-screen w-screen items-center flex-col justify-center bg-primary-m1 text-white">
    <motion.h1
      initial={{ opacity: 0, y: "50px" }}
      animate={{ opacity: 1, y: "0px", transition: { duration: 1 } }}
      className="text-center text-6xl font-bold leading-normal tracking-wide"
      >
      청소년 경제 교육의 모든 것 <br />
      미니머니마니모 에서 <br />
      유용하고 편리하게
    </motion.h1>
      {/* 중앙 하단에 화살표 추가 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 transform">
      <button className=" m-9 text-gray-50" onClick={()=>{navigator("/")} }>홈으로 가기</button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="flex items-center justify-center"
          >
          {/* 화살표 CSS */}
          <div className="h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </motion.div>
    </div>
  </div>
)

}
const Page2Content = () => (
  <div className="flex h-[800px] w-screen items-center justify-center">
    <h1 className="text-center text-4xl font-bold leading-normal tracking-wide">
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
      } else if (window.scrollY >= 3602) {
        setImageSrc("/투자일기.gif") // 변경할 이미지 경로
      } else {
        setImageSrc("/매매.gif") // 원래 이미지 경로
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="relative flex h-[4100px] w-full justify-center gap-8 bg-white">
      <div className="absolute z-10 flex w-full flex-col items-start gap-[400px] ps-24 pt-[250px]">
        <h1 className="ml-[40px] mt-[70px] w-[600px] text-5xl font-bold leading-snug tracking-wide">
          어렵게만 느껴졌던 주식투자
          <br />
          매수부터 매도까지 <br />
          간단하게
        </h1>
        <h1 className="mt-[20px] flex flex-col text-3xl font-bold leading-snug tracking-wider">
          <span className="leading-snugs mb-[30px] mt-[70px] w-[600px] text-5xl tracking-wide">
            소수점 매매
          </span>
          높은 금액대의 주식도 소수점 매매로 <br />
          원하는 만큼 매수해요.
        </h1>
        <h1 className="mt-[120px] flex flex-col text-3xl font-bold leading-snug tracking-wider">
          <span className="leading-snugs mb-[30px] mt-[70px] w-[600px] text-5xl tracking-wide">
            투자 피드백
          </span>
          매매 시 반드시 투자 이유를 작성해 <br />
          충동적인 결정을 방지하고 <br />
          선택에 명확한 근거를 남겨요.
        </h1>
        <h1 className="mt-[120px] flex flex-col text-3xl font-bold leading-snug tracking-wider">
          <span className="leading-snugs mb-[30px] mt-[70px] w-[600px] text-5xl tracking-wide">
            투자 일기
          </span>
          마이페이지에서 투자 기록을 확인하고 <br />
          부모님과 자녀가 피드백을 주고 받아요.
        </h1>
        <h1 className="mt-[120px] flex flex-col text-3xl font-bold leading-snug tracking-wider">
          <span className="leading-snugs mb-[30px] mt-[70px] w-[600px] text-5xl tracking-wide">
            유용한 투자정보
          </span>
          어려운 용어는 설명을, <br />
          투자에 도움을 주는 뉴스기사까지
        </h1>
      </div>
      <div className="sticky right-0 top-[10%] ml-auto mt-[750px] h-screen w-[50%]">
        {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("meme.gif")',
          width: "1200px",
          height: "100vh",
        }}
      /> */}
        {/* <div className=" absolute w-full bg-gradient-to-b from-primary-m1 to-white"></div> */}
        <div className="absolute inset-0 z-10 w-full bg-gradient-to-l from-black/0 via-transparent to-white/100"></div>

        <img className="w-full" src={imageSrc} alt="아이 호버 이미지" />
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
        className="w-[600px] rounded-3xl shadow-md"
        alt="투자분석"
      />
      <h1 className="text-3xl font-bold leading-normal tracking-wide">
        투자결과를 바탕으로 한 <span className="text-4xl">투자 분석</span>
        이 제공돼요.
        <br />
        <span className="text-2xl">
          다른 사용자와 비교하며 나의 위치를 알 수 있어요.
        </span>
      </h1>
    </div>
    <div
      className="mt-[120px] flex w-[90%] flex-nowrap items-center space-x-24"
      data-aos="fade-up"
    >
      <h1 className="ml-[20px] text-3xl font-bold leading-snug tracking-wide">
        <span className="text-4xl">투자 성향</span>
        을 통해 부모님은 <br />
        자녀 투자 교육 방향에 조언을 얻어요.
      </h1>
      <img
        src="/투자성향.JPG"
        className="w-[600px] rounded-3xl shadow-md"
        alt="투자성향"
      />
    </div>
  </div>
)
const Page5Content = () => (
  <div className="flex h-screen w-screen items-start justify-center gap-16 bg-secondary-m2 pt-[120px]">
    <img className="w-[50%]" src="/퀴즈.gif" alt="아이 호버 이미지" />
    <div className="flex w-[40%] flex-col space-y-10">
      <h1 className="text-6xl font-bold text-white">경제 교육</h1>
      <h1 className="text-2xl text-white">
        매일 업데이트되는 <br />
        경제 뉴스를 <br />
        확인해 보세요.
        <br />
      </h1>
      <h1 className="text-3xl leading-snug text-white">
        뉴스를 보며 경제시사상식을 쌓고
        <br />
        {/* (뉴스를 보며 경제시사상식을 쌓아 시장을 보는 눈을 넓혀요.) */}
        퀴즈를 풀며 보너스 머니를 얻어요
        <br />
      </h1>
    </div>
  </div>
)
const Page6Content = () => {
  const navigator = useNavigate()

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between gap-16">
      <div className="flex h-full flex-col items-center justify-center gap-16">
        <div
          className="flex flex-col items-center gap-16 pt-[250px]"
          data-aos="zoom-out"
        >
          <h1 className="text-6xl font-bold">꼭 필요했던 서비스</h1>
          <h1 className="text-6xl font-bold">미니머니마니모</h1>

          <button
            className="mt-6 border border-black px-4 py-1 text-xl"
            onClick={() => {
              navigator("/")
            }}
          >
            이용하러 가기
          </button>
        </div>
      </div>
      <span className="">
        B105 아름다완 요민이 팀원: 김세민 목요빈 이다영 이창현 조아름 개발기간 :
        2024.09.04 ~ 2024.10.11
      </span>
    </div>
  )
}

const Page7Content = () => (
  <div className="flex h-[100px] w-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
    <ParallaxText baseVelocity={-10}>청소년 투자 교육 서비스</ParallaxText>

    <ParallaxText baseVelocity={10}>
      미니머니마니모 MINIMONEYMANYMO
    </ParallaxText>
  </div>
)

const Gra = () => (
  <div className="h-64 w-full bg-gradient-to-b from-white to-primary-50"></div>
)

const Gra2 = () => (
  <div className="h-96 w-full bg-gradient-to-b from-primary-50 to-secondary-m2"></div>
)

const Gra3 = () => (
  <div className="h-24 w-full bg-gradient-to-b from-primary-m1 to-white"></div>
)
const Gra4 = () => (
  <div className="h-96 w-full bg-gradient-to-t from-white to-secondary-m2"></div>
)
const pages = [
  { id: "page1", component: <Page1Content /> },
  // { id: "gra2", component: <Gra3 /> },
  { id: "page2", component: <Page2Content /> },
  { id: "page3", component: <Page3Content /> },
  { id: "gra", component: <Gra /> },
  { id: "page4", component: <Page4Content /> },
  { id: "gra2", component: <Gra2 /> },
  { id: "page5", component: <Page5Content /> },
  { id: "gra2", component: <Gra4 /> },
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
    <div className="hidden-scrollbar w-screen">
      {pages.map((page, index) => (
        <div
          key={index}
          id={page.id} // 각 페이지에 id 추가
          className={`flex w-screen items-center justify-center`}
        >
          {page.component}
        </div>
      ))}
    </div>
  )
}

export default App
