import withLess from "next-with-less";

import { antdConfig } from "./config/antd.config.js";

const isProd = process.env.NODE_ENV === "production";

export default withLess({
  compress: false,
  trailingSlash: false,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: antdConfig.variables,
      javascriptEnabled: true,
    },
  },
  compiler: {
    reactRemoveProperties: isProd,
    removeConsole: isProd,
    styledComponents: {
      displayName: !isProd,
      ssr: true,
      minify: isProd,
      ...(isProd ? { namespace: "ritescreen" } : {}),
    },
  },
});
