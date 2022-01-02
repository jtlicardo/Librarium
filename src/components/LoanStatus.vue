<template>
  <v-chip :color="chipColor">
    {{ type }}
  </v-chip>
</template>

<script>
export default {
  props: ["type"],
  computed: {
    chipColor() {
      if (this.type === "Finished") return "green lighten-3"
      else if (this.type === "In progress") return "yellow lighten-3"
      else return "red lighten-3"
    },
  },
}
</script>

<style scoped></style>
