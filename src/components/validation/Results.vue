<template>
  <div style="width: 100%;  padding: 16px">
    <v-sheet style="margin-top: 16px; border: none !important" flat elevation="0">
      <div style="display: flex; justify-content: center" v-if="!error && !result">
        <v-list-subheader :class="{sh:!mobile, sh_mobile:mobile}">Status: {{
            status ? status + (status === "Queued" ? "(" + queueStats.queuePosition + "/" + queueStats.queueLength + ")" : '') : "communicating..."
          }}
        </v-list-subheader>
      </div>
      <div v-if="!result && !error">
        <v-progress-linear :color="error?'error':'primary'" :indeterminate="progress===undefined"
                           :model-value="progress" density="compact"></v-progress-linear>
        <div style="width: 100%; display: flex; justify-content: center; margin-top:8px;">
          <i v-if="taskID && !result">You may return to your results later using the following URL: <a
              :href="getCurrentURL()">{{ getCurrentURL() }}</a></i>
        </div>
      </div>
      <div v-else-if="result" :style="{'padding-left': isMobile() ? '16px':'64px', 'padding-right': isMobile() ? '16px': '64px'}">
        <v-tabs v-model="resultTab" align-tabs="center" color="primary">
          <v-tab :value="0">
            Input
          </v-tab>
          <v-tab :value="1" :disabled="deleted">
            Result
          </v-tab>

        </v-tabs>
        <v-divider></v-divider>
        <v-window v-model="resultTab">
          <v-window-item :value="0">
            <InputTab @downloadEvent="downloadFile" :task-i-d="taskID" :mode="mode" :mobile="mobile"
                      :input="input" :deleted="deleted"></InputTab>
          </v-window-item>

          <v-window-item style="width: 100%" v-if="!deleted" :value="1">
            <OutputTab v-if="result" @reloadFiles="loadData()" @downloadEvent="downloadFile"
                       @downloadResultEvent="downloadFile(resultFileURL)" :taskID="taskID" :mobile="mobile"
                       :result="resultPreview" :plots="plots" :csvs="csvs" :txts="txt" :input="input" :mode="mode"
                       :zips="zips" :result-file-u-r-l="resultFileURL" :result-file="resultFile"></OutputTab>
          </v-window-item>
        </v-window>
      </div>
      <v-alert
          v-if="error"
          type="error"
          variant="flat"
          style="margin: 16px"
      >
        An error occurred: {{ status }}
      </v-alert>
    </v-sheet>
  </div>
</template>

<script>

import OutputTab from "@/components/validation/start/result/OutputTab.vue";
import InputTab from "@/components/validation/start/result/InputTab.vue";

export default {
  name: "Results",
  components: {OutputTab, InputTab},
  props: {
    params: Object,
    mobile: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      result: false,
      error: false,
      deleted: false,
      taskID: undefined,
      status: "",
      resultTab: 1,
      queueStats: undefined,
      mode: undefined,
      plots: undefined,
      csvs: undefined,
      zips: undefined,
      txt: undefined,
      progress: undefined,
      input: undefined,
      resultPreview: undefined,
      resultFileURL: undefined,
      resultFile: undefined,
    }
  },

  created() {
    this.taskID = this.$route.query.id
    if (this.taskID) {
      this.queryStatus()
    }
  },

  methods: {
    getFilePath: function (uid, name) {
      return this.$config.HOST_URL + this.$config.CONTEXT_PATH+"download_file?uid=" + uid + "&filename=" + name
    },

    downloadFile: function (name) {
      window.open(name)
    },

    loadData: function () {
      this.$http.getInput(this.taskID).then(input => {
        delete input.uid
        this.input = input
        if (this.mode === 'network') {
          this.resultFileURL = this.getFilePath(this.taskID, input.filename)
          this.resultFile = input.filename
        }
      }).then(() => {
        if (this.deleted) {
          this.resultTab = 0
          return;
        }
        this.$http.getResultFiles(this.taskID).then(files => {
          this.plots = files.filter(file => file.name.endsWith('png')).map(file => this.getFilePath(this.taskID, file.name))
          this.csvs = files.filter(file => file.name.endsWith('csv')).map(file => this.getFilePath(this.taskID, file.name))
          this.zips = files.filter(file => file.name.endsWith('zip')).map(file => this.getFilePath(this.taskID, file.name))
          this.txt = files.filter(file => file.name.endsWith('txt')).map(file => this.getFilePath(this.taskID, file.name))
        }).then(() => {
          if (this.mode !== 'intersect') {
            this.$http.getPreview(this.resultFileURL.split("?")[1]).then(data => {
              this.resultPreview = JSON.parse(data)
            }).catch(console.error)
          }else{
            this.$http.getContent(this.resultFileURL.split("?")[1]).then(data=>{
              this.resultPreview = JSON.parse(data)
            })
          }
        }).catch(console.error)
      }).catch(console.error).finally(() => {
        this.result = true
      })
    },

    isMobile: function () {
      return this.mobile
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

    getCurrentURL: function () {
      return window.location
    },

    queryResult: async function () {
      this.loadData()
    },

    queryStatus: function () {
      this.$http.getTaskStatus(this.taskID).then((response) => {
        if (!this.mode)
          this.mode = response.mode
        this.queueStats = response.stats
        if (response.status)
          this.status = response.status
        if (response.progress)
          this.progress = response.progress * 100
        if (response.failed)
          this.error = true
        if (response.deleted)
          this.deleted = true
        if (response.output) {
          this.resultFileURL = this.getFilePath(this.taskID, response.output)
          this.resultFile = response.output
        }
        if (response.done) {
          this.queryResult()
        }
        return response.failed || response.done
      }).then((done) => {
        if (!done)
          setTimeout(() => this.queryStatus(), 5000)
      }).catch(console.error)
    },


  }

}
</script>

<style scoped lang="sass">
.sh_mobile
  font-size: 1.2rem

.sh
  font-size: 1.5rem
</style>
