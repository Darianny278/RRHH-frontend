<template>
  <v-container fluid class="d-flex justify-center align-center login pa-0 ma-0">
    <v-row class="ma-0 pa-0">
      <auth-presentation />
      <v-col cols="6" class="d-flex justify-center align-center flex-column">
        <v-card
          class="login-card elevation-0 justify-center align-center d-flex flex-column"
        >
          <v-card-title class="login-title text-center"
            >Registrarse</v-card-title
          >
          <v-form @submit.prevent="register">
            <v-text-field
              v-model="name"
              label="Nombre"
              required
              class="login-input"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              required
              outlined
              :rules="emailRules"
              :error-messages="emailErrors"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              class="login-input"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              label="Confirmar Password"
              class="login-input"
              type="password"
              required
              outlined
            ></v-text-field>
            <v-btn
              type="submit"
              color="#0d4382"
              class="d-flex mx-auto text-white"
              :disabled="isFormIncomplete || !isEmailValid"
            >
              Registrarse
            </v-btn>
          </v-form>

          <v-btn
            width="150"
            :to="{ name: 'login' }"
            color="#0d4382"
            class="d-flex mx-auto mt-5"
            outlined
          >
            Ir al login
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import AuthPresentation from "@/components/AuthPresentation.vue";

export default {
  components: { AuthPresentation },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      emailError: false,
      emailRules: [
        (v) => !!v || "El email es requerido",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "El email no es válido",
      ],
      emailErrors: [],
    };
  },
  computed: {
    isFormIncomplete() {
      return (
        !this.name || !this.email || !this.password || !this.confirmPassword
      );
    },
    isEmailValid() {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return emailRegex.test(this.email);
    },
  },
  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        this.$toasted.show("¡Las contraseñas no coinciden!", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
        return;
      }

      // Make an API request to register the user
      axios
        .post("/auth/signup", {
          nombre: this.name,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$toasted.show("¡Registro exitoso!", {
            position: "bottom-right",
            duration: 3000,
            theme: "toasted-primary",
            type: "success",
          });
          this.$router.push("/");
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            this.$toasted.show("¡El correo ya esta en uso!", {
              position: "bottom-right",
              duration: 3000,
              theme: "toasted-primary",
              type: "alert",
            });
          } else {
            throw error;
          }
        });
    },
  },
};
</script>

<style>
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
  width: 300px;
}
</style>
