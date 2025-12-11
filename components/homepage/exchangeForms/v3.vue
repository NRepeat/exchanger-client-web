<template>
  <form action="#" class="form">
    <div class="form-wr">
      <div class="form-index-top">
        <h2>SOON_V3</h2>
      </div>
    </div>
  </form>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import {BigNumber} from "bignumber.js";
import Dropdown from "~/components/bp-vuejs-dropdown";

export default {
  components: {Dropdown},
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
        rate: {}
      }
    };
  },
  computed: {
    ...mapGetters("exchange", ["info", "load"]),
    ...mapGetters("user", {profile: "info"}),
    fromList() {
      let obj = {};
      if(this.info)
      return this.info
        .sort(function (a, b) {
          return a.from.positionIn > b.from.positionIn ? 1 : -1;
        })
        .map(el => {
          return {
            ...el,
            can: this.info.some(m => el.from.name === m.from.name && this.to.name === m.to.name)
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
        .sort(function (a, b) {
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
            can: this.info.some(m => el.to.name === m.to.name && this.from.name === m.from.name)
          };
        });
        else return [];
    },
    matchedRoute() {
      
        if(this.info)return this.info.find(el => this.from.name === el.from.name && this.to.name === el.to.name) 
         else return {
          from: {},
          rate: {},
          to: {}
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
    let {from, to, amount} = this.$route.query;
    if ((!from || !to) && this.fromList&&this.fromList[0] && this.toList) {
      this.from = this.fromList[0].from;
      process.nextTick(() => {
        const toCurr = this.toList.find(({can}) => can);
        if (toCurr)
          this.to = toCurr.to;
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
    if(!this.info)return 0;
    if (from) this.from = {...this.info.find(el => el.from.xml === from).from};
    if (to) this.to = {...this.info.find(el => el.to.xml === to).to};
  },

  methods: {
    ...mapActions({routes: "exchange/routes", createOrder: "exchange/createOrder"}),
    setVal2() {
      this.val2 = Number(this.currentRoute.rate.amount);
      this.correctFrom();
    },
    correctFrom() {
      let coef = BigNumber(this.currentRoute.rate.out).dividedBy(this.currentRoute.rate.in) || 1;
      let num = BigNumber(this.val2 || 0)
        .plus(this.currentRoute.rate.outFeeAmount)
        .dividedBy(coef)
        .decimalPlaces(this.currentRoute.from.decimal || 2);
      if (num.lte(0)) return (this.val1 = 0);
      this.val1 = num;
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
        this.$router.push(this.localePath(`/order/${res.uid}/${res.secret}/`));
      }
    },
    correctTo() {
      let coef = BigNumber(this.currentRoute.rate.out).dividedBy(this.currentRoute.rate.in) || 1;
      let num = BigNumber(this.val1 || 0)
        .multipliedBy(coef)
        .minus(this.currentRoute.rate.outFeeAmount)
        .decimalPlaces(this.currentRoute.to.decimal || 2);
      if (num.lte(0)) return (this.val2 = 0);

      if (num.isGreaterThan(this.currentRoute.rate.amount)) return (this.val2 = this.currentRoute.rate.amount);

      this.val2 = num;
    },
    async changeCurrency() {
      let query = {};
      if (this.from.xml) query.from = this.from.xml;
      if (this.to.xml) query.to = this.to.xml;
      this.$router.push({query});
      const res = await this.$rest.api("GET:public/exchanger/route/get/one", {
        id: this.matchedRoute?this.matchedRoute.routeId:"",
        lang: this.$i18n.locale
      });
      if (res.success) this.currentRoute = res.data.route;
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
