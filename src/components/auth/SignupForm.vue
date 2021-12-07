<template>
  <v-container class="login mx-auto d-flex flex-column justify-center">
    <h1 class="text-center">SIGNUP</h1>
    <div class="inputs">
      <v-text-field v-model="name" label="Full name" type="text" required></v-text-field>
      <v-text-field
        v-model="email"
        label="Email"
        hint="We won't send spam :)"
        type="email"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        hint="6 characters minimum"
        required
      ></v-text-field>
      <v-text-field
        v-model="repeatedPassword"
        label="Repeat password"
        type="password"
        required
      ></v-text-field>
    </div>
    <v-btn color="yellow darken-1" class="mx-auto">SIGN UP</v-btn>
    <p class="text-center mt-10">
      Existing user?
      <a @click="changeCmp">Log in here.</a>
    </p>
  </v-container>
</template>

<script>
export default {
  emits: ["change-cmp"],
  data() {
    return {
      name: "",
      email: "",
      password: "",
      repeatedPassword: "",
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
