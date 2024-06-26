import cloneDeep from 'clone-deep'

const addLessToRegExp = (rx) => new RegExp(rx.source.replace('|sass', '|sass|less'), rx.flags)

export const withLess =
  ({ lessLoaderOptions } = {}) =>
  (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      /**
       * @param {import('webpack').Configuration} config
       * @param {*} options
       * @returns {import('webpack').Configuration}
       */
      webpack(config, options) {
        // there are 2 relevant sass rules in next.js - css modules and global css
        let sassModuleRule
        // global sass rule (does not exist in server builds)
        let sassGlobalRule

        const isNextSpecialCSSRule = (rule) =>
          // next >= 12.0.7
          rule[Symbol.for('__next_css_remove')] ||
          // next < 12.0.7
          rule.options?.__next_css_remove

        const cssRule = config.module.rules.find((rule) => rule.oneOf?.find(isNextSpecialCSSRule))

        if (!cssRule) {
          throw new Error(
            'Could not find next.js css rule. Please ensure you are using a supported version of next.js'
          )
        }

        const imageRule = config.module.rules.find((rule) => rule.loader === 'next-image-loader')

        if (imageRule) {
          imageRule.issuer.not = addLessToRegExp(imageRule.issuer.not)
        }

        const addLessToRuleTest = (test) => {
          if (Array.isArray(test)) {
            return test.map((rx) => addLessToRegExp(rx))
          } else {
            return addLessToRegExp(test)
          }
        }

        cssRule.oneOf.forEach((rule) => {
          if (rule.options?.__next_css_remove) return

          if (rule.use?.loader === 'error-loader') {
            rule.test = addLessToRuleTest(rule.test)
          } else if (rule.use?.loader?.includes('file-loader')) {
            // url() inside .less files - next <= 11
            rule.issuer = addLessToRuleTest(rule.issuer)
          } else if (rule.type === 'asset/resource') {
            // url() inside .less files - next >= 12
            rule.issuer = addLessToRuleTest(rule.issuer)
          } else if (rule.use?.includes?.('ignore-loader')) {
            rule.test = addLessToRuleTest(rule.test)
          } else if (rule.test?.source === '\\.module\\.(scss|sass)$') {
            sassModuleRule = rule
          } else if (rule.test?.source === '(?<!\\.module)\\.(scss|sass)$') {
            sassGlobalRule = rule
          }
        })

        const lessLoader = {
          loader: 'less-loader',
          options: {
            ...lessLoaderOptions,
            lessOptions: {
              javascriptEnabled: true,
              ...lessLoaderOptions.lessOptions
            }
          }
        }

        let lessModuleRule = cloneDeep(sassModuleRule)

        const configureLessRule = (rule) => {
          rule.test = new RegExp(rule.test.source.replace('(scss|sass)', 'less'))
          // replace sass-loader (last entry) with less-loader
          rule.use.splice(-1, 1, lessLoader)
        }

        configureLessRule(lessModuleRule)
        cssRule.oneOf.splice(cssRule.oneOf.indexOf(sassModuleRule) + 1, 0, lessModuleRule)

        if (sassGlobalRule) {
          let lessGlobalRule = cloneDeep(sassGlobalRule)
          configureLessRule(lessGlobalRule)
          cssRule.oneOf.splice(cssRule.oneOf.indexOf(sassGlobalRule) + 1, 0, lessGlobalRule)
        }

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      }
    })
  }
