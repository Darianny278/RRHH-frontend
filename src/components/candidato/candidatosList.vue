<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue">Listado de Candidatos</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="candidatosList"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <td>
              <v-icon
                @click="verDetalles(item.id)"
                class="mr-3"
                color="primary"
              >
                mdi-eye
              </v-icon>
              <v-icon @click="eliminarCandidato(item.id)" color="error">
                mdi-delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import router from '@/router';

export default {
  name: "CandidatoListado",
  data() {
    return {
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Cedula", value: "cedula" },
        { text: "Departamento", value: "departamento" },
        { text: "Salario", value: "salarioAspirante" },
        { text: "Recomendado", value: "recomendado" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      candidatos: [],
    };
  },
  computed: {
    candidatosList() {
      return this.candidatos;
    },
  },
  mounted: async function () {
    await this.obtenerCandidatos();
  },
  methods: {
    async obtenerCandidatos() {
      try {
        const response = await axios.get("/candidato");
        this.candidatos = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async eliminarCandidato(id) {
      try {
        await axios.delete(`/candidato/${id}`);
        await this.obtenerCandidatos();
        this.$toasted.show("Candidato eliminado correctamente", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "success",
        });
      } catch (error) {
        console.error(error);
      }
    },
    verDetalles(id) {
      this.$router.push({name : 'detalle-candidato', params: {
        'candidatoId': id
      }})
    },
  },
};
</script>
