<template>
  <div>
    <v-alert
        color="error"
        variant="flat"
        style="margin: 16px; color: white"
        density="comfortable"
    >
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%">
        <b>Your input and output data will be deleted after 24h or click here to delete them now!</b>
        <v-btn @click="deleteDialogModel=true" color="white" variant="flat" style="margin-top: 16px; color: #ff5252">
          Delete
          <v-icon end icon="fa:fas fa-trash"></v-icon>
        </v-btn>
      </div>
    </v-alert>
    <v-dialog v-model="deleteDialogModel" max-width="700px">
      <v-sheet>
        <v-card>
          <v-card-title>
            Delete data
          </v-card-title>
          <v-card-text>Are you sure you want to delete the input and output data now? This link wills stay active only
            to show you used input parameters.
          </v-card-text>
          <v-divider style="margin: 8px 32px"></v-divider>
          <v-card-actions style="display: flex; margin: 8px">
            <v-btn style="justify-self: flex-start; margin: auto" @click="deleteDialogModel=false">Close</v-btn>
            <v-btn color="error" style="justify-self: flex-end; margin: auto" @click="deleteData()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-dialog>
    <div style="display:flex" v-show="mode!=='network'">
      <v-list-subheader style="justify-self: center; margin-left: auto; margin-right: 0">
        {{ mode === 'intersect' ? "Intersection summary" : "Matrix preview" }}
      </v-list-subheader>
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon @click="downloadFile(getZIP('.zip'))"  v-bind="props" variant="text"
                 style="justify-self: flex-end; margin-left: auto; margin-right: 0; top: 12px">
            <v-icon :style="{'color':mode==='network'?'gray':'black'}" icon="fa:fas fa-download"></v-icon>

          </v-btn>
        </template>
        <div v-if="mode!=='network'">Download all files as .zip</div>
        <div v-else>Downloads are available through the network view</div>
      </v-tooltip>
    </div>
    <v-container>
      <v-row justify="center" style="padding-top:16px; padding-bottom: 16px" v-if="result">
        <v-col cols="12" style="display: flex; justify-content: center">
          <v-data-table :headers="getHeader()" :items="getItems()"
                        class="matrix-table"
                        style="overflow-y: auto; width: auto; max-width: 100%; margin-left: auto; margin-right: auto"
                        :items-per-page="5">
          </v-data-table>
        </v-col>
        <div style="display: flex; justify-content: center; margin: 32px;" v-show="mode!=='network'">
          <v-tooltip location="end">
            <template v-slot:activator="{ props }">
              <v-btn @click="$emit('downloadResultEvent')"  v-bind="props" variant="flat" color="primary">
                <v-icon start icon="fa:fas fa-download"></v-icon>
                Download Output
              </v-btn>
            </template>
            <div style="width: 250px">Download whole result matrix</div>
          </v-tooltip>
        </div>
      </v-row>
    </v-container>
    <template v-if="mode==='intersect' && plots">
      <v-divider></v-divider>
      <div style="display:flex">
        <v-list-subheader style="justify-self: center; margin-left: auto; margin-right: auto">Overview Figure
        </v-list-subheader>
      </div>
      <v-container>
        <v-row class="flex_content_center">
          <v-col cols="12" lg="10" class="flex_content_center">
            <div style="width: 60%">
              <div class="flex_content_center">
                <v-img :src="getPlot('overview_intersections')"
                       style="position: relative; max-width: 70%">
                  <v-btn icon density="compact" style="position: absolute; right: 0"
                         @click="downloadFile(getPlot('overview_intersections'))" variant="text">
                    <v-icon density="compact" icon="fa:fas fa-download"></v-icon>
                  </v-btn>
                </v-img>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-if="mode !=='network' && mode !=='intersect'">
      <template v-if="plots">
        <v-divider></v-divider>
        <div style="display:flex">
          <v-list-subheader style="justify-self: center; margin-left: auto; margin-right: auto">Overview Figures
          </v-list-subheader>
        </div>
        <v-container>
          <v-row>
            <v-col cols="12" lg="6" class="flex_content_center">
              <div style="width: 100%">
                <div class="flex_content_center">
                  <v-img :src="getPlot('overview_log_bar')"
                         style="position: relative; max-width: 70%">
                    <v-btn icon density="compact" style="position: absolute; right: 0"
                           @click="downloadFile(getPlot('overview_log_bar'))" variant="text">
                      <v-icon density="compact" icon="fa:fas fa-download"></v-icon>
                    </v-btn>
                  </v-img>
                </div>
              </div>
            </v-col>
            <v-col cols="12" lg="6" class="flex_content_center">
              <div style="width: 100%">
                <div class="flex_content_center">
                  <v-img :src="getPlot('overview_log_box')"
                         style="position: relative; max-width: 70%">
                    <v-btn icon density="compact" style="position: absolute; right: 0"
                           @click="downloadFile(getPlot('overview_log_box'))" variant="text">
                      <v-icon density="compact" icon="fa:fas fa-download"></v-icon>
                    </v-btn>
                  </v-img>
                </div>
              </div>
            </v-col>
          </v-row>
          <div style="display: flex; justify-content: center; margin: 32px;">
            <v-tooltip location="end">
              <template v-slot:activator="{ props }">
                <v-btn @click="downloadFile(getFile('txt','overview_log.txt'))"  v-bind="props" variant="flat" color="primary">
                  <v-icon start icon="fa:fas fa-download"></v-icon>
                  Download Log.txt
                </v-btn>
              </template>
              <div style="width: 250px">Download whole log file</div>
            </v-tooltip>
          </div>
        </v-container>
        <template v-if="mode==='filter' || mode === 'reduce' || mode === 'ortho'">
          <v-divider></v-divider>
          <div style="display:flex">
            <v-list-subheader style="justify-self: center; margin-left: auto; margin-right: auto">Filter Details
            </v-list-subheader>
          </div>
          <v-container>
            <v-row class="flex_content_center">
              <v-col cols="12" lg="6" class="flex_content_center">
                <div style="width: 100%">
                  <div class="flex_content_center">
                    <v-img :src="getPlot('detailed_log')"
                           style="position: relative; max-width: 70%">
                      <v-btn icon density="compact" style="position: absolute; right: 0"
                             @click="downloadFile(getPlot('detailed_log'))" variant="text">
                        <v-icon density="compact" icon="fa:fas fa-download"></v-icon>
                      </v-btn>
                    </v-img>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <div style="display: flex; justify-content: center; margin: 32px;">
          <v-tooltip location="end">
            <template v-slot:activator="{ props }">
              <v-btn @click="downloadFile(getFile('txt','detailed_log.txt'))"  v-bind="props" variant="flat" color="primary">
                <v-icon start icon="fa:fas fa-download"></v-icon>
                Download Log.txt
              </v-btn>
            </template>
            <div style="width: 250px">Download detailed logs</div>
          </v-tooltip>
        </div>
      </template>

    </template>
    <template v-if="input.organism === 'human' || mode==='network'">
      <template v-if="drugstoneNetwork && drugstoneNetwork.nodes">
        <v-divider></v-divider>
        <v-expansion-panels :model-value="mode === 'network' ? 0: undefined" 
                            expand-icon="fa:fas fa-chevron-down" 
                            collapse-icon="fa:fas fa-chevron-up">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div style="display:flex; align-items: center; width: 100%">
                <v-icon icon="fa:fas fa-network-wired" color="primary" style="margin-right: 16px"></v-icon>
                <v-list-subheader style="font-size: 1.5rem; margin-top: 0">Network integration</v-list-subheader>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text v-if="drugstoneNetwork.nodes.length < 200">
              <drugst-one
                  groups='{"nodeGroups":{"protein":{"type":"protein","color":"#4da300","font":{"color":"#f0f0f0"},"groupName":"Protein","shape":"circle","id":"protein"}},"edgeGroups":{"default":{"color":"#000000","groupName":"default edge"}}}'
                  :config=getDrugstoneConfig()
                  :network="getDrugstoneNetwork(drugstoneNetwork)">
              </drugst-one>
            </v-expansion-panel-text>
            <v-expansion-panel-text v-else>
              <div v-if="drugstoneNetwork" style="text-align: justify-all">
                <i>The constructed network contains {{ drugstoneNetwork.nodes.length }} proteins, which cannot be
                  displayed
                  all together due to performance issues. Please use the network integration function on a subset of the
                  data instead.</i>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
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
    resultFile: String,
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      deleteDialogModel: false,
      drugstoneNetwork: undefined
    }
  },

  created() {
    if (this.input.organism === 'human' || this.mode === 'network')
      this.initDrugstoneNetwork()
  },

  methods: {

    downloadFile: function (file) {
      if(this.mode === 'network')
        return
      this.$emit('downloadEvent', file)
    }
    ,

    getHeader: function () {
      return Object.keys(this.result).map(k => {
            return {title: k, key: k}
          }
      )
    },

    getDrugstoneConfig: function () {
      return JSON.stringify({
        "identifier": this.getIDSpace(),
        "title": "Harmonized entries",
        "nodeShadow": true,
        "edgeShadow": false,
        "autofillEdges": true,
        "showLegend": true,
      })
    },

    getIDSpace: function () {
      if (this.mode === 'network')
        return this.input.idSpace
      if (this.mode === 'filter')
        return 'uniprot'
      return 'symbol'
    },

    initDrugstoneNetwork: async function () {
      this.$http.post("/get_result_column", {
        uid: this.taskID,
        filename: this.resultFile,
        column: this.input.resultColumn
      }).then(response => {
        return {
          nodes: [...new Set(response.data.filter(n => n.length > 0).flatMap(n => n.includes(";") ? n.split(";") : [n]))].map(n => {
            return {id: n, group: 'protein'}
          })
        }
      }).then(nw => {
        this.drugstoneNetwork = nw
      })
    },

    getDrugstoneNetwork: function () {
      console.log(JSON.stringify(this.drugstoneNetwork))
      return JSON.stringify(this.drugstoneNetwork)
    },

    getItems: function () {
      return Object.keys(Object.values(this.result)[0]).map(idx => {
        let row = {}
        Object.keys(this.result).forEach(k => row[k] = Object.values(this.result[k])[idx])
        return row
      })
    },

    deleteData: function () {
      this.$http.get("/clear?uid=" + this.taskID).then((response) => {
        if (response.data.uid) {
          location.reload()
        }
      }).catch(console.error)
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

.v-list-subheader
  font-size: 1.5rem
  margin-top: 8px
  padding-bottom: 8px
  line-height: 1.4 !important

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

.matrix-table
  ::v-deep(th)
    background-color: #f5f5f5 !important
    font-weight: bold !important
    color: #484848 !important

</style>
