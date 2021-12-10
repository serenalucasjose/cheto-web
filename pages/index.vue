<template>
  <div class="main-page">
    <!-- Init controls -->
    <transition name="fade">
      <div v-show="!inProgress" class="intro-overlay bg-black absolute z-10 w-screen h-screen grid place-items-center place-content-center">
        <button
          id="play-btn"
          class="text-white text-3xl"
        >
          <i class="fas fa-play" />
        </button>
      </div>
    </transition>
    <!-- Hero -->
    <div class="hero-wrapper grid grid-cols-6 gap-0 h-screen">
      <div class="info col-span-2 px-5 py-5 flex flex-col justify-end">
        <!-- Logo -->
        <img
          class="cheto-logo left"
          src="/images/logos/cheto-logo-negro.png"
          alt="Cheto"
        >
        <!-- Listado fechas -->
        <listado-fechas class="mb-10" />
        <!-- Redes sociales -->
        <redes-sociales />
      </div>
      <div
        id="webgl-image-distorsion-wrapper"
        class="image-bg col-span-4"
      >
        <!-- Logo -->
        <img
          class="cheto-logo right"
          src="/images/logos/cheto-logo-blanco.png"
          alt="Cheto"
        >
        <!-- Audio -->
        <div class="audio-controls absolute left-0 bottom-0 w-full h-50 z-10 text-3xl pr-5 text-right">
          <button
            v-show="inProgress"
            id="toggle-btn"
            class="text-white"
          >
            <i v-show="!playing" class="fas fa-volume-up" />
            <i v-show="playing" class="fas fa-volume-mute" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inProgress: false,
      p5Object: null,
      audio: null
    }
  },
  head () {
    return {
      script: [
        { hid: 'p5', src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.min.js', defer: false },
        { hid: 'p5dom', src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.dom.min.js', defer: false },
        { hid: 'p5sound', src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.sound.min.js', defer: false }
      ]
    }
  },
  computed: {
    playing () {
      return (this.audio) ? this.audio.isPlaying() : false
    }
  },
  mounted () {
    /* eslint-disable */
    const s = (p) => {
      let demo7Shader, img, fft, audio, playBtn, toggleBtn;

      p.preload = () => {
        audio = p.loadSound('/audio/bg-music.mp3')
        demo7Shader = p.loadShader('/shaders/base.vert', '/shaders/d3.frag')
        img = p.loadImage('/images/main-bg.jpg')
      }

      p.setup = () => {
        playBtn = document.querySelector('#play-btn')
        playBtn.addEventListener('click', () => {
          document.body.classList.add('start-anim')
          audio.loop()
          this.inProgress = true
          this.audio = audio // Save reference to audio obj for later
        })

        p.pixelDensity(1)
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

        toggleBtn = document.querySelector('#toggle-btn')
        toggleBtn.addEventListener('click', () => {
          toggleBtn.classList.toggle('toggle--on')
          p.toggleAudio()
        })

        fft = new p5.FFT()
        p.shader(demo7Shader)

        demo7Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
        demo7Shader.setUniform('u_texture', img)
        demo7Shader.setUniform('u_tResolution', [img.width, img.height])
      }

      p.draw = () => {
        fft.analyze()

        const bass = fft.getEnergy("bass")
        const treble = fft.getEnergy("treble")
        const mid = fft.getEnergy("mid")

        const mapBass = p.map(bass, 0, 255, 0.0, 2.0)
        const mapTremble = p.map(treble, 0, 255, 10.0, 10.0)
        const mapMid = p.map(mid, 0, 255, 0.0, 0.05)

        demo7Shader.setUniform('u_time', p.frameCount / 20.0)
        demo7Shader.setUniform('u_bass', mapBass)
        demo7Shader.setUniform('u_mid', mapMid)

        p.rect(0,0, p.width, p.height)
      }

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
        demo7Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
      }

      p.toggleAudio = () => {
        if (audio.isPlaying()) {
          audio.pause()
        } else {
          audio.loop()
        }
      }
    }
    this.p5Object = new p5(s, 'webgl-image-distorsion-wrapper')
  }
}
</script>

<style lang="scss" scoped>
.info,
.image-bg {
  overflow: hidden;
  position: relative;
}
.info {
  background-image: url('/images/noise.png');
  background-color: white;
}
.image-bg {
  background-image: url('/images/main-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.cheto-logo {
  height: 250px;
  width: auto;
  max-width: none;
  position: absolute;
  top: calc(50% - 150px);
  // Modifiers
  &.left {
    right: -236.875px;
  }
  &.right {
    left: -236.875px;
  }
}
// Transitions
.fade-enter-active, .fade-leave-active {
  transition: opacity 2.5s cubic-bezier(0.12, 0, 0.39, 0);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
