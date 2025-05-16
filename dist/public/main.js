(() => {
  const zoomKey = 'hfs_page_zoom'
  const config = HFS.getPluginConfig?.() || {}
  const defaultZoom = parseFloat(config.zoom || '1.0').toFixed(1)
  let zoom = localStorage.getItem(zoomKey) || defaultZoom

  const applyZoom = val => {
    zoom = parseFloat(val).toFixed(1)
    document.documentElement.style.zoom = zoom
    localStorage.setItem(zoomKey, zoom)
  }

  const insertZoomControls = () => {
    const themeSelect = document.getElementById('option-theme')
    if (!themeSelect || document.getElementById('zoom-control')) return

    const control = document.createElement('div')
    control.id = 'zoom-control'
    control.style.display = 'flex'
    control.style.gap = '1em'
    control.style.flexWrap = 'wrap'
    control.style.alignItems = 'center'
    control.style.marginTop = '1em'

    const label = document.createElement('label')
    label.textContent = 'Scale:'

    const minusBtn = document.createElement('button')
    minusBtn.textContent = '-'
    minusBtn.addEventListener('click', () => {
      const newZoom = Math.max(0.5, parseFloat(zoom) - 0.1).toFixed(1)
      input.value = newZoom
      applyZoom(newZoom)
    })

    const plusBtn = document.createElement('button')
    plusBtn.textContent = '+'
    plusBtn.addEventListener('click', () => {
      const newZoom = Math.min(1.5, parseFloat(zoom) + 0.1).toFixed(1)
      input.value = newZoom
      applyZoom(newZoom)
    })

    const input = document.createElement('input')
    input.type = 'number'
    input.min = '0.5'
    input.max = '1.5'
    input.step = '0.1'
    input.value = zoom
    input.style.width = '4em'
    input.addEventListener('input', () => {
      applyZoom(input.value)
    })

    control.append(label, minusBtn, input, plusBtn)
    themeSelect.parentNode.insertBefore(control, themeSelect.nextSibling)
  }

  // apply zoom on load
  document.documentElement.style.zoom = zoom

  // lazy-load and cache custom font
  if (config.enableFont) {
    let fontPath = config.fontUrl
    if (config.localFont) fontPath = '/~/plugins/Page-scale-custom/font/font.ttf'

    const loadFont = () => {
      if (!fontPath || window.__FONT_LOADED__) return
      window.__FONT_LOADED__ = true
      const font = new FontFace('CustomFont', `url("${fontPath}")`)
      font.load().then(loadedFont => {
        document.fonts.add(loadedFont)
        const style = document.createElement('style')
        style.innerHTML = `
          body, input, textarea, select, button {
            font-family: 'CustomFont', sans-serif !important;
          }
        `
        document.head.appendChild(style)
        localStorage.setItem('fontLoaded', '1')
      }).catch(err => console.error("Failed to load custom font:", err))
    }

    if (localStorage.getItem('fontLoaded') === '1') {
      loadFont()
    } else {
      const onInteraction = () => {
        loadFont()
        window.removeEventListener('scroll', onInteraction)
      }
      window.addEventListener('scroll', onInteraction)
      setTimeout(loadFont, 3000)
    }
  }

  // observe DOM changes to insert controls dynamically
  const observer = new MutationObserver(() => insertZoomControls())
  observer.observe(document.body, { childList: true, subtree: true })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => insertZoomControls())
  } else {
    insertZoomControls()
  }
})()
