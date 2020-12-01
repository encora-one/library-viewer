<template>
  <div class="search-bar">
    <input id="query-box"
           class="form-control"
           v-model="query"
           type="text"
           placeholder="Search for..."
           autofocus>
    <span>
      Filtering {{ this.$store.getters.queriedPerformances.length }} of {{ this.$store.state.performances.length }} Performances
    </span>
  </div>
</template>


<script>
export default {
  computed: {
    query: {
      get() {
        return this.$store.state.query;
      },
      set: _.debounce(function(text) {
        return this.$store.commit('updateQuery', text);
      }, 500),
    },
  },
}
</script>
