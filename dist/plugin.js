exports.version = 1.9
exports.description = "Customize layout styles like max-width, scale level, and custom font file. Design for old ages and hawkeye."
exports.apiRequired = 10.0
exports.frontend_js = 'main.js'
exports.repo = "hugo529100/hfs-Page-scale-custom"

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
    helperText: 'Enter URL of a web font (e.g. /images/Fonts/zhunyuan.TTF)',
    showIf: values => !values.localFont
  },
  localFont: {
    type: 'boolean',
    label: 'Use local font file',
    defaultValue: false,
    frontend: true,
    helperText: 'Enable to choose a font file from disk'
  },
  fontFile: {
    type: 'real_path',
    label: 'Font File (local)',
    files: true,
    folders: false,
    defaultPath: __dirname,
    fileMask: '*.ttf|*.otf|*.woff|*.woff2',
    showIf: values => values.localFont,
    helperText: 'Select a TTF/OTF/WOFF font from your disk'
  }
}

exports.init = api => {
  const fs = api.require('fs/promises')
  const path = api.require('path')
  const fontStorage = path.join(__dirname, 'public', 'font')
  const fontDest = path.join(fontStorage, 'font.ttf')

  api.subscribeConfig(['localFont', 'fontFile'], async ({ localFont, fontFile }) => {
    if (!localFont || !fontFile) return
    try {
      await fs.mkdir(fontStorage, { recursive: true })
      const [srcBuf, dstBuf] = await Promise.allSettled([
        fs.readFile(fontFile),
        fs.readFile(fontDest)
      ])

      const same = srcBuf.status === 'fulfilled' &&
                   dstBuf.status === 'fulfilled' &&
                   Buffer.compare(srcBuf.value, dstBuf.value) === 0

      if (!same) {
        await fs.writeFile(fontDest, srcBuf.value)
      }
    } catch (err) {
      api.log('Error handling font file:', err)
    }
  })

  return {}
}
