// Vendors
import './vendor/jquery'
import './vendor/bootstrap'
import './vendor/fontawesome'

window.addEventListener('load', () => {
  let context;
  let gain;
  const pannerOptions = { pan: 0 };
  let panner;
  let biquadFilterHighPass;
  let biquadFilterLowPass;
  let distortion
  let splitter
  let merger

  const bqFiltersEnum = {
    lowpass: biquadFilterLowPass,
    highpass: biquadFilterHighPass
  }

  function makeDistortionCurve(amount) {
    let k = typeof amount === 'number' ? amount : 50
    const n_samples = 44100
    const curve = new Float32Array(n_samples)
    const deg = Math.PI / 180
    let x = 0

    for (let i = 0; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }

  function play() {
    navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      }
    }).then(stream => {
      const lineInSource = context.createMediaStreamSource(stream)

      gain = context.createGain({
        gain: 0.5
      })

      distortion = context.createWaveShaper()
      distortion.curve = makeDistortionCurve(600)
      distortion.oversample = '4x'

      panner = new StereoPannerNode(context, pannerOptions)

      biquadFilterHighPass = new BiquadFilterNode(context, {
        type: 'highpass',
        Q: 1,
        frequency: 0,
        gain: 1,
      })
      bqFiltersEnum.highpass = biquadFilterHighPass

      biquadFilterLowPass = new BiquadFilterNode(context, {
        type: 'lowpass',
        Q: 1,
        frequency: 20000,
        gain: 1,
      })
      bqFiltersEnum.lowpass = biquadFilterLowPass

      splitter = context.createChannelSplitter();
      merger = context.createChannelMerger();

      lineInSource
        .connect(splitter)
        .connect(merger)
        .connect(panner)
        .connect(gain)
        .connect(biquadFilterLowPass)
        .connect(biquadFilterHighPass)
        .connect(distortion)
        .connect(context.destination);

      splitter.connect(merger, 0, 0)
      splitter.connect(merger, 0, 1)
    })
  }

  // ==========================================

  $('.btn-play').on('click', () => {
    context = new AudioContext()
    play()
  })

  $('.effect--control-gain').on('input', (e) => {
    const value = e.target.value
    gain.gain.setValueAtTime(value, context.currentTime)
    $('.effect--gain').find('.effect--value').text(value)
  })

  $('.effect--control-delay').on('input', (e) => {
    const value = e.target.value
    delay.delayTime.setValueAtTime(value, context.currentTime)
    $('.effect--delay').find('.effect--value').text(value)
  })

  $('.effect--control-panner').on('input', (e) => {
    const value = e.target.value
    panner.pan.setValueAtTime(value, context.currentTime)
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
      bqFiltersEnum[type].frequency.setValueAtTime(value, context.currentTime)
      valueDomFrequency.text(value)
    })

    inputQ.on('input', (e) => {
      const value = e.target.value
      bqFiltersEnum[type].Q.setValueAtTime(value, context.currentTime)
      valueDomQ.text(value)
    })

    inputGain.on('input', (e) => {
      const value = e.target.value
      bqFiltersEnum[type].gain.setValueAtTime(value, context.currentTime)
      valueDomGain.text(value)
    })
  }

  bgFilterChange('lowpass')
  bgFilterChange('highpass')
})
