<template>
  <div class="tour"
       :id="tour.slug"
       >
       <h4
         v-if="tour.filteredPerformances.length"
         class="tour-name"
         >
         {{ tour.productionTitle }} - <a :href="'#'+tour.slug">{{ tour.title }}</a>
       </h4>

    <div class="performances">
      <performance
        v-for="performance in filteredPerformances"
        :key="performance.id"
        :id="performance.id"
        :production-title="tour.productionTitle"
        :production-id="tour.production_id"
        :tour-title="tour.title"
        :tour-short-title="tour.short_title"
        :tour-id="tour.id"
        :date="performance.date"
        :matinee="Boolean(performance.matinee)"
        :day-not-known="Boolean(performance.day_not_known)"
        :cast="performance.cast"
        :slug="performance.slug"
        :location="performance.location"
        ></performance>
    </div>
  </div>
</template>

<script>
import Performance from "./Performance.vue";

export default {
  components: {
    Performance,
  },
  props: {
    tour: Object,
    filteredPerformances: Array,
  },
};
</script>
