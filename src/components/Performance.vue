<template>
  <div :v-performance_id="id" :id="slug" class="performance">
    <h5>
      <span class="date" v-html="performanceTitleHighlighted"></span>
    </h5>

    <div>
      <span class="cast" v-html="castHighlighted"></span>
    </div>
  </div>
</template>


<script>
const _ = require('lodash');
const dayjs = require('dayjs');


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
    matinee: {
      type: Boolean,
      required: true,
    },
    dayNotKnown: {
      type: Boolean,
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
    slug: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
  },  // props

  computed: {
    query: function() {
      return this.$store.state.query;
    },  // query
    performanceTitleHighlighted: function() {
      var productionTitle = _.escape(this.productionTitle);
      var tourTitle = _.escape(this.tourTitle);
      var location = _.escape(this.location);
      if (location)
        tourTitle += ` (${location})`;
      var tourShortTitle = _.escape(this.tourShortTitle);
      tourShortTitle = tourTitle;
      var tourTitleFormatted = tourShortTitle;
      var performanceDate = _.escape(this.date);
      const djs = dayjs(this.date);
      let formattedDate;
      if (!this.dayNotKnown && djs.isValid())
        formattedDate = djs.format('MMMM D, YYYY');
      else
        formattedDate = performanceDate;

      if (this.matinee)
        formattedDate += ' matinée';

      if (this.query) {
        const query = '(' + this.query + ')';
        const re = new RegExp(query, 'gi');

        productionTitle = productionTitle.replace(re,
            '<span class="highlight">$1</span>');
        tourTitleFormatted = tourShortTitle.replace(re,
            '<span class="highlight">$1</span>');
        formattedDate = formattedDate.replace(re,
            '<span class="highlight">$1</span>');
      }

      tourTitleFormatted = `<span title="${tourTitle}">${tourTitleFormatted}</span>`;

      // TODO 2017-09-14
      // Handle undefined variables
      //productionTitle = `<a>${productionTitle}</a>`;

      //tourTitleFormatted = `<a>${tourTitleFormatted}</a>`;

      formattedDate = `<a href="#${this.slug}">${formattedDate}</a>`;

      return `${productionTitle} - ${tourTitleFormatted} - ${formattedDate}`;
    },  // performanceTitleHighlighted
    castHighlighted: function() {
      var cast = _.escape(this.cast);

      if (!this.query) {
        return cast;
      }

      const query = '(' + this.query + ')';
      const re = new RegExp(query, 'gi');

      return cast.replace(re, '<span class="highlight">$1</span>');
    },  // castHighlighted
  },  // computed
}  // export default
</script>


<style>
.highlight {
  background-color: yellow;
}
</style>

<style scoped>
a {
  cursor: pointer;
}

.date >>> .highlight {
  background-color: pink;
}

.cast >>> .highlight {
  background-color: skyblue
}

.notes >>> .highlight {
  background-color: orange;
}

.performance:nth-child(odd) {
  padding-left: 2px;
}

.performance:nth-child(even) {
  /* background-color: black; */
  border-left: 1px solid;
  padding-left: 1px;
}

h5 {
  margin-bottom: 0;
  margin-top: .5em;
}
</style>
