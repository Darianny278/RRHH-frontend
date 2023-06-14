<template>
  <v-container fluid class="d-flex justify-center align-center login pa-0 ma-0">
    <v-row class="ma-0 pa-0">
      <auth-presentation />
      <v-col cols="6" class="d-flex justify-center align-center flex-column">
        <h2 class="mb-10">RRHH Open Source 2</h2>
        <v-card
          class="login-card elevation-0 justify-center align-center d-flex flex-column"
        >
          <v-card-title class="login-title text-center">Login</v-card-title>
          <v-card-text class="justify-center">
            <v-form
              @submit.prevent="login"
              class="d-flex flex-column align-center"
            >
              <v-text-field
                v-model="email"
                label="Email"
                class="login-input"
                outlined
                :rules="emailRules"
                :error-messages="emailErrors"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                class="login-input"
                outlined
              ></v-text-field>
              <v-btn
                :disabled="isFormIncomplete || !isEmailValid"
                type="submit"
                color="#0d4382"
                class="d-flex mx-auto"
                >Login</v-btn
              >
            </v-form>
            <v-btn
              width="150"
              :to="{ name: 'register' }"
              color="#0d4382"
              class="d-flex mx-auto mt-5"
              outlined
              >Registrarse</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import AuthPresentation from "@/components/AuthPresentation.vue";

export default {
  components: { AuthPresentation },
  data() {
    return {
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "El email es requerido",
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "El email no es válido",
      ],
      emailErrors: [],
    };
  },
  computed: {
    isFormIncomplete() {
      return !this.email || !this.password;
    },
    isEmailValid() {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return emailRegex.test(this.email);
    },
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("/auth/login", {
          email: this.email,
          password: this.password,
        });

        if (response) {
          // Guardar el token en una cookie
          Cookies.set("token", response.data.access_token);
          Cookies.set("userId", response.data.user.id);
          Cookies.set("admin", response.data.user.admin);

          // Redirigir al usuario a la página de inicio
          this.$router.push("/home");
        }
      } catch (error) {
        this.$toasted.show("Correo o clave incorrecta", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        }),
          console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scope>
.login {
  height: 100vh !important;
  background: #fafbfb;
  overflow-y: hidden !important;
}

.login-card {
  min-width: 400px;
  background: #fafbfb;
}

.login-title {
  color: #0d4382;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.login-input {
  background-color: #fff;
  color: #0d4382;
  margin-bottom: 20px;
}
</style>