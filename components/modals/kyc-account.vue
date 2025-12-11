<template>
  <div class="popup popup-personal-room popup-open modal-mask">
    <div class="modal-wrapper">
      <div class="popup-close-bloc popup-close-bloc-personal-room" @click.self="$emit('close')" />
      <div class="popup-wr-item kyc-modal">
        <div class="modal-header">
          <h5 class="title text-center">
            Verification process
          </h5>
          <span class="popup-close-btn popup-close-btn-personal-room" @click.self="$emit('close')">
            &times;
          </span>
        </div>
        <transition name="faded">
          <div class="popup-top">
            <verification-kyc :is-modal="true" @close="$emit('close')" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import verificationKyc from "@/components/verification-kyc";

export default {
  components: {verificationKyc}
}
</script>
