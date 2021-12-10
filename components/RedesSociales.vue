<template>
  <div class="redes-sociales bg-white">
    <h2 class="uppercase font-light mb-5">
      Encontranos:
    </h2>
    <ul class="flex justify-between w-40 text-xl">
      <li v-for="s in social" :key="s.title">
        <a :href="s.url" target="_blank" :title="s.title"><i :class="s.icon" /></a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      social: []
    }
  },
  async fetch () {
    this.social = await this.$content('social').only(['url', 'title', 'icon']).fetch()
  }
}
</script>

<style lang="scss" scoped>

</style>
