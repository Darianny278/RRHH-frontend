<template>
<v-container>
  <v-card elevation="0">
    <v-card-title class="text-blue">{{ isEditing ? 'Editar Candidato' : 'Crear Candidato' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="candidato.nombre" label="Nombre" outlined></v-text-field>
        <v-text-field v-model="candidato.cedula" label="Cédula" outlined></v-text-field>
        <v-text-field v-model="candidato.departamento" label="Departamento" outlined></v-text-field>
        <v-text-field v-model="candidato.salarioAspirante" label="Salario Aspirante" outlined></v-text-field>
        <v-text-field v-model="candidato.recomendado" label="Recomendado" outlined></v-text-field>
        <v-btn type="submit" color="primary">{{ isEditing ? 'Guardar' : 'Crear' }}</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
import { getUserFromToken } from '@/plugins/cookie';
import axios from 'axios';

export default {
  name: "CandidatoForm",
  data() {
    return {
      candidato: {
        nombre: '',
        cedula: '',
        departamento: '',
        salarioAspirante: '',
        recomendado: ''
      },
      isEditing: false,
    };
  },
  mounted: async () => {
    const response = getUserFromToken()
    if (response.id) {
        let user =  await axios.get(`/users/${response.id}`)
        console.log(user.data.candidato)

        if(user.data.candidato) {
            this.candidato.nombre = user.data.candidato.name
            this.candidato.cedula =  user.data.candidato.cedula
            this.candidato.departamento = user.data.candidato.departamento
            this.candidato.salarioAspirante = user.data.candidato.salarioAspirante
            this.candidato.recomendado = user.data.candidato.recomendado

            this.isEditing = true
        }
    }
  },
  methods: {
    async submitForm() {
     if(!this.isEditing) {
        let user = getUserFromToken()
        await axios.post("/candidato", {userId: user.id, dto: this.candidato})
     } else {
        let user = getUserFromToken()
        user = await axios.get(`/users/${user.id}`)
        await axios.post(`/candidato/${user.data.candidato.id}`, {dto: this.candidato})
     }

      // Reiniciar el formulario y volver al estado de creación
      this.isEditing = false;
    },
  },
};
</script>
