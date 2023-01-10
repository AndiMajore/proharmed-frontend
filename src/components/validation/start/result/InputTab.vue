<template>
  <div>
    <div style="display:flex;">
      <v-subheader style="justify-self: center; margin-left: auto; margin-right: auto">
        <span v-if="mode === 'filter'">Filter Input</span>
        <span v-if="mode === 'remap'">Remap Input</span>
        <span v-if="mode === 'reduce'">Reduce Input</span>
        <span v-if="mode === 'ortho'">Map Orthologs Input</span>
      </v-subheader>
    </div>
    <v-container v-if="input" style="margin-top:16px; margin-bottom: 32px">
      <v-row justify="center">
        <v-col cols="12" lg="4" md="6" class="flex_content_center">
          <div>
            <b>Configuration</b>
            <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="param in Object.keys(input).filter(k=>!k.includes('target') && !k.includes('reference'))"
                    :key="'conf-'+param">
                  <td style="margin: 4px">{{ param }}</td>
                  <td style="margin:4px">{{ input[param] }}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
      </v-row>
      <div style="display: flex; justify-content: center; margin: 32px;">
        <v-btn @click="downloadInput()">
          <v-icon left>fas fa-download</v-icon>
          Download Input
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "InputTab",
  props: {
    input: Object,
    mode: String,
    taskID: String,
  },

  methods: {
    downloadInput: function () {
      this.download('mesidha_' + this.taskID + "_input.json", JSON.stringify(this.input))
    },
    download: function (name, content) {
      let dl = document.createElement('a')
      dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
      dl.setAttribute('download', name)
      dl.style.direction = 'none'
      document.body.appendChild(dl)
      dl.click()
      document.body.removeChild(dl)
    },
  }
}
</script>

<style scoped lang="sass">

.v-subheader
  font-size: 1.5rem
  margin-top: 8px

.sh_mobile
  font-size: 1.2rem

.sh
  font-size: 1.5rem
  margin-left: 64px
  margin-right: 64px

.margin_normal
  padding-left: 64px
  padding-right: 64px

.margin_mobile
  padding-left: 8px
  padding-right: 8px


.flex_self_center
  display: flex
  justify-self: center
  margin-left: auto !important
  margin-right: auto !important

.flex_self_start
  justify-self: flex-start
  margin-right: auto !important
  margin-left: 0 !important

.flex_self_start_alt
  justify-self: flex-start
  margin-right: auto !important
  margin-left: auto !important

.flex_self_end
  justify-self: flex-end
  margin-right: 0 !important
  margin-left: auto !important

.flex_self_end_alt
  justify-self: flex-end
  margin-right: auto !important
  margin-left: auto !important

.flex_content_center
  justify-content: center
  display: flex

</style>
