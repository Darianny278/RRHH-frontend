<template>
  <div>
    <v-navigation-drawer v-model="drawer" app color="#0d4382">
      <v-list>
         <v-img src="../assets/unapec-escudo.png" max-width="100" class="mx-auto" contain />
        <v-list-item
          v-for="option in sideOptions"
          :key="option.title"
          link
          class="text-white font-weight-bold"
          @click="$router.push({name : option.route})"
        >
          <v-list-item-icon>
            <v-icon color="#fff">{{ option.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-white">{{ option.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#fafbfb">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn @click="logout" class="ml-auto" outlined color="#0d4382">Cerrar sesion</v-btn>
    </v-app-bar>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>


<style scoped>
.content {
  margin-left: 240px; /* Ajusta el margen para que la vista se muestre al lado del sidebar */
}
</style>

<script>
import Cookies from 'js-cookie';
import {getCookie} from '../plugins/cookie'

export default {
  name: "HomeView",

  data() {
    return {
      drawer: false,
      sidebarOptions: [
        { title: "Candidato", icon: "mdi-account-multiple-outline", route: "candidato" },
        { title: "Idiomas", icon: "mdi-translate", route: "option2" },
        { title: "Puestos", icon: "mdi-state-machine", route: "option3" },
        { title: "Capacitaciones", icon: "mdi-flag-checkered", route: "option3"},
        { title: "Competencias", icon: "mdi-flag-checkered", route: "option3"},
        { title: "Experiencia Laboral", icon: "mdi-folder-information", route: "option3"},
      ],
      sidebarOptionsAdmin: [
        { title: "Candidatos", icon: "mdi-account-multiple-outline", route: "option1" },
        { title: "Idiomas", icon: "mdi-translate", route: "option2" },
        { title: "Puestos", icon: "mdi-state-machine", route: "option3" },
        { title: "Empleados", icon: "mdi-account-multiple-outline", route: "option3" },
      ],
      isAdmin: getCookie('admin') === true
    };
  },
  computed: {
    sideOptions() {
      return this.isAdmin ? this.sidebarOptionsAdmin : this.sidebarOptions
    }
  }, 
  methods: {
    selectOption(option) {
      console.log(option);
    },
    logout() {
      Cookies.remove('token');
      Cookies.remove('userId');
      Cookies.remove('admin');
      this.$router.push({name: 'login'})
    }
  },
};
</script>