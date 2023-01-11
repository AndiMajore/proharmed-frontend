<template>
  <v-card :style="{width:'100%', margin: mobile ? '' : '8px', 'margin-bottom':'0', height: '100%',padding: mobile ? '4px' :''}">
    <v-card-title :style="{'font-size' : mobile ? '1.2rem' : '', 'margin-bottom' : mobile ? '8px' :''}">{{title}}</v-card-title>
    <v-card-subtitle :style="{height: '52px', 'font-size' :mobile ? '1rem' :''}">{{text}}
    </v-card-subtitle>
    <picture class="white--text align-end" style="width: 100%">
      <source :srcset="image" type="image/avif" >
      <source :srcset="fallback_image" type="image/png" >
      <img alt="For safari users" :src="fallback_image" :style="{margin: isMobile()? '4px 15% 8px' : '8px 15% 48px', position: 'relative', width: '70%'}">
    </picture>
    <div style="display: flex; justify-content: center; margin-bottom: 8px">
      <v-btn depressed color="primary" @click="$emit('startEvent',{mode:mode})" rounded style="font-size: smaller">
        <v-icon left style="margin-right:4px ">fas fa-play</v-icon>
        Run
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "TypeCard",
  props: {
    title: String,
    text: String,
    image: String,
    mode: String,
    fallback_image: String,
    width:{
      type:String,
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
