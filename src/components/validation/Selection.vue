<template>
  <v-container style="padding-bottom: 32px">
    <v-row justify="center">
      <v-col cols="10" lg="3" sm="6">
        <TypeCard title="Filter" text="Filter protein IDs" mode="filter" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('filter')">
        </TypeCard>
      </v-col>
      <v-col cols="10" lg="3" sm="6">
        <TypeCard title="Remap" text="Remap gene names" mode="remap" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('remap')">
        </TypeCard>
      </v-col>
      <v-col cols="10" lg="3" sm="6">
        <TypeCard title="Reduce" text="Reduce gene names" mode="reduce" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('reduce')">
        </TypeCard>
      </v-col>
      <v-col cols="10" lg="3" sm="6">
        <TypeCard title="Map orthologs" text="Map orthologs" mode="ortho" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('ortho')">
        </TypeCard>
      </v-col>
      <v-col cols="6">
        <TypeCard title="Intersection analysis" text="Analyse intersections between proteomics datasets"
                  mode="intersect" :image="getCardImage('drugstone')" @startEvent="startEvent" :mobile="isMobile()">
        </TypeCard>
      </v-col>
      <v-col cols="6">
        <TypeCard title="Network integration" text="Use Drugst.One to integrate proteomics data into network space"
                  mode="drugstone" :image="getCardImage('drugstone')" @startEvent="startEvent" :mobile="isMobile()">
        </TypeCard>
      </v-col>
    </v-row>
  </v-container>


</template>

<script>
import TypeCard from "@/components/validation/start/selection/TypeCard";

export default {
  name: "Selection",
  components: {TypeCard},
  props: {
    mobile: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({}),


  created() {
    if (this.$route.fullPath !== "/")
      this.$router.push("/")
  },

  methods: {
    isMobile: function () {
      return this.mobile
    },
    getCardImage: function (mode) {
      return this.$config.STATIC_PATH + "assets/" + mode + ".png"
    },
    startEvent: function (data) {
      this.$emit("filterEvent", data)
    },
  }
}
</script>

<style scoped>

</style>
