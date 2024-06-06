import fs from 'fs'
import path from 'path'
import withPwa from 'next-pwa'
import withBundleAnalyzer from '@next/bundle-analyzer'
import dateformat from 'dateformat'

import { withLess } from './compile/next.less.js'
import { runtimeCaching } from './compile/next.cache.js'
import { nextConfig } from './compile/next.config.js'
import { BannerPlugin } from './compile/next.webpack.js'

const pkgPath = path.resolve(process.cwd(), 'package.json')
const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

const isProd = process.env.NODE_ENV === 'production'
const isAnalyzer = process.env.NEXT_PUBLIC_ANALYZER_ENABLE === 'true'

/**
 * @type {import('next').NextConfig}
 */
const nextJsConfig = {
  compress: false,
  trailingSlash: false,
  transpilePackages: [],
  compiler: {
    reactRemoveProperties: isProd,
    removeConsole: isProd,
    styledComponents: {
      displayName: !isProd,
      ssr: true,
      minify: isProd,
      ...(isProd ? { namespace: 'ranger' } : {})
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer && isProd) {
      config.optimization.minimizer.push(
        new BannerPlugin({
          banner: `/*!\n *  @name: ${pkgJson.name} \n *  @author: ${
            pkgJson.author
          } \n *  @date: ${dateformat(
            new Date(),
            'UTC:dddd, mmmm dS, yyyy, h:MM:ss TT'
          )} \n *  @version: ${pkgJson.version} \n *  @license: ${
            pkgJson.license
          } \n *  @copyright: ${pkgJson.copyright} \n */\n`
        })
      )
    }

    return config
  }
}

const nextJsPlugins = []

nextJsPlugins.push(
  withLess({
    lessLoaderOptions: {
      // it's possible to use additionalData or modifyVars for antd theming
      // read more @ https://ant.design/docs/react/customize-theme
      // additionalData: (content) => `${content}\n@border-radius-base: 10px;`,
      lessOptions: {
        modifyVars: nextConfig.antd.variables,
        javascriptEnabled: true
      }
    }
  })
)

if (isAnalyzer) {
  nextJsPlugins.push(
    withBundleAnalyzer({
      enabled: isAnalyzer,
      openAnalyzer: false
    })
  )
}

if (isProd) {
  nextJsPlugins.push(
    withPwa({
      disable: false,
      dest: 'public',
      register: true,
      skipWaiting: true,
      reloadOnOnline: true,
      cacheStartUrl: false,
      dynamicStartUrl: true,
      runtimeCaching
    })
  )
}

const nextJsCompile = nextJsPlugins.reduce((acc, plugin) => plugin(acc), {
  ...nextJsConfig
})

export default nextJsCompile
