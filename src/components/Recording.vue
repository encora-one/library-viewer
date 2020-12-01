<template>
<div :v-performance_id="id" class="performance row">

  <div :class="['col-12', 'performance-text']">
    <span class="date" v-html="performanceTitleHighlighted"></span>

    <div class="performance row">
      <div :class="['col-12', 'performance-text']">
      <i>CAST:</i> <span class="cast" v-html="castHighlighted"></span>
      </div>
    </div>

  </div>  <!-- /.performance-text -->
</div>  <!-- /.performance.row -->
</template>


<script>
export default {
  props: {
    productionTitle: {
      type: String,
      required: true,
    },
    productionId: {
      type: Number,
      requires: true,
    },
    tourTitle: {
      type: String,
      required: true,
    },
    tourShortTitle: {
      type: String,
      required: true,
    },
    tourId: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    cast: {
      type: String,
      required: true,
    },
  },  // props
  data() {
    return {
      isAddingToCollection: false,
      hasAddToCollectionError: false,
      isAddingToWants: false,
      hasAddWantError: false,
    }
  },  // data
  computed: {
    query: function() {
      return this.$store.state.query;
    },  // query
    isInCollection: function() {
      return _.includes(this.$store.state.collection, this.id);
    },  // isInCollection
    isWanted: function() {
      return _.includes(this.$store.state.wants, this.id);
    },  // isWanted
    showImages: function() {
      return this.$store.state.showImages;
    },  // showImages
    performanceTitle: function() {
      return this.productionTitle + ' - ' + this.tourShortTitle + ' - ' + this.date;
    },  // performanceTitle
    performanceTitleHighlighted: function() {
      var productionTitle = _.escape(this.productionTitle);
      var tourTitle = _.escape(this.tourTitle);
      var tourShortTitle = _.escape(this.tourShortTitle);
      var tourTitleFormatted = tourShortTitle;
      var performanceDate = _.escape(this.date);

      if (this.query) {
        var query = '(' + this.query + ')';
        var re = RegExp(query, 'gi');

        productionTitle = productionTitle.replace(re,
            '<span class="highlight">$1</span>');
        tourTitleFormatted = tourShortTitle.replace(re,
            '<span class="highlight">$1</span>');
        performanceDate = performanceDate.replace(re,
            '<span class="highlight">$1</span>');
      }

      tourTitleFormatted = '<span title="' + tourTitle + '">' + tourTitleFormatted + '</span>';

      // TODO 2017-09-14
      // Handle undefined variables
      productionTitle = '<a href="#">' + productionTitle + '</a>';

      tourTitleFormatted = '<a href="#">' + tourTitleFormatted + '</a>';

      performanceDate = '<a href="#">' + performanceDate + '</a>';

      return productionTitle + ' - ' + tourTitleFormatted + ' - ' + performanceDate;
    },  // performanceTitleHighlighted
    castHighlighted: function() {
      var cast = _.escape(this.cast);

      if (!this.query) {
        return cast;
      }

      var query = '(' + this.query + ')';
      var re = RegExp(query, 'gi');

      return cast.replace(re, '<span class="highlight">$1</span>');
    },  // castHighlighted
    collectionStoreURL: function() {
      return '#';
    },  // collectionStoreURL
    wantStoreURL: function() {
      return '#';
    },  // wantStoreURL
  },  // computed
  methods: {
  },  // methods
}  // export default
</script>


<style scoped>
a {
  cursor: pointer;
}
.performance.row:nth-child(even) {
  color: black;
}
</style>
