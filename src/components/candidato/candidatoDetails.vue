<template>
  <v-container v-if="candidato">
    <h1 class="text-blue">Detalle del Candidato</h1>
    <v-btn class="mt-n10 float-right" color="primary" @click="goBack"
      >Regresar</v-btn
    >
    <v-card class="mt-5">
      <v-row justify="center" class="align-center">
        <v-col cols="12" sm="4">
          <v-avatar size="200" class="avatar">
            <v-icon size="150">mdi-account</v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card-text>
            <h2 class="subtitle text-blue">{{ candidato.nombre }}</h2>
            <div class="info-row">
              <span class="info-label font-weight-bold">Cedula: </span>
              <span class="info-value">{{ candidato.cedula }}</span>
            </div>
            <div class="info-row">
              <span class="info-label font-weight-bold">Departamento: </span>
              <span class="info-value">{{ candidato.departamento }}</span>
            </div>
            <div class="info-row">
              <span class="info-label font-weight-bold"
                >Salario Aspirante:
              </span>
              <span class="info-value">{{ candidato.salarioAspirante }}</span>
            </div>
            <div class="info-row">
              <span class="info-label font-weight-bold">Recomendado: </span>
              <span class="info-value">{{ candidato.recomendado }}</span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-row class="mt-10">
      <v-col>
        <h3 class="section-title text-blue mt-5">Idiomas</h3>
        <ul>
          <li v-for="idioma in candidato.idiomas" :key="idioma.id">
            {{ idioma.nombre }}
          </li>
        </ul>

        <h3 class="section-title text-blue mt-5">Capacitaciones</h3>
        <ul>
          <li
            v-for="capacitacion in candidato.capacitaciones"
            :key="capacitacion.id"
          >
            <b>{{ capacitacion.descripcion }}</b> - ({{ capacitacion.desde }} -
            {{ capacitacion.hasta }}) - {{ capacitacion.nivel }}
          </li>
        </ul>
      </v-col>
      <v-col>
        <h3 class="section-title text-blue mt-5">Competencias</h3>
        <ul>
          <li
            v-for="competencia in candidato.competencias"
            :key="competencia.id"
          >
            {{ competencia.nombre }}
          </li>
        </ul>

        <h3 class="section-title text-blue mt-5">Experiencias</h3>
        <ul>
          <li
            v-for="experiencia in candidato.experiencias"
            :key="experiencia.id"
          >
            <b>{{ experiencia.puesto }}</b> - ({{ experiencia.desde }} -
            {{ experiencia.hasta }}) - en <b>{{ experiencia.empresa }}</b>
          </li>
        </ul>
      </v-col>
    </v-row>

    <h3 class="section-title text-blue mt-10">Puestos Aspirantes</h3>
    <v-row>
      <v-col
        v-for="puesto in candidato.puestos"
        :key="puesto.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="puesto-card">
          <v-card-text>
            <h3 class="font-weight-bold text-blue mb-2">{{ puesto.nombre }}</h3>
            <p><b>Nivel de Riesgo:</b> {{ puesto.nivelDeRiesgo }}</p>
            <p><b>Salario minimo:</b> {{ puesto.nivelMinimoSalario }}</p>
            <p><b>Nivel de Riesgo:</b> {{ puesto.nivelMaximoSalario }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="reclutarParaPuesto(puesto)"
              >Reclutar para este puesto</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script>
import axios from "axios";

export default {
  props: {
    candidatoId: {
      required: true,
    },
  },
  data() {
    return {
      candidato: null,
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`/candidato/${this.candidatoId}`);
      this.candidato = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async reclutarParaPuesto(puesto) {
      const empleado = {
        nombre: this.candidato.nombre,
        cedula: this.candidato.cedula,
        fechaIngreso:  new Date().toISOString().slice(0, 10),
        departamento: this.candidato.departamento,
        puesto: puesto.nombre,
        salario: this.candidato.salarioAspirante,
        estado: true,
      };

      try {
        const response = await axios.get("/empleado");

        if (response.data) {
          const empleados = response.data ?? undefined;
          const empleadoIndex = empleados
            ? empleados.find(
                (item) =>
                  item.cedula === this.candidato.cedula &&
                  item.puesto === puesto.nombre
              )
            : undefined;

          if (empleadoIndex !== undefined) {
            this.$toasted.show(
              "Este candidato ya ha sido reclutado para este puesto",
              {
                position: "bottom-right",
                duration: 3000,
                theme: "toasted-primary",
                type: "info",
              }
            );

            return;
          }
        }
      } catch (error) {
        throw error;
      }

      try {
        await axios.post("/empleado", empleado);
        this.$toasted.show(
          "Candidato reclutado, puede ver los detalles en empleado",
          {
            position: "bottom-right",
            duration: 3000,
            theme: "toasted-primary",
            type: "success",
          }
        );
      } catch (error) {
        this.$toasted.show("Ha ocurrido un error reclutando el candidato", {
          position: "bottom-right",
          duration: 3000,
          theme: "toasted-primary",
          type: "error",
        });

        console.log(error);
      }
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>
  
  <style scoped>
.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 24px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 12px;
}

ul {
  margin-left: 24px;
  list-style-type: disc;
}

.puesto-card {
  padding: 16px;
  margin-bottom: 16px;
}
</style>
  