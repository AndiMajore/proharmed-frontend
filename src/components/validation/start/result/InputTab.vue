<template>
  <div>
    <div style="display:flex;">
      <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Data
      </v-subheader>
      <v-tooltip top>
        <template v-slot:activator="{attrs, on}">
          <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                 style="justify-self: flex-end; margin-left: auto; margin-right: 0; top: 10px">
            <v-icon>fas fa-download</v-icon>
          </v-btn>
        </template>
        <div>Download all files as .zip</div>
      </v-tooltip>
    </div>
    <v-container v-if="input" style="margin-top:16px; margin-bottom: 32px">
      <v-row justify="center">
        <v-col cols="12" lg="4" md="6" class="flex_content_center">
          <div v-if="mode==='cluster'">
            <b>Clusterings</b>
            <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>{{ input.target_id }}</th>
                  <th>cluster</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="tar in input.target" :key="'cluster'+tar.id">
                  <td style="margin:4px">{{ tar.id }}</td>
                  <td style="margin:4px">{{ tar.cluster }}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div v-else>
            <b>Targets</b>
            <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>{{ input.target_id[0].toUpperCase() + input.target_id.substring(1) }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="tar in input.target" :key="'set'+tar">
                  <td style="margin:4px">{{ tar }}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
        <v-col v-if="input.reference_id" cols="12" lg="4" md="6" class="flex_content_center">
          <div>
            <b>Reference{{ typeof input.reference === 'string' ? '' : 's' }}</b>
            <v-simple-table dense style="max-height: 300px; overflow-y: scroll;">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>{{ input.reference_id }}</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="typeof input.reference !== 'string'">
                  <tr v-for="ref in input.reference" :key="'ref'+ref">
                    <td style="margin:4px">{{ ref }}</td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td style="margin:4px">{{ input.reference }}</td>
                  </tr>
                </template>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
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
      <template v-if="type==='gene'">
        <v-divider></v-divider>
        <div style="display:flex;">
          <v-subheader style="justify-self: center; margin-left: auto; margin-top:32px; margin-right: auto">
            External resources
          </v-subheader>
        </div>
        <v-container>
          <v-row justify="center" v-if="type==='gene'">
            <v-col :cols="3" style=" margin:16px">
              <b>Functional enrichment (g:Profiler)</b>
              <v-container v-if="mode==='cluster'">
                <v-row justify="center">
                  <v-col cols="12">
                    <v-tooltip right>
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.target.map(e=>e.id))" target="_blank">All</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all
                        target
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                    <v-tooltip right v-for="cluster in getClusterNames(input.target)"
                               :key="cluster+'_gprofiler'">
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.target.filter(e=>e.cluster===cluster).map(e=>e.id))"
                             target="_blank">{{ cluster }}</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all
                        {{ cluster }} cluster
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-else>
                <v-row justify="center">
                  <v-col cols="12" class="flex_content_center">
                    <v-tooltip right>
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.target)" target="_blank">Targets</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                    <v-tooltip right v-if="input.reference">
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.reference)" target="_blank">References</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "InputTab",
  props: {
    zips: Array,
    input: Object,
    mode: String,
    type: String,
    taskID:String,
    idMap: Object,
    mobile: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    getZIP: function (name) {
      return this.zips.filter(zip => zip.includes(name))[0]
    },
    downloadFile: function (file) {
      this.$emit('downloadEvent', file)
    },
    isMobile: function () {
      return this.mobile
    },
    getGProfilerUrl: function (list) {
      const queryString = list.join('%0A');
      const url = 'http://biit.cs.ut.ee/gprofiler/gost?' +
          'organism=hsapiens&' +
          `query=${queryString}&` +
          'ordered=false&' +
          'all_results=false&' +
          'no_iea=false&' +
          'combined=false&' +
          'measure_underrepresentation=false&' +
          'domain_scope=annotated&' +
          'significance_threshold_method=g_SCS&' +
          'user_threshold=0.05&' +
          'sources=GO:MF,GO:CC,GO:BP,KEGG,TF,REAC,MIRNA,HPA,CORUM,HP,WP'
      return url
    },
    downloadInput: function () {
      this.download('digest_' + this.taskID + "_input.json", JSON.stringify(this.input))
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
    getIDType: function (id) {
      for (let idType of Object.keys(this.idMap)) {
        if (this.idMap[idType].map(e => e.value).includes(id)) {
          return idType
        }
      }
      return undefined
    },
    getClusterNames: function (clustering) {
      const uniq = []
      clustering.map(e => e.cluster).forEach(e => {
        if (uniq.indexOf(e) === -1)
          uniq.push(e)
      })
      return uniq
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