import React, {useState} from "react"
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Radio,
} from "@material-tailwind/react"
import {ChevronDownIcon} from "@heroicons/react/24/outline"

// MenuComponent 정의
interface MenuComponentProps {
  label: string
  items: string[]
  onSelect: (selected: string) => void
}

const StockFilterMenu: React.FC<MenuComponentProps> = ({
  label,
  items,
  onSelect,
}) => {
  const [openMenu, setOpenMenu] = useState(false)
  const [selected, setSelected] = useState<string>("")

  const handleSelect = (item: string) => {
    setSelected(item)
    onSelect(item) // 선택된 아이템을 부모로 전달
  }

  return (
    <Menu
      animate={{
        mount: {y: 0},
        unmount: {y: 25},
      }}
    >
      <MenuHandler>
        <Button
          variant="text"
          className="flex items-center gap-3 text-base font-normal capitalize tracking-normal"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {label}
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3.5 w-3.5 transition-transform ${
              openMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList>
        {items.map((item, index) => (
          <MenuItem key={index} className="flex items-center gap-2">
            <Radio
              id={`radio-${item}`}
              name="menu-radio"
              color="blue"
              checked={selected === item}
              onChange={() => handleSelect(item)}
            />
            <label htmlFor={`radio-${item}`} className="cursor-pointer">
              {item}
            </label>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default StockFilterMenu
