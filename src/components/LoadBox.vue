<template>
  <div>
    <label>
      Load library.json
      <input type="file" @change="loadFile" accept=".json">
    </label>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="error">
      Error loading library from {{ fileName }}. Try again.
    </div>
  </div>
</template>


<script>
const _ = require('lodash');


export default {
  name: 'LoadBox',
  data: () => {
    return {
      loading: false,
      error: false,
      fileName: '',
    };
  },
  methods: {
    loadFile: function(ev) {
      const self = this;

      const file = ev.target.files[0];
      self.fileName = file.name;
      const reader = new FileReader();

      reader.addEventListener('load', function() {
        self.loading = true;
        self.error = false;

        let json;

        try {
          json = JSON.parse(reader.result);
        } catch (e) {
          self.error = true;
          self.loading = false;
          return;
        }

        self.$root.getVueItems(json);

        self.loading = false;
        self.error = false;
      });
      reader.readAsText(file);
    },
  },
}
</script>
