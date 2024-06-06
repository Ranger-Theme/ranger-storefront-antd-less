import { ConfigProvider as AntdConfigProvider } from 'antd'
import { ThemeProvider, StyleSheetManager } from 'styled-components'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.less'

import { isPropValid } from '@ranger-theme/utils'

import { ThemeConf } from '@/config/theme.conf'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const App = ({ Component, pageProps }: AppProps) => {
  const shouldForwardProp: any = (propName: string, elementToBeRendered: string) => {
    return typeof elementToBeRendered === 'string' ? isPropValid(propName) : true
  }

  return (
    <AntdConfigProvider prefixCls={ThemeConf.theme.prefix}>
      <StyleSheetManager enableVendorPrefixes shouldForwardProp={shouldForwardProp}>
        <ThemeProvider theme={ThemeConf.theme}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </ThemeProvider>
      </StyleSheetManager>
    </AntdConfigProvider>
  )
}

export default App
