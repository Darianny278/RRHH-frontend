<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue">Listado de Competencias</v-card-title>
      <v-card-text>
        <v-btn
          class="mb-5 ml-auto d-flex"
          color="primary"
          @click="
            agregarModal = true;
            clearFields();
          "
        >
          Agregar Competencia
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="competencias"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <td>
              <v-icon
                @click="
                  editarModal = true;
                  editarcompetencia(item);
                "
                class="mr-3"
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <v-icon @click="eliminarcompetencia(item.id)" color="error">
                mdi-delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para agregar competencia -->
    <v-dialog v-model="agregarModal" max-width="500px">
      <v-card>
        <v-card-title>Agregar Competencia</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="competencia.nombre"
            label="Nombre"
          ></v-text-field>
          <v-checkbox v-model="competencia.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!isValidForm"
            @click="agregarcompetencia"
            >Guardar</v-btn
          >
          <v-btn @click="agregarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar competencia -->
    <v-dialog v-model="editarModal" max-width="500px">
      <v-card>
        <v-card-title>Editar Competencia</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="competencia.nombre"
            label="Nombre"
          ></v-text-field>
          <v-checkbox v-model="competencia.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!isValidForm"
            color="primary"
            @click="guardarEdicioncompetencia"
            >Guardar</v-btn
          >
          <v-btn @click="editarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import { getUserFromToken } from "@/plugins/cookie";

export default {
  name: "competenciasList",
  data() {
    return {
      competencias: [],
      competencia: {
        nombre: "",
        estado: true,
      },
      agregarModal: false,
      editarModal: false,
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  mounted() {
    this.obtenercompetencias();
  },
  computed: {
    isValidForm() {
      return this.competencia.nombre;
    },
  },
  methods: {
    clearFields() {
      this.competencia.nombre = "";

      if (this.competencia?.id) {
        delete this.competencia.id;
      }
    },
    async obtenercompetencias() {
      const userInfo = getUserFromToken();
      if (userInfo.id) {
        let user = await axios.get(`/users/${userInfo.id}`);

        if (user.data.candidato) {
          const response = await axios.get(
            `/candidato/${user.data.candidato.id}`
          );

          this.competencias = response.data.competencias;
        }
      }
    },
    async agregarcompetencia() {
      try {
        const userInfo = getUserFromToken();
        if (userInfo.id) {
          let user = await axios.get(`/users/${userInfo.id}`);

          if (user.data.candidato) {
            const response = await axios.post("/candidato/addCompetencias", {
              candidatoId: user.data.candidato.id,
              competenciaDto: this.competencia,
            });

            const nuevacompetencia = response.data;

            this.competencias.push(nuevacompetencia);
            this.agregarModal = false;

            this.competencia = {
              nombre: "",
              estado: true,
            };

            this.$toasted.show("Competencia agregada correctamente", {
              position: "bottom-right",
              duration: 3000,
              theme: "toasted-primary",
              type: "success",
            });
          }
        }
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al agregar la competencia", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
      }
    },
    async editarcompetencia(competencia) {
      this.competencia = { ...competencia };
      this.editarModal = true;
    },
    async guardarEdicioncompetencia() {
      try {
        await axios.put(
          `/competencias/${this.competencia.id}`,
          this.competencia
        );

        this.$toasted.show("Competencia actualizada correctamente", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "success",
        });

        this.editarModal = false;
        this.obtenercompetencias();
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al actualizar la competencia", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
      }
    },
    async eliminarcompetencia(id) {
      try {
        const response = await axios.delete(`/competencias/${id}`);
        this.competencias = this.competencias.filter(
          (competencia) => competencia.id !== id
        );

        this.$toasted.show("Competencia eliminada correctamente", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "success",
        });
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al eliminar la competencia", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
      }
    },
  },
};
</script>
