import './index.css'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { Background } from '@/pages/index/Background.tsx'

export function Page() {
  return (
    <div className="container">
      <Background />

      <div className="content">
        <div className="heading">
          <h1>
            <span className="box-text">
              一般社団法人 <wbr />
              幽霊電網
            </span>
          </h1>
          <div>
            <span className="box-text">
              当法人は、
              <wbr />
              情報通信システムの
              <wbr />
              設計・
              <wbr />
              運用・
              <wbr />
              構築を通じて、
              <wbr />
              技術者育成に
              <wbr />
              寄与することを
              <wbr />
              目的としています。
            </span>
          </div>
        </div>

        <div className="links">
          <Link label="定款" href="/aoi" />
          <Link label="電子公告">
            <Link label="2022年度">
              <Link label="事業報告書" href="/public-notice/2022/annual-report.pdf" />
              <Link label="収支計算書" href="/public-notice/2022/financial-statement.pdf" />
            </Link>
          </Link>
        </div>
      </div>
    </div>
  )
}

type LinkProps =
  | {
      label: string
      href: string
      children?: undefined
    }
  | {
      label: string
      href?: undefined
      children: ReactNode
    }

const LinkContext = createContext(false)

function Link({ label, href, children }: LinkProps) {
  const [showLinkGroup, setShowLinkGroup] = useState(false)
  const toggleLinkGroup = () => setShowLinkGroup((prev) => !prev)

  const showLinkGroupOnParent = useContext(LinkContext)
  useEffect(() => {
    if (!showLinkGroupOnParent) {
      setShowLinkGroup(false)
    }
  }, [showLinkGroupOnParent])

  if (href != null) {
    return (
      <a className="link box-text" href={href}>
        {label}
      </a>
    )
  } else {
    return (
      <div className="link-container">
        <button className={`box-text link ${showLinkGroup ? 'link-active' : ''}`} onClick={toggleLinkGroup}>
          {label}
        </button>
        {showLinkGroup && (
          <div className="link-group">
            <LinkContext.Provider value={showLinkGroup}>{children}</LinkContext.Provider>
          </div>
        )}
      </div>
    )
  }
}
