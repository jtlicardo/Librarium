export default {
  login() {},
  async signup(context, payload) {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDmpWucdj9MuwM5mvjA5_TKMCFlsUXUGpg",
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      }
    )

    const responseData = await response.json()

    if (!response.ok) {
      console.log(responseData)
      const error = new Error(responseData.error.message || "Signup error!")
      throw error
    }

    console.log(responseData)
    console.log("Signup successful!")

    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn,
    })
  },
}
