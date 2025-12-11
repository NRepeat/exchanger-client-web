<template>
  <form v-if="info" action="#" class="form">
    <div class="form-v2-wr">
      <div class="form-v2">
        <div class="receive">
          <div class="padding-block">
            <div class="form--title ">
              <h4>{{ $t("page.main.from.title") }}</h4>
              <div v-if="currentRoute && currentRoute.from">
                <p
                  v-if="currentRoute.from.min && currentRoute.from.min !== '0'"
                  :style="{color: minAmount ? 'red' : ''}"
                  @click="val1 = fixedNumber('ceil', currentRoute.from.decimal, currentRoute.from.min);correctTo()"
                >
                  {{ $t("page.main.from.min") + "&nbsp;" }}
                  <span>{{ fixedNumber("ceil", currentRoute.from.decimal, currentRoute.from.min) }} </span>
                </p>
                <p
                  v-if="currentRoute.from.max && currentRoute.from.max !== '0'"
                  :style="{color: maxAmount ? 'red' : ''}"
                  @click="val1 = fixedNumber('floor', currentRoute.from.decimal, currentRoute.from.max);correctTo()"
                >
                  {{ $t("page.main.from.max") + "&nbsp;" }}
                  <span> {{ fixedNumber("floor", currentRoute.from.decimal, currentRoute.from.max) }} </span>
                </p>
              </div>
              <img src="~assets/img/arr.svg" alt />

            </div>

            <div class="form-v2--input">
              <input
                v-model="val1"
                :style="{color: minAmount || maxAmount ? 'red' : ''}"
                type="number"
                placeholder="0.00"
                @input="correctTo"
              />
              <img v-if="from.image" :alt="from.name" :src="$rest.urlImg(from.image).small" />

            </div>
          </div>

          <div class="currency--choice">
            <ul>
              <li>
                <a :class="{active: symbolFrom === ''}" @click="symbolFrom = ''">{{ $t("page.main.from.all") }}</a>
              </li>
              <li>
                <a :class="{active: symbolFrom === 'USD'}" @click="symbolFrom = 'USD'">USD</a>
              </li>
              <li>
                <a :class="{active: symbolFrom === 'EUR'}" @click="symbolFrom = 'EUR'">EUR</a>
              </li>
              <li>
                <a :class="{active: symbolFrom === 'UAH'}" @click="symbolFrom = 'UAH'">UAH</a>
              </li>
              <!--              <li v-for="sym in fromSymbolList" :key="sym">-->
              <!--                <a :class="{active: symbolFrom === sym}" @click="symbolFrom = sym">{{ sym }}</a>-->
              <!--              </li>-->
            </ul>
          </div>
          <div class="form-v2__currency--list padding-block">
            <ul>
              <li v-for="ro in fromListNoCity" :key="ro.routeId" @click="from = ro.from">
                <a :class="{active: from && ro.from && from.xml === ro.from.xml}">
                  <span class="cur--logo">
                    <img :alt="ro.from.name" :src="$rest.urlImg(ro.from.image).small" />
                  </span>
                  <p>{{ ro.from.name + " " + ro.from.symbol }}</p>
                  <span class="cur--check">
                    <img
                      v-if="from && ro.from && from.xml === ro.from.xml"
                      src="~assets/img/tick-inside-circle.svg"
                      alt="+"
                    />
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <button
              class="btn-reverse"
              type="button"
              @click.prevent="reverseCurrency()"
            >
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8672 1.61377V14.3862L16.0253 9.22816"
                  fill="none"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.125 14.3862V1.61377L1.96693 6.77184"
                  fill="none"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

        </div>
        <div class="give">
          <div class="padding-block">

            <div class="form--title">
              <h4>{{ $t("page.main.to.title") }}</h4>
              <div>
                <p
                  v-if="currentRoute && currentRoute.rate && currentRoute.rate.amount"
                  :style="{color: limitAmount ? 'red' : ''}"
                >
                  {{ $t("page.main.to.reserve") + "&nbsp;" }}
                  <span>{{ fixedNumber("floor", currentRoute.to.decimal, currentRoute.rate.amount) }} </span>
                </p>
                <img src="~assets/img/arr.svg" alt />

              </div>
            </div>
            <div v-if="!matchedRoute.routeId" class="form-v2--input">
              <input placeholder="0.00" disabled="disabled" />
            </div>
            <div v-else class="form-v2--input">
              <input
                v-model="val2"
                :style="{color: limitAmount ? 'red' : ''}"
                type="number"
                placeholder="0.00"
                @input="correctFrom"
              />
              <img v-if="to.image" :alt="to.name" :src="$rest.urlImg(to.image).small" />
            </div>
          </div>
          <div class="currency--choice">
            <ul>
              <li>
                <a :class="{active: symbolTo === ''}" @click="symbolTo = ''">{{ $t("page.main.to.all") }}</a>
              </li>
              <li>
                <a :class="{active: symbolTo === 'USD'}" @click="symbolTo = 'USD'">USD</a>
              </li>
              <li>
                <a :class="{active: symbolTo === 'EUR'}" @click="symbolTo = 'EUR'">EUR</a>
              </li>
              <li>
                <a :class="{active: symbolTo === 'UAH'}" @click="symbolTo = 'UAH'">UAH</a>
              </li>
              <!--              <li v-for="sym in toSymbolList" :key="sym">-->
              <!--                <a :class="{active: symbolTo === sym}" @click="symbolTo = sym">{{ sym }}</a>-->
              <!--              </li>-->
            </ul>
          </div>
          <div class="form-v2__currency--list padding-block">
            <ul>
              <li v-for="ro in toListNoCity" :key="ro.routeId" @click="to = ro.to">
                <a :class="{active: to && ro.to && to.xml === ro.to.xml}">
                  <span class="cur--logo">
                    <img :alt="ro.to.name" :src="$rest.urlImg(ro.to.image).small" />
                  </span>
                  <p>
                    {{ ro.to.name + " " + ro.to.symbol }}
                    <span class="cur--sum"> {{ ro.rate.amount }} {{ ro.to.symbol }}</span>
                  </p>

                  <span class="cur--check">
                    <img
                      v-if="to && ro.to && to.xml === ro.to.xml"
                      src="~assets/img/tick-inside-circle.svg"
                      alt="+"
                    />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="!matchedRoute.routeId" class="dataInput">
          <div class="form--title">
            <h4>{{ $t("page.main.details.title") }}</h4>
            <img src="~assets/img/arr.svg" alt />
          </div>
          <div>
            <div class="help_block">
              <span class="file_icon">
                <img src="~assets/img/exchange.svg" alt="Money" />
              </span>
              <h3>{{ $t("page.main.details.pleaseSelectRoute") }}</h3>
              <p>{{ $t("page.main.details.select_p_1") }}</p>
              <p>{{ $t("page.main.details.select_p_2") }}</p>
              <span class="arrow_icon">
            <img src="~assets/img/arr.svg" alt />
              </span>
            </div>
          </div>
        </div>
        <div v-else-if="!loadRouteGetOne" class="dataInput">
          <div class="form--title">
            <h4>{{ $t("page.main.details.title") }}</h4>
            <img src="~assets/img/arr.svg" alt />
          </div>
          <div>
            <div class="help_block">
              <span class="file_icon">
                <loader :responsive="true" width="100" height="100" />
              </span>
              <h3>{{ $t("page.main.details.pleaseWait") }}</h3>
              <p>{{ $t("page.main.details.loading_p_1") }}</p>
              <p>{{ $t("page.main.details.loading_p_2") }}</p>
            </div>
          </div>
        </div>
        <div v-else-if="errorloadRouteGetOne" class="dataInput">
          <div class="form--title">
            <h4>{{ $t("page.main.details.title") }}</h4>
            <img src="~assets/img/arr.svg" alt />
          </div>
          <div>
            <div class="help_block">
              <h3>{{ $t("page.main.details.errorRoute") }}</h3>
              <p>{{ $t("page.main.details.error_p_1") }}</p>
              <p>{{ $t("page.main.details.error_p_2") }}</p>
            </div>
          </div>
        </div>
        <div v-else class="dataInput">
          <div class="form--title">
            <h4>{{ $t("page.main.details.title") }}</h4>
            <div style="justify-content: start;align-items: flex-start;flex-direction: column;">
              <p>
                {{ $t("page.main.to.rate") }}
                <span v-if="rateIn > 20">{{ Number((+rateIn || 1).toFixed(2)) }}:</span>
                <span v-else-if="rateIn > 10">
                  {{ Number((+rateIn || 1).toFixed(3)) }}:
                </span>
                <span v-else>{{ Number((+rateIn || 1).toFixed(4)) }}:</span>
                <span v-if="rateOut > 20">{{ Number((+rateOut || 1).toFixed(2)) }}</span>
                <span v-else-if="rateOut > 10">
                  {{ Number((+rateOut || 1).toFixed(3)) }}
                </span>
                <span v-else>{{ Number((+rateOut || 1).toFixed(4)) }}</span>
              </p>
              <p v-if="this.currentRoute.rate.outFeeAmount">
                {{ $t("page.main.to.fee") }}
                <span> -{{ this.currentRoute.rate.outFeeAmount }} {{ currentRoute.to.symbol }}</span>
              </p>
            </div>
          </div>
          <div class="dataInput--info">
            <ul>
              <li>
                <div class="dataInput--info__item">
                  <span v-if="currentRoute.from.image" class="data--logo">
                    <img :src="$rest.urlImg(currentRoute.from.image).small" alt />
                  </span>
                  <p class="data--name">
                    {{ currentRoute.from.name }}
                    <span class="data--sum">{{ val1 || 0 }} {{ currentRoute.from.symbol }}</span>
                  </p>

                  <span class="data--img">
                   <img src="~assets/img/arr.svg" alt />
                  </span>
                </div>
              </li>
              <li>
                <div class="dataInput--info__item">
                  <span v-if="currentRoute.to.image" class="data--logo">
                    <img :src="$rest.urlImg(currentRoute.to.image).small" alt />
                  </span>
                  <p class="data--name">
                    {{ currentRoute.to.name }}
                    <span class="data--sum">{{ val2 || 0 }} {{ currentRoute.to.symbol }}</span>
                  </p>

                  <span class="data-down data--img">
                 <img src="~assets/img/arr.svg" alt />
                  </span>
                </div>
              </li>
            </ul>

          </div>

          <!--check cities-->
          <div v-if="fromCities && fromCities.length" class="form-v2--input-enter-form">
            <select
              v-model="from"
              :placeholder="'From city'"
            >
              <option v-for="city in fromCities" :key="city.xml" :value="city">
                {{ city.cityName }}
              </option>
            </select>
          </div>

          <div v-if="toCities && toCities.length" class="form-v2--input-enter-form">
            <select
              v-model="to"
              :placeholder="'From city'"
            >
              <option v-for="city in toCities" :key="city.xml" :value="city">
                {{ city.cityName }}
              </option>
            </select>
          </div>
          <!--check cities-->
          <p v-if="currentRoute.requiredVerificationUser && currentRoute.requiredVerificationUser.enable"
             style="color: #4bb56b;padding-bottom: 10px;">
            {{ $t("page.main.details.needVerifPerson") + " " }}
          </p>
          <p v-if="currentRoute.verification" style="color: #4bb56b;padding-bottom: 10px;">
            {{ $t("page.main.details.needVerifPerson") + " " }}
          </p>
          <p v-if="currentRoute.from.verification" style="color: #4bb56b;padding-bottom: 10px;">
            {{ $t("page.main.details.needVerifCurrency") + " " }}
            {{ currentRoute.from.name + " " + currentRoute.from.symbol }}
          </p>
          <p v-if="currentRoute.to.verificationPayout" style="color: #4bb56b;padding-bottom: 10px;">
            {{ $t("page.main.details.needVerifCurrency") + " " }}
            {{ currentRoute.to.name + " " + currentRoute.to.symbol }}
          </p>
          <p
            v-for="instruction in instructions"
            :key="instruction._id"
            class="form-attention"
            v-html="instruction.content"
          />
          <div class="dataInput--inputs">
            <h4 class="dataInput--titleSub">
              {{ $t("page.main.details.enter_form") }}
            </h4>
            <div v-for="field in currentRoute.from.fields" :key="field.id" class="form-v2--input-enter-form">
              <select
                v-if="field.options"
                v-model="fromValues[field._id]"
                :style="{
                  border: !fromValues[field._id] || fromValues[field._id].match(field.regexp) ? '' : '1px solid red'
                }"
              >
                <option :value="undefined" disabled>{{field.name}}</option>
                <option v-for="optionItem in field.options" :value="optionItem.value">{{optionItem.name}}</option>
              </select>
              <input
                v-else
                v-model="fromValues[field._id]"
                :style="{
                  border: !fromValues[field._id] || fromValues[field._id].match(field.regexp) ? '' : '1px solid red'
                }"
                :placeholder="field.name"
                type="text"
              />
              <img :src="$rest.urlImg(currentRoute.from.image).small" alt="wallet" />
            </div>
            <div v-for="field in currentRoute.to.fields" :key="field.id" class="form-v2--input-enter-form">
              <!--              <span>{{ field.name }}</span>-->
              <select
                v-if="field.options"
                v-model="toValues[field._id]"
                :style="{
                  border: !toValues[field._id] || toValues[field._id].match(field.regexp) ? '' : '1px solid red'
                }"
              >
                <option :value="undefined" disabled>{{field.name}}</option>
                <option v-for="optionItem in field.options" :value="optionItem.value">{{optionItem.name}}</option>
              </select>
              <input
                v-else
                v-model="toValues[field._id]"
                :style="{
                  border: !toValues[field._id] || toValues[field._id].match(field.regexp) ? '' : '1px solid red'
                }"
                :placeholder="field.name"
                type="text"
              />
              <img :src="$rest.urlImg(currentRoute.to.image).small" alt="wallet" />
            </div>
            <div v-for="field in currentRoute.fields" :key="field.id" class="form-v2--input-enter-form">
              <input
                v-model="routeValues[field._id]"
                :style="{
                  border: !routeValues[field._id] || routeValues[field._id].match(field.regexp) ? '' : '1px solid red'
                }"
                :placeholder="field.name"
                type="text"
              />
              <!--              <img src="~assets/img/mail.png" alt="mail" />-->
              <img />
            </div>
            <div
              v-if="captchaSettings.sitekey && captchaSettings.module === 'recaptcha_v2' && captchaSettings.requiredForCreateOrder"
              style="margin-bottom: 15px;display: flex;justify-content: center;"
            >
              <recaptcha
                ref="recaptcha"
                :sitekey="captchaSettings.sitekey"
                :load-recaptcha-script="true"
                :language="$root.$i18n.locale"
                @verify="token => (captcha = token)"
              />
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
              :style="{opacity: currentRoute.routeId ? 1 : 0.5}"
              class="btn btn-submit btn-submitForm"
              @click.prevent="from && to && currentRoute.routeId && create()"
            >
              {{ $t("page.main.details.submit") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {BigNumber} from "bignumber.js";

export default {
  props: {
    isWidget: {
      type: Boolean,
      default: false
    },
    widgetFrom: {type: String, default: () => ""},
    widgetTo: {type: String, default: () => ""},
    widgetAmount: {type: [String, Number], default: () => ""},
    widgetWidth: {type: [String, Number], default: () => ""}
  },
  data() {
    return {
      loadRouteGetOne: false,
      errorloadRouteGetOne: false,
      limitAmount: false,
      minAmount: false,
      maxAmount: false,
      sendAmount: "in", // in - user want take some money, out - get some money
      errorRoutes: "",
      from: "",
      to: "",
      val1: "",
      val2: "",
      amount: "",
      captcha: "",
      fromValues: {},
      toValues: {},
      routeValues: {},
      email: "",
      symbolFrom: "",
      symbolTo: "",
      valid: 1,
      agree: false,
      agree_kyc: false,
      currentRoute: {
        to: {},
        from: {},
        rate: {}
      },
      loadRouteId: ""
    };
  },
  computed: {
    ...mapGetters({
      captchaSettings: "params/getCaptchaConf",
      info: "exchange/info",
      load: "exchange/load",
      profile: "user/info",
    }),
    rateFullNumber() {
      if (!this.currentRoute || !this.currentRoute.rate || !this.currentRoute.rate.rateFullNumber) return 0;
      const rate = new BigNumber(this.currentRoute.rate.rateFullNumber);
      if (rate.lte(0))
        return new BigNumber(0);
      return rate;
    },
    rateIn() {
      if (!this.currentRoute || !this.currentRoute.rate || !this.currentRoute.rate.in) return 0;
      let rate = new BigNumber(this.currentRoute.rate.in);
      let discountPercent = 0;
      const discount = this.currentRoute.from.discounts.find(el => Number(el.amountMoreThan) <= this.val1);
      if (discount && discount.discountPercent) {
        discountPercent = Number(discount.discountPercent);
      }
      rate = rate.minus(
        new BigNumber(rate)
          .div(100)
          .multipliedBy(discountPercent)
      );
      return rate;
    },
    rateOut() {
      if (!this.currentRoute || !this.currentRoute.rate || !this.currentRoute.rate.out) return 0;

      let rate = new BigNumber(this.currentRoute.rate.out);

      return rate;
    },
    fromListNoCity() {
      const direction = 'from';
      return this[direction + "List"]
        .filter((el, indexId) => {
          const isCash = el[direction].isCash
          if (isCash) {
            return (indexId === this[direction + "List"].findIndex(item => item[direction].xml.indexOf(el[direction].xml.split("_C_")[0]) === 0))
          }
          return true;
        });
    },
    fromCities() {
      const direction = 'from';
      if (!this || !this[direction] || !this[direction].isCash) {
        return [];
      }
      return this[direction + "List"]
        .filter(({[direction]: curr}) => {
          return curr.xml.indexOf(this[direction].xml.split("_C_")[0]) === 0
        })
        .map((el) => el[direction])
    },
    toListNoCity() {
      const direction = 'to';
      return this[direction + "List"]
        .filter((el, indexId) => {
          const isCash = el[direction].isCash
          if (isCash) {
            return (indexId === this[direction + "List"].findIndex(item => item[direction].xml.indexOf(el[direction].xml.split("_C_")[0]) === 0))
          }
          return true;
        });
    },
    toCities() {
      const direction = 'to';
      if (!this || !this[direction] || !this[direction].isCash) {
        return [];
      }
      return this[direction + "List"]
        .filter(({[direction]: curr}) => {
          return curr.xml.indexOf(this[direction].xml.split("_C_")[0]) === 0
        })
        .map((el) => el[direction])
    },

    fromList() {
      let obj = {};
      if (!this.info) return 0; // techworks
      return this.info
        .map(el => {
          return {
            ...el,
            can: this.info.some(m => el.from.xml === m.from.xml && this.to.name === m.to.xml)
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
            can: this.info.some(m => el.to.xml === m.to.xml && this.from.xml === m.from.xml)
          };
        })
        .filter(el => (!this.symbolTo || this.symbolTo === el.to.symbol) && el.can)
        .sort(function (a, b) {
          return a.to.positionOut > b.to.positionOut ? 1 : -1;
        });
    },
    matchedRoute() {
      return (
        this.info.find(el => this.from.xml === el.from.xml && this.to.xml === el.to.xml) || {
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
            let resultContent = "";
            const content = item.content.split("##");
            for (let i = 0; i < content.length; i++) {
              if (content[i].length === 2) {
                if (content[i] !== this.$i18n.locale) {
                  i++;
                }
              } else {
                resultContent += content[i];
              }
            }
            return {...item, content: resultContent};
          });
      } else {
        return [];
      }
    }
  },
  watch: {
    from: {
      deep: true,
      handler() {
        this.changeCurrency();
      }
    },
    to: {
      deep: true,
      handler() {
        this.changeCurrency();
      }
    }
  },
  async created() {
    await this.routes();
    if (process.server) {
      if(this.fromList && this.fromList[0] && this.fromList[0].from)
        this.from = this.fromList[0].from;
      return
    }

    if (!this.info || !this.info[0]) {
      this.errorRoutes = "Routes not found";
    }
    if (!this.info) return 0; // techworks

    let from = String(this.$route.query.from || this.widgetFrom || "");
    let to = String(this.$route.query.to || this.widgetTo || "");
    let amount = this.$route.query.amount || this.widgetAmount;
    if ((!from || !to) && this.fromList && this.toList) {
      this.from = this.fromList[0].from;
      process.nextTick(() => {
        const toCurr = this.toList.find(({can}) => can);
        if (toCurr) this.to = toCurr.to;
      });
    }
    if (amount) {
      if (amount > 0) {
        this.val1 = Math.abs(amount);
      }
      if (amount < 0) {
        this.val2 = Math.abs(amount);
      }
    }
    let city = String(this.$route.query.city || "");
    let f_f = this.info.find(el => {
      if(el.from.xml === from)
        return true;
      if(city && el.from.xml.indexOf(from+"_C_"+city) === 0)
        return true;
      return false;
    });
    let f_t = this.info.find(el => {
      if(el.to.xml === to)
        return true;
      if(city && el.to.xml.indexOf(to+"_C_"+city) === 0)
        return true;
      return false;
    });
    if (!f_f)
      f_f = this.info.find(el => (el.from.xml.indexOf(to+"_C_") === 0));
    if (!f_t)
      f_t = this.info.find(el => (el.to.xml.indexOf(to+"_C_") === 0));
    if (from && f_f) this.from = {...f_f.from};
    else this.from = this.fromList[0].from;

    if (to && f_t) this.to = {...f_t.to};
    else
      process.nextTick(() => {
        const toCurr = this.toList.find(({can}) => can);
        if (toCurr) this.to = toCurr.to;
      });
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
    correctFrom() {
      let coef = this.rateFullNumber || 0;
      let num = new BigNumber(this.val2 || 0)
        .plus(this.currentRoute.rate.outFeeAmount)
        .multipliedBy(coef)
        .decimalPlaces(this.currentRoute.from.decimal !== undefined ? this.currentRoute.from.decimal : 2, BigNumber.ROUND_UP);
      if (num.lte(0)) return (this.val1 = 0);

      if (new BigNumber(this.val2).isGreaterThan(this.currentRoute.rate.amount)) {
        this.limitAmount = true;
      } else {
        this.limitAmount = false;
      }
      this.sendAmount = "out";
      let discountPercent = 0;
      const discount = this.currentRoute.from.discounts.find(el => Number(el.amountMoreThan) <= num);
      if (discount && discount.discountPercent) {
        discountPercent = Number(discount.discountPercent);
      }
      if (discountPercent) {
        coef = coef.minus(
          new BigNumber(coef)
            .div(100)
            .multipliedBy(discountPercent)
        );

        const numAfterDiscount = new BigNumber(this.val2 || 0)
          .plus(this.currentRoute.rate.outFeeAmount)
          .multipliedBy(coef)
          .decimalPlaces(this.currentRoute.from.decimal !== undefined ? this.currentRoute.from.decimal : 2, BigNumber.ROUND_UP);

        if (numAfterDiscount.lte(discount.amountMoreThan)) {
          this.val1 = discount.amountMoreThan
        } else {
          this.val1 = numAfterDiscount
        }
      } else {
        this.val1 = num;
      }
      this.minAmount = (num < +this.fixedNumber('ceil', this.currentRoute.from.decimal, this.currentRoute.from.min));
      this.maxAmount = !!Number(this.currentRoute.from.max) && (num > +this.fixedNumber('floor', this.currentRoute.from.decimal, this.currentRoute.from.max));
    },
    async create() {
      let {routeId} = this.currentRoute;
      if (
        this.currentRoute.from.fields.some(el => el.required && !this.fromValues[el._id]) &&
        this.currentRoute.to.fields.some(el => el.required && !this.toValues[el._id]) &&
        this.currentRoute.fields.some(el => el.required && !this.routeValues[el._id])
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
        captcha: this.captcha,
        email: this.email,
        lang: this.$root.$i18n.locale,
        amount: this.sendAmount === "out" ? -this.val2 : this.val1,
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
        this.$router.push(this.localePath(`/order/${res.uid}/${res.secret}/`));
      }
    },
    correctTo() {
      if (!this.currentRoute || !this.currentRoute.rate || !this.currentRoute.rate.out || !this.currentRoute.rate.in) {
        this.val2 = 0;
        return null;
      }
      let coef = this.rateFullNumber || 0;
      let discountPercent = 0;
      const discount = this.currentRoute.from.discounts.find(el => Number(el.amountMoreThan) <= this.val1);
      if (discount && discount.discountPercent) {
        discountPercent = Number(discount.discountPercent);
      }
      coef = coef.minus(
        new BigNumber(coef)
          .div(100)
          .multipliedBy(discountPercent)
      );
      let num = BigNumber(this.val1 || 0)
        .dividedBy(coef)
        .minus(this.currentRoute.rate.outFeeAmount)
        .decimalPlaces(this.currentRoute.to.decimal !== undefined ? this.currentRoute.to.decimal : 2, BigNumber.ROUND_DOWN);
      if (num.lte(0)) return (this.val2 = 0);

      if (num.isGreaterThan(this.currentRoute.rate.amount)) {
        this.limitAmount = true;
      } else {
        this.limitAmount = false;
      }

      this.sendAmount = "in";
      this.val2 = num;
      this.minAmount = (this.val1 < +this.fixedNumber('ceil', this.currentRoute.from.decimal, this.currentRoute.from.min));
      this.maxAmount = !!Number(this.currentRoute.from.max) && (this.val1 > +this.fixedNumber('floor', this.currentRoute.from.decimal, this.currentRoute.from.max));
    },
    async changeCurrency() {
      if(String(this.loadRouteId) === String(this.matchedRoute.routeId)) return;
      this.loadRouteId = String(this.matchedRoute.routeId);
      let query = {};
      if (this.from.xml) query.from = this.from.xml;
      if (this.to.xml) query.to = this.to.xml;
      if (!this.isWidget && !process.server) this.$router.push({query});
      if (!this.matchedRoute || !this.matchedRoute.routeId) {
        return false;
      }
      this.loadRouteGetOne = false;
      this.errorloadRouteGetOne = false;
      const res = await this.$rest
        .api("GET:public/exchanger/route/get/one", {
          id: this.matchedRoute.routeId,
          lang: this.$i18n.locale
        })
        .catch(err => {
          this.errorloadRouteGetOne = true;
          this.loadRouteGetOne = true;
          this.loadRouteId = String("");
          return Promise.reject(err);
        });
      if (res.success) this.currentRoute = res.data.route;
      process.nextTick(() => {
        this.loadRouteGetOne = true;
        this.errorloadRouteGetOne = false;
      });
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

    reverseCurrency() {
      const tempFrom = this.from;
      const tempTo = this.to;

      const found = this.info.find(item => item.from.xml === tempTo.xml && item.to.xml === tempFrom.xml);

      if (found) { //Проверяем что направление существует
        this.from = tempTo;
        this.to = tempFrom;

        this.$nextTick();
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.dropper img {
  width: 25px;
  height: 25px;
  margin: 5px;
}

.dropper li {
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropper li:hover {
  background: rgba(0, 150, 255, 0.1);
}

.dropper {
  width: 100%;
}

.dropper .bp-dropdown__btn {
  width: 100%;
}

.help_block {
  text-align: center;

  h3 {
    font-size: 20px;
    margin: 10px 0;
    color: #656565;
    font-weight: 400;
    font-family: "Roboto-Regular";
  }

  p {
    font-size: 14px;
    color: #a0a3b1;
  }

  .arrow_icon {
    display: block;
    padding: 20px;
  }

  .file_icon {
    display: block;
    padding-top: 30px;
    padding-bottom: 10px;
  }
}
</style>
