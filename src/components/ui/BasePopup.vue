<template>
  <div class="text-center">
    <v-dialog v-model="active" width="500" @click:outside="closeDialog">
      <v-card>
        <v-alert type="error" prominent>
          <p class="popup-text">{{ text }}</p>
          <v-icon class="popup-icon" @click="closeDialog">
            mdi-close-circle-outline
          </v-icon>
        </v-alert>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["text", "active"],
  emits: ["close-dialog"],
  methods: {
    closeDialog() {
      this.$emit("close-dialog")
    },
  },
}
</script>

<style scoped>
.popup-text {
  display: inline;
}
.popup-icon {
  float: right;
  cursor: pointer;
}

.popup-icon:hover {
  opacity: 0.8;
}

* >>> .v-dialog {
  box-shadow: none !important;
}
</style>
