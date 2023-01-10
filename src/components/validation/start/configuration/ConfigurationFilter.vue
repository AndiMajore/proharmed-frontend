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
      <v-alert v-if="errorColumnName" type="error" dense>Missing column name to filter from the file!</v-alert>
      <v-alert v-if="errorFile" type="error" dense>Missing input file!</v-alert>
      <div :class="{border_mobile:mobile, border:!mobile}">
        <v-container style="padding-top: 16px">
          <v-row style="width:100%" justify="center">
            <v-col cols="12" md="6" class="flex_content_center">
              <v-file-input ref="tarInput" label="Upload input File"
                            hide-details
                            dense
                            single-line
                            style="width: 300px; max-width: 300px; cursor: pointer"
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
            <v-col cols="12" md="6" class="flex_content_center">
              <v-text-field dense label="Column name" style="max-width: 300px;"
                            v-model="columnNameModel">
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
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <div style="display: flex; justify-content: center">
          <v-subheader class="sh">
            Optional
          </v-subheader>
        </div>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="6" class="flex_content_center">
              <v-select label="Organism"
                        v-model="organismModel" :items="organismList.map(o=>{return{text:o, value:o}})"
                        style="max-width: 210px; min-width: 210px" outlined dense filled hide-details>
                <template v-slot:append-outer>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      ID type of inserted {{ mode === 'network' ? 'node' : 'target' }} IDs. Click on the drop-down
                      to see the supported types.
                    </div>
                  </v-tooltip>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6" lg="3" class="flex_content_center">
              <v-checkbox v-model="keepEmptyModel" label="Keep Empty"
                          style="max-width: 170px" hide-details>
                <template v-slot:append>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Set checkmark if the input target set should be compared to a reference.
                    </div>
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="12" md="6" lg="3" class="flex_content_center">
              <v-checkbox v-model="reviewedModel" label="Reviewed"
                          style="max-width: 170px" hide-details>
                <template v-slot:append>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Set checkmark if the input target set should be compared to a reference.
                    </div>
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="12" md="6" lg="3" class="flex_content_center">
              <v-checkbox v-model="revConModel" label="Rev con"
                          style="max-width: 170px" hide-details>
                <template v-slot:append>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Set checkmark if the input target set should be compared to a reference.
                    </div>
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="12" md="6" class="flex_content_center">
              <v-text-field dense label="Result column" style="max-width: 300px;"
                            v-model="resultColumnNameModel">
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
            </v-col>
            <v-col cols="12" md="6" class="flex_content_center">
              <v-text-field dense label="E-mail" style="max-width: 300px;"
                            v-model="mailModel">
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
            </v-col>
          </v-row>
        </v-container>
      </div>
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
    organismList: Array,
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

      uid: undefined,
      columnNameModel: undefined,
      organismModel: 'rat',
      resultColumnNameModel: 'Filtered Protein IDs',
      keepEmptyModel: true,
      reviewedModel: false,
      revConModel: false,
      filename: undefined,
      mailModel: undefined,

      errorColumnName: false,
      errorFile: false,
    }
  },

  created() {
    this.$router.push("/configure")
    this.$http.initTask(this.mode).then(data => {
      this.uid = data.uid
    })
  },

  methods: {


    uploadFile: function (file) {
      if (!file)
        return
      let data = new FormData();
      data.append('file', file, file.name)
      data.append('uid', this.uid)
      this.$http.post('/upload_file', data).then(response => {
        this.filename = response.data.filename
      })
    },

    setNotification: function (message, timeout) {
      if (timeout)
        this.notification.timeout = timeout
      if (message)
        this.notification.message = message
      this.notification.show = true
    }
    ,

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

    checkEvent: async function () {
      this.errorFile = !this.filename;
      this.errorColumnName = !this.columnNameModel || this.columnNameModel.length === 0
      let error = this.errorFile || this.columnNameModel
      if(error){
        this.setNotification('There are errors in your configuration!',5000)
      }
      let params = {
        uid: this.uid,
        filename: this.filename,
        column: this.columnNameModel,
        organism: this.organismModel,
        keep: this.keepEmptyModel,
        reviewed: this.keepEmptyModel,
        revCon: this.revConModel,
        resultColumn: this.resultColumnNameModel,
        mail: this.mailModel
      }
      this.$emit("applyFilterEvent", params)
    },
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
