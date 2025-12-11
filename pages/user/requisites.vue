<template>
  <div class="container">
    <div class="text-center">
      <h1>{{ $t("page.user.nav.profile") }}</h1>
    </div>
    <div class="partners-program__main">

      <user />
      <div class="requisites-main-block">
        <div v-if="wallets && wallets.length" class="container-api">
          <div class="requisites--top">
            <h2 class="title">
              {{ $t("page.user.requisites.wallet") }}
            </h2>
          </div>
          <div class="wallets-main">
            <ul>
              <li v-for="walletItem in wallets" :key="walletItem._id" @click="openDepositAddress(walletItem)">
                <img :src="$rest.urlImg(walletItem.currency.image).small" alt="" />

                <div>
                  <p class="requisites-main--verified">
                    <span>{{ walletItem.currency.name }} {{ walletItem.currency.symbol }}</span>
                  </p>

                  <p>
                    {{ Number(walletItem.balance).toFixed(walletItem.currency.decimal) }}
                    {{ walletItem.currency.symbol }}
                  </p>
                </div>
              </li>
            </ul>
            <transition name="modal">
              <deposit-address
                v-if="deposit_address"
                @close="deposit_address = null"
                :wallet="deposit_address"
              />
            </transition>
          </div>
        </div>
        <div class="container-api">

          <div class="requisites--top">
            <h2 class="title">
              {{ $t("page.user.requisites.requisites") }}
            </h2>

            <div class="requisites--top__btn-group">
              <div>
                <div>
                  <button :class="filterType===''?'btn-filter btn-filter-blue':'btn-filter'" @click="filterType=''">
                    {{ $t("page.main.from.all") }}
                  </button>
                </div>
                <div>
                  <button :class="filterType==='currency'?'btn-filter btn-filter-blue':'btn-filter'"
                          @click="filterType='currency'">
                    {{ $t("page.user.requisites.electronic_currency") }}
                  </button>
                </div>
                <div>
                  <button :class="filterType==='user'?'btn-filter btn-filter-blue':'btn-filter'"
                          @click="filterType='user'">
                    {{ $t("page.user.requisites.person") }}
                  </button>
                </div>
              </div>

            </div>
          </div>
          <div class="requisites-main">
            <ul>

              <li v-if="!verificationsFiltered||!verificationsFiltered.length">
                <div class="text-center">
                  <p class="requisites-main--img">
                  </p>
                  <p class="requisites-main--txt">
                    {{ $t("page.user.requisites.you_none") }} <br />
                  </p>
                </div>
              </li>
              <li v-for="verification in verificationsFiltered" :key="verification._id">
                <div class="text-center">
                  <p class="requisites-main--img">
                    <img :src="$rest.fsPath + verification.image.files[0].url" alt="" />
                  </p>
                  <p class="requisites-main--txt__">
                    {{ $moment(verification.createdAt).format("DD.MM.YYYY, HH:mm") }}
                  </p>
                  <p class="requisites-main--verified">
                    <span v-if="verification.type==='currency'">{{ verification.currency.name }}</span>
                    <span v-else-if="verification.type==='user'">{{ $t("page.user.requisites.person") }}</span>

                  <p v-if="verification.status === 'pending'">
                    {{ $t("page.user.requisites.pending") }} <img src="~assets/img/proces.svg" alt="proces" />
                  </p>
                  <p v-else-if="verification.status === 'approve'">
                    {{ $t("page.user.requisites.verified_wallet") }} <img src="~assets/img/trip.svg" alt="trip" />
                  </p>

                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="requisites-select-block">
      <form class="form text-center">
        <div class="requisites-select-block--btn-group">
          <div class="btn-select selected">
            <select>
              <option selected disabled>
                {{ $t("page.user.requisites.wallet") }}
              </option>
              <option>USD</option>
              <option>EURO</option>
              <option>P.P.</option>
              <option>UA</option>
            </select>
          </div>

          <div class="btn-select">
            <select>
              <option selected disabled>
                {{ $t("page.user.requisites.currency") }}
              </option>
              <option>12121212</option>
              <option>23232323</option>
              <option>34343434</option>
              <option>45454545</option>
            </select>
          </div>
        </div>

        <p>
          <button class="btn btn-submit">
            {{ $t("page.user.requisites.save") }}
          </button>
        </p>
      </form>
    </div> -->
  </div>
</template>
<script>
import {mapGetters, mapActions} from "vuex";
import user from "~/components/user";
import DepositAddress from "@/components/modals/depositAddress";

export default {
  head() {
    return {
      title: this.$t("meta.requisites.title"),
      meta: [{description: this.$t("meta.requisites.description")}, {keywords: this.$t("meta.requisites.keywords")}]
    };
  },
  data() {
    return {
      deposit_address: "",
      filterType: '',
    }
  },
  components: {
    DepositAddress,
    user
  },
  computed: {
    ...mapGetters({
      verifications: "user/verifications",
      wallets: "user/wallets",
    }),
    verificationsFiltered() {
      if (this.filterType) return this.verifications.filter(el => el.type === this.filterType);
      else return this.verifications;
    }
  },
  methods: {
    ...mapActions({getVerifications: "user/getVerifications", getWallets: "user/getWallets"}),
    openDepositAddress(wallet) {
      this.deposit_address = wallet;
    }
  },
  created() {
    this.getVerifications();
    this.getWallets();
  }
};
</script>
