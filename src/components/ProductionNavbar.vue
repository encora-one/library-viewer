/*global _, slugify*/
/*eslint no-undef: "error"*/

<template>
<div v-if="library.length"
     class="col-6 col-sm-3 col-md-2 sidebar-offcanvas" role="complementary">
  <button type="button"
          class="btn btn-primary btn-sm visible-xs"
          id="toggle-production-button"
          data-toggle="offcanvas"
          @click.stop="toggleOffCanvas">
    Toggle Production list
  </button>
  <nav id="production-navbar">
    <ul class="nav nav-pills nav-stacked">
      <li v-for="production in library"
          :key="production.id"
        >
        <a role="button"
           :href="'#' + slugify('collapse-' + production.title)"
           :aria-controls="slugify('collapse-' + production.title)"
           data-parent="#production-navbar"
           class="nav-production"
           data-toggle="collapse"
           aria-expanded="false">
          {{ production.title }}
          <div class="float-right"><span class="caret arrow"></span></div>
        </a>
        <ul :id="slugify('collapse-' + production.title)"
            class="nav nav-pills nav-stacked collapse">
          <li v-for="tour in production.tours"
              :key="tour.id"
            >
            <a :href="'#' + slugify(production.title + '-' + tour.title)"
               class="nav-tour"
               data-toggle="offcanvas"
               @click.stop="toggleOffCanvas"
               :title="tour.title">
              {{ tour.short_title }}
            </a>
          </li>
        </ul>
      </li>
      <li>
          <a href="#top"
             class="back-to-top"
             data-toggle="offcanvas"
             @click.stop="toggleOffCanvas">
            Back to top
          </a>
      </li>
    </ul>
  </nav>
</div>
</template>


<script>
export default {
  props: {
    library: {
      type: Array,
      required: true,
    },
  },  // props
  mounted: function() {
    //var navbar = $('#production-navbar');
    //console.log(navbar);

    //var navbarTop = navbar.offset().top;
    //var navbarHeight = navbar.height();
    //var windowHeight = $(document).height();
    //console.log(navbar.offset(), navbarTop, navbarHeight, windowHeight, windowHeight-navbarTop-navbarHeight);

    // TODO 2017-05-05
    // These initial offsets are incorrect.
    // TODO 2017-05-05
    // Implement a app.watch for app.query to update the offset
    //navbar.affix({offset: {top: navbarTop, bottom: windowHeight-navbarTop-navbarHeight}});

    // TODO 2017-05-05
    // This does not work at all
    //$('#production-list').scrollspy({target: '#production-navbar'});
  },  // mounted
  methods: {
    toggleOffCanvas: function() {
      //$('.row-offcanvas').toggleClass('active');
      document.querySelector('.row-offcanvas').classList.toggle('active');
    },  // toggleOffCanvas
    slugify: function(text) {
      return slugify(text);
    },
  },  // methods
}
</script>


<style scoped>
#toggle-production-button {
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: 1;
}
.nav-production {
  padding-top: 0px;
  padding-bottom: 0px;
}
.nav-tour {
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 2em;
}
</style>
