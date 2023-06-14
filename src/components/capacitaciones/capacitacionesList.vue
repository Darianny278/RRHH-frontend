<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue">Listado de Capacitaciones</v-card-title>
      <v-card-text>
        <v-btn
          class="mb-5 ml-auto d-flex"
          color="primary"
          @click="
            agregarModal = true;
            clearFields();
          "
        >
          Agregar Capacitación
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="capacitaciones"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <td>
              <v-icon
                @click="
                  editarModal = true;
                  editarCapacitacion(item);
                "
                class="mr-3"
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <v-icon @click="eliminarCapacitacion(item.id)" color="error">
                mdi-delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para agregar capacitación -->
    <v-dialog v-model="agregarModal" max-width="500px">
      <v-card>
        <v-card-title>Agregar Capacitación</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="capacitacion.descripcion"
            label="Descripción"
          ></v-text-field>
          <v-select
            v-model="capacitacion.nivel"
            :items="niveles"
            label="Nivel"
          ></v-select>
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
                v-model="capacitacion.desde"
                label="Desde"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="capacitacion.desde"
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
                v-model="capacitacion.hasta"
                label="Hasta"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="capacitacion.hasta"
              @input="hastaMenu = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="capacitacion.institucion"
            label="Institución"
          ></v-text-field>
          <v-checkbox v-model="capacitacion.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="!isValidForm" @click="agregarCapacitacion">Guardar</v-btn>
          <v-btn @click="agregarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar capacitación -->
    <v-dialog v-model="editarModal" max-width="500px">
      <v-card>
        <v-card-title>Editar Capacitación</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="capacitacion.descripcion"
            label="Descripción"
          ></v-text-field>
          <v-select
            v-model="capacitacion.nivel"
            :items="niveles"
            label="Nivel"
          ></v-select>
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
                v-model="capacitacion.desde"
                label="Desde"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="capacitacion.desde"
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
                v-model="capacitacion.hasta"
                label="Hasta"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="capacitacion.hasta"
              @input="hastaMenu = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="capacitacion.institucion"
            label="Institución"
          ></v-text-field>
          <v-checkbox v-model="capacitacion.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!isValidForm" color="primary" @click="guardarEdicionCapacitacion"
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
  name: "CapacitacionesList",
  data() {
    return {
      capacitaciones: [],
      capacitacion: {
        descripcion: "",
        nivel: "",
        desde: "",
        hasta: "",
        institucion: "",
        estado: true,
      },
      agregarModal: false,
      editarModal: false,
      headers: [
        { text: "Descripción", value: "descripcion" },
        { text: "Nivel", value: "nivel" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      niveles: ["Técnico", "Grado", "Postgrado"],
      desdeMenu: false,
      hastaMenu: false,
    };
  },
  mounted() {
    this.obtenerCapacitaciones();
  },
  computed: {
    isValidForm() {
      return (
        this.capacitacion.descripcion &&
        this.capacitacion.nivel &&
        this.capacitacion.desde &&
        this.capacitacion.hasta &&
        this.capacitacion.institucion &&
        this.validarFechas()
      );
    },
  },
  methods: {
    validarFechas() {
      if (this.capacitacion.desde && this.capacitacion.hasta) {
        const desde = new Date(this.capacitacion.desde);
        const hasta = new Date(this.capacitacion.hasta);
        return desde < hasta;
      }

      return false;
    },
    clearFields() {
      this.capacitacion.descripcion = "";
      this.capacitacion.nivel = "";
      this.capacitacion.desde = "";
      this.capacitacion.hasta = "";
      this.capacitacion.institucion = "";

      if (this.capacitacion?.id) {
        delete this.capacitacion.id;
      }
    },
    async obtenerCapacitaciones() {
      const userInfo = getUserFromToken();
      if (userInfo.id) {
        let user = await axios.get(`/users/${userInfo.id}`);

        if (user.data.candidato) {
          const response = await axios.get(
            `/candidato/${user.data.candidato.id}`
          );

          this.capacitaciones = response.data.capacitaciones;
        }
      }
    },
    async agregarCapacitacion() {
      try {
        const userInfo = getUserFromToken();
        if (userInfo.id) {
          let user = await axios.get(`/users/${userInfo.id}`);

          if (user.data.candidato) {
            const response = await axios.post("/candidato/addCapacitaciones", {
              candidatoId: user.data.candidato.id,
              capacitacionDto: this.capacitacion,
            });

            const nuevaCapacitacion = response.data;

            this.capacitaciones.push(nuevaCapacitacion);
            this.agregarModal = false;

            this.capacitacion = {
              descripcion: "",
              nivel: "",
              desde: "",
              hasta: "",
              institucion: "",
              estado: true,
            };

            this.$toasted.show("Capacitación agregada correctamente", {
              position: "bottom-right",
              duration: 3000,
              theme: "toasted-primary",
              type: "success",
            });
          }
        }
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al agregar la capacitación", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
      }
    },
    async editarCapacitacion(capacitacion) {
      this.capacitacion = { ...capacitacion };
      this.editarModal = true;
    },
    async guardarEdicionCapacitacion() {
      try {
        await axios.put(
          `/capacitaciones/${this.capacitacion.id}`,
          this.capacitacion
        );

        this.$toasted.show("Capacitación actualizada correctamente", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "success",
        });

        this.editarModal = false;
        this.obtenerCapacitaciones();
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al actualizar la capacitación", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });
      }
    },
    async eliminarCapacitacion(id) {
      try {
        const response = await axios.delete(`/capacitaciones/${id}`);
        this.capacitaciones = this.capacitaciones.filter(
          (capacitacion) => capacitacion.id !== id
        );

        this.$toasted.show("Capacitación eliminada correctamente", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "success",
        });
      } catch (error) {
        console.error(error);

        this.$toasted.show("Error al eliminar la capacitación", {
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
