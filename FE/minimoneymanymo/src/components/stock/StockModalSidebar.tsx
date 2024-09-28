import React from "react"
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react"
import {
  AssessmentOutlined, // 시장
  MonetizationOn, //시가총액
  BarChartOutlined, // PER, PBR, 주가 등락률
  ShowChart, // 주가
  AttachMoney, // 거래대금
  TrendingUp, // 52주 최고가
  TrendingDown, // 52주 최저가
  SwapVert, // 거래량
} from "@mui/icons-material" // Material UI Icons

interface StockModalSidebarProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function StockModalSidebar({
  selectedCategory,
  setSelectedCategory,
}: StockModalSidebarProps) {
  return (
    <Card className="shadow-blue-gray-900/5 h-full w-full max-w-[16rem] p-4 shadow-xl">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          검색 조건
        </Typography>
      </div>
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <List>
          <ListItem onClick={() => setSelectedCategory("시장")}>
            <ListItemPrefix>
              <AssessmentOutlined className="h-5 w-5" /> {/* 시장 아이콘 */}
            </ListItemPrefix>
            시장
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("시가총액")}>
            <ListItemPrefix>
              <MonetizationOn className="h-5 w-5" /> {/* 시장 아이콘 */}
            </ListItemPrefix>
            시가총액
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("PER")}>
            <ListItemPrefix>
              <BarChartOutlined className="h-5 w-5" /> {/* PER 아이콘 */}
            </ListItemPrefix>
            PER
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("PBR")}>
            <ListItemPrefix>
              <BarChartOutlined className="h-5 w-5" /> {/* PBR 아이콘 */}
            </ListItemPrefix>
            PBR
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("주가")}>
            <ListItemPrefix>
              <ShowChart className="h-5 w-5" /> {/* 주가 아이콘 */}
            </ListItemPrefix>
            주가
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("주가 등락률")}>
            <ListItemPrefix>
              <BarChartOutlined className="h-5 w-5" />{" "}
              {/* 주가 등락률 아이콘 */}
            </ListItemPrefix>
            주가 등락률
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("52주 최고가")}>
            <ListItemPrefix>
              <TrendingUp className="h-5 w-5" /> {/* 52주 최고가 아이콘 */}
            </ListItemPrefix>
            52주 최고가
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("52주 최저가")}>
            <ListItemPrefix>
              <TrendingDown className="h-5 w-5" /> {/* 52주 최저가 아이콘 */}
            </ListItemPrefix>
            52주 최저가
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("거래량")}>
            <ListItemPrefix>
              <SwapVert className="h-5 w-5" /> {/* 거래량 아이콘 */}
            </ListItemPrefix>
            거래량
          </ListItem>
          <ListItem onClick={() => setSelectedCategory("거래대금")}>
            <ListItemPrefix>
              <AttachMoney className="h-5 w-5" /> {/* 거래대금 아이콘 */}
            </ListItemPrefix>
            거래대금
          </ListItem>
        </List>
      </div>
    </Card>
  )
}
