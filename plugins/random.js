export default ({ app }, inject) => {
  inject('randomBetween', (min, max) => Math.floor(Math.random() * (max - min) + min))
}
