import 'the-new-css-reset/css/reset.css'
import '../index.css'

import React from 'react'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
