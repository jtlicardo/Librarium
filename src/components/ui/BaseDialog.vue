<template>
  <div class="text-center">
    <v-dialog v-model="active" persistent width="500" @click:outside="tryClose">
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
  methods: {
    tryClose() {
      this.$emit("close")
    },
  },
}
</script>

<style></style>
