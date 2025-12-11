<template>
  <footer class="footer">
    <div class="footer-bottom">
      <div class="container">
        <!-- <p style="margin-left: 15px;">
          {{ $t("ui.footer.dev_by") }}
          <a href="https://www.boxexchanger.net/" target="_blank" style="padding: 0;color:#282E38;">
            {{ $t("ui.footer.box_exchanger") }}
          </a>
        </p> -->
        <ul>
          <li v-for="b in buttons" v-if="b.lang === $root.$i18n.locale && b.isFooterMenu" :key="b.id">
            <nuxt-link :to="localePath( '/' + b.link +'/')">
              {{ b.nameLink }}
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="localePath('/rules/')">
              {{ $t("ui.footer.rules") }}
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="localePath('/contacts/')">
              {{ $t("ui.footer.contacts") }}
            </nuxt-link>
          </li>
		  <li>
			Пн-Пт с 9:00 до 23:00 (GMT+02:00) Сб-Вс свободный график, смотрите статус оператора.
		  </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {...mapGetters("menu", ["menu", "buttons"])}
};
</script>
