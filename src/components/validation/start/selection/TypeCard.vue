<template>
  <v-card :style="{width:'100%', margin: mobile ? '' : '', 'margin-bottom':'0', height: '100%',padding: mobile ? '4px' :''}">
    <v-card-title :style="{'font-size' : mobile ? '1.2rem' : '', 'margin-bottom' : mobile ? '0px' : '2px', 'padding-bottom': '0'}">
      {{ title }}
    </v-card-title>
    <v-card-subtitle v-if="text" :style="{'font-size': mobile ? '0.8rem' : '0.9rem', 'margin-bottom': '8px', 'white-space': 'normal', 'padding-top': '0'}">
      {{ text }}
    </v-card-subtitle>
    <picture class="white--text align-end" style="width: 100%">
      <img alt="For safari users" :src="image" :style="{margin: isMobile()? '4px 15% 8px' : '8px 15% 24px', position: 'relative', width: '70%'}">
    </picture>
    <div style="display: flex; justify-content: center; margin-bottom: 8px">
      <v-btn variant="flat" color="primary" @click="$emit('startEvent',{mode:mode})" rounded style="font-size: smaller">
        <v-icon start icon="fa:fas fa-play"></v-icon>
        Run
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "TypeCard",
  props: {
    title: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    image_width: {
      type: String,
      default:"45%"
    },
    mobile: {
      type: Boolean,
      default: false,
    }
  },
  created() {
  },

  methods:{
    isMobile: function(){
      return this.mobile
    },
  }
}
</script>

<style scoped>

</style>
