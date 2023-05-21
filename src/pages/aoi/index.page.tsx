import './index.css'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import aoiMd from './aoi.md?raw'

export const documentProps = {
  title: '定款',
}

export function Page() {
  return (
    <div className="aoi-container">
      <ReactMarkdown className="aoi" rehypePlugins={[rehypeRaw]} children={aoiMd} />
    </div>
  )
}
