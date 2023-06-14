import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import CandidatoForm from "../components/candidato/candidatoForm.vue";
import CandidatosList from "../components/candidato/candidatosList.vue"
import IdiomasList from "../components/idiomas/idiomasList.vue"
import PuestosList from "../components/puestos/puestosList.vue"
import CapacitacionesList from "../components/capacitaciones/capacitacionesList.vue"
import CompetenciasList from "../components/competencias/competenciasList.vue"
import ExperienciasList from "../components/experiencia/experienciasList.vue"
import DetalleCandidato from "../components/candidato/candidatoDetails.vue"
import EmpleadosList from "../components/empleados/empleadoList.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "",
        redirect: (to) => {
          const isAdmin = getCookie("admin") === "true";
          return isAdmin ? "/candidatos" : "/candidato";
        },
      },
      {
        path: "/candidato",
        name: "candidato",
        component: CandidatoForm
      },
      {
        path: "/candidatos",
        name: "candidatos",
        component: CandidatosList
      },
      {
        path: "/idiomas",
        name: "idiomas",
        component: IdiomasList
      },
      {
        path: "/puestos",
        name: "puestos",
        component: PuestosList
      },
      {
        path: "/capacitaciones",
        name: "capacitaciones",
        component: CapacitacionesList
      },
      {
        path: "/competencias",
        name: "competencias",
        component: CompetenciasList
      },
      {
        path: "/experiencias",
        name: "experiencias",
        component: ExperienciasList
      },
      {
        path: "/candidato/:candidatoId",
        name: "detalle-candidato",
        component: DetalleCandidato,
        props: true,
      },
      {
        path: "/empleados",
        name: "empleados",
        component: EmpleadosList,
      },
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = getCookie('token'); // Obtener el valor de la cookie 'token'

  if ((to.name !== 'login' && !token) && (to.name !== 'register' && !token)) {
    next({ name: 'login' }); // Redireccionar al inicio de sesión
  } else {
    next(); // Continuar con la navegación normal
  }
});

// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export default router;
