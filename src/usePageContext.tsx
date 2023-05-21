import React, { useContext } from 'react'

import { PageContext } from './types.ts'

const Context = React.createContext<PageContext>(undefined as unknown as PageContext)

type PageContextProviderProps = {
  pageContext: PageContext
  children: React.ReactNode
}

export function PageContextProvider({ pageContext, children }: PageContextProviderProps) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

export function usePageContext() {
  return useContext(Context)
}
