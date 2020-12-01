<template>
  <div v-if="production.title" class="production">
    <h3 :id="production.slug" class="production-name">
      <a :href="'#'+production.slug">{{ production.title }}</a>
    </h3>

    <tour v-for="tour in sortedByTitle(filteredTours)"
          :tour="tour"
          :filtered-performances="tour.filteredPerformances"
          :key="tour.id">
    </tour>
  </div>
</template>


<script>
import Tour from './Tour.vue';

export default {
  name: 'Production',
  props: {
    production: Object,
    filteredTours: Object,
  },
  components: {
    Tour,
  },
};
</script>


<style scoped>
.production {
  border-top: 1px solid;
  padding-bottom: 1em;
}

.production-name {
  padding-top: 0;
}
</style>
