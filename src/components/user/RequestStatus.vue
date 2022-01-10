<template>
  <v-chip :color="chipColor">
    {{ text }}
  </v-chip>
</template>

<script>
export default {
  props: ["type"],
  computed: {
    chipColor() {
      if (this.type === true) return "green lighten-3"
      else if (this.type === false) return "red lighten-3"
      else return "yellow lighten-3"
    },
    text() {
      if (this.isMobile) {
        if (this.type === true) return "Request accepted"
        else if (this.type === false) return "Request denied"
        else return "Request sent"
      }
      if (this.type === true) return "Accepted"
      else if (this.type === false) return "Denied"
      else return "Sent"
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true
        default:
          return false
      }
    },
  },
}
</script>
