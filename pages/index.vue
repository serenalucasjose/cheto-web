<template>
  <div class="main-page" @mousemove="showNews">
    <!-- Init controls -->
    <transition v-if="!isMobile" name="fade">
      <div v-show="!inProgress" class="intro-overlay bg-black absolute z-10 w-screen h-screen grid place-items-center place-content-center">
        <!-- Play -->
        <button
          v-show="setupDone"
          id="play-btn"
          class="text-white text-3xl"
        >
          <i class="fas fa-play" />
        </button>
        <!-- Loading -->
        <div v-if="!setupDone" class="fa-3x text-white">
          <i class="fas fa-circle-notch fa-spin" />
        </div>
      </div>
    </transition>
    <!-- Hero -->
    <div class="hero-wrapper grid gap-0 h-screen sm:grid-cols-6">
      <div class="info px-5 py-5 sm:col-span-2 flex flex-col justify-end">
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
        class="image-bg sm:col-span-4"
      >
        <!-- Logo -->
        <img
          class="cheto-logo right"
          src="/images/logos/cheto-logo-blanco.png"
          alt="Cheto"
        >
        <!-- Audio -->
        <div v-if="!isMobile" class="audio-controls absolute left-0 bottom-0 w-full h-50 z-10 text-3xl pr-5 text-right">
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
    <!-- News Modal -->
    <sweet-modal
      ref="newsModal"
      title="Ultimos lanzamientos"
      :enable-mobile-fullscreen="true"
    >
      <div class="news-outer-wrapper">
        <div class="news-inner-wrapper">
          <a
            href="https://open.spotify.com/album/0ydWdz4mYa0o0KFV1IQHvC?si=G1YdMSVUTu6CtqooOFYzAw"
            target="_blank"
            class="surveillance"
            :style="{ backgroundImage: `url(${surveillanceBg})`}"
          >
            <h2>Surveillance</h2>
            <img src="~/assets/logos/spotify-logo.png" alt="Spotify">
          </a>
          <a
            href="https://open.spotify.com/album/62cbMrvQjQRw7ACiVDMqoi?si=eFcmx_0TQ_mS_apSVu-6Sw"
            target="_blank"
            class="withstand"
            :style="{ backgroundImage: `url(${withstandBg})`}"
          >
            <h2>Withstand</h2>
            <img src="~/assets/logos/spotify-logo.png" alt="Spotify">
          </a>
        </div>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import { SweetModal } from 'sweet-modal-vue'
import surveillanceBg from 'assets/photos/surveillance.jpg'
import withstandBg from 'assets/photos/withstand.jpg'

export default {
  components: {
    SweetModal
  },
  data () {
    return {
      inProgress: false,
      p5Object: null,
      audio: null,
      isMobile: null,
      setupDone: false,
      userEnteredAt: Date.now(),
      newsThreshold: 10 * 1000,
      userSawNews: false,
      surveillanceBg,
      withstandBg
    }
  },
  computed: {
    playing () {
      return (this.audio) ? this.audio.isPlaying() : false
    }
  },
  mounted () {
    // Check device
    this.isMobile = this.$devices('isMobile')
    // Show presentation and news
    this.homePresentation()
    if (!this.isMobile) {
      this.initVanillaTilt()
    }
    this.showNews()
  },
  methods: {
    homePresentation () {
      // Get random BG
      const option = [0, 0, 1, 1]
      const imgUri = `/images/main-bg-${option[this.$randomBetween(0, 4)]}.jpg`
      /* eslint-disable */
      if (!this.isMobile) { // Animation only for desktop
        const s = (p) => {
          let demo7Shader, img, fft, audio, playBtn, toggleBtn, imageModes, i, currMode
    
          p.preload = () => {
            // Resources
            audio = p.loadSound('/audio/bg-music.mp3')
            demo7Shader = p.loadShader('/shaders/base.vert', '/shaders/d3.frag')
            img = p.loadImage(imgUri)
          }
    
          p.setup = () => {
            // Image Mode
            imageModes = [
              p.CORNER,
              p.CORNERS,
              p.CENTER
            ]
            i = 0
            currMode = imageModes[i]
            // Handlers
            playBtn = document.querySelector('#play-btn')
            playBtn.addEventListener('click', () => {
              if (this.inProgress) return false
              document.body.classList.add('start-anim')
              audio.loop()
              this.inProgress = true
              this.audio = audio // Save reference to audio obj for later
            })
  
            p.imageMode(currMode)
            p.image(img, 0, 0)
            p.textureMode("normal")
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
            this.setupDone = true
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
    },
    showNews() {
      if (this.userSawNews || this.playing) return false

      if (Date.now() > this.userEnteredAt + this.newsThreshold) {
        this.$refs.newsModal.open()
        this.userSawNews = true
      }

      return true
    },
    initVanillaTilt() {
      const cards = ['.surveillance', '.withstand']
      
      cards.forEach(classNamme => {
        VanillaTilt.init(document.querySelector(classNamme), {
          max: 25,
          speed: 400
        })
      })
    }
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
  // Responsive
  @media (max-width: 640px) {
    background: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .cheto-logo {
      &.left {
        display: none;
      }
    }
  }
  @media screen and (orientation: landscape) and (min-device-width: 319px) and (max-device-width: 960px) {
    .cheto-logo {
      &.left {
        display: none;
      }
    }
  }
}
.image-bg {
  background-image: url('/images/main-bg-1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  // Responsive
  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-row-start: 1;
    .cheto-logo {
      &.right {
        position: relative;
        width: 100%;
        height: auto;
        top: 0;
        left: 0;
        max-width: 250px;
        margin: 0 auto;
      }
    }
  }
  @media screen and (orientation: landscape) and (min-device-width: 319px) and (max-device-width: 960px) {
    .cheto-logo {
      &.right {
        position: relative;
        width: 100%;
        height: auto;
        top: calc(100% - 131px);
        left: 0;
        max-width: 250px;
        margin: 0 auto;
      }
    }
  }
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

// News
.news-outer-wrapper {
  padding: 1rem;
  .news-inner-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .surveillance,
    .withstand {
      border-radius: 5px;
      padding: .5rem;
      transform-style: preserve-3d;
      transform: perspective(1000px);
      height: 250px;
      width: 100%;
      max-width: 250px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
      background-size: cover;
      background-repeat: no-repeat;
      h2 {
        text-transform: uppercase;
        text-align: center;
        font-size: 1.5rem;
        color: white;
        font-weight: bold;
        text-shadow: 0px 1px 4px #23430C;
      }
      h2,
      img {
        transform: translateZ(20px);
      }
      img {
        width: 100%;
        max-width: 120px;
        margin: 0 auto;
      }
    }
  }
  // Responsive
  @media (max-width: 640px) {
    padding: 0;
    .news-inner-wrapper {
      padding: 0;
      flex-direction: column;
      width: 100%;
      .surveillance {
        margin-bottom: 2rem;
      }
    }
  }
}
// Common
.sweet-content {
  // Responsive
  @media (max-width: 640px) {
    height: calc(100% - 64px);
  }   
}
</style>
