<template>
  <div class="exchangeform-step-2-page">
    <div class="under-header">
      <div class="form-confirmation">
        <div v-if="currentRoute && currentRoute.routeId" class="container--form">
          <h1
            v-if="currentRoute.seo && (currentRoute.seo.h1 || currentRoute.seo.title)"
            class="text-center"
          >{{ currentRoute.seo.h1 || currentRoute.seo.title }}</h1>
          <h1 v-else class="text-center">
            {{
              $t("page.main.details.instructionTitle", {
                from: currentRoute.from.name + " " + currentRoute.from.symbol,
                to: currentRoute.to.name + " " + currentRoute.to.symbol
              })
            }}
          </h1>
          <h2
            v-if="currentRoute.seo && (currentRoute.seo.h2 || currentRoute.seo.subtitle)"
            class="text-center"
          >{{ currentRoute.seo.h2 || currentRoute.seo.subtitle }}</h2>
          <h2 v-else class="text-center">{{ $t("page.main.descr") }}</h2>
          <form class="form">

            <!--check cities-->
            <div v-if="currentRoute.requiredVerificationUser && currentRoute.requiredVerificationUser.enable"
              style="color: #4bb56b;" class="form-attention">
              {{ $t("page.main.details.needVerifPerson") + " " }}
            </div>
            <div v-if="currentRoute.verification" style="color: #4bb56b;" class="form-attention">
              {{ $t("page.main.details.needVerifPerson") + " " }}
            </div>
            <div v-if="currentRoute.from.verification" style="color: #4bb56b;" class="form-attention">
              {{ $t("page.main.details.needVerifCurrency") + " " }}
              {{ currentRoute.from.name + " " + currentRoute.from.symbol }}
            </div>
            <div v-if="currentRoute.to.verificationPayout" style="color: #4bb56b;" class="form-attention">
              {{ $t("page.main.details.needVerifCurrency") + " " }}
              {{ currentRoute.to.name + " " + currentRoute.to.symbol }}
            </div>
            
            <div
              v-for="instruction in instructions"
              :key="instruction._id"
              class="form-attention"
              v-html="instruction.content"
            />
            <div class="exchangeform-step-2">
              <div class="form-v2">
                <!--Block give-->
                <div class="receive">
                  <div class="form--title">
                    <h4>{{ $t("page.main.from.title") }}</h4>
                    <img src="~assets/img/arr.svg" alt />
                  </div>
                  <div class="form-v2--group">
                    <div class="form-v2--input">
                      <span class="label" />
                      <div class="exchangeform__date">
                        <span class="exchangeform__date-icon">
                          <img
                            :src="$rest.urlImg(currentRoute.from.image).small"
                            alt="Icon currency take"
                          />
                        </span>
                        <p
                          class="exchangeform__date-name"
                        >{{ currentRoute.from.name + " " + currentRoute.from.symbol }}</p>
                      </div>
                    </div>
                    <div class="form-v2--input">
                      <span class="label">{{ $t("page.main.details.amount") }} *</span>
                      <input
                        v-model="val1"
                        :style="{color: val1 === 'incorrect_data' ? 'red' : ''}"
                        type="text"
                        placeholder="0.00"
                        @input="correctTo"
                      />
                      <div>
                        <p v-if="currentRoute.from.min !== '0'">
                          {{ $t("page.main.from.min") + "&nbsp;" }}
                          <span>{{ fixedNumber("ceil", currentRoute.from.decimal, currentRoute.from.min) }}</span>
                        </p>
                        <p
                          v-if="currentRoute.from.min !== '0' && currentRoute.from.max !== '0'"
                        >&nbsp;-&nbsp;</p>
                        <p v-if="currentRoute.from.max !== '0'">
                          {{ $t("page.main.from.max") + "&nbsp;" }}
                          <span>{{ fixedNumber("floor", currentRoute.from.decimal, currentRoute.from.max) }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="field in currentRoute.from.fields"
                    :key="field.id"
                    class="form-v2--input b-top m-top-18 p-top-16"
                  >
                    <span class="label">{{ field.name }} {{ field.required ? "*" : "" }}</span>
                    <div class="form-v2--number">
                      <input
                        v-model="fromValues[field._id]"
                        :style="{
                          border: !fromValues[field._id] || fromValues[field._id].match(field.regexp) ? '' : '1px solid red'
                        }"
                        :placeholder="field.placeholder"
                      />
                      <span class="currency--symbol">
                        <img
                          :src="$rest.urlImg(currentRoute.from.image).small"
                          alt="Icon currency take"
                        />
                      </span>
                    </div>
                    <p
                      v-if="fromValues[field._id] && !fromValues[field._id].match(field.regexp)"
                      :style="{color: 'red'}"
                    >{{ field.regexp_error }}</p>
                  </div>
                </div>
                <!--Block get-->
                <div class="give">
                  <div class="form--title">
                    <h4>{{ $t("page.main.to.title") }}</h4>
                    <img src="~assets/img/arr.svg" alt />
                  </div>
                  <div class="form-v2--group">
                    <div class="form-v2--input">
                      <span class="label" />
                      <div class="exchangeform__date">
                        <span class="exchangeform__date-icon">
                          <img
                            :src="$rest.urlImg(currentRoute.to.image).small"
                            alt="Icon currency give"
                          />
                        </span>
                        <p
                          class="exchangeform__date-name"
                        >{{ currentRoute.to.name + " " + currentRoute.to.symbol }}</p>
                      </div>
                      <p>
                        {{ $t("page.main.to.rate") }}
                        <span>{{ currentRoute.rate.in }}:</span>
                        <span>{{ currentRoute.rate.out }}</span>
                      </p>
                    </div>
                    <div class="form-v2--input">
                      <span class="label">{{ $t("page.main.details.amount") }} *</span>
                      <input
                        v-model="val2"
                        :style="{color: limitAmount ? 'red' : ''}"
                        type="text"
                        placeholder="0.00"
                        @input="correctFrom"
                      />
                      <p
                        v-if="currentRoute && currentRoute.rate && currentRoute.rate.amount"
                        :style="{color: limitAmount ? 'red' : ''}"
                      >
                        {{ $t("page.main.to.reserve") + "&nbsp;" }}
                        <span>{{ fixedNumber("floor", currentRoute.to.decimal, currentRoute.rate.amount) }}</span>
                      </p>
                    </div>
                  </div>
                  <div
                    v-for="field in currentRoute.to.fields"
                    :key="field.id"
                    class="form-v2--input b-top m-top-18 p-top-16"
                  >
                    <span class="label">{{ field.name }} {{ field.required ? "*" : "" }}</span>
                    <div class="form-v2--number">
                      <input
                        v-model="toValues[field._id]"
                        :style="{
                          border: !toValues[field._id] || toValues[field._id].match(field.regexp) ? '' : '1px solid red'
                        }"
                        :placeholder="field.placeholder"
                      />
                      <span class="currency--symbol">
                        <img
                          :src="$rest.urlImg(currentRoute.to.image).small"
                          alt="Icon currency take"
                        />
                      </span>
                    </div>
                    <p
                      v-if="toValues[field._id] && !toValues[field._id].match(field.regexp)"
                      :style="{color: 'red'}"
                    >{{ field.regexp_error }}</p>
                  </div>
                </div>
                <!--Block personal date-->
                <div class="dataInput">
                  <div
                    v-if="currentRoute.fields && currentRoute.fields.lenght >0"
                    class="form--title"
                  >
                    <h4>{{ $t("page.main.details.personalData") }}</h4>
                    <img src="~assets/img/arr.svg" alt />
                  </div>
                  <div v-for="field in currentRoute.fields" :key="field.id" class="form-v2--input">
                    <span class="label">{{ field.name }} {{ field.required ? "*" : "" }}</span>
                    <div class="form-v2--number">
                      <input
                        v-model="routeValues[field._id]"
                        :style="{
                          border: !routeValues[field._id] || routeValues[field._id].match(field.regexp) ? '' : '1px solid red'
                        }"
                        :placeholder="field.placeholder"
                      />
                    </div>
                    <p
                      v-if="routeValues[field._id] && !routeValues[field._id].match(field.regexp)"
                      :style="{color: 'red'}"
                    >{{ field.regexp_error }}</p>
                  </div>

                  <div class="dataInput--label">
                    <input id="cbx" v-model="agree" type="checkbox" />
                    <label for="cbx">
                      {{ $t("page.main.details.agree") }}
                      <p>&ensp;</p>
                      <nuxt-link :to="localePath('/rules/')">
                        {{ $t("page.main.details.agree_link") }}
                      </nuxt-link>
                      .
                    </label>
                  </div>
                  <div class="dataInput--label">
                    <input id="cbx_kyc" v-model="agree_kyc" type="checkbox" />
                    <label for="cbx_kyc">
                      {{ $t("page.main.details.agree_kyc") }}
                      <p>&ensp;</p>
                      <nuxt-link :to="localePath('/rules/aml-kyc-policy/')">
                        {{ $t("page.main.details.agree_link_kyc") }}
                      </nuxt-link>
                      .
                    </label>
                  </div>

                  <loader v-if="!load" :responsive="true" width="100" height="100" />

                  <button
                    v-else
                    class="btn btn-submit btn-submitForm"
                    @click.prevent="currentRoute.routeId && create()"
                  >{{ $t("page.main.details.submit") }}
                  </button>
                </div>
              </div>
              <div
                v-if="currentRoute.seo.instruction"
                class="exchangeform-step-2--info b-top p-top-16"
                v-html="currentRoute.seo.instruction"
              />
              <div v-else class="exchangeform-step-2--info b-top p-top-16">
                <h3 class="info-title">
                  {{
                    $t("page.main.details.instructionTitle", {
                      from: currentRoute.from.name + " " +
                        currentRoute.from.symbol, to: currentRoute.to.name + " " + currentRoute.to.symbol
                    })
                  }}
                </h3>
                <p>{{ $t("page.main.details.stepDescription") }}</p>
                <ol>
                  <li>
                    <span>
                      {{ $t("page.main.details.step_p1") }}
                      <nuxt-link :to="localePath('/rules/')">«{{ $t("ui.header.rules") }}»</nuxt-link>.
                    </span>
                  </li>
                  <li>
                    <span>{{ $t("page.main.details.step_p2") }} «{{ $t("page.main.details.submit") }}».</span>
                  </li>
                  <li>
                    <span>{{ $t("page.main.details.step_p3") }}</span>
                  </li>
                  <li>
                    <span>{{ $t("page.main.details.step_p4") }}</span>
                  </li>
                </ol>
              </div>
            </div>
          </form>
        </div>
        <div v-else>
          <h1 class="text-center">Route is not found.</h1>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {BigNumber} from "bignumber.js";
import {localizeText, parseSeoText} from "@/plugins/localizeText";

export default {
  head() {
    if (!this.currentRoute || !this.currentRoute.seo) return {};
    const {meta, title} = this.$seo({
      title: this.currentRoute.seo.title,
      description: this.currentRoute.seo.description,
      openGraph: {
        title: this.currentRoute.seo.title,
        description: this.currentRoute.seo.description,
        content: this.currentRoute.seo.subtitle,
        image: {url: this.$rest.fsPath + this.currentRoute.from.image.files[3].url, width: 100, height: 100}
      }
    });
    return {meta, title};
  },
  data() {
    return {
      // loadRouteGetOne: false,
      limitAmount: false,
      errorRoutes: "",
      from: "",
      to: "",
      val1: "",
      val2: "",
      amount: "",
      fromValues: {},
      toValues: {},
      routeValues: {},
      email: "",
      symbolFrom: "",
      symbolTo: "",
      valid: 1,
      agree: false,
      agree_kyc: false
    };
  },
  async asyncData({params, app, seo, error}) {
    const res = await app.$rest
      .api("GET:public/exchanger/route/get/one/by-friendlyURL", {
        friendlyURL: params.friendly_url,
        lang: app.i18n.locale
      })
      .catch(() => {
        error({statusCode: 404, message: 'Page not found'})
        return null;
      });

    if (res && res.success && res.data && res.data.route) {
      let routeSeo = res.data.route.seo;

      return {
        currentRoute: {
          ...res.data.route,
          seo: {
            title: parseSeoText(localizeText(routeSeo.title, app.i18n.locale), res.data.route),
            subtitle: parseSeoText(localizeText(routeSeo.subtitle, app.i18n.locale), res.data.route),
            h1: parseSeoText(localizeText(routeSeo.h1 || routeSeo.title, app.i18n.locale), res.data.route),
            h2: parseSeoText(localizeText(routeSeo.h2 || routeSeo.subtitle, app.i18n.locale), res.data.route),
            description: parseSeoText(localizeText(routeSeo.description, app.i18n.locale), res.data.route),
            instruction: parseSeoText(localizeText(routeSeo.instruction, app.i18n.locale), res.data.route),
          }
        }, loadRouteGetOne: true
      };
    }
    return {
      currentRoute: {
        to: {},
        from: {},
        rate: {}
      }
    };
  },
  computed: {
    ...mapGetters("exchange", ["info", "load"]),
    ...mapGetters("user", {profile: "info"}),

    fromList() {
      let obj = {};
      if (this.info)
        return this.info
          .map(el => {
            return {
              ...el,
              can: this.info.some(
                m => el.from.xml === m.from.xml && this.to.name === m.to.xml
              )
            };
          })
          .filter(el => {
            if (obj[el.from.xml]) {
              return false;
            } else {
              obj[el.from.xml] = true;
              return true;
            }
          })
          .filter(el => !this.symbolFrom || this.symbolFrom === el.from.symbol)
          .sort(function (a, b) {
            return a.from.positionIn > b.from.positionIn ? 1 : -1;
          });
      else return [];
    },
    toList() {
      let obj = {};
      return this.info
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
            can: this.info.some(
              m => el.to.xml === m.to.xml && this.from.xml === m.from.xml
            )
          };
        })
        .filter(el => !this.symbolTo || this.symbolTo === el.to.symbol)
        .sort(function (a, b) {
          return a.to.positionOut > b.to.positionOut ? 1 : -1;
        });
    },
    fromSymbolList() {
      let obj = {};
      this.info.forEach(el => (obj[el.from.symbol] = true));
      return Object.keys(obj);
    },
    toSymbolList() {
      let obj = {};
      this.info.forEach(el => (obj[el.to.symbol] = true));
      return Object.keys(obj);
    },
    matchedRoute() {
      return (
        this.info.find(
          el => this.from.xml === el.from.xml && this.to.xml === el.to.xml
        ) || {
          from: {},
          rate: {},
          to: {}
        }
      );
    },
    instructions() {
      if (this.currentRoute) {
        return this.currentRoute.instructions
          .filter(item => {
            return item.step === "createOrder";
          })
          .map(item => {
            return {...item, content: localizeText(item.content, this.$i18n.locale)};
          });
      } else {
        return [];
      }
    }
  },

  methods: {
    ...mapMutations({
      setLogin: "user/login",
      changeStatusOpenKycModal: "user/changeStatusOpenKycModal",
      setReg: "user/reg",
    }),
    ...mapActions({
      routes: "exchange/routes",
      createOrder: "exchange/createOrder"
    }),

    async checkAndPassVerification(route, byAmountRequired) {
      console.log('profile', this.profile, route);
      if (!route.requiredVerificationUser) return true;
      if (!route.requiredVerificationUser.enable) return true;
      if (route.requiredVerificationUser.minAmount > 0 && !byAmountRequired) return true; // skip for response by api
      if (!this.profile) {
        this.setLogin('startKyc');
        return false;
      }
      if (!this.profile.verificationPerson) {
        this.changeStatusOpenKycModal(true)
        return false;
      }

      return true;
    },

    setVal2() {
      this.val2 = Number(this.currentRoute.rate.amount);
      this.correctFrom();
    },
    setMaxValueTo() {
      this.val2 = Number(this.currentRoute.rate.amount);
      this.calculate("from");
    },
    correctFrom() {
      let coef =
        BigNumber(this.currentRoute.rate.out).dividedBy(
          this.currentRoute.rate.in
        ) || 1;
      let num = BigNumber(this.val2 || 0)
        .plus(this.currentRoute.rate.outFeeAmount)
        .dividedBy(coef)
        .decimalPlaces(this.currentRoute.from.decimal || 2);
      if (num.lte(0)) return (this.val1 = 0);

      if (
        new BigNumber(this.val2).isGreaterThan(this.currentRoute.rate.amount)
      ) {
        this.limitAmount = true;
      } else {
        this.limitAmount = false;
      }
      this.val1 = num;
    },
    async create() {
      let {routeId} = this.currentRoute;
      if (
        this.currentRoute.from.fields.some(
          el => el.required && !this.fromValues[el._id]
        ) &&
        this.currentRoute.to.fields.some(
          el => el.required && !this.toValues[el._id]
        ) &&
        this.currentRoute.fields.some(
          el => el.required && !this.routeValues[el._id]
        )
      )
        return this.$store.dispatch("notify/add", {
          message: this.$t("page.main.messages.checkFields"),
          type: "warning"
        });
      if (!this.agree)
        return this.$store.dispatch("notify/add", {
          message: this.$t("page.main.messages.mustBeAgree"),
          type: "warning"
        });
      if (!this.agree_kyc)
        return this.$store.dispatch("notify/add", {
          message: this.$t("page.main.messages.mustBeAgree"),
          type: "warning"
        });
      let fromValues = Object.keys(this.fromValues).map(el => ({
        key: el,
        value: this.fromValues[el]
      }));
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
        fromValues,
        toValues,
        routeValues,
        agreement: true,
        email: this.email,
        lang: this.$root.$i18n.locale,
        amount: this.val1,
        vuexActionV2: true // vuex param
      };

      const isOkVerification = await this.checkAndPassVerification(this.currentRoute)
      if (!isOkVerification) return;

      let res = await this.createOrder(order).catch(async err => {
        if(5001670807585394 === err.errorCode) {
          await this.checkAndPassVerification(this.currentRoute, true);
          return;
        }
        if(1601588666628861 === err.errorCode) {
          if (this.$refs.recaptcha && this.$refs.recaptcha.reset) this.$refs.recaptcha.reset();
        }
        this.$swal("", err.message, "error");
      });
      if (res) {
        if (!this.profile) {
          let orders = JSON.parse(localStorage.getItem("orders"));
          if (orders) orders.push(res);
          else orders = [res];
          localStorage.setItem("orders", JSON.stringify(orders));
        }
        this.$router.push(
          this.localePath(`/order/${res.uid}/${res.secret}/`)
        );
      }
    },
    correctTo() {
      if (
        !this.currentRoute ||
        !this.currentRoute.rate ||
        !this.currentRoute.rate.out ||
        !this.currentRoute.rate.in
      ) {
        this.val2 = 0;
        return null;
      }
      let coef =
        BigNumber(this.currentRoute.rate.out).dividedBy(
          this.currentRoute.rate.in
        ) || 1;
      let num = BigNumber(this.val1 || 0)
        .multipliedBy(coef)
        .minus(this.currentRoute.rate.outFeeAmount)
        .decimalPlaces(this.currentRoute.to.decimal || 2);
      if (num.lte(0)) return (this.val2 = 0);

      if (num.isGreaterThan(this.currentRoute.rate.amount)) {
        this.limitAmount = true;
      } else {
        this.limitAmount = false;
      }

      this.val2 = num;
    },
    async changeCurrency() {
      this.correctTo();
    },
    fixedNumber(type, decimal, number) {
      const divN = Number(10 ** decimal);
      let n = 0;
      if (type === "floor") {
        n = Math.floor(number * divN) / divN;
      } else if (type === "ceil") {
        n = Math.floor(number * divN) / divN;
      } else {
        n = Number(Number(number).toFixed(decimal));
      }
      if (decimal <= 2 && decimal > 0) {
        n = n.toFixed(2);
      } else if (decimal === 0) {
        n = n.toFixed(0);
      }
      return n;
    },
  }
};
</script>
<style scoped>
.form-v2--input p {
  margin: 10px 0 0;
}

button.btn.btn-submit.btn-submitForm {
  padding: 15px 30px;
}

.form-v2--input input {
  padding: 14px 30px;
  color: #282E38;
  border-radius: 14px;
  height: 50px;
  border: 1px solid #dedede;
  background: #ffffff;
}
</style>
