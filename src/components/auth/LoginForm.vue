<template>
  <v-container class="login mx-auto d-flex flex-column justify-center">
    <h1 class="text-center">LOGIN</h1>
    <div class="inputs">
      <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
      ></v-text-field>
    </div>
    <v-btn color="yellow darken-1" class="mx-auto">LOG IN</v-btn>
    <p class="text-center mt-10">
      New user?
      <a @click="changeCmp">Sign up here</a>
      or:
    </p>
  </v-container>
</template>

<script>
export default {
  emits: ["change-cmp"],
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    changeCmp() {
      this.$emit("change-cmp")
    },
  },
}
</script>

<style scoped>
.login {
  background-color: white;
  max-width: 570px;
  margin-top: 120px;
  border-radius: 20px;
  padding: 20px 50px 30px;
}

.inputs {
  padding: 40px 40px;
}

p,
p a {
  color: gray;
}

p a {
  text-decoration: underline;
  font-weight: 500;
}
</style>
