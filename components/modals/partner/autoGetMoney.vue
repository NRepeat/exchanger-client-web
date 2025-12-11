<template>
  <div class="modal-mask">
    <div class="modal-wrapper ">
      <div class="modal-container partner-listOrder-modal">
        <div class="modal-header">
          <span class="btn_close" @click.self="$emit('close')">×</span>

          <slot name="header">
            <h3>История выводов</h3>
          </slot>
        </div>
        <div class="zayvki-table">
          <div class="modal-body">
            <slot>
              <table>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>{{ $t("page.user.order.getting") }}</th>
                    <th>{{ $t("page.user.order.status") }}</th>
                    <th>{{ $t("page.user.order.date") }}</th>
                    <th>{{ $t("page.user.order.action") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in history" :key="order._id">
                    <td>
                      <span :style="{background: status[order.status].color}" class="status new-zayvka--marker__v" />
                      {{ order.uid }}
                    </td>

                    <td>
                      <div class="table--row">
                        <img :src="$rest.fsPath + $rest.unpackImg(order.route.to.image.files).small.url" alt="" />
                        <p>
                          <span class="qt">{{ order.outAmount }} {{ order.route.to.symbol }}</span>
                          <span class="currency">{{ order.route.to.name }}</span>
                        </p>
                      </div>
                    </td>
                    <td>
                      <div class="status--row">
                        <span :style="{background: status[order.status].color}" class="status new-zayvka--marker" />
                        <span class="status new-zayvka">{{ $t("ui.order.status." + order.status) }}</span>
                      </div>
                    </td>
                    <td>{{ $moment(order.createdAt).format("DD.MM.YYYY - HH:mm") }}</td>
                    <td class="text-center">
                      <nuxt-link
                        v-if="order.uid && order.secret"
                        :to="localePath('/partnerOrder/' + order.uid + '/' + order.secret + '/')"
                        class="view"
                        tag="button"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </slot>
          </div>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <div>
              <pagination
                v-if="pagination"
                :current-page="current_page"
                :total-pages="total_pages"
                class="paginationOrder"
                @page-changed="getListPartnerOrder({page: $event})"
              />
              <div v-else>
                {{ $t("page.user.order.noOrders") }}
              </div>
            </div>
            <div class="btn_position">
              <a class="modal-default-button ok_btn" @click="$emit('close')">
                {{ $t("page.user.order.closeBtn") }}
              </a>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pagination from "~/components/pagination";

import {mapActions, mapGetters} from "vuex";

export default {
  components: {pagination},
  props: {pagination: {type: Boolean, default: true}, limit: {type: Number, default: 999}},

  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      history: "historyOrderPartner/history",
      load: "historyOrderPartner/load",
      errorData: "historyOrderPartner/errorData",
      status: "historyOrderPartner/status",
      total_pages: "historyOrderPartner/getTotalPages",
      current_page: "historyOrderPartner/getCurrentPage"
    })
  },
  async created() {
    await this.getListPartnerOrder();
  },

  methods: {
    ...mapActions({
      getListPartnerOrder: "historyOrderPartner/getListPartnerOrder"
    })
  }
};
</script>
<style lang="scss">
.partner-listOrder-modal {
  max-width: 800px !important;
  padding: 25px 15px !important;
}

.paginationOrder {
  li {
    margin: 8px;
    border: none;
    min-width: auto;
    flex-basis: auto;
    padding: inherit;
  }
}
</style>
