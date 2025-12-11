<template>
  <transition name="modal">
    <div class="modal-mask deposit-modal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="deposit-modal__header modal-header">
            <span class="btn_close" @click.self="$emit('close')">×</span>

            <slot name="header">
              <h3 class="deposit-modal__title">
                {{ $t('modals.partner.get_money.deposit') }}: {{ wallet.currency.name }} {{ wallet.currency.symbol }}
              </h3>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="deposit-modal__balance">
                <div
                  v-if="wallet.currency.image"
                  class="deposit-modal__balance-logo"
                >
                  <img
                    :src="$rest.urlImg(wallet.currency.image).small"
                    :alt="wallet.currency.name"
                  />
                </div>
                <div class="deposit-modal__balance-wrap">
                  <div class="deposit-modal__balance-name">
                    {{ wallet.currency.name }}
                  </div>
                  <div class="deposit-modal__balance-symbol">
                    {{ wallet.currency.symbol }}
                  </div>
                </div>
                <div class="deposit-modal__balance-right">
                  <div class="deposit-modal__balance-label">{{ $t('modals.partner.get_money.balance') }}:</div>
                  <div class="deposit-modal__balance-value">
                    {{ wallet.balance }}
                  </div>
                </div>
              </div>

              <div v-if="load" class="deposit-modal__buttons">
                <a
                  v-if="sellRoutesList &&  sellRoutesList.length > 0"
                  @click.prevent="buyMoney()"
                  href="#"
                  class="deposit-modal__btn btn btn-blue"
                >{{ $t('modals.partner.get_money.replenish') }}</a
                >
                <a
                  v-if="buyRoutesList && buyRoutesList.length > 0"
                  @click.prevent="sellMoney()"
                  href="#"
                  class="deposit-modal__btn btn btn-blue"
                >{{ $t('modals.partner.get_money.withdraw') }}</a
                >
              </div>

              <transition name="faded">
                <div
                  v-if="
                    (!btnStep1Show && wallet.currency.networks.length > 1 || routesList && routesList.length) && load && buyShow
                  "
                >
                  <h3 class="deposit-modal__subtitle">{{ $t('modals.partner.get_money.selectNetwork') }}:</h3>
                  <div class="deposit-modal__tabs select-network-deposit">
                    <button
                      v-for="itemNetwork in wallet.currency.networks"
                      class="deposit-modal__tab btn"
                      :class="{'is-active': itemNetwork === selectedNetwork}"
                      @click="getAddress(itemNetwork)"
                    >
                      {{ itemNetwork === 'default' ? wallet.currency.symbol : itemNetwork }}
                    </button>

                    <template
                      v-if="routesList"
                    >
                      <button
                        v-for="(el, index) in routesList"
                        :key="index"
                        class="deposit-modal__tab btn"
                        :class="{'is-active': el.routeId === currentRoute.routeId && !address}"
                        @click="changeRouteBtn(el.routeId)"
                      >
                        {{ el.from.name }} {{ el.from.symbol }}
                      </button>
                    </template>
                  </div>

                </div>
              </transition>

              <transition name="faded">
                <div class="deposit-modal__body" v-if="load && (sellShow || buyShow)">
                  <!-- Пополнить -->
                  <transition name="faded">
                    <!-- <DepositBuy :wallet="wallet"></DepositBuy> -->
                    <div
                      class="deposit-modal__buy"
                      v-if="load && buyShow"
                    >
                      <div class="deposit-modal__alert" v-if="selectedNetwork && selectedNetwork !== undefined">
                        {{ $t('modals.partner.get_money.sendOnly') }}
                        <b
                        >{{ wallet.currency.symbol }}
                          {{
                            selectedNetwork && selectedNetwork !== "default"
                              ? selectedNetwork
                              : ""
                          }}</b
                        >
                        {{ $t('modals.partner.get_money.sendOnly2') }}
                      </div>

                      <!-- <div
                        class="deposit-modal__select form-v2--input-enter-form"
                        v-if="routesList"
                      >
                        <div class="deposit-modal__label">Отдадите:</div>
                        <select name="" id="" @change="changeRoute($event)">
                          <option value="" selected disabled>Выберите:</option>
                          <option
                            v-for="(el, index) in routesList"
                            :key="index"
                            :value="el.routeId"
                            v-if="el.isShowWeb"
                          >
                            {{ el.from.name }} {{ el.from.symbol }}
                          </option>
                        </select>
                      </div> -->

                      <transition name="faded">
                        <div class="deposit-modal__address" v-if="address">
                          <div class="deposit-modal__label">{{ $t('modals.partner.get_money.address') }}:</div>
                          <div class="form-v2--input-enter-form">
                            <input
                              class="deposit-modal__input"
                              disabled
                              :value="address"
                            />
                          </div>
                        </div>
                      </transition>

                      <div class="deposit-modal__tag" v-if="tag">
                        <div class="deposit-modal__label">{{ $t('modals.partner.get_money.tag') }}:</div>
                        <input
                          class="deposit-modal__input"
                          disabled
                          :value="tag"
                        />
                      </div>

                      <div class="deposit-modal__count" v-if="showCount && !address">
                        <div class="deposit-modal__label">
                          <div>{{ $t('modals.partner.get_money.sum') }}:</div>
                          <!-- <div class="deposit-modal__max">
                            <p>
                              Ваш баланс: {{ wallet.balance }}
                              {{ wallet.currency.symbol }}
                            </p>
                          </div> -->
                        </div>
                        <div class="form-v2--input">
                          <input
                            class="deposit-modal__input"
                            v-model="val1"
                            :style="{
                              color:
                                minAmount || maxAmount || limitAmount
                                  ? 'red'
                                  : '',
                            }"
                            type="number"
                            placeholder="0.00"
                            @input="correctTo"
                          />
                          <img
                            v-if="currentRoute.from.image"
                            :alt="currentRoute.from.name"
                            :src="$rest.urlImg(currentRoute.from.image).small"
                          />
                        </div>
                      </div>

                      <template
                        v-if="
                          currentRoute.from && !address
                        "
                      >
                        <div
                          v-for="field in currentRoute.from.fields"
                          :key="field.id"
                          class="deposit-modal__group"
                        >
                          <div class="deposit-modal__label">
                            {{ field.name }}:
                          </div>
                          <div class="form-v2--input-enter-form">
                            <input
                              v-model="fromValues[field._id]"
                              :style="{
                                border:
                                  !fromValues[field._id] ||
                                  fromValues[field._id].match(field.regexp)
                                    ? ''
                                    : '1px solid red',
                              }"
                              :placeholder="field.name"
                              type="text"
                            />
                            <img
                              :src="$rest.urlImg(currentRoute.from.image).small"
                              alt="wallet"
                            />
                          </div>
                        </div>
                      </template>

                      <template
                        v-if="currentRoute.to && !address"
                      >
                        <div
                          v-for="field in currentRoute.to.fields"
                          :key="field.id"
                          class="deposit-modal__group"
                          v-if="field.required"
                        >
                          <div class="deposit-modal__label">
                            {{ field.name }}:
                          </div>
                          <div class="form-v2--input-enter-form">
                            <input
                              v-model="toValues[field._id]"
                              :style="{
                                border:
                                  !toValues[field._id] ||
                                  toValues[field._id].match(field.regexp)
                                    ? ''
                                    : '1px solid red',
                              }"
                              :placeholder="field.name"
                              type="text"
                              disabled
                            />
                            <!-- <img
                          :src="$rest.urlImg(currentRoute.to.image).small"
                          alt="wallet"
                        /> -->
                          </div>
                        </div>
                      </template>
                      <div
                        v-if="currentRoute.fields && !address"
                        v-for="field in currentRoute.fields"
                        :key="field.id"
                        class="deposit-modal__group"
                      >
                        <div class="deposit-modal__label">
                          {{ field.name }}:
                        </div>
                        <div class="form-v2--input-enter-form">
                          <input
                            v-model="routeValues[field._id]"
                            :style="{
                              border:
                                !routeValues[field._id] ||
                                routeValues[field._id].match(field.regexp)
                                  ? ''
                                  : '1px solid red',
                            }"
                            :placeholder="field.name"
                            type="text"
                          />
                        </div>
                      </div>

                      <DepositData
                        v-if="
                          Object.keys(currentRoute.from).length > 0 && !address
                        "
                        :loadRouteGet="loadRouteGet"
                        :currentRoute="currentRoute"
                        :val1="val1"
                        :val2="val2"
                      ></DepositData>

                      <transition name="faded">
                        <div class="deposit-modal__buttons"
                             v-if="Object.keys(currentRoute.from).length > 0 && Object.keys(currentRoute.to).length > 0 && !address">
                          <button
                            :disabled="val1 == '' || val1 == 0"
                            @click.prevent="create()"
                            class="deposit-modal__btn deposit-modal__btn--submit btn btn-blue"
                          >
                            {{ $t('modals.partner.get_money.replenish') }}
                          </button>
                        </div>
                      </transition>
                    </div>
                  </transition>

                  <!-- Вывести -->
                  <transition name="faded">
                    <div
                      class="deposit-modal__sell"
                      v-if="load && sellShow"
                    >
                      <div
                        class="deposit-modal__select form-v2--input-enter-form"
                        v-if="routesList"
                      >
                        <div class="deposit-modal__label">{{ $t('modals.partner.get_money.receive') }}:</div>
                        <select name="" id="" @change="changeRoute($event)">
                          <option value="" selected disabled>{{ $t('modals.partner.get_money.select') }}:</option>
                          <option
                            v-for="(el, index) in routesList"
                            :key="index"
                            :value="el.routeId"
                          >
                            {{ el.to.name }} {{ el.to.symbol }}
                          </option>
                        </select>
                      </div>

                      <div class="deposit-modal__count" v-if="showCount">
                        <div class="deposit-modal__label">
                          <div>{{ $t('modals.partner.get_money.giveUp') }}:</div>
                          <div class="deposit-modal__max">
                            <p>
                              {{ $t('modals.partner.get_money.balance') }}: {{ wallet.balance }}
                              {{ wallet.currency.symbol }}
                            </p>
                          </div>
                        </div>
                        <div class="form-v2--input">
                          <input
                            class="deposit-modal__input"
                            v-model="val1"
                            :style="{
                              color:
                                minAmount || maxAmount || limitAmount
                                  ? 'red'
                                  : '',
                            }"
                            type="number"
                            placeholder="0.00"
                            @input="correctToBalance"
                          />
                          <img
                            v-if="from.image"
                            :alt="from.name"
                            :src="$rest.urlImg(from.image).small"
                          />
                        </div>
                      </div>

                      <template
                        v-if="
                          currentRoute.from
                        "
                      >
                        <div
                          v-for="field in currentRoute.from.fields"
                          :key="field.id"
                          class="deposit-modal__group"
                        >
                          <div class="deposit-modal__label">
                            {{ field.name }}:
                          </div>
                          <div class="form-v2--input-enter-form">
                            <input
                              v-model="fromValues[field._id]"
                              :style="{
                                border:
                                  !fromValues[field._id] ||
                                  fromValues[field._id].match(field.regexp)
                                    ? ''
                                    : '1px solid red',
                              }"
                              :placeholder="field.name"
                              type="text"
                            />
                            <img
                              :src="$rest.urlImg(currentRoute.from.image).small"
                              alt="wallet"
                            />
                          </div>
                        </div>
                      </template>
                      <template
                        v-if="currentRoute.to"
                      >
                        <div
                          v-for="field in currentRoute.to.fields"
                          :key="field.id"
                          class="deposit-modal__group"
                        >
                          <div class="deposit-modal__label">
                            {{ field.name }}:
                          </div>
                          <div class="form-v2--input-enter-form">
                            <input
                              v-model="toValues[field._id]"
                              :style="{
                                border:
                                  !toValues[field._id] ||
                                  toValues[field._id].match(field.regexp)
                                    ? ''
                                    : '1px solid red',
                              }"
                              :placeholder="field.name"
                              type="text"
                            />
                            <!-- <img
                          :src="$rest.urlImg(currentRoute.to.image).small"
                          alt="wallet"
                        /> -->
                          </div>
                        </div>
                      </template>
                      <div
                        v-if="currentRoute.fields"
                        v-for="field in currentRoute.fields"
                        :key="field.id"
                        class="deposit-modal__group"
                      >
                        <div class="deposit-modal__label">
                          {{ field.name }}:
                        </div>
                        <div class="form-v2--input-enter-form">
                          <input
                            v-model="routeValues[field._id]"
                            :style="{
                              border:
                                !routeValues[field._id] ||
                                routeValues[field._id].match(field.regexp)
                                  ? ''
                                  : '1px solid red',
                            }"
                            :placeholder="field.name"
                            type="text"
                          />
                        </div>
                      </div>

                      <DepositData
                        v-if="Object.keys(currentRoute.from).length > 0 && Object.keys(currentRoute.to).length > 0"
                        :loadRouteGet="loadRouteGet"
                        :currentRoute="currentRoute"
                        :val1="val1"
                        :val2="val2"
                      ></DepositData>

                      <transition name="faded">
                        <div class="deposit-modal__buttons"
                             v-if="Object.keys(currentRoute.from).length > 0 && Object.keys(currentRoute.to).length > 0">
                          <button
                            :disabled="val1 == '' || val1 == 0"
                            @click.prevent="create()"
                            class="deposit-modal__btn deposit-modal__btn--submit btn btn-blue"
                          >
                            {{ $t('modals.partner.get_money.withdraw') }}
                          </button>
                        </div>
                      </transition>
                    </div>
                  </transition>
                </div>
              </transition>

              <loader
                class="deposit-modal__loader"
                v-if="!load"
                :responsive="true"
                width="100"
                height="100"
              />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters} from "vuex";
import {BigNumber} from "bignumber.js";
import DepositData from "./deposit/depositData.vue";

export default {
  name: "depositAddress",
  props: {
    wallet: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {DepositData},
  data() {
    return {
      loadRouteGet: true,
      loadRouteGetOne: false,
      errorloadRouteGetOne: false,
      selectedNetwork: "",
      address: "",
      tag: "",
      typeRoute: "",
      limitAmount: false,
      minAmount: false,
      maxAmount: false,
      sendAmount: "in",
      errorRoutes: "",
      from: "",
      to: "",
      val1: "",
      val2: 0,
      fromValues: {},
      toValues: {},
      routeValues: {},
      email: "",
      amount: "",
      symbolFrom: "",
      symbolTo: "",
      currentRoute: {
        to: {},
        from: {},
        rate: {},
        isAutoPayout: true,
        routeId: "",
      },
      buyShow: false,
      sellShow: false,
      btnStep1Show: true,
      btnStep2Show: false,
      btnDisabled: true,
      showCount: false,
      routesList: [],
      buyRoutesList: [],
      sellRoutesList: [],
    };
  },
  async created() {
    this.buyRoutesList = await this.getBuyRouteCurrencyId({
      id: this.wallet.currency._id,
    });
    this.sellRoutesList = await this.getSellRouteCurrencyId({
      id: this.wallet.currency._id,
    });
    if (this.wallet.currency.networks.length <= 1) {
      await this.getAddress(this.wallet.currency.networks[0]);
    }
  },
  watch: {
    from: {
      deep: true,
      handler() {
        this.changeCurrency();
      },
    },
    to: {
      deep: true,
      handler() {
        this.changeCurrency();
      },
    },
  },
  computed: {
    ...mapGetters({
      info: "exchange/info",
      load: "exchange/load",
      profile: "user/info",
    }),
    rateIn() {
      if (
        !this.currentRoute ||
        !this.currentRoute.rate ||
        !this.currentRoute.rate.in
      )
        return 0;
      let rate = new BigNumber(this.currentRoute.rate.in);
      let discountPercent = 0;

      /* const discount = this.currentRoute.from.discounts.find(
              (el) => Number(el.amountMoreThan) <= this.val1
            );
        if (discount && discount.discountPercent) {
          discountPercent = Number(discount.discountPercent);
        } */

      rate = rate.minus(
        new BigNumber(rate).div(100).multipliedBy(discountPercent)
      );
      return rate;
    },
    rateOut() {
      if (
        !this.currentRoute ||
        !this.currentRoute.rate ||
        !this.currentRoute.rate.out
      )
        return 0;
      let rate = new BigNumber(this.currentRoute.rate.out);
      return rate;
    },
  },
  methods: {
    ...mapActions({
      getWalletAddress: "user/getWalletAddress",
      routes: "exchange/routes",
      createOrder: "exchange/createOrder",
      getOrder: "exchange/getOrder",
      getBuyRouteCurrencyId: "exchange/getBuyRouteCurrencyId",
      getSellRouteCurrencyId: "exchange/getSellRouteCurrencyId",
      getOrderStatus: "exchange/getOrderStatus",
    }),
    async getAddress(network) {
      this.address = "";
      this.tag = "";
      this.selectedNetwork = network;
      await this.getWalletAddress({
        walletId: this.wallet._id,
        network: this.selectedNetwork,
      })
        .then((r) => {
          this.address = r.address;
          this.tag = r.tag;
        })
        .catch(error => {
          console.log(error);
          return null;
        });

    },
    async sellMoney() {
      this.routesList = [];
      this.currentRoute = {from:{}, to: {}, rate: {}};
      this.showCount = false;
      this.address = "";
      this.selectedNetwork = "";
      this.sellShow = true;
      this.buyShow = false;
      this.btnStep1Show = false;
      this.typeRoute = "sell";
      await this.getBuyRouteCurrencyId({
        id: this.wallet.currency._id,
      }).then((route) => {
        if (route.length > 0) {
          this.routesList = route;
        }
        this.loadRouteGet = false;

      });
    },
    async buyMoney() {
      this.routesList = [...this.sellRoutesList.filter((el) => el.from.name.indexOf("Gateway") === -1)];
      if (this.routesList.length > 0) {
        this.toValues.email = this.profile.email;
      }
      this.currentRoute = {from:{}, to: {}, rate: {}};
      this.showCount = false;
      this.sellShow = false;
      this.buyShow = true;
      this.btnStep1Show = false;
      this.typeRoute = "deposit";
      this.loadRouteGet = false;
    },
    setVal2() {
      this.val2 = Number(this.currentRoute.rate.amount);
      this.correctFrom();
    },
    setMaxValueTo() {
      this.val2 = Number(this.currentRoute.rate.amount);
      this.correctFrom();
    },
    correctFrom() {
      let coef = new BigNumber(this.rateOut).dividedBy(this.rateIn) || 1;
      let num = new BigNumber(this.val2 || 0)
        .plus(this.currentRoute.rate.outFeeAmount)
        .dividedBy(coef)
        .decimalPlaces(
          this.currentRoute.from.decimal !== undefined
            ? this.currentRoute.from.decimal
            : 2
        );
      if (num.lte(0)) return (this.val1 = 0);
      if (
        new BigNumber(this.val2).isGreaterThan(this.currentRoute.rate.amount)
      ) {
        this.limitAmount = true;
      } else {
        this.limitAmount = false;
      }
      this.sendAmount = "out";
      this.val1 = num;
      this.minAmount =
        num <
        +this.fixedNumber(
          "ceil",
          this.currentRoute.from.decimal,
          this.currentRoute.from.min
        );
      this.maxAmount =
        !!Number(this.currentRoute.from.max) &&
        num >
        +this.fixedNumber(
          "floor",
          this.currentRoute.from.decimal,
          this.currentRoute.from.max
        );
      process.nextTick(() => {
        let coef1 = new BigNumber(this.rateOut).dividedBy(this.rateIn) || 1;
        if (!coef1.eq(coef)) {
          this.correctFrom();
        }
      });
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
      let coef = new BigNumber(this.rateOut).dividedBy(this.rateIn) || 1;
      let num = BigNumber(this.val1 || 0)
        .multipliedBy(coef)
        .minus(this.currentRoute.rate.outFeeAmount)
        .decimalPlaces(
          this.currentRoute.to.decimal !== undefined
            ? this.currentRoute.to.decimal
            : 2
        );
      if (num.lte(0)) return (this.val2 = 0);
      //if (num.isGreaterThan(this.currentRoute.rate.amount)) {
      /* console.log(num.isGreaterThan(this.currentRoute.rate.amount));
              console.log(num.isGreaterThan(this.wallet.balance)); */
      if (num.isGreaterThan(this.currentRoute.rate.amount)) {
        this.limitAmount = true;
      } else {
        this.limitAmount = false;
      }
      this.sendAmount = "in";
      this.val2 = Number(num);
      this.minAmount =
        this.val1 <
        +this.fixedNumber(
          "ceil",
          this.currentRoute.from.decimal,
          this.currentRoute.from.min
        );
      this.maxAmount =
        !!Number(this.currentRoute.from.max) &&
        this.val1 >
        +this.fixedNumber(
          "floor",
          this.currentRoute.from.decimal,
          this.currentRoute.from.max
        );
    },
    correctToBalance() {
      if (
        !this.currentRoute ||
        !this.currentRoute.rate ||
        !this.currentRoute.rate.out ||
        !this.currentRoute.rate.in
      ) {
        this.val2 = 0;
        return null;
      }
      let coef = new BigNumber(this.rateOut).dividedBy(this.rateIn) || 1;
      let num = BigNumber(this.val1 || 0)
        .multipliedBy(coef)
        .minus(this.currentRoute.rate.outFeeAmount)
        .decimalPlaces(
          this.currentRoute.to.decimal !== undefined
            ? this.currentRoute.to.decimal
            : 2
        );
      if (num.lte(0)) return (this.val2 = 0);
      //if (num.isGreaterThan(this.currentRoute.rate.amount)) {
      /* console.log(num.isGreaterThan(this.currentRoute.rate.amount));
              console.log(num.isGreaterThan(this.wallet.balance)); */
      if (
        num.isGreaterThan(this.currentRoute.rate.amount) ||
        num.isGreaterThan(this.wallet.balance)
      ) {
        this.limitAmount = true;
      } else {
        this.limitAmount = false;
      }
      this.sendAmount = "in";
      this.val2 = Number(num);
      this.minAmount =
        this.val1 <
        +this.fixedNumber(
          "ceil",
          this.currentRoute.from.decimal,
          this.currentRoute.from.min
        );
      this.maxAmount =
        !!Number(this.currentRoute.from.max) &&
        this.val1 >
        +this.fixedNumber(
          "floor",
          this.currentRoute.from.decimal,
          this.currentRoute.from.max
        );
    },
    async create() {
      let {routeId} = this.currentRoute;
      if (
        this.currentRoute.from.fields.some(
          (el) => el.required && !this.fromValues[el._id]
        ) &&
        this.currentRoute.to.fields.some(
          (el) => el.required && !this.toValues[el._id]
        ) &&
        this.currentRoute.fields.some(
          (el) => el.required && !this.routeValues[el._id]
        )
      )
        return this.$store.dispatch("notify/add", {
          message: this.$t("page.main.messages.checkFields"),
          type: "warning",
        });
      let fromValues = Object.keys(this.fromValues).map((el) => ({
        key: el,
        value: this.fromValues[el],
      }));
      let toValues = Object.keys(this.toValues).map((el) => ({
        key: el,
        value: this.toValues[el],
      }));
      let routeValues = Object.keys(this.routeValues).map((el) => ({
        key: el,
        value: this.routeValues[el],
      }));
      let order = {
        routeId,
        fromValues,
        toValues,
        routeValues,
        agreement: true,
        email: this.profile.email,
        lang: this.$root.$i18n.locale,
        amount: this.sendAmount === "out" ? -this.val2 : this.val1,
        vuexActionV2: true,
        skipPreview: true,
        hideOutData: true, // vuex param
      };

      let res = await this.createOrder(order).catch((err) => {
        this.$swal("", err.message, "error");
      });
      //! Если ВЫВОД
      if (res && this.typeRoute === "sell") {
        await this.getOrder({
          type: "payment",
          orderUID: res.uid,
          orderSecret: res.secret,
          vuexActionV2: true,
          disableLoaders: false,
        }).catch((err) => {
          this.$swal("", err.message, "error");
        });
        const approvePaymentResult = await axios({
          method: "post",
          url:
            this.$rest.servicePath +
            "/merchant_call/internal_balance/url_confirm_pay",
          data: {order_id: res._id},
        })
          .then((r) => r.data)
          .then((r) => r.result)
          .catch((err) => {
            console.error("approvePaymentResult err", err);
            this.$swal("", err.message, "error");
          });
        if (approvePaymentResult.ok === 1) {
          this.$swal("", "Success!", "success");
          this.$emit("close");
        }

        //! Если ДЕПОЗ
      } else if (res && this.typeRoute === "deposit") {
        this.$router.push(
          this.localePath(`/payment/${res.uid}/${res.secret}/`)
        );
      }
    },
    async changeRoute(event) {
      let r = this.routesList.find((el) => el.routeId === event.target.value);
      if (r !== undefined && r !== null) {
        this.currentRoute = r;
        this.showCount = true;
        this.changeCurrency();
      }
    },
    async changeRouteBtn(val) {
      let r = this.routesList.find((el) => el.routeId === val);
      if (r !== undefined && r !== null) {
        this.currentRoute = r;
        this.showCount = true;
        this.address = "";
        this.selectedNetwork = this.currentRoute.from.name + " " + this.currentRoute.from.symbol;
        this.changeCurrency();
      }
    },
    async changeCurrency() {
      let query = {};
      if (this.from.xml) query.from = this.from.xml;
      if (this.to.xml) query.to = this.to.xml;
      if (!this.currentRoute || !this.currentRoute.routeId) {
        return false;
      }
      this.loadRouteGetOne = false;
      this.errorloadRouteGetOne = false;
      const res = await this.$rest
        .api("GET:public/exchanger/route/get/one", {
          id: this.currentRoute.routeId,
          lang: this.$i18n.locale,
        })
        .catch((err) => {
          this.errorloadRouteGetOne = true;
          this.loadRouteGetOne = true;
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
  },
};
</script>
