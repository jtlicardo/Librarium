<template>
  <div class="text-center">
    <v-dialog v-model="isActive" width="500" @click:outside="close">
      <v-card :color="color" dark>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          {{ text }}
          <v-progress-linear
            v-if="loading"
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  emits: ["close"],
  data() {
    return {
      isActive: false,
    }
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    active(newValue) {
      this.isActive = newValue
    },
  },
  methods: {
    close() {
      this.$emit("close")
    },
  },
}
</script>

<style></style>
