<template>
  <div class="container api">
    <div class="text-center">
      <h1>{{ $t("page.user.nav.profile") }}</h1>
    </div>
    <div class="partners-program__main">
      <user />
      <div class="requisites-main-block">
        <div class="container-api">
          <h2 class="title ">
            {{ $t("page.user.api.rest_api_access") }}
          </h2>
          <div class="api-block__main">
            <div class="api-block__img">
              <img src="~assets/img/api.svg" alt="img" />
            </div>
            <div class="api-block__txt">
              <h5 class="title__">{{ $t("page.user.api.rest_api") }}</h5>
              <p>{{ $t("page.user.api.rest_api_description") }}</p>
            </div>
            <div class="api-block__btns">
              <button class="btn btn-submit" @click="create">
                <span v-if="load">{{ $t("ui.buttons.create_api_access") }}</span>
                <loader v-else :responsive="true" width="40" height="40" />
              </button>
              <a :href="$rest.servicePath + '/api/v1/docs/#/'" target="_blank" class="btn btn-bord">
                {{ $t("page.user.api.documentation_api") }}
              </a>
            </div>
          </div>
          <div v-if="block" class="api-block__main">
            <div class="api-block__img">
              <!--<img src="~assets/img/api.svg" alt="img">-->
              <qrcode-vue :value="JSON.stringify({key: block.key, secret: block.secret})" :size="150" level="H" />
            </div>
            <div class="api-block__txt">
              <h5 class="title__">{{ $t("page.user.api.save_api_access") }}</h5>
              <div>
                <p>KEY:</p>
                <span>{{ block.key }}</span>
                <button class="btn btn-copy" @click="copy(block.key)">
                  {{ $t("page.user.api.btn_copy_key") }}
                </button>
              </div>
              <div>
                <p>SECRET:</p>
                <span>{{ block.secret }}</span>
                <button class="btn btn-copy" @click="copy(block.secret)">
                  {{ $t("page.user.api.btn_copy_key") }}
                </button>
              </div>
              <div class="form__option--wr">
                <p>{{ $t("page.user.api.access") }}</p>

                <div class="form__option">
                  <label>
                    <input :checked="block.permission.base" type="checkbox" disabled />
                    <span class="form__option__text">{{ $t("page.user.api.enable_api") }}</span>
                  </label>
                  <label>
                    <input :checked="block.permission.withdrawal" type="checkbox" disabled />
                    <span class="form__option__text">{{ $t("page.user.api.enable_withdrawals") }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="api-block__btns">
              <button class="btn btn-bord" @click="clean">Hide</button>
            </div>
          </div>
          <div class="api-block">
            <table class="table">
              <thead>
                <tr>
                  <td>
                    <span>{{ $t("page.user.api.api_key") }}</span>
                  </td>
                  <td>
                    <span>{{ $t("page.user.api.api_created") }}</span>
                  </td>
                  <td>
                    <span>{{ $t("page.user.api.api_delete") }}</span>
                  </td>
                </tr>
              </thead>
              <tbody :style="{opacity: load ? 1 : 0.5}">
                <item v-for="key in data" :data="key" :key="key._id" @remove="remove($event)" />
              </tbody>
            </table>
          </div>
          <div class="api-block__info">
            <h5 class="title__sub">
              {{ $t("page.user.api.for_the_access_title") }}
            </h5>

            <p>
              <span>URL</span> — {{ $t("page.user.api.need_to_use") }}
              <b>{{ $rest.servicePath }}/api/v1/<span>{method_name}</span></b>
              {{ $t("page.user.api.where") }} <span>method_name</span> -
              {{ $t("page.user.api.name_api") }}
            </p>

            <p>
              {{ $t("page.user.api.auth_with") }}<br />
              <span>apikey</span> — {{ $t("page.user.api.take_public_key") }} (
              {{ $t("page.user.api.take_public_key") }}:EF04794F718A3FC8C6DFA0B)<br />
              <span>hash</span> — {{ $t("page.user.api.get_post") }}
            </p>

            <dd>
              {{ $t("page.user.api.extra_in_the") }}
            </dd>
            <h6 class="title__sub">{{ $t("page.user.api.js_example") }}</h6>
            <div class="api-block__info--wr">
              <div class="api-block__info--h"><span /><span /><span /></div>
              <div class="api-block__info--txt">
                <p>1&nbsp;&nbsp;&nbsp;const <span>crypto</span> = require('<span>crypto</span>');</p>
                <p>2</p>
                <p>3&nbsp;&nbsp;&nbsp;const <span>GET_PARAMS</span> = {time:123456789}</p>
                <p>4&nbsp;&nbsp;&nbsp;const <span>POST_PARAMS</span> = {param1:'val1'}</p>
                <p>5&nbsp;&nbsp;&nbsp;const <span>YOUR_SECRET</span> = '97aab8410868ba7c1824f490999607c0ce46a3de';
                </p>
                <p>6</p>
                <p>
                  7&nbsp;&nbsp;&nbsp;const <span>params</span> =
                  {...<span>GET_PARAMS</span>,...<span>POST_PARAMS</span>};
                </p>
                <p>
                  8&nbsp;&nbsp;&nbsp;const checksumParams =
                  crypto.createHash('sha256').update(JSON.stringify(params)).digest('hex');
                </p>
                <p>
                  9&nbsp;&nbsp;&nbsp;const <span>HASH</span> = crypto.createHash('sha256').update(checksumParams +
                  <span>YOUR_SECRET</span>).digest('hex');
                </p>
                <p>10</p>
                <p>11&nbsp;&nbsp;console.log('result <span>HASH</span>:', <span>HASH</span>);</p>
                <p>12&nbsp;&nbsp;// ---------- result ------- ^^</p>
              </div>
            </div>
            <h6 class="title__sub">{{ $t("page.user.api.example_headers") }}</h6>
            <div class="api-block__info--wr">
              <div class="api-block__info--h"><span /><span /><span /></div>
              <div class="api-block__info--txt">
                <dd>
                  apikey: 8c50e2809306b61b9b5f6253f89ed203a60e624f<br />
                  hash: ac876c6314ffcca01b0e65571cc136cedfb2c3d8e2194aaaf364ca7123568fc7
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import item from "~/components/api/item";
import user from "~/components/user";

export default {
  components: {item, user},
  data() {
    return {};
  },
  computed: {
    ...mapGetters("api", ["data", "load", "block"]),
    ...mapGetters({
      info: "user/info"
    })
  },
  beforeDestroy() {
    this.clean();
  },
  async created() {
    this.getList();
  },
  methods: {
    ...mapActions("api", ["getList", "remove", "create"]),
    clean() {
      this.$store.commit("api/block", false);
    },
    copy(val) {
      navigator.clipboard.writeText(val);
    }
  },

  head() {
    return {
      title: this.$t("meta.api.title"),

      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.api.description")
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.$t("meta.api.description")
        }
      ]
    };
  }
};
</script>
