<template>
  <div class="technocal-work under-header four-wr" style="min-height:81vh">
    <div class="four four-second">
      <div class="container text-center">
        <div><img src="~assets/img/error.png" alt="" /></div>
        <div class="four-second-break">{{ $t("page.technical.title") }}</div>
        <!--<p class="four-second-back">###### #### ######### ###### <b>## ##### ## #######</b></p>-->
        <div class="four-second-dont-worry">
          {{ $t("page.technical.description") }}
        </div>
        <div>
          <nuxt-link :to="localePath(`/news/`)" class="btn btn-submit">
            {{ $t("page.technical.btn-news") }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.technocal-work{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(#fff,0.95);
  display: block;
  color: #000;
  padding-top: 100px;

  .four{
    color: #000;
  }
}
</style>