<template>
  <div :class="isPage?'contact-main-item':'contact-main-item-page'">
    <h4 v-if="isFooter">{{ $t("ui.footer.support.title") }}</h4>
    <div>
      <div v-for="cont in info" :key="cont.id" class="contact-main-mail">
        <div :class="{'footer-icon': isFooter}" class="contact-main-icon">
          <img :src="$rest.urlImg(cont.image).big" alt=""/>
        </div>
        <div>
          <span>{{ cont.name }}</span>
          <a
            v-if="cont.link && cont.link !== 'null' && cont.link !== 'false'"
            :style="{color: color}"
            :href="cont.link"
            target="_blank"
            style="display: block;"
            v-html="cont.value"
          />

          <p v-else :style="{color: color}" v-html="cont.value"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: {
    color: {
      type: String,
      default: "#fff"
    },
    isFooter: {
      type: Boolean,
      default: false
    },
    isPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters("contacts", {
      info: "getData",
      load: "getLoad"
    })
  }
};
</script>
