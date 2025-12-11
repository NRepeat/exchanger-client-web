<template>
  <div class="partner">
    <div class="container">
      <ul>
        <li v-for="keyOffer in offers" :key="keyOffer">
          <div class="partner-item">
            <div class="partner-img text-center">
              <img v-if="keyOffer === 'toUsers'" src="~assets/img/team.svg" alt="img" />
              <img v-if="keyOffer === 'toPartners'" src="~assets/img/bars-chart.svg" alt="img" />
              <img v-if="keyOffer === 'toShops'" src="~assets/img/shopping-store.svg" alt="img" />
            </div>
            <div class="partner-description">
              <p class="partner-description-title">{{ $t("page.partners." + keyOffer + ".slogan") }}</p>
              <p class="partner-description-theme">{{ $t("page.partners." + keyOffer + ".title") }}</p>
              <p class="partner-description-txt">{{ $t("page.partners." + keyOffer + ".content") }}</p>
              <p v-if="keyOffer === 'toShops' || keyOffer === 'toPartners'" class="partner-description-btn">
                <nuxt-link :to="link(keyOffer)" class="btn btn-look">
                  {{ $t("page.partners." + keyOffer + ".button") }}
                </nuxt-link>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    offers: {
      type: Array,
      required: true
    }
  },
  methods: {
    link(keyOffer) {
      if (keyOffer === "toShops") {
        return this.localePath("/merchant-docs/");
      }
      if (keyOffer === "toPartners") {
        return this.localePath("/partner-api-docs/");
      }
      return this.localePath("/");
    }
  }
};
</script>
