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
        <v-col class="flex_content_center">
          <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
              >
                <v-icon left>far fa-lightbulb</v-icon>
                Load Example
              </v-btn>
            </template>
            <v-list>
              <v-list-item link v-for="(example,idx) in examples" :key="example.label" @click="loadExample(idx)">
                {{ example.label }}
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon right v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                  </template>
                  <div style="width: 250px; text-align: justify">
                    Download Example {{ example.label }} input and sets parameters to those used in this example.
                  </div>
                </v-tooltip>
              </v-list-item>
            </v-list>

          </v-menu>
        </v-col>
        <v-col align-self="end" class="flex">
          <v-btn color="primary" @click="checkEvent" class="flex_self_end">
            Visualize
            <v-icon right>fas fa-angle-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <template v-if="uid">
      <v-sheet style="margin-top: 16px;">
        <v-divider></v-divider>
        <div style="display: flex; justify-content: center">
          <v-subheader class="sh">
            <b>Intersection Analysis Configuration</b>
          </v-subheader>
        </div>
        <v-divider></v-divider>
        <div style="display: flex; justify-content: center">
          <v-subheader class="sh">
            File Upload
          </v-subheader>
        </div>
        <div :class="{border_mobile:mobile, border:!mobile}">
          <v-container style="padding-top: 16px">
            <template v-for="(e, idx) in files">
              <v-alert v-if="errorColumnName[idx]" type="error" :key="idx+'_col'" dense>Missing column name to filter
                from the file!
              </v-alert>
              <v-alert v-if="errorFile[idx]" type="error" :key="idx+'_file'" dense>Missing input file!</v-alert>
              <v-row style="width:100%" justify="center" :key="idx">
                <v-col cols="1">
                  <v-chip outlined>{{ idx + 1 }}</v-chip>
                </v-col>
                <v-col cols="12" md="5" class="flex_content_center">
                  <v-file-input label="Upload Input File"
                                hide-details
                                dense
                                single-line
                                @change="(file)=>{uploadFile(file, idx)}"
                                style="width: 300px; max-width: 300px; cursor: pointer"
                                prepend-inner-icon="fas fa-arrow-up-from-bracket">
                    <template v-slot:append-outer>
                      <v-tooltip right>
                        <template v-slot:activator="{on, attrs}">
                          <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width: 250px; text-align: justify">
                          Upload file with a column containing the IDs that should be intersected. <br><i>Note: File can
                          contain multiple additional columns containing other information and will be <b>deleted</b>
                          after 24 hours.</i>
                        </div>
                      </v-tooltip>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col cols="12" md="5" class="flex_content_center">
                  <v-text-field dense label="Column name" style="max-width: 300px;"
                                v-model="files[idx].column">
                    <template v-slot:append-outer>
                      <v-tooltip right>
                        <template v-slot:activator="{on, attrs}">
                          <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width: 250px; text-align: justify">
                          Define the name of the column in the uploaded file containing the IDs that should be
                          intersected.
                        </div>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="1">
                  <v-btn color="red" icon :disabled="idx<2"
                         @click="files.splice(idx,1); errorColumnName.splice(idx, 1); errorFile.splice(idx,1)">
                    <v-icon>fas fa-trash</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-row style="width:100%" justify="center">
              <v-col cols="12" md="6" class="flex_content_center">
                <v-btn icon
                       @click="files.push({file:'', column:''}); errorColumnName.push(false); errorFile.push(false)">
                  <v-icon>fas fa-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-divider></v-divider>
        <div style="display: flex; justify-content: center">
          <v-subheader class="sh">
            Optional
          </v-subheader>
        </div>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="6" class="flex_content_center">
              <v-text-field style="max-width: 120px; min-width: 120px" outlined filled dense
                            v-model="thresholdModel"
                            type="number"
                            label="Threshold"
              >
                <template v-slot:append-outer>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Only keep IDs which number of intersections is greater or equal the threshold.
                    </div>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="3" class="flex_content_center">
              <v-checkbox v-model="isHuman" label="Organism Human"
                          style="max-width: 170px" hide-details>
                <template v-slot:append>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Set checkmark if the organism used in your data is human.
                    </div>
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="12" md="6" class="flex_content_center">
              <v-select label="ID Type"
                        v-model="idSpaceModel" :items="idSpaceList.concat(['other']).map(i=>{return{text:i, value:i}})"
                        style="max-width: 210px; min-width: 210px" outlined dense filled hide-details>
                <template v-slot:append-outer>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      ID type of inserted IDs. <br><i>Click on the drop-down
                      to see the supported types.</i>
                    </div>
                  </v-tooltip>
                </template>
              </v-select>
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
              Visualize
              <v-icon right>fas fa-angle-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-else>
      <div style="width: 100%; display: flex; justify-content: center; margin-top:8px;">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div style="width: 100%; display: flex; justify-content: center; margin-top:8px;">
        <i>Connecting to server! If this does not change soon, please reload the page or contact the website admin </i>
      </div>
    </template>
    <v-snackbar v-model="notification.show" :multi-line="true" :timeout="notification.timeout"
                color="warning" dark>
      {{ notification.message }}
    </v-snackbar>
  </div>
</template>

<script>

export default {
  name: "ConfigurationFilter",

  props: {
    mode: String,
    type: String,
    idSpaceList: Array,
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
      resultColumnNameModel: undefined,
      thresholdModel: 1,
      files: [{file: '', column: ''}, {file: '', column: ''}],
      idSpaceModel: 'other',
      isHuman: false,
      filename: undefined,
      mailModel: undefined,

      errorColumnName: [false, false],
      errorFile: [false, false],
      examples: [
        {
          label: 'Schmidt 2017 & 2018, ...',
          file: 'Intersect.zip',
          params: {thresholdModel: 2, isHuman: true, idSpaceModel: 'symbol'}
        },]
    }
  },

  created() {
    this.$router.push("/configure")
    this.init()
  },

  methods: {
    init: function () {
      this.$http.initTask(this.mode).then(data => {
        if (data.uid) {
          this.uid = data.uid
        }
      }).catch(() => {
        if (!this.uid)
          setTimeout(() => {
            this.init
          }, 2000)
      })
    },

    uploadFile: function (file, idx) {
      if (!file)
        return
      let data = new FormData();
      data.append('file', file, file.name)
      data.append('uid', this.uid)

      this.$http.post('/upload_file', data).then(response => {
        if (response.data.filename)
          this.files[idx].filename = response.data.filename
      }).catch(() => {
        this.init()
        this.uploadFile(file, idx)
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

    loadExample: function (idx) {
      let example = this.examples[idx]
      this.thresholdModel = example.params.thresholdModel
      this.isHuman = example.params.isHuman
      this.idSpaceModel = example.params.idSpaceModel
      window.open(this.$config.HOST_URL + "/download_example_file?filename=" + example.file)
    },

    checkEvent: async function () {
      let error = false
      for (let idx = 0; idx < this.files.length; idx++) {
        this.errorFile[idx] = !this.files[idx].filename
        this.errorColumnName[idx] = !this.files[idx].column
        error = this.errorFile[idx] || this.errorColumnName[idx] || error
      }
      if (error) {
        this.setNotification('There are errors in your configuration!', 5000)
        return
      }
      let params = {
        uid: this.uid,
        filenames: this.files.map(e => e.filename),
        columns: this.files.map(e => e.column),
        threshold: this.thresholdModel,
        organism: this.isHuman ? 'human' : 'other',
        idSpace: this.idSpaceModel,
        resultColumn: 'ID',
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
