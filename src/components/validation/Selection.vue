<template>
  <v-container style="padding-bottom: 32px">
    <v-row justify="center">
      <v-col cols="10" md="6">
        <TypeCard title="Filter" text="Filter protein IDs" mode="filter" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('set', false)" :fallback_image="getCardImage('set', 'gene', true)">
        </TypeCard>
      </v-col>
      <v-col cols="10" md="6">
        <TypeCard title="Remap" text="Remap gene names" mode="remap" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('remap', false)" :fallback_image="getCardImage('set', 'gene', true)">
        </TypeCard>
      </v-col>
      <v-col cols="10" md="6">
        <TypeCard title="Reduce" text="Reduce gene names" mode="reduce" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('reduce', false)" :fallback_image="getCardImage('set', 'gene', true)">
        </TypeCard>
      </v-col>
      <v-col cols="10" md="6">
        <TypeCard title="Map orthologs" text="Map orthologs" mode="ortho" @startEvent="startEvent" :mobile="isMobile()"
                  :image="getCardImage('ortho', false)" :fallback_image="getCardImage('set', 'gene', true)">
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
    getCardImage: function (mode, fallback) {
      this.$config.STATIC_PATH + "assets/" + mode + "_" + (fallback ? ".png" : ".avif")
      return this.$config.STATIC_PATH + "assets/img.png"
      // return this.$config.STATIC_PATH + "assets/" + mode + "_" + type + (fallback ? ".png":".avif")
    },
    startEvent: function (data) {
      this.$emit("filterEvent", data)
    },
  }
}
</script>

<style scoped>

</style>
