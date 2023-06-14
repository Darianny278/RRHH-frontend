<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue">Listado de Puestos</v-card-title>
      <v-card-text>
        <v-btn
          class="mb-5 ml-auto d-flex"
          color="primary"
          @click="agregarModal = true"
          v-if="isAdmin"
          >Agregar Puesto</v-btn
        >
        <v-data-table
          :headers="headers"
          :items="puestos"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <td>
              <v-icon
                v-if="isAdmin"
                @click="
                  editarModal = true;
                  editarPuesto(item);
                "
                class="mr-3"
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="isAdmin"
                @click="eliminarPuesto(item.id)"
                color="error"
              >
                mdi-delete
              </v-icon>
              <v-icon
                color="gray"
                v-if="!isAdmin"
                @click="addOrRemoveFromUser(item.id)"
              >
                mdi-check-underline-circle
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para agregar puesto -->
    <v-dialog v-model="agregarModal" max-width="500px">
      <v-card>
        <v-card-title>Agregar Puesto</v-card-title>
        <v-card-text>
          <v-text-field v-model="puesto.nombre" label="Nombre"></v-text-field>
          <v-select
            v-model="puesto.nivelDeRiesgo"
            :items="['bajo', 'medio', 'alto']"
            label="Nivel de Riesgo"
          ></v-select>
          <v-text-field
            v-model="puesto.nivelMinimoSalario"
            label="Nivel Mínimo de Salario"
            type="number"
          ></v-text-field>
          <v-text-field
            v-model="puesto.nivelMaximoSalario"
            label="Nivel Máximo de Salario"
            type="number"
          ></v-text-field>
          <v-checkbox v-model="puesto.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="agregarPuesto">Guardar</v-btn>
          <v-btn @click="agregarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar puesto -->
    <v-dialog v-model="editarModal" max-width="500px">
      <v-card>
        <v-card-title>Editar Puesto</v-card-title>
        <v-card-text>
          <v-text-field v-model="puesto.nombre" label="Nombre"></v-text-field>
          <v-select
            v-model="puesto.nivelDeRiesgo"
            :items="['bajo', 'medio', 'alto']"
            label="Nivel de Riesgo"
          ></v-select>
          <v-text-field
            v-model="puesto.nivelMinimoSalario"
            label="Nivel Mínimo de Salario"
            type="number"
          ></v-text-field>
          <v-text-field
            v-model="puesto.nivelMaximoSalario"
            label="Nivel Máximo de Salario"
            type="number"
          ></v-text-field>
          <v-checkbox v-model="puesto.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="guardarEdicionPuesto">Guardar</v-btn>
          <v-btn @click="editarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import { getCookie, getUserFromToken } from "@/plugins/cookie";

export default {
  name: "PuestosList",
  data() {
    return {
      puestos: [],
      puesto: {
        nombre: "",
        nivelDeRiesgo: "",
        nivelMinimoSalario: "",
        nivelMaximoSalario: "",
        estado: true,
      },
      agregarModal: false,
      editarModal: false,
      headers: [
        { text: "Puesto", value: "nombre" },
        { text: "Nivel de Riesgo", value: "nivelDeRiesgo" },
        { text: "Min Salario", value: "nivelMinimoSalario" },
        { text: "Max Salario", value: "nivelMaximoSalario" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    isAdmin() {
      return getCookie("admin") === "true";
    },
  },
  async mounted() {
    this.obtenerPuestos();
  },
  methods: {
    async obtenerPuestos() {
      try {
        const response = await axios.get("/puesto");
        this.puestos = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async agregarPuesto() {
      try {
        await axios.post("/puesto", this.puesto);
        this.agregarModal = false;
        this.obtenerPuestos();
      } catch (error) {
        console.error(error);
      }
    },
    editarPuesto(puesto) {
      this.puesto = { ...puesto };
    },
    async guardarEdicionPuesto() {
      try {
        await axios.put(`/puesto/${this.puesto.id}`, this.puesto);
        this.editarModal = false;
        this.obtenerPuestos();
      } catch (error) {
        console.error(error);
      }
    },
    async eliminarPuesto(id) {
      try {
        await axios.delete(`/puesto/${id}`);
        this.obtenerPuestos();
      } catch (error) {
        console.error(error);
      }
    },
    async addOrRemoveFromUser(id) {
      try {
        const data = {
          candidatoId: "",
          puestoId: id,
        };

        const response = getUserFromToken();
        if (response.id) {
          let user = await axios.get(`/users/${response.id}`);

          if (user.data.candidato) {
            data.candidatoId = user.data.candidato.id;
          }
        }

        const responseCand = await axios.post("/candidato/addPuesto", data);
        const puestoIndex = responseCand.data.puestos.findIndex(
          (puesto) => puesto.id === id
        );

        if (puestoIndex === -1) {
          this.$toasted.show("Puesto Removido de su perfil", {
            position: "bottom-right",
            duration: 3000,
            theme: "toasted-primary",
            type: "success",
          });

          const puestoRemovido = this.puestos.find(puesto => puesto.id === id)
          delete puestoRemovido.exist
        } else {
          this.$toasted.show("Puesto agregado a su perfil", {
            position: "bottom-right",
            duration: 3000,
            theme: "toasted-primary",
            type: "success",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
