<template>
  <transition name="modal">
    <div class="modal-mask to-modal ">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header text-center">
            <span class="btn_close" @click.self="$emit('close')">×</span>

            <slot name="header">
              <h3>{{ $t("modals.partner.get_money.get_money") }}</h3>
            </slot>
          </div>

          <div v-if="load" class="modal-body">
            <slot v-if="getDataPartnerRoutes.length" name="body" action="" class="form">
              <div class="modals-block-inputs">
                <p v-if="to && !currentRoute.to.name" style="color:orange">
                  {{ $t("page.main.attention") }}
                </p>
                <div class="modals-block-inputs--item">
                  <label>
                    <span class="label">{{ $t("page.main.to.choose") }}</span>
                    <dropdown :close-on-click="true" class="dropper">
                      <template slot="btn">
                        <img
                          v-if="to.image"
                          :alt="to.name"
                          :src="$rest.fsPath + $rest.unpackImg(to.image.files).small.url"
                        />
                        {{ to.name }}
                        {{ to.symbol }}
                      </template>
                      <template slot="body">
                        <ul>
                          <li v-for="ro in toList" :key="ro.routeId" class="element-currency-pr" @click="to = ro.to">
                            <img
                              :alt="ro.to.name"
                              :src="$rest.fsPath + $rest.unpackImg(ro.to.image.files).small.url"
                            />
                            {{ ro.to.name }}
                            {{ ro.to.symbol }}
                          </li>
                        </ul>
                      </template>
                    </dropdown>
                  </label>
                </div>

                <div class="modals-block-inputs--item form-input">
                  <p>
                    <label>
                      <span class="label">{{ $t("modals.partner.get_money.amountInUsd") }}</span>
                      <input
                        id="ammrec3"
                        v-model="val1"
                        :style="{color: val1 === 'Error.' ? 'red' : ''}"
                        :placeholder="'0.00'"
                        type="text"
                        class="input"
                        @input="correctTo"
                      />
                    </label>
                  </p>
                </div>
                <div
                  v-for="field in currentRoute.to.fields"
                  :key="field.id"
                  class="modals-block-inputs--item form-input"
                >
                  <span
                    v-if="toValues[field._id] && !toValues[field._id].match(field.regexp)"
                    class="error"
                    style="color:red;"
                  >
                    {{ parseField(field.regexp_error)[$i18n.locale]  }}
                  </span>
                  <p>
                    <label>
                      <span class="label">{{ parseField(field.name)[$i18n.locale] }}</span>
                      <img class="card" src="~assets/img/card.svg" alt="img" />
                      <input
                        v-model="toValues[field._id]"
                        class="input-card"
                        :style="{border: borderToCss}"
                        :placeholder="parseField(field.placeholder)[$i18n.locale] "
                        type="text"
                      />
                    </label>
                  </p>
                </div>
                <div
                  v-for="field in currentRoute.fields"
                  :key="field.id"
                  class="modals-block-inputs--item form-input"
                >
                  <span
                    v-if="routeValues[field._id] && !routeValues[field._id].match(field.regexp)"
                    class="error"
                    style="color:red;"
                  >
                    {{ parseField(field.regexp_error)[$i18n.locale]  }}
                  </span>
                  <p>
                    <label>
                      <span class="label">{{ parseField(field.name)[$i18n.locale] }}</span>
                      <input
                        v-model="routeValues[field._id]"
                        class="input"
                        :style="{border: borderToCss}"
                        :placeholder="parseField(field.placeholder)[$i18n.locale] "
                        type="text"
                      />
                    </label>
                  </p>
                </div>
              </div>
              <div class="modals-block-data">
                <p v-if="Number(val2) > Number(currentRoute.rate.amount)" style="color:orange">
                  {{ $t("page.main.haven_t_reserve") }}
                  <button style="border-radius:5px;border:1px solid silver" @click="setVal2()">
                    {{ $t("page.main.correct") }}
                  </button>
                </p>
                <p>
                  {{ $t("page.main.to.reserve") }}
                  <b>{{ currentRoute.rate.amount }} {{ currentRoute.to.symbol }}</b>
                </p>
                <p>
                  {{ $t("page.main.to.rate") }}
                  <b>{{ currentRoute.rate.in }} : {{ currentRoute.rate.out }} {{ currentRoute.to.symbol }} </b>
                </p>
                <p>
                  {{ $t("modals.partner.get_money.youWillGet") }}
                  <b> {{ val2 }} {{ currentRoute.to.symbol }}</b>
                </p>
              </div>
              <div class="modals-block-btns text-center">
                <button
                  :style="{opacity: currentRoute.routeId ? 1 : 0.5}"
                  class="btn btn-submit"
                  @click.prevent="to && currentRoute.routeId && createOrder()"
                >
                  <span v-if="load">{{ $t("modals.partner.get_money.withdraw")+" "+ valout }}</span>
                  <loader v-else :responsive="true" width="50" height="50" />
                </button>
              </div>

              <div class="form-ruls text-center">
                <p>{{ $t("page.main.details.rules") }}</p>
              </div>
            </slot>

            <slot v-else name="body" action="" class="form">
              <br />
              <p>{{ $t("modals.partner.get_money.no_routes") }}</p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import Dropdown from "~/components/bp-vuejs-dropdown";
import {BigNumber} from "bignumber.js";

export default {
  components: {Dropdown},
  data() {
    return {
      errorRoutes: "",
      from: "",
      to: "",
      val2: 0,
      val1: "",
      amount: "",
      fromValues: {},
      toValues: {},
      routeValues: {},
      email: "",
      valid: 1,
      currentRoute: {
        from: {},
        rate: {
          parsers: {fromCurrency: {}, toCurrency: {}}
        },
        to: {}
      }
    };
  },

  computed: {
    ...mapGetters({
      getDataPartnerRoutes: "exchangePartner/getDataPartnerRoutes",
      load: "exchangePartner/getLoad",
      errorData: "exchangePartner/getErrorData"
    }),
    borderToCss() {
      if (this.field && (this.toValues[this.field._id] || this.toValues[this.field._id].match(this.field.regexp))) {
        return "1px solid red";
      }
      return "";
    },
    valout() {
      let a = Number(this.val1);
      if (!a && isNaN(a)) {
        a = 0;
      }
      if (!a) return "";
      return a + " USD";
    },
    borderRouterCss() {
      if (
        this.field &&
        (this.routeValues[this.field._id] || this.routeValues[this.field._id].match(this.field.regexp))
      ) {
        return "1px solid red";
      }
      return "";
    },
    toList() {
      let obj = {};
      return this.getDataPartnerRoutes
        .filter(el => {
          if (obj[el.to.xml]) {
            return false;
          } else {
            obj[el.to.xml] = true;
            return true;
          }
        })
        .map(el => {
          return {
            ...el,
            can: this.getDataPartnerRoutes.some(m => el.to.name === m.to.name)
          };
        })
        .sort((a, b) => (a.rate.amount < b.rate.amount ? 1 : -1));
    },

    matchedRoute() {
      return (
        this.getDataPartnerRoutes.find(el => this.to.name === el.to.name) || {
          rate: {},
          to: {}
        }
      );
    }
  },
  watch: {
    to: {
      deep: true,
      handler() {
        this.getPartnerRouteOne();
      }
    }
  },

  async created() {
    await this.getPartnerRoutes();
    let {to} = this.$route.query;
    if (!to && this.getDataPartnerRoutes && this.getDataPartnerRoutes[0]) {
      this.to = this.getDataPartnerRoutes[0].to;
    }
    if (!this.getDataPartnerRoutes || !this.getDataPartnerRoutes[0]) {
      this.errorRoutes = "Routes not found";
    }
    if (to) {
      this.to = {...this.getDataPartnerRoutes.find(el => el.to.xml === to).to};
    }
  },

  methods: {
    ...mapActions({
      getPartnerRoutes: "exchangePartner/getPartnerRoutes",
      createPartnerOrder: "exchangePartner/createPartnerOrder"
    }),
    parseField(string){
      try{
        return JSON.parse(string)
      }
      catch(e){
        return {
          en:string,
          [this.$i18n.locale]:string
        }
      }
    },
    setVal2() {
      this.val2 = Number(this.currentRoute.rate.amount);
      this.correctFrom();
    },
    correctFrom() {
      let coef = BigNumber(this.currentRoute.rate.out).dividedBy(this.currentRoute.rate.in) || 1;
      let num = BigNumber(this.val2 || 0)
        .plus(this.currentRoute.rate.outFeeAmount)
        .dividedBy(coef)
        .decimalPlaces(this.currentRoute.to.decimal || 2);
      if (num.lte(0)) return (this.val1 = 0);
      this.val1 = num;
    },
    correctTo() {
      let coef = BigNumber(this.currentRoute.rate.out).dividedBy(this.currentRoute.rate.in) || 1;

      let num = BigNumber(this.val1 || 0)
        .multipliedBy(coef)
        .minus(this.currentRoute.rate.outFeeAmount)
        .decimalPlaces(this.currentRoute.to.decimal || 2);
      if (num.lte(0)) return (this.val2 = 0);

      if (num.isGreaterThan(this.currentRoute.rate.amount)) {
        return (this.val2 = this.currentRoute.rate.amount);
      }

      this.val2 = num;
    },

    async getPartnerRouteOne() {
      let query = {};
      if (this.to.xml) {
        query.to = this.to.xml;
      }
      this.$router.push({query});
      const apiResult = await this.$rest.api("GET:user/exchanger/partner-route/get/one", {
        id: this.matchedRoute?this.matchedRoute.routeId:""
      });
      if (apiResult.success) {
        this.currentRoute = apiResult.data.route;
      }
    },
    async createOrder() {
      let {routeId} = this.currentRoute;

      if (
        this.currentRoute.to.fields.some(el => el.required && !this.toValues[el._id]) &&
        this.currentRoute.fields.some(el => el.required && !this.routeValues[el._id])
      )
        return this.$store.dispatch("notify/add", {
          message: this.$t("page.main.messages.checkFields"),
          type: "warning"
        });
      let toValues = Object.keys(this.toValues).map(el => ({
        key: el,
        value: this.toValues[el]
      }));

      let routeValues = Object.keys(this.routeValues).map(el => ({
        key: el,
        value: this.routeValues[el]
      }));
      let order = {
        routeId,
        toValues,
        routeValues,
        agreement: true,
        amount: this.val1
      };
      let res = await this.createPartnerOrder(order).catch(error => {
        this.$emit("close");
        this.$swal("Error ", error.message, "error");

        return null;
      });
      if (res) {
        this.$router.push(this.localePath(`/partnerOrder/${res.uid}/${res.secret}/`));
      }
    }
  }
};
</script>
