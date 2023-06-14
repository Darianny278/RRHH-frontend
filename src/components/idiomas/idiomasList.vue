<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue">Listado de Idiomas</v-card-title>
      <v-card-text>
        <v-btn
          class="mb-5 ml-auto d-flex"
          color="primary"
          @click="agregarModal = true"
          v-if="isAdmin"
          >Agregar Idioma</v-btn
        >
        <v-data-table
          :headers="headers"
          :items="idiomas"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <td>
              <v-icon
                v-if="isAdmin"
                @click="
                  editarModal = true;
                  editarIdioma(item);
                "
                class="mr-3"
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="isAdmin"
                @click="eliminarIdioma(item.id)"
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

    <!-- Modal para agregar idioma -->
    <v-dialog v-model="agregarModal" max-width="500px">
      <v-card>
        <v-card-title>Agregar Idioma</v-card-title>
        <v-card-text>
          <v-text-field v-model="idioma.nombre" label="Nombre"></v-text-field>
          <v-checkbox v-model="idioma.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="agregarIdioma">Guardar</v-btn>
          <v-btn @click="agregarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar idioma -->
    <v-dialog v-model="editarModal" max-width="500px">
      <v-card>
        <v-card-title>Editar Idioma</v-card-title>
        <v-card-text>
          <v-text-field v-model="idioma.nombre" label="Nombre"></v-text-field>
          <v-checkbox v-model="idioma.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="guardarEdicionIdioma">Guardar</v-btn>
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
  name: "IdiomasList",
  data() {
    return {
      idiomas: [],
      idioma: {
        nombre: "",
        estado: true,
      },
      agregarModal: false,
      editarModal: false,
      headers: [
        { text: "Idioma", value: "nombre" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    isAdmin() {
      return getCookie("admin") === "true";
    },
  },
  mounted() {
    this.obtenerIdiomas();
  },
  methods: {
    async obtenerIdiomas() {
      try {
        const response = await axios.get("/idioma");
        this.idiomas = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async agregarIdioma() {
      try {
        await axios.post("/idioma", this.idioma);
        this.agregarModal = false;
        this.obtenerIdiomas();
      } catch (error) {
        console.error(error);
      }
    },
    editarIdioma(idioma) {
      this.idioma = { ...idioma };
    },
    async guardarEdicionIdioma() {
      try {
        await axios.put(`/idioma/${this.idioma.id}`, this.idioma);
        this.editarModal = false;
        this.obtenerIdiomas();
      } catch (error) {
        console.error(error);
      }
    },
    async eliminarIdioma(id) {
      try {
        await axios.delete(`/idioma/${id}`);
        this.obtenerIdiomas();
      } catch (error) {
        console.error(error);
      }
    },
    async addOrRemoveFromUser(id) {
      try {
        const data = {
          candidatoId: "",
          idiomaId: id,
        };

        const response = getUserFromToken();
        if (response.id) {
          let user = await axios.get(`/users/${response.id}`);

          if (user.data.candidato) {
            data.candidatoId = user.data.candidato.id;
          }
        }

        const responseCand = await axios.post("/candidato/addIdioma", data);
        const idiomaIndex = responseCand.data.idiomas.findIndex(
          (idioma) => idioma.id === id
        );

        if (idiomaIndex === -1) {
          this.$toasted.show("Idioma Removido de su perfil", {
            position: "bottom-right",
            duration: 3000,
            theme: "toasted-primary",
            type: "success",
          });
        } else {
          this.$toasted.show("Idioma agregado a su perfil", {
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
