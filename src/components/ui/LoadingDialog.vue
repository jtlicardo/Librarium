<template>
  <div class="text-center">
    <v-dialog v-model="active" persistent width="500">
      <v-card color="primary" dark>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
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
    active: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style></style>
