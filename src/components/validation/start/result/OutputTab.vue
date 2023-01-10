<template>
  <div>
    <div style="display:flex">
      <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Matrix preview
      </v-subheader>
      <v-tooltip top>
        <template v-slot:activator="{attrs, on}">
          <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                 style="justify-self: flex-end; margin-left: auto; margin-right: 0; top: 12px">
            <v-icon>fas fa-download</v-icon>
          </v-btn>
        </template>
        <div>Download all files as .zip</div>
      </v-tooltip>
    </div>
    <v-container>
      <v-row justify="center" style="padding-top:16px; padding-bottom: 16px" v-if="result">
        <v-col cols="12" style="display: flex; justify-content: center">
          <v-data-table :headers="getHeader()" :items="getItems()" style="overflow-y: auto; max-width: 100%"
                        hide-default-footer :items-per-page="5">
          </v-data-table>
        </v-col>
        <div style="display: flex; justify-content: center; margin: 32px;">
          <v-btn @click="downloadFile(resultFileURL)">
            <v-icon left>fas fa-download</v-icon>
            Download Output
          </v-btn>
        </div>
      </v-row>
    </v-container>
    <template v-if="plots">
      <v-divider></v-divider>
      <div style="display:flex">
        <v-subheader style="justify-self: center; margin-left: auto; margin-right: auto">Overview Figures
        </v-subheader>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12" lg="6" class="flex_content_center">
            <div style="width: 100%">
              <div class="flex_content_center">
                <v-img :src="getPlot('overview_log_bar')" contain
                       style="position: relative; max-width: 70%">
                  <v-btn icon small style="position: absolute; right: 0"
                         @click="downloadFile(getPlot('overview_log_bar'))">
                    <v-icon small>fas fa-download</v-icon>
                  </v-btn>
                </v-img>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="6" class="flex_content_center">
            <div style="width: 100%">
              <div class="flex_content_center">
                <v-img :src="getPlot('overview_log_box')" contain
                       style="position: relative; max-width: 70%">
                  <v-btn icon small style="position: absolute; right: 0"
                         @click="downloadFile(getPlot('overview_log_box'))">
                    <v-icon small>fas fa-download</v-icon>
                  </v-btn>
                </v-img>
              </div>
            </div>
          </v-col>
        </v-row>
        <div style="display: flex; justify-content: center; margin: 32px;">
          <v-btn @click="downloadFile(getFile('txt','overview_log.txt'))">
            <v-icon left>fas fa-download</v-icon>
            Download Log.txt
          </v-btn>
        </div>
      </v-container>
      <template v-if="mode==='filter'">
        <v-divider></v-divider>
        <div style="display:flex">
          <v-subheader style="justify-self: center; margin-left: auto; margin-right: auto">Filter Details
          </v-subheader>
        </div>
        <v-container v-if="mode==='filter'">
          <v-row class="flex_content_center">
            <v-col cols="12" lg="6" class="flex_content_center">
              <div style="width: 100%">
                <div class="flex_content_center">
                  <v-img :src="getPlot('detailed_log')" contain
                         style="position: relative; max-width: 70%">
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot('detailed_log'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                </div>
              </div>
            </v-col>
          </v-row>
          <div style="display: flex; justify-content: center; margin: 32px;">
            <v-btn @click="downloadFile(getFile('txt','detailed_log.txt'))">
              <v-icon left>fas fa-download</v-icon>
              Download Log.txt
            </v-btn>
          </div>
        </v-container>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "OutputTab",
  props: {
    mode: String,
    csvs: Array,
    txts: Array,
    plots: Array,
    input: Object,
    taskID: String,
    resultFileURL: String,
    zips: Array,
    result: Object,
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    }
  },

  created() {

  },

  methods: {

    downloadFile: function (file) {
      this.$emit('downloadEvent', file)
    }
    ,

    getHeader: function () {
      return Object.keys(this.result).map(k => {
            return {text: k, value: k}
          }
      )
    },

    getItems: function () {
      return Object.keys(Object.values(this.result)).map(idx => {
        let row = {}
        Object.keys(this.result).forEach(k => row[k] = Object.values(this.result[k])[idx])
        return row
      })
    },

    getZIP: function (name) {
      return this.zips.filter(zip => zip.includes(name))[0]
    }
    ,

    getPlot: function (name) {
      let url = this.plots.filter(plot => plot.includes(name))[0]
      if (url)
        return url
      return "https://www.schulz-grafik.de/wp-content/uploads/2018/03/placeholder.png"
    },

    getFile: function (type, name) {
      let types = {'png': this.plots, 'txt': this.txts, 'csv': this.csvs, 'zip': this.zips}
      let url = types[type].filter(plot => plot.includes(name))[0]
      if (url)
        return url
      return undefined
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
