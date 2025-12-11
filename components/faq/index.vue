<template>
  <div>
    <div class="faq-top-wr">
      <div class="container">
        <h1>{{ $t("page.faq.title") }}</h1>
        <div class="faq-top">
          <ul>
            <li>
              <a @click="filter.group = ''">
                <img src="~assets/img/text-document.svg" alt="" />
                {{ $t("page.faq.all") }}
              </a>
            </li>
            <li v-for="gr in filteredGroups" :key="gr.id">
              <a @click="filter.group = gr.groupName">
                <img src="~assets/img/text-document.svg" alt="" />
                {{ gr.groupName }}
              </a>
            </li>
          </ul>
          <form action="#">
            <div class="form-faq-search">
              <input v-model="filter.search" :placeholder="$t('page.faq.search')" type="search" />
              <input type="submit" value="" />
            </div>
          </form>
        </div>
      </div>
    </div>
    <transition name="faded">
      <loader v-if="!load" />
    </transition>
    <div :style="load ? {} : {opacity: '0.5'}" class="faq">
      <div v-if="info.length" class="container">
        <div class="faq-qst">
          <ul>
            <item
              v-for="faq in info"
              :style="faq.title && load ? {} : {minHeight: '71px', borderRadius: '5px'}"
              :content="faq.content"
              :title="faq.title"
              :key="faq._id"
            />
          </ul>
        </div>
        <pagination :current-page="current_page" :total-pages="total_pages" @page-changed="filter.page = $event" />
      </div>
      <div v-else class="text-center">{{ $t("page.faq.no_info") }}</div>
    </div>
  </div>
</template>
<script>
import pagination from "~/components/pagination";
import {mapActions, mapGetters} from "vuex";
import item from "./item";

export default {
  components: {pagination, item},
  data() {
    return {
      filter: {
        group: this.$route.query.group || "",
        search: this.$route.query.search || "",
        page: this.$route.query.page || 1,
        lang: this.$root.$i18n.locale || "en"
      }
    };
  },
  computed: {
    filteredGroups() {
      return this.groups && this.groups.filter(group => this.$root.$i18n.locale === group.lang);
    },
    ...mapGetters({
      info: "faq/getData",
      groups: "faq/getGroups",
      langs: "faq/getLangs",
      total_pages: "faq/getTotalPages",
      current_page: "faq/getCurrentPage",
      load: "faq/getLoad"
    }),
    lang() {
      return this.$root.$i18n.locale;
    }
  },
  watch: {
    filter: {
      deep: true,
      handler() {
        let query = {};
        Object.keys(this.filter).forEach(key =>
          this.filter[key] !== "" && this.filter[key] !== 1 && key !== "lang" ? (query[key] = this.filter[key]) : ""
        );
        this.$router.push({query});
        this.getFaqFull(this.filter);
      }
    },
    lang() {
      this.filter.group = "";
      this.filter.lang = this.lang;
    }
  },
  created() {
    this.getFaqFull(this.filter);
  },
  methods: {
    ...mapActions({
      getFaqFull: "faq/getFaqFull"
    })
  }
};
</script>
