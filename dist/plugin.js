
exports.version = 1.4
exports.description = "Customize layout styles like max-width, scale level, and custom font file. Design for old ages and hawkeye."
exports.apiRequired = 1
exports.frontend_js = 'main.js'
exports.repo = "Hug3O/Page-scale-custom"

exports.config = {
  maxWidth: {
    type: 'string',
    label: 'Max width',
    defaultValue: '220em',
    frontend: true,
    helperText: 'E.g. 100em, 1200px'
  },
  zoom: {
    type: 'string',
    label: 'Page Scale',
    defaultValue: '1.0',
    frontend: true,
    helperText: 'E.g. 1.0 for normal, 0.9 to scale down, 1.1 to scale up'
  },
  enableFont: {
    type: 'boolean',
    label: 'Enable custom font',
    defaultValue: false,
    frontend: true,
    helperText: 'Enable to apply a custom web font'
  },
  fontUrl: {
    type: 'string',
    label: 'Custom Font URL',
    frontend: true,
    helperText: 'Enter URL of a web font (e.g. /images/Fonts/zhunyuan.TTF)'
  }
}

exports.init = api => {
  return {
    // No custom REST API needed
  }
}