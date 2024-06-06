import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    prefix: string
    colors: {
      primary: string
      white: string
      black: string
    }
    breakPoint: {
      xxs: number
      xs: number
      s: number
      m: number
      l: number
      xl: number
      xxl: number
    }
  }
}
