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
    label.textContent = 'Page Zoom:'

    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0.5'
    slider.max = '1.5'
    slider.step = '0.1'
    slider.value = zoom

    const zoomText = document.createElement('span')
    zoomText.textContent = 'Current zoom:'

    const input = document.createElement('input')
    input.type = 'number'
    input.min = '0.5'
    input.max = '1.5'
    input.step = '0.1'
    input.value = zoom
    input.style.width = '4em'

    const resetBtn = document.createElement('button')
    resetBtn.textContent = 'Reset'
    resetBtn.addEventListener('click', () => {
      slider.value = defaultZoom
      input.value = defaultZoom
      applyZoom(defaultZoom)
    })

    slider.addEventListener('input', () => {
      input.value = slider.value
      applyZoom(slider.value)
    })

    input.addEventListener('input', () => {
      slider.value = input.value
      applyZoom(input.value)
    })

    control.append(label, slider, zoomText, input, resetBtn)

    // 插入到 #option-theme select 的下方
    themeSelect.parentNode.insertBefore(control, themeSelect.nextSibling)
  }

  // 立即套用倍率
  document.documentElement.style.zoom = zoom

  // 監控是否載入到 Options
  const observer = new MutationObserver(() => insertZoomControls())
  observer.observe(document.body, { childList: true, subtree: true })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => insertZoomControls())
  } else {
    insertZoomControls()
  }
})()
