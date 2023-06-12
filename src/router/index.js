import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import CandidatoForm from "../components/candidato/candidatoForm.vue";

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
        path: "/candidato",
        name: "candidato",
        component: CandidatoForm
      }
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
