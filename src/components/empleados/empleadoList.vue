<template>
  <v-container>
    <v-card elevation="0">
      <v-card-title class="text-blue">Listado de Empleados</v-card-title>
      <v-card-text>
        <v-btn  class="mb-5 ml-auto d-flex" color="primary" @click="exportarEmpleados">Exportar a Excel</v-btn>

        <v-data-table
          :headers="headers"
          :items="empleados"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <td>
              <v-icon
                @click="
                  editarModal = true;
                  editarEmpleado(item);
                "
                class="mr-3"
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                @click="eliminarEmpleado(item.id)"
                color="error"
              >
                mdi-delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para editar empleado -->
    <v-dialog v-model="editarModal" max-width="500px">
      <v-card>
        <v-card-title>Editar Empleado</v-card-title>
        <v-card-text>
          <v-text-field v-model="empleado.nombre" label="Nombre"></v-text-field>
          <v-text-field v-model="empleado.cedula" label="Cédula"></v-text-field>
          <v-text-field v-model="empleado.departamento" label="Departamento"></v-text-field>
          <v-text-field v-model="empleado.puesto" label="Puesto"></v-text-field>
          <v-text-field v-model="empleado.salario" label="Salario"></v-text-field>
          <v-checkbox v-model="empleado.estado" label="Estado"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="guardarEdicionEmpleado">Guardar</v-btn>
          <v-btn @click="editarModal = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import * as XLSX from 'xlsx';

export default {
  name: "EmpleadosList",
  data() {
    return {
      empleados: [],
      empleado: {
        nombre: "",
        cedula: "",
        fechaIngreso: "",
        departamento: "",
        puesto: "",
        salario: "",
        estado: true,
      },
      agregarModal: false,
      editarModal: false,
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Cédula", value: "cedula" },
        { text: "Fecha de Ingreso", value: "fechaIngreso" },
        { text: "Departamento", value: "departamento" },
        { text: "Puesto", value: "puesto" },
        { text: "Salario", value: "salario" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  async mounted() {
    this.obtenerEmpleados();
  },
  methods: {
    async obtenerEmpleados() {
      try {
        const response = await axios.get("/empleado");
        this.empleados = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    editarEmpleado(empleado) {
      this.empleado = { ...empleado };
    },
    async guardarEdicionEmpleado() {
      try {
        await axios.put(`/empleado/${this.empleado.id}`, this.empleado);
        this.editarModal = false;
        this.obtenerEmpleados();
      } catch (error) {
        console.error(error);
      }
    },
    async eliminarEmpleado(id) {
      try {
        await axios.delete(`/empleado/${id}`);
        this.obtenerEmpleados();
      } catch (error) {
        console.error(error);
      }
    },
    async exportarEmpleados() {
      try {
        // Ordenar los empleados por fecha
        const empleadosOrdenados = this.empleados.sort(
          (a, b) => new Date(a.fechaIngreso) - new Date(b.fechaIngreso)
        );

        // Crear la estructura de datos para el archivo Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(empleadosOrdenados);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados");

        // Generar el archivo Excel
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        // Descargar el archivo Excel
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fechaActual = new Date().toISOString().slice(0, 10);
        const nombreArchivo = `empleados_${fechaActual}.xlsx`;

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // Para navegadores IE/Edge
          window.navigator.msSaveOrOpenBlob(blob, nombreArchivo);
        } else {
          // Para otros navegadores
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = nombreArchivo;
          link.click();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
