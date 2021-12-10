export default ({ app }, inject) => {
  inject('devices', isMobile => window.matchMedia('only screen and (max-width: 760px)').matches)
}
