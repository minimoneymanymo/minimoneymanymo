import {createContext, ReactNode, useContext, useState} from "react"
import {Child} from "../my-children/types"


interface ChildContextType {
  child: Child | null
  setChild: React.Dispatch<React.SetStateAction<Child | null>>
}

const defaultContextValue: ChildContextType = {
  child: null,
  setChild: () => {},
}

const ChildContext = createContext<ChildContextType>(defaultContextValue)

export const ChildProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [child, setChild] = useState<Child | null>(null)

  return (
    <ChildContext.Provider value={{child, setChild}}>
      {children}
    </ChildContext.Provider>
  )
}
export const useChild = () => useContext(ChildContext)

export default ChildContext