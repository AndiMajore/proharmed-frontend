<template>
  <div style="width: 100%;  padding: 16px">
    <v-container>
      <v-row>
        <v-col>
          <v-btn color="error" @click="$emit('resetEvent')"
                 style="justify-self: flex-start; margin-right: auto;">
            <v-icon left>fas fa-angle-left</v-icon>
            Back
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" class="flex_self_center" outlined @click="loadExample(mode)">
            <v-icon left>far fa-lightbulb</v-icon>
            Load Example
          </v-btn>
        </v-col>
        <v-col align-self="end" class="flex">
          <v-btn color="primary" @click="checkEvent" class="flex_self_end">
            Harmonize
            <v-icon right>fas fa-angle-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-sheet style="margin-top: 16px;">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader class="sh">
          Filter Configuration
        </v-subheader>
      </div>
      <v-alert v-if="errorTargetID" type="error" dense>Missing target ID type selection</v-alert>
      <v-alert v-if="errorTargetIDs" type="error" dense>Missing targetIDs</v-alert>
      <v-container :class="{border_mobile:mobile, border:!mobile}">
        <v-row justify="center">
          <v-col cols="12" lg="4" :class="{'flex_content_center':mobile}">
            <v-container style="padding-top: 16px">
              <v-row justify="center" justify-lg="start">
                <v-col cols="12" md="6" lg="12" class="flex_content_center">
                  <!--                  <v-select :label="mode==='network' ?'Node ID type':'Target ID type'" "-->
                  <!--                            v-model="targetIDType"-->
                  <!--                            style="max-width: 210px; min-width: 210px" outlined dense filled hide-details>-->
                  <!--                    <template v-slot:append-outer>-->
                  <!--                      <v-tooltip right>-->
                  <!--                        <template v-slot:activator="{on, attrs}">-->
                  <!--                          <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>-->
                  <!--                        </template>-->
                  <!--                        <div style="width: 250px; text-align: justify">-->
                  <!--                          ID type of inserted {{ mode === 'network' ? 'node' : 'target' }} IDs. Click on the drop-down-->
                  <!--                          to see the supported types.-->
                  <!--                        </div>-->
                  <!--                      </v-tooltip>-->
                  <!--                    </template>-->
                  <!--                  </v-select>-->
                </v-col>
                <v-col cols="12" md="6" lg="12" class="flex_content_center">
                  <v-file-input ref="tarInput" :label="'Upload '+(mode==='network' ? 'nodes' : 'targets')"
                                hide-details
                                dense
                                single-line
                                style="width: 210px; max-width: 210px; cursor: pointer"
                                @change="uploadFile"
                                prepend-inner-icon="fas fa-arrow-up-from-bracket">
                    <template v-slot:append-outer>
                      <v-tooltip right>
                        <template v-slot:activator="{on, attrs}">
                          <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width: 250px; text-align: justify" v-if="mode !== 'network'">
                          Upload of file with target IDs that are separated by a newline in the file.
                        </div>
                        <div style="width: 250px; text-align: justify" v-if="mode === 'network'">
                          Upload a single column node list, edge list or .sif network file with node IDs.
                        </div>
                      </v-tooltip>
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" lg="8" :class="{'flex_content_center':mobile}">
            <v-textarea v-if="mode==='set' || mode==='network'" :label="mode==='network' ? 'Node IDs' : 'Target IDs'"
                        v-model="targets"
                        :class="{ 'ta_mobile':mobile }"
                        no-resize
                        filled
                        placeholder="Enter your chosen IDs newline separated...">
              <template v-slot:append>
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon style="top: -14px;right:-10px; margin-left: -21px" v-bind="attrs" v-on="on">far
                      fa-question-circle
                    </v-icon>
                  </template>
                  <div style="width: 250px; text-align: justify">
                    Manually add IDs newline separated. After inserting IDs manually or with a file upload, IDs can be
                    changed or deleted as desired.
                  </div>
                </v-tooltip>
              </template>
            </v-textarea>
            <v-data-table v-if="mode==='cluster'" item-key="id" :items="clusters" :class="{ 'ta_mobile':mobile }"
                          style="padding: 16px; margin-left: 0; margin-right: 0; justify-self: flex-end" dense
                          :headers="clusterHeaders">
              <template v-slot:item.action="{item}">
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn icon v-on="on" v-bind="attrs" @click="removeClusterEntry(item)" small>
                      <v-icon>far fa-trash-can</v-icon>
                    </v-btn>
                  </template>
                  <div style="width: 200px; text-align: justify">
                    Remove entry from cluster list!
                  </div>
                </v-tooltip>
              </template>
              <template v-slot:body.append="{headers}">
                <tr>
                  <td :style="{'text-align':headers[0].align}">
                    <v-text-field dense label="id" style="margin-bottom: -16px; margin-top:16px;padding-bottom: 6px"
                                  v-model="clusterIDModel">
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            Insert ID of target ID type.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </td>
                  <td :style="{'text-align':headers[1].align}">
                    <v-text-field dense label="cluster"
                                  style="margin-bottom: -16px; margin-top:16px; padding-bottom: 6px"
                                  v-model="clusterModel">
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            Add assigned Cluster. Names and/or numbers are supported.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </td>
                  <td :style="{'text-align':headers[2].align, 'width':headers[2].width}">
                    <v-tooltip right>
                      <template v-slot:activator="{attrs, on}">
                        <v-btn v-on="on" v-bind="attrs" icon @click="addClusterEntry()" small>
                          <v-icon>far fa-square-plus</v-icon>
                        </v-btn>
                      </template>
                      <div style="width: 200px; text-align: justify">
                        Add custom entry to cluster list!
                      </div>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
    </v-sheet>
    <v-container>
      <v-row style="margin-top:8px">
        <v-col>
          <v-btn color="error" @click="$emit('resetEvent')" style="justify-self: left; margin-right: auto;">
            <v-icon left>fas fa-angle-left</v-icon>
            Back
          </v-btn>
        </v-col>
        <v-col align-self="end" class="flex">
          <v-btn color="primary" @click="checkEvent" class="flex_self_end">
            Harmonize
            <v-icon right>fas fa-angle-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="notification.show" :multi-line="true" :timeout="notification.timeout"
                color="warning" dark>
      {{ notification.message }}
    </v-snackbar>
  </div>
</template>

<script>

// import * as EXAMPLES from "../../Example"

export default {
  name: "Configuration",

  props: {
    mode: String,
    type: String,
    idMap: Object,
    mobile: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      notification: {
        show: false,
        message: "",
        timeout: 5000,
      },
      targetFile: undefined,
      referenceFile: undefined,
      errorTargetID: false,
      errorTargetIDs: false,
      errorReferenceID: false,
      width: "50px",
      errorSigCont: false,
      errorReferenceIDs: false,
      errorNetworkFormat: false,
      errorNetworkIDType: false,
      errorNetworkNodeName: false,
      clusterIDModel: "",
      clusterModel: "",
      edgeID1Model: "",
      edgeID2Model: "",
      edgeNameModel: "",
      targetIDType: undefined,
      networkFile: undefined,
      targets: "",
      references: "",
      reference: "",
      referenceIDType: undefined,
      useReference: false,
      enriched: false,
      sigCont: false,
      sigContMail: "",
      sigContTargets: [],
      sigContFile: undefined,
      runs: 1000,
      replace: 100,
      distanceModel: "jaccard",
      refType: "disease",
      nodeType: "",
      nodeName: "",
      clusters: [],
      edges: [],
      networkRule: [
        value => !value || (value.name.endsWith('.gt') || value.name.endsWith('.graphml') || value.name.endsWith('.sif')) || 'Network file must have the suffix .sif, .gt or .graphml.'
      ],
      refTypes: [
        {text: "Gene", value: "gene"},
        {text: "Disease", value: "disease"},
      ],
      distanceMeasures: [
        {text: "Jaccard index", value: "jaccard"},
        {text: "Overlap coefficient", value: "overlap"}
      ],
      backgroundModel: this.mode === 'cluster' ? 'complete' : (this.mode === 'network' ? 'network' : "complete"),
      backgroundModels: [
        {text: "Fully randomized", value: "complete"},
        {text: "Term-size preserving", value: "term-pres"},
        {text: "Network-based", value: "network"}
      ],
      targetIDTypes: this.idMap
    }
  },

  created() {
    this.$router.push("/configure")
  },

  methods: {

    idsToList: function (ids) {
      return ids.split(/\n/).filter(id => id.length > 0)
    },

    uploadFile: function (file) {
      let data = new FormData();
      // console.log(file)
      data.append('file', file, file.name)
      // data.append('uid','someid')
      // console.log(data)
      // let config =  {
      //   header:{}
      // }
      this.$http.post('/upload_file', data).then(response=>{
        console.log(response)
      })
    },

    readSigContFile: function (file) {
      if (file) {
        if (this.mode === 'network') {
          this.readEdges(file, true)
        } else {
          this.readFile(file, 'sigCont')
        }
        this.$refs.sigContList.blur()
      }
    },

    readReferenceFile: function (file) {
      if (file) {
        this.readFile(file, 'reference')
        this.$refs.refInput.blur()
      }
    },

    isMobile: function () {
      return this.mobile
    },
    limitColumns: function (content, delim, columns, sigCont) {
      let out = content.split("\n").map(line => {
        if (line.length === 0)
          return ""
        let entries = line.split(delim);
        let l = ""
        for (let e = 0; e < columns; e++)
          l += entries[e] + delim;
        l = l.substring(0, l.length - delim.length)
        return l
      }).filter(l => l.length > 0)
      if (sigCont)
        return out
      return out.join("\n")
    },

    readFileContent: function (result, goal) {
      if (goal === 'target' || goal === 'sigCont') {
        let sigCont = goal === 'sigCont'
        if (this.mode === 'cluster' && !sigCont) {
          // if (sigCont)
          //   this.sigContTargets = []
          result = this.limitColumns(result, "\t", 2)
          result.split("\n").forEach(l => {
            let entries = l.split("\t");
            this.addToClusters(entries[0], entries[1]);
          })
        } else {
          result = this.limitColumns(result, "\t", 1, sigCont)
          if (sigCont) {
            this.sigContTargets = result
          } else {
            this.targets = result
          }
        }
        if (sigCont) {
          this.sigContFile = undefined
          if (this.sigContTargets && this.sigContTargets.length > 100) {
            this.setNotification("Please select maximum 100 entries for significance contribution calculation.")
            this.sigContTargets = []
          }
        } else {
          this.targetFile = undefined
        }
      }
      if (goal === 'reference') {
        this.references = result
        this.referenceFile = undefined
      }
    },

    readEdgeListContent: function (result, sif, sigCont) {
      if (!sigCont) {
        this.targets = []
      } else {
        this.sigContTargets = []
      }
      let lines = result.split("\n").filter(l => l && l.length > 0).map(l => l.split(/\s*[\s,]\s*/))
      if (sif) {
        lines.forEach(entries => {
          if (entries.length > 2)
            for (let i = 2; i < entries.length; i++) {
              this.addToEdges(entries[0], entries[i], sigCont)
            }
          else if (entries.length === 1) {
            this.addToEdges(entries[0], sigCont)
          } else
            this.addToEdges(entries[0], entries[1], sigCont)
        })
      } else {
        lines.forEach(entries => {
          this.addToEdges(entries[0], entries[1], sigCont);
        })
      }
      if (!sigCont) {
        this.targets = this.targets.join("\n")
        this.targetFile = undefined
      } else {
        this.sigContFile = undefined
      }
    }
    ,

    readFile: function (file, goal) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let result = event.target.result
        this.readFileContent(atob(result.split('base64,')[1]), goal)
      });
      reader.readAsDataURL(file);
    }
    ,

    readEdges: function (file, sigCont) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let result = event.target.result
        this.readEdgeListContent(atob(result.split('base64,')[1]), file.name.endsWith(".sif"), sigCont)
      });
      reader.readAsDataURL(file);
    }
    ,

    removeClusterEntry: function (item) {
      this.clusters.splice(this.clusters.indexOf(item), 1)
    }
    ,
    addClusterEntry: function () {
      if (this.clusterModel && this.clusterIDModel && this.clusterModel.length > 0 && this.clusterIDModel.length > 0) {
        this.addToClusters(this.clusterIDModel, this.clusterModel)
        this.clusterModel = ""
        this.clusterIDModel = ""
      }
    }
    ,
    addToClusters: function (id, cluster) {
      let clusterItem = {id: id, cluster: cluster}
      if (this.clusters.indexOf(clusterItem) > -1) {
        this.setNotification("This entry already exists!")
      } else {
        if (this.clusters.map(i => i.id).indexOf(id) > -1) {
          this.setNotification("Duplicate IDs are not allowed!")
        }
        this.clusters.push(clusterItem)
      }
    }
    ,

    addTarget: function (entry, sigCont) {
      if (sigCont) {
        if (this.sigContTargets.indexOf(entry) === -1)
          this.sigContTargets.push(entry)
      } else {
        if (this.targets.indexOf(entry) === -1)
          this.targets.push(entry)
      }
    },
    addToEdges: function (id1, id2, sigCont) {
      if (id1)
        this.addTarget(id1, sigCont)
      if (id2)
        this.addTarget(id2, sigCont)
    }
    ,
    setNotification: function (message, timeout) {
      if (timeout)
        this.notification.timeout = timeout
      if (message)
        this.notification.message = message
      this.notification.show = true
    }
    ,
    getExampleNetwork: async function () {
      this.nodeName = 'name'
      this.nodeType = 'symbol'
      var link = document.createElement("a");
      link.setAttribute('target', '_blank');
      link.href = this.$config.HOST_URL + '/network_file';
      document.body.appendChild(link);
      link.click();
      link.remove();
    },

    loadExample: function (mode) {
      mode
      // if (mode === 'set') {
      //   if (type === 'gene') {
      //     if (example === 'set') {
      //       this.readFileContent(EXAMPLES.gene_set.target, 'target')
      //       this.targetIDType = EXAMPLES.gene_set.target_id_type
      //       this.useReference = false
      //       this.enriched = false
      //       this.backgroundModel = 'complete'
      //       this.references = ""
      //     }
      //     if (example === 'ref') {
      //       this.readFileContent(EXAMPLES.gene_set.target, 'target')
      //       this.targetIDType = EXAMPLES.gene_set.target_id_type
      //       this.useReference = true
      //       this.enriched = true
      //       this.backgroundModel = 'term-pres'
      //       this.refType = EXAMPLES.gene_set.reference_type
      //       this.readFileContent(EXAMPLES.gene_set.reference, 'reference')
      //       this.referenceIDType = EXAMPLES.gene_set.reference_id_type
      //     }
      //   } else {
      //     if (example === 'network') {
      //       this.readFileContent(EXAMPLES.disease_network.target, 'target')
      //       this.targetIDType = EXAMPLES.disease_network.target_id_type
      //       this.backgroundModel = 'network'
      //     } else {
      //       this.readFileContent(EXAMPLES.disease_set.target, 'target')
      //       this.targetIDType = EXAMPLES.disease_set.target_id_type
      //       this.backgroundModel = 'term-pres'
      //
      //     }
      //   }
      // } else if (mode === 'network') {
      //
      //   if (type === 'gene') {
      //     if (example === 'set' || example === 'network') {
      //       this.readFileContent(EXAMPLES.gene_network.target, 'target')
      //       this.targetIDType = EXAMPLES.gene_network.target_id_type
      //       this.enriched = false
      //       this.backgroundModel = 'network'
      //       this.useReference = false
      //       this.references = ""
      //     }
      //     if (example === 'ref') {
      //       this.readFileContent(EXAMPLES.gene_network.target, 'target')
      //       this.targetIDType = EXAMPLES.gene_network.target_id_type
      //       this.useReference = true
      //       this.enriched = true
      //       this.backgroundModel = 'network'
      //       this.refType = EXAMPLES.gene_network.reference_type
      //       this.readFileContent(EXAMPLES.gene_network.reference, 'reference')
      //       this.referenceIDType = EXAMPLES.gene_network.reference_id_type
      //     }
      //
      //   } else {
      //     this.readFileContent(EXAMPLES.disease_network.target, 'target')
      //     this.targetIDType = EXAMPLES.disease_network.target_id_type
      //     this.backgroundModel = 'network'
      //   }
      // } else if (mode === 'cluster') {
      //   if (type === 'gene') {
      //     this.readFileContent(EXAMPLES.gene_cluster.target, 'target')
      //     this.targetIDType = EXAMPLES.gene_cluster.target_id_type
      //   } else {
      //     this.readFileContent(this.targets = EXAMPLES.disease_cluster.target, 'target')
      //     this.targetIDType = EXAMPLES.disease_cluster.target_id_type
      //   }
      // }
    }
    ,


    getBackgroundModelItems: function () {
      let items = this.backgroundModels;
      if (this.mode !== 'network')
        items = items.filter(e => e.value !== 'network')
      if (this.mode === 'cluster')
        items = items.filter(e => e.value === 'complete')
      if (this.mode === 'network')
        items = items.filter(e => e.value === 'network')
      return items
    },

    checkEvent: async function () {
      this.errorTargetID = !this.targetIDType;
      this.errorTargetIDs = this.mode === 'cluster' ? this.clusters.length === 0 : this.targets.length === 0
      if (this.useReference) {
        this.errorReferenceID = !this.referenceIDType;
        this.errorReferenceIDs = this.references.length === 0
      } else {
        this.errorReferenceIDs = false
        this.errorReferenceID = false
      }
      // if (this.mode === 'network' && !this.networkFile)
      //   this.errorNetwork = true
      if (this.mode === 'network' && this.networkFile) {
        this.errorNetworkFormat = !(this.networkFile.name.endsWith('.sif') || this.networkFile.name.endsWith('.graphml') || this.networkFile.name.endsWith('.gt'))
        this.errorNetworkIDType = !this.nodeType
        if (!this.networkFile.name.endsWith('.sif'))
          this.errorNetworkNodeName = !this.nodeName || this.nodeName.length === 0
      }
      this.errorSigCont = this.sigCont && (!this.sigContTargets || this.sigContTargets.length === 0) && (this.mode === 'cluster' ? this.clusters.length > 100 : this.idsToList(this.targets).length > 100)
      let error = this.errorSigCont || this.errorTargetID || this.errorTargetIDs || this.errorReferenceID || this.errorReferenceIDs || this.errorNetworkIDType || this.errorNetworkFormat || this.errorNetworkNodeName
      if (!error) {
        let route;
        let params = {
          type: this.type,
          targetID: this.targetIDType,
          target: this.mode === 'cluster' ? this.clusters : this.idsToList(this.targets),
          distance: this.distanceModel,
          runs: this.runs,
          replace: this.replace,
          background: this.backgroundModel,
          sigCont: this.sigCont
        }
        if (this.sigCont) {
          if (this.sigContMail.includes("@"))
            params['mail'] = this.sigContMail
          if (this.sigContTargets && this.sigContTargets.length > 0) {
            params['sigContTargets'] = this.sigContTargets
          }
        }
        if (this.mode === 'network') {
          params.network = this.networkFile ? {
            name: this.networkFile.name,
            data: await this.getNetwork(),
            id_type: this.nodeType,
            prop_name: this.nodeName
          } : undefined;
          route = 'network'
        } else if (this.useReference) {
          params.enriched = this.enriched
          params.referenceID = this.referenceIDType
          params.reference = this.idsToList(this.references)
          route = "set-set"
        } else {
          route = this.mode
        }
        params.mode = route
        this.$emit("validationEvent", params)
      }
    },
    getNetwork: async function () {
      if (this.networkFile) {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            resolve(event.target.result.split('base64,')[1])
          });
          reader.readAsDataURL(this.networkFile)
        }).then(result => {
          return result
        })
      } else
        return undefined;
    }
  }

}
</script>

<style scoped lang="sass">

.v-subheader
  margin: 8px

.flex
  display: flex

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

.example_div_width
  width: 100%
  display: flex
  margin: 4px

.sh_mobile
  font-size: 1.2rem

.ta_mobile
  padding: 0

.ta_not_mobile
  max-width: 40vw
  margin-left: auto
  margin-right: 0
  justify-self: flex-end

.sh
  font-size: 1.5rem
  margin-left: 64px
  margin-right: 64px

.margin_normal
  padding-left: 64px
  padding-right: 64px

.border
  padding-right: 64px
  padding-left: 64px

.border_mobile
  padding-right: 16px
  padding-left: 16px

.margin_mobile
  padding-left: 8px
  padding-right: 8px
</style>
