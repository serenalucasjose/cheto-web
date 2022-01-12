<template>
  <div
    v-if="events.length > 0"
    class="list-wrapper bg-white"
  >
    <h2 class="uppercase font-light mb-5">
      Proximas fechas:
    </h2>
    <div v-for="e in events" :key="e.title" class="bg-white">
      <p class="font-semibold">
        {{ e.title }}
      </p>
      <p class="font-light">
        {{ e.date }}
      </p>
      <p class="font-light">
        {{ e.address }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      events: []
    }
  },
  async fetch () {
    this.events = await this.$content('events').only(['date', 'title', 'address']).fetch()
  }
}
</script>

<style lang="scss" scoped>
</style>
