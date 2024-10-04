import { createContext, ReactNode, useContext, useState } from "react"
import { Child } from "../my-children/types"
import { getMyChild } from "@/api/user-api"

interface ChildContextType {
  child: Child | null
  setChild: React.Dispatch<React.SetStateAction<Child | null>>
  fetchChild: () => Promise<void>
  fetchChildById: (childId: number) => Promise<void>
}

const defaultContextValue: ChildContextType = {
  child: null,
  setChild: () => {},
  fetchChild: async () => {},
  fetchChildById: async () => {},
}

const ChildContext = createContext<ChildContextType>(defaultContextValue)

export const ChildProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [child, setChild] = useState<Child | null>(null)

  const fetchChildById = async (childId: number) => {
    const res = await getMyChild(Number(childId))
    console.log("child context" + res.data)
    if (res) {
      setChild(res.data)
    }
  }
  const fetchChild = async () => {
    const res = await getMyChild(child!.childrenId)
    console.log("child context" + res.data)
    if (res) {
      setChild(res.data)
    }
  }

  return (
    <ChildContext.Provider
      value={{ child, setChild, fetchChildById, fetchChild }}
    >
      {children}
    </ChildContext.Provider>
  )
}
export const useChild = () => useContext(ChildContext)

export default ChildContext
