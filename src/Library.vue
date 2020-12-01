<template>
  <div id="app">
    <load-box></load-box>
    <search-bar v-if="this.$root.library && Object.keys(this.$root.library).length"></search-bar>

    <div class="productions">
      <production v-for="production in filteredProductions"
                  :production="production"
                  :filteredTours="production.filteredTours"
                  :key="production.id"
                  ></production>
    </div>

    <library-pager v-if="this.$root.library && Object.keys(this.$root.library).length"></library-pager>
  </div>
</template>

<script>
import LoadBox from './components/LoadBox.vue';
import SearchBar from './components/SearchBar.vue';
import Production from './components/Production.vue';
import LibraryPager from './components/LibraryPager.vue';


export default {
  name: 'Library',
  components: {
    LoadBox,
    SearchBar,
    Production,
    LibraryPager,
  },
  computed: {
    filteredProductions: function() {
      var self = this;

      // This is what we will be returning
      var filteredProductions = {};

      // The index of the first performance we want to render via pagination
      var minSlice = (self.$store.state.page - 1) * self.$store.state.perPage;
      // The index of the last performance we want to render via pagination
      var maxSlice = self.$store.state.page * self.$store.state.perPage;

      // The performances we want to render
      var pagedPerformances = _.sortBy(self.$store.getters.queriedPerformances, ['productionTitle', 'tourTitle', 'date'])
        .slice(minSlice, maxSlice);

      _.each(pagedPerformances, function(performance) {
        // See if this Production is already filtered
        var production = _.get(filteredProductions, performance.production_id);

        // This Production is not filtered yet
        if (production === undefined) {
          // Get the Production
          production = self.$root.library[performance.production_id];
          if (!production) return;

          production.filteredTours = {};

          // And add it
          filteredProductions[production.id] = production;
        }

        // See if this Tour is already filtered
        var tour = _.get(production.filteredTours, performance.tour_id);

        // This Tour is not filtered yet
        if (tour === undefined) {
          // Get the Tour
          tour = production.tours[performance.tour_id];

          tour.filteredPerformances = [];

          // And add it
          production.filteredTours[tour.id] = tour;
        }

        // Add this Performance as filtered and to be rendered
        tour.filteredPerformances.push(performance);
      }); // _.each(self.performances

      return _.sortBy(filteredProductions, 'title');
    },  // filteredProductions
  },
};
</script>
