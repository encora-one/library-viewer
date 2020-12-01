<template>
  <div class="library-pager">
    <a href="javascript:;" @click="decrementPage">
      Prev
    </a>
    <a v-for="page in numPages"
       :key="page"
       href="javascript:;"
       :class="{ selected: isCurPage(page) }"
       @click="setPage(page)">
      {{ page }}
    </a>
    <a href="javascript:;" @click="incrementPage">
      Next
    </a>
  </div>
</template>


<script>
export default {
  computed: {
    curPage: function() {
      return this.$store.state.page;
    },
    perPage: {
      get: function() {
        return this.$store.state.perPage;
      },
      set: _.debounce(
        function(value) {
          if (value > 9) {
            this.$store.commit('setPerPage', value);
          }
        },
        300  // milliseconds to wait
      ),  // _.debounce
    },
    numPages: function() {
      return this.$store.getters.numPages;
    },
  },  // computed
  methods: {
    decrementPage: function() {
      if (this.$store.state.page > 0) {
        this.$store.commit('decrementPage');
      }
    },
    incrementPage: function() {
      if (this.$store.state.page < this.numPages) {
        this.$store.commit('incrementPage');
      }
    },
    setPage: function(value) {
      this.$store.commit('setPage', value);
    },
    isCurPage: function(page) {
      return page === this.curPage;
    },
  }, // methods
}
</script>


<style scoped>
a {
  cursor: pointer;
}
a.selected {
  font-weight: bold;
}
</style>
