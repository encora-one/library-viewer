/* eslint-env browser */
/*global _, slugify, laroute*/
/*eslint no-undef: "error"*/
/*eslint no-self-assign: ["error", {"props": false}]*/


/*eslint-disable */
// eslint-disable-next-line no-use-before-define
//window._ = require('./lodash.custom.min');
/*eslint-enable */
window._ = require('lodash');
//window._ = require('lodash-es');
//bin/lodash include=debounce,each,escape,filter,find,get,includes,isString,some,sortBy,map,pick
/*
import {
  debounce,
  each,
  escape,
  filter,
  find,
  get,
  includes,
  isString,
  some,
  sortBy,
  map,
  pick,
} from 'lodash-es';

window._ = {
  debounce:debounce,
  each:each,
  escape:escape,
  filter:filter,
  find:find,
  get:get,
  includes:includes,
  isString:isString,
  some:some,
  sortBy:sortBy,
  map:map,
  pick:pick,
};
*/


window.slugify = (text) => {
  // Turn a text into a url friendly slug

  const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text.toString()
    .replace(p, c =>
      b.charAt(a.indexOf(c)))         // Replace special chars
      .replace(/[^\w-]+/g, '')        // Remove all non-word chars
      .replace(/--+/g, '-')           // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '')             // Trim - from end of text
}


//const Vue = require('vue');
import Vue from 'vue';
const Vuex = require('vuex');
Vue.use(Vuex);

Vue.mixin({
  methods: {
    slugify: (text) => slugify,
    sortedByTitle: (objects) => {
      return _.sortBy(objects, 'title');
    },
  },
});

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    collection: [],
    wants: [],
    performances: [],
    query: '',
    page: 1,
    perPage: 10,
    showImages: false,
  },
  getters: {
    numPages: function(state, getters) {
      var ret = Math.ceil(getters.queriedPerformances.length / state.perPage);

      if (ret && state.page > ret) {
        // is this to correct way to commit within a getter?
        store.commit('setPage', ret);
      }

      return ret || 1;
    },
    queriedPerformances: function(state) {
      if (state.query === '') {
        return state.performances;
      }

      var re = RegExp(state.query, 'i');

      return _.filter(state.performances, function(performance) {
        var values = _.pick(performance, [
          'productionTitle',
          'tourTitle',
          'tourShortTitle',
          'cast',
          'date',
          'notes',
          'slug',
        ]);

        return _.some(values, function(value) {
          //return _.isString(value) && re.test(value);
          if(_.isString(value) && re.test(value)) {
            if (values['productionTitle'] == '13')
              console.log(value);
            return 1;
          }
        });
      }); // matchesQuery
    }, // queriedPerformances
  }, // getters
  mutations: {
    updateQuery: function(state, text) {
      state.query = text;
    },
    updateShowImages(state, value) {
      state.showImages = value;
    },
    incrementPage: function(state) {
      state.page++;
    },
    decrementPage: function(state) {
      state.page = --state.page || 1;
    },
    setPage: function(state, value) {
      state.page = value;
    },
    setPerPage: function(state, value) {
      state.perPage = value;

      // If the current page we are on no longer exists because
      // we change the perPage too high
      if ((state.page * state.perPage) > state.performances.length) {
        //state.page = this.getters.numPages;
        state.page = Math.ceil(state.performances.length / state.perPage) || 1;
      }
    },
    setPerformances: function(state, values) {
      state.performances = values;
    },
  }, // mutations
}); // Store
window.store = store;


import Library from './Library.vue';


function preProcessLibrary(productions, tours, performances) {
	// Create a Library data structure with a
	// production/tour/performance heirarchy

	// We would sort the productions and tours lexicographically here
	// but our data structure uses their id as index.
	// So we let Vue do the sorting as the `sortedByTitle` method.
	Vue.set(libraryVM, 'library', {});

  // Map the Productions to be accessible by id
  productions.forEach((production) => {
		production.tours = {};
		Vue.set(libraryVM.library, production.id, production);
  });

	// Map the Tours to be accessible by id within their respective Production
  const toursById = {};
  tours.forEach((tour) => {
		tour.performances = [];
		toursById[tour.id] = tour;
		const production = libraryVM.library[tour.production_id];
		tour.productionTitle = production.title;
		Vue.set(libraryVM.library[tour.production_id].tours, tour.id, tour);
	});

	// Insert the Performances according to their Tour
	_.each(_.sortBy(performances, 'date'), function(performance) {
		// The Tour this Performance belongs to
		const tour = toursById[performance.tour_id];
		const production = libraryVM.library[tour.production_id];

		// The Production this Performance belongs to
		const production_id = tour.production_id;

		// Keep a record of the Production on the Performance
		performance.production_id = production_id;
		performance.productionTitle = production.title;
		performance.tourTitle = tour.title;
		performance.tourShortTitle = tour.short_title;
		performance.tourSlug = tour.slug;
		// This is used in the `filteredProductions` computed property

		// Add the Performance to the Tour data structure
		toursById[performance.tour_id]['performances'].push(performance);
	});
}  // function preProcessLibrary


function semiProcessedLibrary(vue, productions) {
  Vue.set(this, 'library', {});
  const performances = [];

  Object.values(productions).forEach((production) => {
    Vue.set(this.library, production.id, production);

    Object.entries(production.tours??{}).forEach(([i,tour]) => {
      Object.entries(tour.performances??{}).forEach(([i,performance]) => {
        performances.push(performance);
      });
    });
  });

  vue.$store.commit('setPerformances', performances);
}  // semiProcessedLibrary


/*
new Vue({
  render: h => h(Library),
}).$mount('#app');
*/
const libraryVM = new Vue({
  //el: '#app',
  store: store,
  data: {
    library: undefined,
    performances: [],
  },
  render: h => h(Library),
  components: {
    //Library,
  },
  mounted: function() {
    // Show more items per page
    if (window.innerWidth > 1023) {
      this.$store.commit('setPerPage', 50);
    } else if (window.innerWidth > 767) {
      this.$store.commit('setPerPage', 25);
    }

    console.log('mounted');
    //this.getVueItems();

    // Jump to ID
    window.location.hash = window.location.hash;
  },
  computed: {
    showImages: {
      get() {
        return this.$store.state.showImages;
      }, // get
      set(value) {
        this.$store.commit('updateShowImages', value);
      }, // set
    }, // showImages
  }, // computed
  methods: {
    getVueItems: function(json) {
      var self = this;

      json = json ?? {};

      const productions = json.productions ?? {};
      const tours = json.tours ?? [];
      const performances = json.performances ?? [];

      if (productions.length) {
        self.$store.commit('setPerformances', performances);
        return preProcessLibrary(productions, tours, performances);
      }

      return semiProcessedLibrary(self, productions);

    }, // getVueItems
    sortedByTitle: function(objects) {
      return _.sortBy(objects, 'title');
    }, // sortedByTitle
    slugify: function(text) {
      return slugify(text);
    }, // slugify
    //productionHref: function(productionId) {
    productionHref: function() {
      return '#';
    }, // productionHref
  }, // methods
}).$mount('#app');
; // new Vue(
