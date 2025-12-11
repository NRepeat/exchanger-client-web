<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <span class="btn_close" @click.self="$emit('close')">×</span>

            <slot name="header">
                            <!--<h3 v-if="!success && !error">Верефикация</h3>-->
            </slot>
          </div>
          <div v-if="success">
            <center>
              <h3 style="color: #16a612">Accepted verification. Wait review...</h3>
              <br>
              <button
                class="btn btn-submit"
                @click="
                  error = false;
                  success = false;
                  $emit('close');
                "
              >
                Okay
              </button>
            </center>
          </div>
          <div v-if="error">
            <center>
              <h3 style="color: #9b0a12">Error. Please try again.</h3>
              <br>
              <button
                class="btn btn-submit"
                @click="
                  error = false;
                  success = false;
                "
              >
                Try again
              </button>
            </center>
          </div>
          <div v-show="!success && !error" class="modal-body modal-verif ">
            <slot name="body">
              <div class="modal-body__txt item-page">
                <v-runtime-template v-if="content != undefined" :template="'<div>' + content + '</div>'" />
              </div>
              <dropzone
                id="dropzone"
                ref="myDropzone"
                :options="dropzoneOptions"
                :use-custom-slot="true"
                :destroy-dropzone="true"
              >
                <div class="dropzone-custom-content">
                  <p class="text-center"><img src="~assets/img/upload.svg" alt="upload" /></p>
                  <h3 class="dropzone-custom-title">Drag and drop to upload photo!</h3>
                  <div class="subtitle">...or click to select a file from your computer</div>
                </div>
              </dropzone>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";

export default {
  components: {
    dropzone
  },
  props: {
    text: {type: String, required: true},
    requiredImagesCount: {type: Number, default: 1},
    currencyId: {type: String, default: null},
    typeVerification: {type: String, default: null},
    dataVerification: {type: String, required: true}
  },
  data() {
    return {
      imageIds: [],
      success: false,
      error: false,
      resultText: {},
      dropzoneOptions: {
        paramName: "image",
        params: () => {
          return {type: "verification"};
        },
        resizeQuality: 1,
        maxFilesize: 10,
        url: this.$rest.apiPath + "user/files/upload/image",
        thumbnailWidth: 200,
        addRemoveLinks: true
      }
    };
  },
  computed:{
    content(){
      let resultContent = "";
            const content = this.text.split("##");
            for (let i = 0; i < content.length; i++) {
              if (content[i].length === 2) {
                if (content[i] !== this.$i18n.locale) {
                  i++;
                }
              } else {
                resultContent += content[i];
              }
            }
            return resultContent
    },
    lang(){
      return this.$i18n.locale;
    }
  },
  created() {
  },
  mounted() {

    const myDropzone = this.$refs.myDropzone.dropzone;
    myDropzone.on("error", res => {
      this.error = true;
      myDropzone.removeFile(res);
    });
    myDropzone.on("success", res => {
      // myDropzone.removeFile(res);

      try {
        const response = JSON.parse(res.xhr.response);
        this.imageIds.push(response.data._id);
        if (this.imageIds.length < this.requiredImagesCount)
          return console.log('Upload more files', this.imageIds.length, 'of', this.requiredImagesCount);
        myDropzone.removeAllFiles();
        this.$rest
          .api("POST:public/exchanger/verification/create", {
            currencyId: this.currencyId || undefined,
            imageId: this.imageIds[0],
            imageIds: this.imageIds,
            type: this.typeVerification,
            data: this.dataVerification
          })
          .then(() => {
            this.success = true;
          })
          .catch(() => {
            this.error = true;
          });
        // this.success = true;

      } catch (e) {
        console.error("Error get response upload image", e);
        this.error = true;
      }
    });
  },
  methods: {
  }
};
</script>
<style scoped>
  .dropzone-custom-title {
    margin-top: 0;
  }

  .modal-mask .modal-wrapper .modal-container .modal-header .btn_close {
    right: -46px;
    top: -40px;
  }

  .dropzone-custom-title, .subtitle {
    text-align: center;
    font-size: 1rem;
    font-family: 'Conv_MuseoSansCyrl_0', sans-serif;
  }

  .vue-dropzone {
    border-style: dashed;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
  }

  .subtitle {
    color: #314b5f;
  }

  .dropzone-custom-content img{
    width: 44px;
  }

  @media screen and (max-width: 767px) {
    .vue-dropzone {
      padding: 6px;
    }
    .dropzone-custom-content img {
      width: 26px;
    }
    .dropzone-custom-title, .subtitle {
      font-size: 16px;
    }
    .modal-mask .modal-wrapper .modal-container .modal-header .btn_close {
      right: 6px;
    }
    .modal-mask .modal-wrapper .modal-container {
      max-width: 340px;
    }
    .dropzone {
      min-height: 110px;
    }
  }

</style>
