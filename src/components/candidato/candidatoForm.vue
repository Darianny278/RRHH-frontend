<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue">{{
        isEditing ? "Editar Candidato" : "Crear Candidato"
      }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="candidato.nombre"
            label="Nombre"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="candidato.cedula"
            label="Cédula"
            :rules="cedulaRules"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="candidato.departamento"
            label="Departamento"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="candidato.salarioAspirante"
            label="Salario Aspirante"
            outlined
            :rules="salarioRules"
          ></v-text-field>
          <v-text-field
            v-model="candidato.recomendado"
            label="Recomendado"
            outlined
          ></v-text-field>
          <v-btn :disabled="!isFormValid" type="submit" color="primary">{{
            isEditing ? "Guardar" : "Crear"
          }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { getUserFromToken } from "@/plugins/cookie";
import axios from "axios";

export default {
  name: "CandidatoForm",
  data() {
    return {
      candidato: {
        nombre: "",
        cedula: "",
        departamento: "",
        salarioAspirante: "",
        recomendado: "",
      },
      isEditing: false,
      cedulaRules: [
        (v) => !!v || "La cédula es requerida",
        (v) => /^(\d{3}-\d{7}-\d{1}|\d{11})$/.test(v) || "Cédula inválida",
      ],
      salarioRules: [
        (v) => !!v || "El salario es requerido",
        (v) => /^\d+(\.\d+)?$/.test(v) || "Salario inválido",
      ],
    };
  },
  computed: {
    isFormValid() {
      return (
        this.candidato.nombre &&
        this.candidato.cedula &&
        this.candidato.departamento &&
        this.candidato.salarioAspirante &&
        this.candidato.recomendado
      );
    },
  },
  mounted: async function () {
    const response = getUserFromToken();
    if (response.id) {
      let user = await axios.get(`/users/${response.id}`);

      if (user.data.candidato) {
        this.candidato.nombre = user.data.candidato.nombre;
        this.candidato.cedula = user.data.candidato.cedula;
        this.candidato.departamento = user.data.candidato.departamento;
        this.candidato.salarioAspirante = user.data.candidato.salarioAspirante;
        this.candidato.recomendado = user.data.candidato.recomendado;

        this.isEditing = true;
      }
    }
  },
  methods: {
    async submitForm() {
      let user = getUserFromToken();

      if (!this.isEditing) {
        try {
          await axios.post(`/candidato`, {
            userId: user.id,
            dto: this.candidato,
          });

          this.isEditing = true;

          this.$toasted.show("Candidato creado correctamente", {
            position: "bottom-right",
            duration: 3000,
            theme: "toasted-primary",
            type: "success",
          });
        } catch (error) {
          if (error.response && error.response.status === 500) {
            this.$toasted.show("¡La cedula ya esta en uso!", {
              position: "bottom-right",
              duration: 3000,
              theme: "toasted-primary",
              type: "alert",
            });
          } else {
            throw error;
          }
        }
      } else {
        try {
          user = await axios.get(`/users/${user.id}`);
          await axios.put(`/candidato/${user.data.candidato.id}`, {
            dto: this.candidato,
          });

          this.$toasted.show("Candidato actualizado", {
            position: "bottom-right",
            duration: 3000,
            theme: "toasted-primary",
            type: "success",
          });
        } catch (error) {
          if (error.response && error.response.status === 500) {
            this.$toasted.show("¡La cedula ya esta en uso!", {
              position: "bottom-right",
              duration: 3000,
              theme: "toasted-primary",
              type: "alert",
            });
          } else {
            throw error;
          }
        }
      }
    },
  },
};
</script>
