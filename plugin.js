exports.version = 1
exports.description = "Page-size-custom: Customize layout styles like max-width and zoom level, Design for old man."
exports.apiRequired = 1
exports.frontend_js = 'main.js'
exports.repo = "Hug3O/Page-size-custom"

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
    label: 'Page Zoom',
    defaultValue: '1.0',
    frontend: true,
    helperText: 'E.g. 1.0 for normal, 0.9 to zoom out, 1.1 to zoom in'
  }
}
