import withPwa from "next-pwa";
import withBundleAnalyzer from "@next/bundle-analyzer";

import { withLess } from "./compile/next.less.js";
import { runtimeCaching } from "./compile/next.cache.js";
import { nextConfig } from "./compile/next.config.js";
// import { BannerPlugin } from "./compile/next.webpack.js";

const isProd = process.env.NODE_ENV === "production";
const isAnalyzer = process.env.NEXT_PUBLIC_ANALYZER_ENABLE === "true";

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
      ...(isProd ? { namespace: "ranger" } : {}),
    },
  },
};

const nextJsPlugins = [];

nextJsPlugins.push(
  withLess({
    lessLoaderOptions: {
      // it's possible to use additionalData or modifyVars for antd theming
      // read more @ https://ant.design/docs/react/customize-theme
      // additionalData: (content) => `${content}\n@border-radius-base: 10px;`,
      lessOptions: {
        modifyVars: nextConfig.antd.variables,
        javascriptEnabled: true,
      },
    },
  })
);

if (isAnalyzer) {
  nextJsPlugins.push(
    withBundleAnalyzer({
      enabled: isAnalyzer,
      openAnalyzer: false,
    })
  );
}

if (isProd) {
  nextJsPlugins.push(
    withPwa({
      disable: false,
      dest: "public",
      register: true,
      skipWaiting: true,
      reloadOnOnline: true,
      cacheStartUrl: false,
      dynamicStartUrl: true,
      runtimeCaching,
    })
  );
}

const nextJsCompile = nextJsPlugins.reduce((acc, plugin) => plugin(acc), {
  ...nextJsConfig,
});

export default nextJsCompile;
