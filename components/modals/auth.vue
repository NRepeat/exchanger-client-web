<template>
  <div class="popup popup-personal-room popup-open modal-mask">
    <div class="modal-wrapper">
      <div class="popup-close-bloc popup-close-bloc-personal-room" @click.self="$emit('close')" />
      <div class="popup-wr-item">
        <div class="modal-header text-center">
          <h5 class="title text-center"></h5>
          <span class="popup-close-btn popup-close-btn-personal-room" @click.self="$emit('close')">
            &times;
          </span>
        </div>
        <div class="popup-top">
          <p :style="{color: 'red', textAlign: 'center', fontWeight: 'bold'}">
            {{ errStep2 }}
          </p>
          <form action="">
            <div>
              <p class="d-flex flex-start">
                <img src="~assets/img/locked.svg" alt="" />{{ $t("modals.2fa.confirmCode") }}
              </p>
              <input
                ref="number"
                v-model="code"
                autofocus
                class="hide"
                type="number"
                name="code"
                @keyup.enter="$emit('confirm', code)"
                @input="
                  $event.target.value.length < 7
                    ? (code = $event.target.value)
                    : (code = $event.target.value.slice(0, 6))
                "
              />
              <div class="d-flex flex-row margin-b-0">
                <div
                  v-for="(val, i) in 6"
                  :key="i"
                  class="number"
                  :class="code.length === i ? '' : ''"
                  @click="$refs.number.focus()"
                >
                  {{ code.length === i ? "" : code.charAt(i) }}
                  <span v-if="code.length === i || (i === 5 && code.length === 6)" class="flick">|</span>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button class="btn btn-submit" @click.prevent="$emit('confirm', code)">
                {{ $t("ui.buttons.confirm") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  components: {},
  data() {
    return {
      errStep2: "",
      code: ""
    };
  },
  computed: {
    ...mapGetters("user", ["load"])
  },
  methods: {
    ...mapMutations("user", ["login", "reset"])
  }
};
</script>
<style scoped>

/* todo transfer to scss */
.hide {
  position: absolute;
  top: -9999px;
}

.flick {
  font-size: 0px;
}

.hide:focus + .flex-row .flick {
  font-size: 18px;
  animation: flick 2s 0.2s infinite;
}

@keyframes flick {
  0% {
    /*color: auto;*/
  }
  50% {
    color: white;
  }
}

.number {
  width: 42px;
  height: 48px;
  border: 1px solid #eee;
  border-radius: 7px;
  font-size: 18px;
  top: 8px;
  position: relative;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(250, 250, 250, 1);
}

.popup-wr .title {
  margin: 0;
  padding: 1rem;
  font-size: 22px;
}

.popup-personal-date p {
  font-size: 11px;
  line-height: 2;
  font-weight: bold;
  margin-top: 20px;
}

.popup .btn {
  margin-top: 1rem;
  line-height: 2.75;
  font-size: 1rem;
  box-shadow: none;
}

.popup input,
.popup textarea {
  font-size: 13px;
  padding-bottom: 12px;
  padding-top: 12px;
}

.popup-bottom img {
  max-width: 30px;
}

.popup-wr-item {
  max-width: 300px;
  box-shadow: none;
  border-radius: 10px;
}

.input-img img {
  left: 1.25rem;
  width: 1rem;
}

.popup .d-flex a {
  text-decoration: none;
  text-align: right;
  color: rgba(50, 150, 200, 1);
  font-size: 10px;
  font-weight: bold;
}

.popup-bottom-title {
  font-size: 15px;
  font-weight: bold;
}
</style>
