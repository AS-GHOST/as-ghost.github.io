import React from 'react'
import { PageContextBuiltIn, PageContextBuiltInClientWithServerRouting } from 'vite-plugin-ssr/types'

type Page = (pageProps: PageProps) => React.ReactElement
export type PageProps = Record<string, unknown>

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  urlPathname: string
  exports: {
    documentProps?: {
      title?: string
      description?: string
    }
  }
}

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
export type PageContextClient = PageContextBuiltInClientWithServerRouting<Page> & PageContextCustom

export type PageContext = PageContextClient | PageContextServer
