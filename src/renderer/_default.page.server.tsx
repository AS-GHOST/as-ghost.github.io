import ReactDOMServer from 'react-dom/server'
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr/server'

import { PageContextServer } from '../types.ts'
import { PageShell } from './PageShell.tsx'

export const passToClient = ['pageProps', 'urlPathname']

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  if (!Page) throw new Error('render() hook expects pageContext.Page to be defined')

  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
  )

  const { documentProps } = pageContext.exports
  const title =
    documentProps?.title != null ? `${documentProps.title} | 一般社団法人 幽霊電網` : '一般社団法人 幽霊電網'
  const description =
    documentProps?.description ??
    '当法人は、情報通信システムの設計・運用・構築を通じて、技術者育成に寄与することを目的としています。'

  const adobeFontsScript =
    '(function(l){var e={kitId:"vpq7pvk",scriptTimeout:3000,async:true},j=l.documentElement,g=setTimeout(function(){j.className=j.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive"},e.scriptTimeout),c=l.createElement("script"),k=false,i=l.getElementsByTagName("script")[0],b;j.className+=" wf-loading";c.src="https://use.typekit.net/"+e.kitId+".js";c.async=true;c.onload=c.onreadystatechange=function(){b=this.readyState;if(k||b&&b!="complete"&&b!="loaded"){return}k=true;clearTimeout(g);try{Typekit.load(e)}catch(a){}};i.parentNode.insertBefore(c,i)})(document);'

  const documentHtml = escapeInject`
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f47b.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
        
        <script>${dangerouslySkipEscape(adobeFontsScript)}</script>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>
  `

  return {
    documentHtml,
    pageContext: {},
  }
}
