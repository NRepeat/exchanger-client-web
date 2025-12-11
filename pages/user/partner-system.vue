<template>
  <div v-if="info" class="container api">
    <div class="text-center">
      <h1>{{ $t("page.user.nav.profile") }}</h1>
    </div>
    <div class="partners-program__main">
      <user/>
      <div class="partners-program">
        <div class="container-aff">

          <h2 class="title">
            {{ $t("page.partners.system.affiliate_program") }}
          </h2>
          <ul>
            <li>
              <div class="text-center">
                <p class="partners-program-title">{{ $t("page.partners.system.available_withdraw") }} :</p>
                <p class="partners-program-cost">
                  {{ toFix(info.affiliate.balance.usd, 3) }}
                  <span>USD</span>
                </p>
                <div>
                  <button class="btn btn-submit" @click="get_money = true">
                    {{ $t("page.partners.system.withdraw_funds") }}
                  </button>
                  <transition name="modal">
                    <getMoney v-if="get_money" @close="get_money = false"/>
                  </transition>
                </div>
                <div>
                  <button class="btn btn-look" @click="auto_get_money = true">
                    {{ $t("page.partners.system.history") }}
                  </button>
                  <autoGetMoney v-if="auto_get_money" @close="auto_get_money = false"/>
                </div>
              </div>
            </li>
            <li>
              <div class="text-center">
                <p class="partners-program-title">{{ $t("page.partners.system.my_bet") }}:</p>
                <p class="partners-program-cost">
                  {{ info.affiliate.rate }}
                  <span v-if="info.affiliate.type === 'byAmount'">% {{ $t("page.partners.system.from_the") }}</span>
                  <span v-if="info.affiliate.type === 'byServiceFee'">
                    % {{ $t("page.partners.system.from_profit") }}
                  </span>
                </p>
                <div>
                  <p>
                    <span>{{ $t("page.partners.system.total_received") }}:</span>
                    <b>{{ toFix(info.affiliate.totalReceived.usd, 3) }} USD</b>
                  </p>
                </div>
                <div>
                  <button class="btn btn-look" @click="show_about = true">
                    {{ $t("page.partners.system.more") }}
                  </button>
                  <about v-if="show_about" @close="show_about = false"/>
                </div>
              </div>
            </li>
            <li>
              <div class="text-center">
                <p class="partners-program-title">
                  Discount:
                </p>
                <p class="partners-program-cost">
                  {{ toFix(info.affiliate.discount, 3) }}
                  <span>%</span>
                </p>
                <div>
                  <p>
                    <b>#</b>
                  </p>
                </div>
                <div>
                  <button class="btn btn-look" @click="show_change_rate = true">
                    {{ $t("page.partners.system.change_rate") }}
                  </button>
                  <changeRate v-if="show_change_rate" @close="show_change_rate = false"/>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="ref-link ">
        <div class="container-aff">
          <div class="ref-link-item ">
            <div class="ref-link-title">
              <h2 class="title">{{ $t("page.partners.system.referral_link") }}:</h2>
              <p>
                {{ $t("page.partners.system.you_can_text") }}
              </p>
            </div>

            <div class="ref-link-list">
              <div>
                <p>{{ $t("page.partners.system.your_affiliate_link") }}:</p>
                <label>
                  <input class="current-link" :value="$rest.baseUrl + '/ref/' + info.affiliate.link + '/'" type="text"
                         placeholder="..." disabled/>
                  <span @click="copy($rest.baseUrl + '/ref/' + info.affiliate.link + '/')">
                        <img src="~assets/img/copy-documents-option-w.svg" alt/>
                      </span>
                </label>
              </div>
              <div v-for="localeOne in $i18n.locales" :key="'locales-ref'+localeOne.code">
                <p>{{ $t("page.partners.system.your_affiliate_link") }} ({{localeOne.name}}):</p>
                <label>
                  <input class="current-link" :value="$rest.baseUrl + '/ref/' + info.affiliate.link + '/' + localeOne.code + '/'" type="text"
                         placeholder="..." disabled/>
                  <span @click="copy($rest.baseUrl + '/ref/' + info.affiliate.link + '/' + localeOne.code + '/')">
                        <img src="~assets/img/copy-documents-option-w.svg" alt/>
                      </span>
                </label>
              </div>
              <div>
                <p>{{ $t("page.partners.system.export_txt") }}:</p>
                <label>
                  <input :value="`${$rest.baseUrl}/service/export/txt/${info.affiliate.rateKey ? info.affiliate.rateKey+'/': ''}`" type="text" placeholder="..." disabled/>
                  <span @click="copy(`${$rest.baseUrl}/service/export/txt/${info.affiliate.rateKey ? info.affiliate.rateKey+'/': ''}`)">
                        <img src="~assets/img/copy-documents-option.svg" alt/>
                      </span>
                </label>
              </div>
              <div>
                <p>{{ $t("page.partners.system.export_json") }}:</p>
                <label>
                  <input :value="`${$rest.baseUrl}/service/export/json/${info.affiliate.rateKey ? info.affiliate.rateKey+'/': ''}`" type="text" placeholder="..." disabled/>
                  <span @click="copy(`${$rest.baseUrl}/service/export/json/${info.affiliate.rateKey ? info.affiliate.rateKey+'/': ''}`)">
                        <img src="~assets/img/copy-documents-option.svg" alt/>
                      </span>
                </label>
              </div>
              <div>
                <p>{{ $t("page.partners.system.export_xml") }}:</p>
                <label>
                  <input :value="`${$rest.baseUrl}/service/export/xml/${info.affiliate.rateKey ? info.affiliate.rateKey+'/': ''}`" type="text" placeholder="..." disabled/>
                  <span @click="copy(`${$rest.baseUrl}/service/export/xml/${info.affiliate.rateKey ? info.affiliate.rateKey+'/': ''}`)">
                        <img src="~assets/img/copy-documents-option.svg" alt/>
                      </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="zayvki">
        <div class="container-aff zayvki-item">
          <div class="zayvki-filter">
            <div class="zayvki-filter--top">
              <h2 class="title">
                {{ $t("page.partners.system.affiliate_rewards") }}
              </h2>
            </div>
          </div>
          <div class="zayvki-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{{ $t("page.partners.system.profit") }}</th>
                  <th>{{ $t("page.partners.system.exchange") }}</th>
                  <th/>
                  <th>{{ $t("page.user.profile.requests.date") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in history" :key="order._id">
                  <td>
                    <div class="table--row">
                      <div class="table--row">
                        <div class="table--row">
                          <p>
                            <span class="qt">{{ order.uid }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="table--row">
                      <div class="table--row">
                        <div class="table--row">
                          <p>
                            <span class="qt">+ {{ order.partnerFee.amountInUSD }} USD</span>
                            <span class="currency">
                                  {{ order.partnerFee.amountOut }}
                                  {{ order.route.to.name }}
                                </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="table--row">
                      <div class="table--row">
                        <img :src="$rest.urlImg(order.route.from.image).medium" alt/>
                        <p>
                          <span class="qt">{{ order.route.from.name }}</span>
                          <span class="currency">{{ order.route.from.symbol }}</span>
                        </p>
                      </div>
                      <dd><img src="~assets/img/right.svg" alt="right"/>на</dd>
                    </div>
                  </td>

                  <td>
                    <div class="table--row">
                      <img :src="$rest.urlImg(order.route.to.image).medium" alt/>
                      <p>
                        <span class="qt">{{ order.outAmount }} {{ order.route.to.symbol }}</span>
                        <span class="currency">{{ order.route.to.name }}</span>
                      </p>
                    </div>
                  </td>

                  <td>
                    <div class="table--row">
                      <p>
                        <span class="qt">{{ $moment(order.createdAt).format("DD.MM.YYYY") }}</span>
                        <span class="currency">{{ $moment(order.createdAt).format("HH:mm:ss Z") }}</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination
              v-if="pagination"
              :current-page="current_page"
              :total-pages="total_pages"
              @page-changed="getList($event)"
            />
            <div v-else>
              {{ $t("page.user.order.noOrders") }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    <div style="display: none">-->
    <!--      <div>-->
    <!--        <p>{{ $t("page.partners.system.technical_partner") }} :</p>-->
    <!--      </div>-->
    <!--      <p style="max-width: 620px;display: inline-block;">-->
    <!--        {{ $t("page.partners.system.user_guide") }}-->
    <!--      </p>-->
    <!--    </div>-->
    <!--    <div class="partners-program">-->
    <!--      <div class="container">-->
    <!--        <h2 class="title">-->
    <!--          {{ $t("page.partners.system.affiliate_program") }}-->
    <!--        </h2>-->
    <!--        <ul>-->
    <!--          <li>-->
    <!--            <div class="text-center">-->
    <!--              <p class="partners-program-title">{{ $t("page.partners.system.available_withdraw") }} :</p>-->
    <!--              <p class="partners-program-cost">-->
    <!--                {{ toFix(info.affiliate.balance.usd, 3) }}-->
    <!--                <span>USD</span>-->
    <!--              </p>-->
    <!--              <div>-->
    <!--                <button class="btn btn-submit" @click="get_money = true">-->
    <!--                  {{ $t("page.partners.system.withdraw_funds") }}-->
    <!--                </button>-->
    <!--                <transition name="modal">-->
    <!--                  <getMoney v-if="get_money" @close="get_money = false" />-->
    <!--                </transition>-->
    <!--              </div>-->
    <!--              <div>-->
    <!--                <button class="btn btn-look" @click="auto_get_money = true">-->
    <!--                  {{ $t("page.partners.system.history") }}-->
    <!--                </button>-->
    <!--                <autoGetMoney v-if="auto_get_money" @close="auto_get_money = false" />-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            <div class="text-center">-->
    <!--              <p class="partners-program-title">{{ $t("page.partners.system.my_bet") }}:</p>-->
    <!--              <p class="partners-program-cost">-->
    <!--                {{ info.affiliate.rate }}-->
    <!--                <span v-if="info.affiliate.type === 'byAmount'">{{ $t("page.partners.system.from_the") }}</span>-->
    <!--                <span v-if="info.affiliate.type === 'byServiceFee'">{{ $t("page.partners.system.from_profit") }}</span>-->
    <!--              </p>-->
    <!--              <div>-->
    <!--                <p>-->
    <!--                  <span>{{ $t("page.partners.system.total_received") }}:</span>-->
    <!--                  <b>{{ toFix(info.affiliate.totalReceived.usd, 3) }} USD</b>-->
    <!--                </p>-->
    <!--              </div>-->
    <!--              <div>-->
    <!--                <button class="btn btn-look" @click="show_about = true">-->
    <!--                  {{ $t("page.partners.system.more") }}-->
    <!--                </button>-->
    <!--                <about v-if="show_about" @close="show_about = false" />-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            <div class="text-center">-->
    <!--              <p class="partners-program-title">-->
    <!--                Discount:-->
    <!--              </p>-->
    <!--              <p class="partners-program-cost">-->
    <!--                {{ toFix(info.affiliate.discount, 3) }}-->
    <!--                <span>%</span>-->
    <!--              </p>-->
    <!--              <div>-->
    <!--                <p>-->
    <!--                  <b>#</b>-->
    <!--                </p>-->
    <!--              </div>-->
    <!--              <div>-->
    <!--                <button class="btn btn-look" @click="show_change_rate = true">-->
    <!--                  {{ $t("page.partners.system.change_rate") }}-->
    <!--                </button>-->
    <!--                <changeRate v-if="show_change_rate" @close="show_change_rate = false" />-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="ref-link">-->
    <!--      <div class="container">-->
    <!--        <div class="ref-link-item form text-center">-->
    <!--          <h4 class="title">{{ $t("page.partners.system.referral_link") }}:</h4>-->
    <!--          <p style="max-width: 500px;display: inline-block;">-->
    <!--            {{ $t("page.partners.system.you_can_text") }}-->
    <!--          </p>-->
    <!--          <div>-->
    <!--            <p>{{ $t("page.partners.system.your_affiliate_link") }}:</p>-->
    <!--            <label>-->
    <!--              <input :value="$rest.baseUrl + '/ref/' + info.affiliate.link" type="text" placeholder="..." disabled />-->
    <!--              <span @click="copy($rest.baseUrl + '/ref/' + info.affiliate.link)">-->
    <!--                <img src="~assets/img/copy-documents-option.svg" alt />-->
    <!--              </span>-->
    <!--            </label>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <p>{{ $t("page.partners.system.export_txt") }}:</p>-->
    <!--            <label>-->
    <!--              <input :value="$rest.baseUrl + '/service/export/txt'" type="text" placeholder="..." disabled />-->
    <!--              <span @click="copy($rest.baseUrl + '/service/export/txt')">-->
    <!--                <img src="~assets/img/copy-documents-option.svg" alt />-->
    <!--              </span>-->
    <!--            </label>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <p>{{ $t("page.partners.system.export_json") }}:</p>-->
    <!--            <label>-->
    <!--              <input :value="$rest.baseUrl + '/service/export/json'" type="text" placeholder="..." disabled />-->
    <!--              <span @click="copy($rest.baseUrl + '/service/export/json')">-->
    <!--                <img src="~assets/img/copy-documents-option.svg" alt />-->
    <!--              </span>-->
    <!--            </label>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <p>{{ $t("page.partners.system.export_xml") }}:</p>-->
    <!--            <label>-->
    <!--              <input :value="$rest.baseUrl + '/service/export/xml'" type="text" placeholder="..." disabled />-->
    <!--              <span @click="copy($rest.baseUrl + '/service/export/xml')">-->
    <!--                <img src="~assets/img/copy-documents-option.svg" alt />-->
    <!--              </span>-->
    <!--            </label>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="container zayvki">-->
    <!--      <div class="zayvki-filter">-->
    <!--        <div class="zayvki-filter&#45;&#45;top">-->
    <!--          <h2 class="title">-->
    <!--            {{ $t("page.partners.system.affiliate_rewards") }}-->
    <!--          </h2>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="zayvki-table">-->
    <!--        <table>-->
    <!--          <thead>-->
    <!--            <tr>-->
    <!--              <th>ID</th>-->
    <!--              <th>{{ $t("page.partners.system.profit") }}</th>-->
    <!--              <th>{{ $t("page.partners.system.exchange") }}</th>-->
    <!--              <th />-->
    <!--              <th>{{ $t("page.user.profile.requests.date") }}</th>-->
    <!--            </tr>-->
    <!--          </thead>-->
    <!--          <tbody>-->
    <!--            <tr v-for="order in history" :key="order._id">-->
    <!--              <td>-->
    <!--                <div class="table&#45;&#45;row">-->
    <!--                  <div class="table&#45;&#45;row">-->
    <!--                    <div class="table&#45;&#45;row">-->
    <!--                      <p>-->
    <!--                        <span class="qt">{{ order.uid }}</span>-->
    <!--                      </p>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </td>-->
    <!--              <td>-->
    <!--                <div class="table&#45;&#45;row">-->
    <!--                  <div class="table&#45;&#45;row">-->
    <!--                    <div class="table&#45;&#45;row">-->
    <!--                      <p>-->
    <!--                        <span class="qt">+ {{ order.partnerFee.amountInUSD }} USD</span>-->
    <!--                        <span class="currency">-->
    <!--                          {{ order.partnerFee.amountOut }}-->
    <!--                          {{ order.route.to.name }}-->
    <!--                        </span>-->
    <!--                      </p>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </td>-->

    <!--              <td>-->
    <!--                <div class="table&#45;&#45;row">-->
    <!--                  <div class="table&#45;&#45;row">-->
    <!--                    <img :src="$rest.urlImg(order.route.from.image).medium" alt />-->
    <!--                    <p>-->
    <!--                      <span class="qt">{{ order.route.from.name }}</span>-->
    <!--                      <span class="currency">{{ order.route.from.symbol }}</span>-->
    <!--                    </p>-->
    <!--                  </div>-->
    <!--                  <dd><img src="~assets/img/right.svg" alt="right" />на</dd>-->
    <!--                </div>-->
    <!--              </td>-->

    <!--              <td>-->
    <!--                <div class="table&#45;&#45;row">-->
    <!--                  <img :src="$rest.urlImg(order.route.to.image).medium" alt />-->
    <!--                  <p>-->
    <!--                    <span class="qt">{{ order.outAmount }} {{ order.route.to.symbol }}</span>-->
    <!--                    <span class="currency">{{ order.route.to.name }}</span>-->
    <!--                  </p>-->
    <!--                </div>-->
    <!--              </td>-->

    <!--              <td>-->
    <!--                <div class="table&#45;&#45;row">-->
    <!--                  <p>-->
    <!--                    <span class="qt">{{ $moment(order.createdAt).format("DD.MM.YYYY") }}</span>-->
    <!--                    <span class="currency">{{ $moment(order.createdAt).format("HH:mm:ss Z") }}</span>-->
    <!--                  </p>-->
    <!--                </div>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--          </tbody>-->
    <!--        </table>-->
    <!--        <pagination-->
    <!--          v-if="pagination"-->
    <!--          :current-page="current_page"-->
    <!--          :total-pages="total_pages"-->
    <!--          @page-changed="getList($event)"-->
    <!--        />-->
    <!--        <div v-else>-->
    <!--          {{ $t("page.user.order.noOrders") }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import about from "~/components/modals/partner/about";
import changeRate from "~/components/modals/partner/changeRate";
import getMoney from "~/components/modals/partner/getMoney";
import autoGetMoney from "~/components/modals/partner/autoGetMoney";
import pagination from "~/components/pagination";
import user from "~/components/user";

export default {
  components: {
    pagination,
    user,
    about,
    getMoney,
    changeRate,
    autoGetMoney
  },
  props: {
    pagination: {type: Boolean, default: true},
    limit: {type: Number, default: 999}
  },
  data() {
    return {
      show_about: false,
      show_change_rate: false,
      get_money: false,
      auto_get_money: false,
      page: this.$route.query.group || 1
    };
  },
  computed: {
    ...mapGetters({
      status: "request/status",
      history: "room/history",
      load: "room/load",
      uLoad: "user/load",
      info: "user/info",
      current_page: "room/getCurrentPage",
      total_pages: "room/getTotalPages"
    })
  },
  created() {
    this.getList();
  },
  methods: {
    ...mapActions({
      getList: "room/getList",
      checkAuth: "user/checkAuth"
    }),
    copy(val) {
      navigator.clipboard.writeText(val);
      this.$store.dispatch("notify/add", {
            message: this.$t('modals.2fa.copied'),
            type: "success"
          });
    },
    modalOpenGetMoney() {
      console.log("getMoney", this.$refs.getMoney.open());
    },
    toFix(int, fix) {
      fix = Math.pow(10, fix);
      int = int * fix;
      return Math.floor(int) / fix;
    }
  },
  head() {
    return {
      title: this.$t("meta.partners_system.title")
    };
  }
};
</script>
