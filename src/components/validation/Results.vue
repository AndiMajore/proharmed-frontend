<template>
  <div style="width: 100%;  padding: 16px">
    <v-sheet style="margin-top: 16px;">
      <div style="display: flex; justify-content: center" v-if="!error && result ===undefined">
        <v-subheader :class="{sh:!mobile, sh_mobile:mobile}">Status: {{
            status ? status + (status === "Queued" ? "(" + queueStats.queuePosition + "/" + queueStats.queueLength + ")" : '') : "communicating..."
          }}
        </v-subheader>
      </div>
      <div v-if="result===undefined">
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
          <v-tab>
            Result
          </v-tab>

        </v-tabs>
        <v-divider></v-divider>
        <v-tabs-items v-model="resultTab">
          <v-tab-item>
            <InputTab @downloadEvent="downloadFile" :task-i-d="taskID" :id-map="idMap" :type="type" :mode="mode" :mobile="mobile" :input="input" :zips="zips"></InputTab>
          </v-tab-item>

          <v-tab-item style="width: 100%">
            <OutputTab @reloadFiles="loadPlots()" @downloadEvent="downloadFile" :taskID="taskID" :mobile="mobile" :result="result" :plots="plots" :csvs="csvs" :input="input" :type="type" :mode="mode" :zips="zips" :reference-type="getIDType(input.reference_id)"></OutputTab>
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
    idMap: Object,
    mobile: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      result: undefined,
      error: false,
      taskID: undefined,
      status: "",
      resultTab: 1,
      queueStats: undefined,
      mode: undefined,
      type: undefined,
      plots: undefined,
      csvs: undefined,
      zips: undefined,
      progress: undefined,
      input: undefined,
    }
  },

  created() {
    this.taskID = this.$route.query.id
    console.log(this.params)
    if (this.taskID) {
      this.queryStatus()
    } else {
      this.execute()
    }
  },

  methods: {
    saveResult: function (result) {
      if (typeof result !== "object") {
        this.error = true
        return;
      }
      this.result = result.result
      this.loadPlots()
    },
    getFilePath: function (name) {
      return this.$config.HOST_URL + "/result_file?name=" + name
    },

    downloadFile: function (name) {
      window.open(name)
    },
    getClusterNames: function (clustering) {
      const uniq = []
      clustering.map(e => e.cluster).forEach(e => {
        if (uniq.indexOf(e) === -1)
          uniq.push(e)
      })
      return uniq
    },

    loadPlots: function () {
      this.$http.getResultFiles(this.taskID).then(files => {
        this.plots = files.filter(file => file.type === 'png').map(file => this.getFilePath(file.name))
        this.csvs = files.filter(file => file.type === 'csv').map(file => this.getFilePath(file.name))
        this.zips = files.filter(file => file.type === 'zip').map(file => this.getFilePath(file.name))
      }).catch(console.error)
    },

    getIDType: function (id) {
      for (let idType of Object.keys(this.idMap)) {
        if (this.idMap[idType].map(e => e.value).includes(id)) {
          return idType
        }
      }
      return undefined
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

    queryResult: function () {
      this.$http.getTaskResult(this.taskID).then(this.saveResult).catch(console.error)
    },

    queryStatus: function () {
      this.$http.getTaskStatus(this.taskID).then((response) => {
        if (!this.input)
          this.input = response.input
        if (!this.mode)
          this.mode = response.mode
        if (!this.type)
          this.type = response.type
        this.queueStats = response.stats
        if (response.status)
          this.status = response.status
        if (response.progress)
          this.progress = response.progress * 100
        if (response.failed)
          this.error = true
        if (response.done) {
          this.queryResult()
        }
        return response.failed || response.done
      }).then((done) => {
        if (!done)
          setTimeout(() => this.queryStatus(), 5000)
      }).catch(console.error)
    },


    saveTaskId: function (response) {
      this.taskID = response.task
      this.$router.push("/result?id=" + this.taskID)
      this.queryStatus()
    },
    reset: function () {
      this.$router.push("/")
      this.$router.go()
    },

    execute: function () {
      this.step = 2
      switch (this.params.mode) {
        case "set": {
          this.$http.validate_set(this.params.targetID, this.params.target, this.params.runs, this.params.replace, this.params.distance, this.params.background, this.params.type, this.params.sigCont, this.params.mail, this.params.sigContTargets).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break;
        }
        case "network": {
          if(!this.params.referenceID) {
            this.$http.validate_subnetwork(this.params.targetID, this.params.target, this.params.runs, this.params.replace, this.params.distance, this.params.background, this.params.network, this.params.type, this.params.sigCont, this.params.mail, this.params.sigContTargets).then(response => {
              this.saveTaskId(response)
            }).catch(() => {
              this.error = true
            })
          }else{
            this.$http.validate_subnetwork_set(this.params.targetID, this.params.target, this.params.referenceID, this.params.reference,this.params.runs, this.params.replace, this.params.distance, this.params.background, this.params.network, this.params.type, this.params.sigCont, this.params.mail, this.params.sigContTargets).then(response => {
              this.saveTaskId(response)
            }).catch(() => {
              this.error = true
            })
          }
          break;
        }
        case "id-set": {
          this.$http.validate_id_set(this.params.targetID, this.params.target, this.params.referenceID, this.params.reference, this.params.runs, this.params.replace, this.params.enriched, this.params.distance, this.params.background, this.params.type, this.params.sigCont, this.params.mail, this.params.sigContTargets).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break
        }
        case "set-set": {
          this.$http.validate_set_set(this.params.targetID, this.params.target, this.params.referenceID, this.params.reference, this.params.runs, this.params.replace, this.params.enriched, this.params.distance, this.params.background, this.params.type, this.params.sigCont, this.params.mail, this.params.sigContTargets).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break
        }
        case "cluster": {
          this.$http.validate_cluster(this.params.targetID, this.params.target, this.params.runs, this.params.replace, this.params.distance, this.params.background, this.params.type, this.params.sigCont, this.params.mail, this.params.sigContTargets).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
        }
      }
    }

  }

}
</script>

<style scoped lang="sass">

</style>