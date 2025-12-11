<template>

  <div v-if="info" class="container ">
    <div class="text-center">
      <h1>{{ $t("page.user.nav.profile") }}</h1>
    </div>
    <div class="zayvki-main">
      <user/>
      <div class="zayvki-border">
        <div class="container-aff zayvki-item">

          <div class="zayvki-filter ">

            <div class="zayvki-filter--top">
              <h2 class="title">
                {{ $t("page.user.order.title") }}
              </h2>
              <div class="zayvki-filter--top__btn-group">
                <ul>
                  <li v-for="tab in tabs"
                      :key="tab.key"
                      @click="updateFilter({activeTab: tab.key})">
                    <a :class="tab.key === activeTab ? 'btn-filter btn-filter-blue' : 'btn-filter'">
                      {{ tab.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="zayvki-table">
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>{{ $t("page.user.order.giving") }}</th>
                  <th>{{ $t("page.user.order.getting") }}</th>
                  <th>{{ $t("page.user.order.status") }}</th>
                  <th>{{ $t("page.user.order.date") }}</th>
                  <th>{{ $t("page.user.order.action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in history" :key="order._id">
                  <td>
                    <span :style="{background: status[order.status].color}" class="status new-zayvka--marker__v"/>
                    {{ order.uid }}
                  </td>

                  <td>
                    <div class="table--row">
                      <div class="table--row">
                        <img :src="$rest.urlImg(order.route.from.image).medium" alt=""/>
                        <p>
                          <span class="qt">{{ order.inAmount }} {{ order.route.from.symbol }}</span>
                          <span class="currency">{{ order.route.from.name }}</span>
                        </p>
                      </div>
                      <dd><img src="~assets/img/right.svg" alt="right"/>to</dd>
                      <!--todo translate-->
                    </div>
                  </td>

                  <td>
                    <div class="table--row">
                      <img :src="$rest.urlImg(order.route.to.image).medium" alt=""/>
                      <p>
                        <span class="qt">{{ order.outAmount }} {{ order.route.to.symbol }}</span>
                        <span class="currency">{{ order.route.to.name }}</span>
                      </p>
                    </div>
                  </td>

                  <td>
                    <div class="status--row">
                      <span :style="{background: status[order.status].color}" class="status new-zayvka--marker"/>
                      <span class="status new-zayvka">{{ $t("ui.order.status." + order.status) }}</span>
                    </div>
                  </td>
                  <td>{{ $moment(order.createdAt).format("DD.MM.YYYY - HH:mm") }}</td>
                  <td class="text-center">
                    <nuxt-link
                      v-if="order.uid && order.secret"
                      :to="localePath('/order/' + order.uid + '/' + order.secret + '/')"
                      class="view"
                      tag="button"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination
              v-if="history.length > 0"
              :current-page="page"
              :total-pages="getTotalPages"
              @page-changed="updateFilter({page: $event})"
            />
            <div v-else>
              Orders not found
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import pagination from "~/components/pagination";
import user from "~/components/user";

export default {
  components: {pagination, user},
  props: {
    pagination: {type: Boolean, default: true}
  },
  data() {
    return {
      activeTab: "all",
      tabs: [
        {name: this.$t("page.user.order.all"), key: "all"},
        {name: this.$t("page.user.order.current"), key: "current"},
        {name: this.$t("page.user.order.doneTab"), key: "done"},
        {name: this.$t("page.user.order.deletedTab"), key: "deleted"}
      ],
      page: 1
    };
  },

  computed: {
    ...mapGetters({
      info: "user/info",
      history: "request/history",
      load: "request/load",
      status: "request/status",
      getCurrentPage: "request/getCurrentPage",
      getTotalPages: "request/getTotalPages"
    })
  },
  async created() {
    if (!this.info) {
      await this.checkAuth();
    }
    await this.getList({});
  },
  methods: {
    ...mapActions({
      checkAuth: "user/checkAuth",
      getList: "request/getList"
    }),
    async updateFilter(filterObject) {
      if (filterObject.activeTab) {
        this.page = 1;

        this.activeTab = filterObject.activeTab;
      }
      if (filterObject.page) {
        this.page = filterObject.page;
      }
      return this.getList({status: this.activeTab, page: this.page});
    }
  },
  head() {
    return {
      title: this.$t("meta.orders.title"),
      meta: [{description: this.$t("meta.orders.description")}, {keywords: this.$t("meta.orders.keywords")}]
    };
  }
};
</script>
