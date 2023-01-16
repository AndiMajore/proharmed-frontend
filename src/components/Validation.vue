<template>
  <div>
    <v-card
        :style="{'background-color': '#444444', width: '100%', padding: mobile ? '16px' :'16px 32px', display: 'flex'}">
      <div style="width:32%; justify-content: flex-start">
        <picture>
          <img :src="getLogoPath()" type="image/png" width="45%">
        </picture>
      </div>
      <div style="width: 60%; justify-content: flex-end; margin-left: auto; margin-right: 0">
        <div style=" height: 100%;display:flex;">
          <p :style="{'font-size': mobile ? '1rem' : '1.3rem', color: '#ffffff', 'align-self': 'flex-end', 'margin-top': 'auto', 'margin-bottom': 0}">
            {{ taglineText }}</p>
        </div>
      </div>

    </v-card>
    <div v-if="step===0">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center; margin-top:32px">
        <v-subheader :style="{'font-size': mobile ? '1.4rem' : '1.5rem'}">Harmonize your data now!
        </v-subheader>
      </div>
    </div>
    <Selection v-if="step===0" @filterEvent="startConfiguration" @remapEvent="startConfiguration"
               @reduceEvent="startConfiguration" @orthoEvent="startConfiguration" :mobile="mobile"></Selection>
    <template v-if="step===1 && mode">
      <ConfigurationFilter @applyFilterEvent="runFilter" @resetEvent="resetValidation" v-if="mode==='filter'" :mode="mode"
                           :organism-list="organismList"></ConfigurationFilter>
      <ConfigurationRemap @applyFilterEvent="runRemap"  @resetEvent="resetValidation" v-if="mode==='remap'" :mode="mode"
                          :organism-list="organismList" :mode-list="modeList"></ConfigurationRemap>
      <ConfigurationReduce @applyFilterEvent="runReduce"  @resetEvent="resetValidation" v-if="mode==='reduce'" :mode="mode"
                           :organism-list="organismList" :mode-list="reduceModeList"></ConfigurationReduce>
      <ConfigurationOrtho @applyFilterEvent="runOrtho"  @resetEvent="resetValidation" v-if="mode==='ortho'" :mode="mode"
                          :organism-list="organismList"></ConfigurationOrtho>
      <ConfigurationIntersect @applyFilterEvent="runIntersect"  @resetEvent="resetValidation" v-if="mode==='intersect'" :mode="mode"
                             :organism-list="organismList"></ConfigurationIntersect>
      <ConfigurationNetwork @applyFilterEvent="runNetwork"  @resetEvent="resetValidation" v-if="mode==='network'" :mode="mode" :id-space-list="idSpaceList"></ConfigurationNetwork>
    </template>
    <Results v-if="step===2" @resetEvent="resetValidation" :params="params" :mobile="mobile"></Results>
    <template v-if="step===0">
      <div style="display: flex; justify-content: center; margin-top: 32px;">
        <v-subheader :style="{'font-size': mobile ? '1.4rem' : '1.5rem'}">How does MeSIdHa work?
        </v-subheader>
      </div>
      <div
          style="width: 90%;text-align: justify; display: flex; justify-self: center; margin: 16px auto 16px;color: #484848">
        <template>
          <picture class="white--text align-end" style="display: flex; justify-content: center; width: 100%">
            <img :src="getIllustration()" type="image/png" width="80%">
          </picture>
        </template>
      </div>
    </template>
  </div>

</template>

<script>

import Selection from "@/components/validation/Selection";
import Results from "@/components/validation/Results";
import ConfigurationFilter from "@/components/validation/start/configuration/ConfigurationFilter.vue";
import ConfigurationRemap from "@/components/validation/start/configuration/ConfigurationRemap.vue";
import ConfigurationReduce from "@/components/validation/start/configuration/ConfigurationReduce.vue";
import ConfigurationOrtho from "@/components/validation/start/configuration/ConfigurationOrtho.vue";
import ConfigurationNetwork from "@/components/validation/start/configuration/ConfigurationNetwork.vue";
import ConfigurationIntersect from "@/components/validation/start/configuration/ConfigurationIntersect.vue";

export default {


  name: "Validation",

  components: {
    Results,
    ConfigurationFilter,
    ConfigurationRemap,
    ConfigurationReduce,
    ConfigurationOrtho,
    ConfigurationNetwork,
    ConfigurationIntersect,
    Selection,
  },

  data() {
    return {
      taglineText: 'MeSIdHa is great and all...',
      step: 0,
      mode: undefined,
      result: undefined,
      params: {},
      mobile: this.isMobile(),
      idSpaceList:[
        'symbol','entrez','ensembl','uniprot'
      ],
      organismList: [
        'human', 'rat', 'mouse', 'rabbit'
      ],
      modeList: [
        'all', 'fasta', 'uniprot', 'uniprot_primary', 'uniprot_one'
      ],
      reduceModeList:[
        'ensembl',
        'HGNC',
        'mygeneinfo',
        'enrichment'
      ]
    }
  },

  created() {
    if (this.$route.query.id)
      this.step = 2
  },

  methods: {
    isMobile: function () {
      let check = false;
      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    getIllustration: function () {
      return this.$config.STATIC_PATH + "assets/MeSIdHa.png"
    },

    getLogoPath: function () {
      return this.$config.STATIC_PATH + "assets/MeSIdHa_icon.png"
    },

    startConfiguration: function (data) {
      this.step = 1
      this.mode = data.mode
    },
    resetValidation: function () {
      this.step = 0
      this.result = undefined;
      this.mode = undefined
      this.params = {}
    },

    runFilter: function (payload) {
      this.$http.runFilter(payload).then(response => {
        this.saveTaskResponse(response)
        this.step = 2
      })
    },

    runRemap: function (payload) {
      this.$http.runRemap(payload).then(response => {
        this.saveTaskResponse(response)
        this.step = 2
      })
    },

    runReduce: function (payload) {
      this.$http.runReduce(payload).then(response => {
        this.saveTaskResponse(response)
        this.step = 2
      })
    },

    runOrtho: function (payload) {
      this.$http.runOrtho(payload).then(response => {
        this.saveTaskResponse(response)
        this.step = 2
      })
    },

    runNetwork: function(payload){
      this.$http.runNetwork(payload).then(response=>{
        this.saveTaskResponse(response)
        this.step = 2
      })
    },
    runIntersect: function (payload){
      this.$http.runIntersect(payload).then(response=>{
        this.saveTaskResponse(response)
        this.step = 2
      })
    },


    saveTaskResponse: function (response) {
      if (response.data.uid) {
        this.$router.push("/result?id=" + response.data.uid)
      }
    }
  },


}
</script>

<style scoped lang="scss">

$img-preload-filter: blur(2px) !default;

</style>
