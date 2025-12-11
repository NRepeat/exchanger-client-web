<template>
  <form v-if="errorRoutes" action class="form">
    <div class="form-wr">
      <div class="form-index-top">
        <h2>{{ errorRoutes }}</h2>
      </div>
    </div>
  </form>
  <transition v-else name="faded">
    <form v-if="info" :style="{opacity: load ? 1 : 0.9, transition: 'all .3s'}" action class="form">
      <div class="form-wr">
        <div class="form-index-top">
          <div class="form-index-item">
            <h3>{{ $t("page.main.from.title") }}</h3>
            <p>{{ $t("page.main.from.choose") }}</p>
            <div class="form-index-bloc form-select">
              <div class="form-index-bloc-item">
                <label>
                  <dropdown :close-on-click="true" class="dropper">
                    <template slot="btn">
                      <img v-if="from.image" :alt="from.name" :src="$rest.urlImg(from.image).small" />
                      {{ from.name }}
                      {{ from.symbol }}
                    </template>
                    <template slot="body">
                      <ul>
                        <li
                          v-for="ro in fromList"
                          :key="ro.routeId"
                          :style="{opacity: ro.can ? 1 : 0.5}"
                          @click="from = ro.from"
                        >
                          <img :alt="ro.from.name" :src="$rest.urlImg(ro.from.image).small" />
                          {{ ro.from.name }}
                          {{ ro.from.symbol }}
                        </li>
                      </ul>
                    </template>
                  </dropdown>
                </label>
              </div>
            </div>

            <div class="form-index-bloc form-input">
              <div class="form-index-bloc-item">
                <label>
                  <span>{{ from.symbol }}</span>
                  <input
                    v-model="val1"
                    :style="{color: val1 === 'Неверные данные' ? 'red' : ''}"
                    type="text"
                    placeholder="1000"
                    @input="calculate('to')"
                  />
                </label>
              </div>

              <p>
                <template v-if="currentRoute.from.min !== '0'">
                  {{ $t("page.main.from.min") + "&nbsp;" }}
                  <span>{{ fixedNumber("ceil", currentRoute.from.decimal, currentRoute.from.min) }}</span>
                </template>
                <template
                  v-if="currentRoute.from.min !== '0' && currentRoute.from.max !== '0'"
                >&nbsp;-&nbsp;</template>
                <template v-if="currentRoute.from.max !== '0'">
                  {{ $t("page.main.from.max") + "&nbsp;" }}
                  <span>{{ fixedNumber("floor", currentRoute.from.decimal, currentRoute.from.max) }}</span>
                </template>
              </p>
            </div>
            <div
              v-for="field in currentRoute.from.fields"
              :key="field.id"
              class="form-index-bloc form-input"
            >
              <div class="form-index-bloc-item">
                <span
                  v-if="fromValues[field._id] && !fromValues[field._id].match(field.regexp)"
                  style="padding:15px;color:red;font-weight:bold"
                >{{ field.regexp_error }}</span>
                <label>
                  <span>{{ field.name }}</span>
                  <input
                    v-model="fromValues[field._id]"
                    :style="{
                      border: !fromValues[field._id] || fromValues[field._id].match(field.regexp) ? '' : '1px solid red'
                    }"
                    :placeholder="field.placeholder"
                    type="text"
                  />
                </label>
              </div>
            </div>
          </div>

          <div class="form-exchange text-center">
            <img src="~/assets/img/exchange.svg" alt />
          </div>

          <div class="form-index-item">
            <h3>{{ $t("page.main.to.title") }}</h3>
            <p>{{ $t("page.main.to.choose") }}</p>
            <p
              v-if="to && from && !currentRoute.from.name"
              style="color:orange"
            >{{ $t("page.main.attention") }}</p>
            <p v-if="Number(val2) > Number(currentRoute.rate.amount)" style="color:orange">
              {{ $t("page.main.haven_t_reserve") }}
              <button
                style="border-radius:5px;border:1px solid silver"
                @click="setMaxValueTo()"
              >{{ $t("page.main.correct") }}</button>
            </p>
            <div class="form-index-bloc form-select">
              <div class="form-index-bloc-item">
                <label>
                  <dropdown :close-on-click="true" class="dropper">
                    <template slot="btn">
                      <img v-if="to.image" :alt="to.name" :src="$rest.urlImg(to.image).small" />
                      {{ to.name }}
                      {{ to.symbol }}
                    </template>
                    <template slot="body">
                      <ul>
                        <li
                          v-for="ro in toList"
                          :key="ro.routeId"
                          :style="{opacity: ro.can ? 1 : 0.5}"
                          @click="to = ro.to"
                        >
                          <img :alt="ro.to.name" :src="$rest.urlImg(ro.to.image).small" />
                          {{ ro.to.name }}
                          {{ ro.to.symbol }}
                        </li>
                      </ul>
                    </template>
                  </dropdown>
                </label>
              </div>

              <p>
                {{ $t("page.main.to.reserve") + "&nbsp;" }}
                <span>{{ fixedNumber("floor", currentRoute.to.decimal, currentRoute.rate.amount) }}</span>
              </p>
            </div>

            <div class="form-index-bloc">
              <div class="form-index-bloc-item">
                <label>
                  <span>{{ to.symbol }}</span>
                  <input
                    v-model="val2"
                    :style="{color: val2 === 'Неверные данные' ? 'red' : ''}"
                    type="text"
                    placeholder="1000"
                    @input="calculate('from')"
                  />
                </label>
              </div>

              <p>
                {{ $t("page.main.to.rate") }}
                <span>
                  {{ currentRoute.rate.in }}
                  {{ currentRoute.from.symbol }}
                </span>
                <span>
                  = {{ currentRoute.rate.out }}
                  {{ currentRoute.to.symbol }}
                </span>
              </p>
            </div>

            <div
              v-for="field in currentRoute.to.fields"
              :key="field.id"
              class="form-index-bloc form-input"
            >
              <span
                v-if="toValues[field._id] && !toValues[field._id].match(field.regexp)"
                style="padding:15px;color:red;font-weight:bold"
              >{{ field.regexp_error }}</span>
              <div class="form-index-bloc-item">
                <label>
                  <span>{{ field.name }}</span>
                  <input
                    v-model="toValues[field._id]"
                    :style="{
                      border: !toValues[field._id] || toValues[field._id].match(field.regexp) ? '' : '1px solid red'
                    }"
                    :placeholder="field.placeholder"
                    type="text"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentRoute.fields && currentRoute.fields.length > 0" class="form-index-item">
          <h3>{{ $t("page.main.details.title") }}</h3>
          <p>{{ $t("page.main.details.choose") }}</p>
        </div>

        <div v-if="currentRoute.fields && currentRoute.fields.length > 0" class="form-index-bottom">
          <div
            v-for="field in currentRoute.fields"
            :key="field.id"
            class="form-index-bloc form-input"
          >
            <span
              v-if="routeValues[field._id] && !routeValues[field._id].match(field.regexp)"
              style="padding:15px;color:red;font-weight:bold"
            >{{ field.regexp_error }}</span>
            <div class="form-index-bloc-item">
              <label>
                <span>{{ field.name }}</span>
                <input
                  v-model="routeValues[field._id]"
                  :style="{
                    border: !routeValues[field._id] || routeValues[field._id].match(field.regexp) ? '' : '1px solid red'
                  }"
                  :placeholder="field.placeholder"
                  type="text"
                />
              </label>
            </div>
          </div>
        </div>
        <p
          v-for="instruction in instructions"
          :key="instruction._id"
          class="form-attention"
          v-html="instruction.content"
        />
        <br />
        <div class="text-center form-submit">
          <button
            :style="{opacity: currentRoute.routeId ? 1 : 0.5}"
            class="btn btn-submit"
            @click.prevent="from && to && currentRoute.routeId && create()"
          >
            <span v-if="load">{{ $t("page.main.details.submit") }}</span>
            <loader v-else :responsive="true" width="50" height="50" />
          </button>
        </div>
      </div>

      <div class="form-ruls">
        <p class="text-center">{{ $t("page.main.details.rules") }}</p>
      </div>
    </form>
  </transition>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { BigNumber } from "bignumber.js";
import Dropdown from "~/components/bp-vuejs-dropdown";

export default {
  components: { Dropdown },
  data() {
    return {
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
      valid: 1,
      currentRoute: {
        to: {},
        from: {},
        rate: {},
        instructions: []
      }
    };
  },
  computed: {
    ...mapGetters({
      info: "exchange/info",
      load: "exchange/load",
      profile: "user/info"
    }),
    instructions() {
      if (this.currentRoute && this.currentRoute.instructions)
        return this.currentRoute.instructions.filter(item => {
          return item.step === "createOrder";
        });
    },
    fromList() {
      let obj = {};
      if(this.info)
      return this.info
        .sort(function(a, b) {
          return a.from.positionIn > b.from.positionIn ? 1 : -1;
        })
        .map(el => {
          return {
            ...el,
            can: this.info.some(
              m => el.from.name === m.from.name && this.to.name === m.to.name
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
        });
        else return [];
    },
    toList() {
      let obj = {};
      if(this.info)
      return this.info
        .sort(function(a, b) {
          return a.to.positionOut > b.to.positionOut ? 1 : -1;
        })
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
              m => el.to.name === m.to.name && this.from.name === m.from.name
            )
          };
        });
        else return [];
    },
    matchedRoute() {
      if (this.info)
        return this.info.find(
          el => this.from.name === el.from.name && this.to.name === el.to.name
        );
      else
        return {
          from: {},
          rate: {},
          to: {}
        };
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
    let { from, to, amount } = {
      from: this.$route.query.from,
      to: this.$route.query.to,
      amount: this.$route.query.amount
    };
    if ((!from || !to) && this.fromList&&this.fromList[0] && this.toList) {
      this.from = this.fromList[0].from;
      process.nextTick(() => {
        const toCurr = this.toList.find(({ can }) => can);
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
    if (!this.info || !this.info[0]) {
      this.errorRoutes = "Routes not found";
    }
    if (!this.info) return 0;
    if (from)
      this.from = { ...this.info.find(el => el.from.xml === from).from };
    if (to) this.to = { ...this.info.find(el => el.to.xml === to).to };
  },

  methods: {
    ...mapActions({
      routes: "exchange/routes",
      createOrder: "exchange/createOrder"
    }),
    async create() {
      let { routeId } = this.currentRoute;
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
        amount: this.val1
      };
      let res = await this.createOrder(order);
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
    /**
     * @param type {string}  - from or to
     * @return {number}
     */
    calculate(type) {
      const rate =
        BigNumber(this.currentRoute.rate.out).dividedBy(
          this.currentRoute.rate.in
        ) || 1;
      if (type === "from") {
        const num = BigNumber(this.val2 || 0)
          .plus(this.currentRoute.rate.outFeeAmount)
          .dividedBy(rate)
          .decimalPlaces(this.currentRoute.from.decimal || 2, 2);
        if (num.lte(0)) {
          this.val1 = 0;
          return 0;
        }
        this.val1 = num;
        return Number(num);
      }
      if (type === "to") {
        const num = BigNumber(this.val1 || 0)
          .multipliedBy(rate)
          .minus(this.currentRoute.rate.outFeeAmount)
          .decimalPlaces(this.currentRoute.to.decimal || 2, 1);
        if (num.lte(0)) {
          this.val2 = 0;
          return 0;
        }
        this.val2 = num;
        return Number(num);
      }
    },
    setMaxValueTo() {
      this.val2 = Number(this.currentRoute.rate.amount);
      this.calculate("from");
    },
    async changeCurrency() {
      let query = {};
      if (this.from.xml) query.from = this.from.xml;
      if (this.to.xml) query.to = this.to.xml;
      this.$router.push({ query });
      const res = await this.$rest.api("GET:public/exchanger/route/get/one", {
        id: this.matchedRoute?this.matchedRoute.routeId:"",
        lang: this.$i18n.locale
      });
      if (res.success) this.currentRoute = res.data.route;
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
    }
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
</style>
