<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue"
        >Listado de Experiencia Laboral</v-card-title
      >
      <v-card-text>
        <v-btn
          class="mb-5 ml-auto d-flex"
          color="primary"
          @click="
            agregarModal = true;
            clearFields();
          "
        >
          Agregar Experiencia
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="experiencias"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <td>
              <v-icon
                @click="
                  editarModal = true;
                  editarExperiencia(item);
                "
                class="mr-3"
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <v-icon @click="eliminarExperiencia(item.id)" color="error">
                mdi-delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para agregar Experiencia -->
    <v-dialog v-model="agregarModal" max-width="500px">
      <v-card>
        <v-card-title>Agregar Experiencia</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="experiencia.empresa"
            label="Empresa"
          ></v-text-field>
          <v-text-field
            v-model="experiencia.puesto"
            label="Puesto"
          ></v-text-field>
          <v-menu
            ref="desdeMenu"
            v-model="desdeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="experiencia.desde"
                label="Desde"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="experiencia.desde"
              @input="desdeMenu = false"
            ></v-date-picker>
          </v-menu>

          <v-menu
            ref="hastaMenu"
            v-model="hastaMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="experiencia.hasta"
                label="Hasta"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="experiencia.hasta"
              @input="hastaMenu = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="experiencia.salario"
            label="Salario"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!isValidForm"
            @click="agregarExperiencia"
            >Guardar</v-btn
          >
          <v-btn @click="agregarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar Experiencia -->
    <v-dialog v-model="editarModal" max-width="500px">
      <v-card>
        <v-card-title>Editar Experiencia</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="experiencia.empresa"
            label="Empresa"
          ></v-text-field>
          <v-text-field
            v-model="experiencia.puesto"
            label="Puesto"
          ></v-text-field>
          <v-menu
            ref="desdeMenu"
            v-model="desdeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="experiencia.desde"
                label="Desde"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="experiencia.desde"
              @input="desdeMenu = false"
            ></v-date-picker>
          </v-menu>

          <v-menu
            ref="hastaMenu"
            v-model="hastaMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="experiencia.hasta"
                label="Hasta"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="experiencia.hasta"
              @input="hastaMenu = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="experiencia.salario"
            label="Salario"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!isValidForm"
            color="primary"
            @click="guardarEdicionExperiencia"
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
  name: "ExperienciaLaboralList",
  data() {
    return {
      experiencias: [],
      experiencia: {
        empresa: "",
        puesto: "",
        desde: "",
        hasta: "",
        salario: "",
      },
      agregarModal: false,
      editarModal: false,
      headers: [
        { text: "Empresa", value: "empresa" },
        { text: "Puesto", value: "puesto" },
        { text: "Desde", value: "desde" },
        { text: "Hasta", value: "hasta" },
        { text: "Salario", value: "salario" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      desdeMenu: false,
      hastaMenu: false,
    };
  },
  mounted() {
    this.obtenerExperienciaLaboral();
  },
  computed: {
    isValidForm() {
      return (
        this.experiencia.empresa &&
        this.experiencia.puesto &&
        this.experiencia.desde &&
        this.experiencia.hasta &&
        this.experiencia.salario &&
        this.validarFechas()
      );
    },
  },
  methods: {
    validarFechas() {
      if (this.experiencia.desde && this.experiencia.hasta) {
        const desde = new Date(this.experiencia.desde);
        const hasta = new Date(this.experiencia.hasta);
        return desde < hasta;
      }

      return false;
    },
    clearFields() {
      this.experiencia.empresa = "";
      this.experiencia.puesto = "";
      this.experiencia.desde = "";
      this.experiencia.hasta = "";
      this.experiencia.salario = "";

      if (this.experiencia?.id) {
        delete this.experiencia.id;
      }
    },
    async obtenerExperienciaLaboral() {
      const userInfo = getUserFromToken();
      if (userInfo.id) {
        let user = await axios.get(`/users/${userInfo.id}`);

        if (user.data.candidato) {
          const response = await axios.get(
            `/candidato/${user.data.candidato.id}`
          );

          this.experiencias = response.data.experiencias;
        }
      }
    },
    async agregarExperiencia() {
      try {
        const userInfo = getUserFromToken();
        if (userInfo.id) {
          let user = await axios.get(`/users/${userInfo.id}`);

          if (user.data.candidato) {
            const response = await axios.post("/candidato/addExpLab", {
              candidatoId: user.data.candidato.id,
              expLabDto: this.experiencia,
            });

            const nuevaExperiencia = response.data;

            this.experiencias.push(nuevaExperiencia);
            this.agregarModal = false;

            this.experiencia = {
              empresa: "",
              puesto: "",
              desde: "",
              hasta: "",
              salario: "",
            };

            this.$toasted.show("Experiencia agregada correctamente", {
              position: "bottom-right",
              duration: 3000,
              theme: "toasted-primary",
              type: "success",
            });
          }
        }
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al agregar la Experiencia", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
      }
    },
    async editarExperiencia(experiencia) {
      this.experiencia = { ...experiencia };
      this.editarModal = true;
    },
    async guardarEdicionExperiencia() {
      try {
        await axios.put(`/exp-lab/${this.experiencia.id}`, this.experiencia);

        this.$toasted.show("Experiencia actualizada correctamente", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "success",
        });

        this.editarModal = false;
        this.obtenerExperienciaLaboral();
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al actualizar la Experiencia", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
      }
    },
    async eliminarExperiencia(id) {
      try {
        const response = await axios.delete(`/exp-lab/${id}`);
        this.experiencias = this.experiencias.filter(
          (experiencia) => experiencia.id !== id
        );

        this.$toasted.show("Experiencia eliminada correctamente", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "success",
        });
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al eliminar la Experiencia", {
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
