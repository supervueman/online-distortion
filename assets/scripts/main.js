// Vendors
import './vendor/jquery'
import './vendor/bootstrap'
import './vendor/fontawesome'

window.addEventListener('load', () => {
  $('.effect--control-gain').on('input', (e) => {
    const value = e.target.value
    // gain.gain.setValueAtTime(value, context.currentTime)
    $('.effect--gain').find('.effect--value').text(value)
  })

  $('.effect--control-delay').on('input', (e) => {
    const value = e.target.value
    // delay.delayTime.setValueAtTime(value, context.currentTime)
    $('.effect--delay').find('.effect--value').text(value)
  })

  $('.effect--control-panner').on('input', (e) => {
    const value = e.target.value
    // panner.pan.setValueAtTime(value, context.currentTime)
    $('.effect--panner').find('.effect--value').text(value)
  })

  function bgFilterChange(type) {
    const bgfilterDomEl = $('.effect--bqfilter')

    const filter = bgfilterDomEl.find(`.effect--bqfilter-${type}`)

    const controlContainerFrequency = filter.find('.effect--control-container-bqfilter-frequency')
    const controlContainerQ = filter.find('.effect--control-container-bqfilter-q')
    const controlContainerGain = filter.find('.effect--control-container-bqfilter-gain')

    const inputFrequency = controlContainerFrequency.find('.effect--control')
    const inputQ = controlContainerQ.find('.effect--control')
    const inputGain = controlContainerGain.find('.effect--control')

    const valueDomFrequency = controlContainerFrequency.find('.effect--value')
    const valueDomQ = controlContainerQ.find('.effect--value')
    const valueDomGain = controlContainerGain.find('.effect--value')

    inputFrequency.on('input', (e) => {
      const value = e.target.value
      // bqFiltersEnum[type].frequency.setValueAtTime(value, context.currentTime)
      valueDomFrequency.text(value)
    })

    inputQ.on('input', (e) => {
      const value = e.target.value
      // bqFiltersEnum[type].Q.setValueAtTime(value, context.currentTime)
      valueDomQ.text(value)
    })

    inputGain.on('input', (e) => {
      const value = e.target.value
      // bqFiltersEnum[type].gain.setValueAtTime(value, context.currentTime)
      valueDomGain.text(value)
    })
  }

  bgFilterChange('lowpass')
  bgFilterChange('highpass')
})
