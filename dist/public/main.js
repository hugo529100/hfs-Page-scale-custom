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
    input.style.width = '3em'

    const resetBtn = document.createElement('button')
    resetBtn.textContent = 'Reset'
    resetBtn.addEventListener('click', () => {
      input.value = defaultZoom
      applyZoom(defaultZoom)
    })

    input.addEventListener('input', () => {
      applyZoom(input.value)
    })

    control.append(label, minusBtn, input, plusBtn, resetBtn)
    themeSelect.parentNode.insertBefore(control, themeSelect.nextSibling)
  }

  // apply zoom on load
  document.documentElement.style.zoom = zoom

  // load and apply custom font if enabled and URL is provided
  if (config.enableFont && config.fontUrl) {
    const font = new FontFace('CustomFont', `url("${config.fontUrl}")`)
    font.load().then(loadedFont => {
      document.fonts.add(loadedFont)
      const style = document.createElement('style')
      style.innerHTML = `
        body, input, textarea, select, button {
          font-family: 'CustomFont', sans-serif !important;
        }
      `
      document.head.appendChild(style)
    }).catch(err => console.error("Failed to load custom font:", err))
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
