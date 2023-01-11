<template>
  <div style="width: 100%;  padding: 16px">
    <v-sheet style="margin-top: 16px;">
      <div style="display: flex; justify-content: center" v-if="!error && !result">
        <v-subheader :class="{sh:!mobile, sh_mobile:mobile}">Status: {{
            status ? status + (status === "Queued" ? "(" + queueStats.queuePosition + "/" + queueStats.queueLength + ")" : '') : "communicating..."
          }}
        </v-subheader>
      </div>
      <div v-if="!result">
        <v-progress-linear :color="error?'error':'primary'" :indeterminate="progress===undefined"
                           :value="progress"></v-progress-linear>
        <div style="width: 100%; display: flex; justify-content: center; margin-top:8px;">
          <i v-if="taskID && !result">You may return to your results later using the following URL: <a
              :href="getCurrentURL()">{{ getCurrentURL() }}</a></i>
        </div>
      </div>
      <div v-else :style="{'padding-left': isMobile() ? '16px':'64px', 'padding-right': isMobile() ? '16px': '64px'}">
        <v-tabs v-model="resultTab" centered>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab>
            Input
          </v-tab>
          <v-tab :disabled="deleted">
            Result
          </v-tab>

        </v-tabs>
        <v-divider></v-divider>
        <v-tabs-items v-model="resultTab">
          <v-tab-item>
            <InputTab @downloadEvent="downloadFile" :task-i-d="taskID" :mode="mode" :mobile="mobile"
                      :input="input" :deleted="deleted"></InputTab>
          </v-tab-item>

          <v-tab-item style="width: 100%" v-if="!deleted">
            <OutputTab v-if="result" @reloadFiles="loadData()" @downloadEvent="downloadFile" @downloadResultEvent="downloadFile(resultFileURL)" :taskID="taskID" :mobile="mobile"
                       :result="resultPreview" :plots="plots" :csvs="csvs" :txts="txt" :input="input" :mode="mode"
                       :zips="zips" :result-file-u-r-l="resultFileURL"></OutputTab>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <span v-if="error"><i>An error with following message occurred: {{ status }}</i></span>
    </v-sheet>
  </div>
</template>

<script>

import OutputTab from "@/components/validation/start/result/OutputTab";
import InputTab from "@/components/validation/start/result/InputTab";

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
      return this.$config.HOST_URL + "/download_file?uid=" + uid + "&filename=" + name
    },

    downloadFile: function (name) {
      window.open(name)
    },

    loadData: function () {
      this.$http.getInput(this.taskID).then(input => {
        delete input.uid
        this.input = input
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
          this.$http.getPreview(this.resultFileURL.split("?")[1]).then(data => {
            this.resultPreview = JSON.parse(data)
          }).catch(console.error)
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
        if(response.output)
          this.resultFileURL = this.getFilePath(this.taskID,response.output)
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

</style>
