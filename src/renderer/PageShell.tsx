import React from 'react'

import { PageContext } from '../types.ts'
import { PageContextProvider } from '../usePageContext.tsx'
import { Layout } from './Layout.tsx'

type PageShellProps = {
  children: React.ReactNode
  pageContext: PageContext
}

export function PageShell({ children, pageContext }: PageShellProps) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>{children}</Layout>
      </PageContextProvider>
    </React.StrictMode>
  )
}
