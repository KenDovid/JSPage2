const form = document.getElementById("formRegistro");
const campos = [
  "nombre",
  "apellido",
  "email",
  "edad",
  "fechaNacimiento", 
  "genero",
  "pais",
  "descripcion", 
  "terminos" 
]
const barra =  document.getElementById("barra")
const descripcion = document.getElementById("descripcion");
const contador = document.getElementById("contador");
const btnEnviar = document.getElementById("btnEnviar");
const btnBorrar = document.getElementById("btnBorrar");

// Actualizar contador de caracteres
descripcion.addEventListener("input", () => {
  contador.textContent = `${descripcion.value.length}/150 caracteres`;
});

// Evento principal: validar y descargar JSON
btnEnviar.addEventListener("click", (e) => {
  e.preventDefault(); // evita el envío por defecto
  validarYDescargar();
});

// Limpia formulario y errores al borrar
btnBorrar.addEventListener("click", () => {
  form.reset();
  contador.textContent = "0/150 caracteres";
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
});

// Función principal de validación
function validarYDescargar() {
  let valido = true;

  // Limpiamos errores previos
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));

  // Validar nombre
  if (document.getElementById("nombre").value.trim() === "") {
    document.getElementById("error-nombre").textContent =
      "El nombre es obligatorio.";
    valido = false;
  }

  // Validar apellido
  if (document.getElementById("apellido").value.trim() === "") {
    document.getElementById("error-apellido").textContent =
      "El apellido es obligatorio.";
    valido = false;
  }

  // Validar Email
  const email = document.getElementById("email").value.trim();
  if (email === "" || !email.includes("@")) {
    document.getElementById("error-email").textContent =
      "Ingrese un correo válido.";
    valido = false;
  }

  // Validar edad
  const edad = document.getElementById("edad").value.trim();
  if (edad === "" || edad < 1 || edad > 120) {
    document.getElementById("error-edad").textContent =
      "Ingrese una edad válida.";
    valido = false;
  }

  // Validar fecha
  if (document.getElementById("fechaNacimiento").value === "") {
    document.getElementById("error-fechaNacimiento").textContent =
      "La fecha es obligatoria.";
    valido = false;
  }

  // Validar género
  if (document.getElementById("genero").value === "Seleccionar...") {
    document.getElementById("error-genero").textContent =
      "Seleccione un género.";
    valido = false;
  }

  // Validar país
  if (document.getElementById("pais").value.trim() === "") {
    document.getElementById("error-pais").textContent =
      "El país es obligatorio.";
    valido = false;
  }

  // Validar descripción
  if (document.getElementById("descripcion").value.trim() === "") {
    document.getElementById("error-descripcion").textContent =
      "La descripción es obligatoria.";
    valido = false;
  }

  // Validar términos
  if (!document.getElementById("terminos").checked) {
    document.getElementById("error-terminos").textContent =
      "Debe aceptar los términos y condiciones.";
    valido = false;
  }

  // Si todo es válido, generar JSON
  if (valido) {
    const datosUsuario = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      email: document.getElementById("email").value,
      edad: document.getElementById("edad").value,
      nacimiento: document.getElementById("fechaNacimiento").value,
      genero: document.getElementById("genero").value,
      pais: document.getElementById("pais").value,
      descripcion: document.getElementById("descripcion").value,
      terminos: document.getElementById("terminos").checked,
    };

    const blob = new Blob([JSON.stringify(datosUsuario, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "datos_formulario.json";
    a.click();
    URL.revokeObjectURL(url);

    alert("¡Su información ha sido registrada!");
  }
}
// Actualizar progreso
function actualizarProgreso() {
  let completados = 0;
  const total = campos.length - 1; // excluimos el checkbox "terminos"

  campos.forEach((id) => {
    const campo = document.getElementById(id);

    if (campo.type === "checkbox") {
      // no se incluye en el conteo
      return;
    } 
    else if (campo.tagName === "SELECT") {
      if (campo.value !== "Seleccionar...") completados++;
    } 
    else if (campo.value && campo.value.trim() !== "") {
      completados++;
    }
  });

  // Calcular porcentaje
  const porcentaje = Math.round((completados / total) * 100);

  // Actualizar la barra
  barra.style.width = porcentaje + "%";

  // Colores dinámicos según avance
  if (porcentaje < 40) barra.style.backgroundColor = "#f87171";   // rojo suave
  else if (porcentaje < 80) barra.style.backgroundColor = "#facc15"; // amarillo
  else barra.style.backgroundColor = "#4ade80"; // verde
}

// 🔄 Escuchar cambios en los campos
campos.forEach((id) => {
  const campo = document.getElementById(id);

  if (campo.type === "checkbox" || campo.tagName === "SELECT") {
    campo.addEventListener("change", actualizarProgreso);
  } else {
    campo.addEventListener("input", actualizarProgreso);
  }
});

// 🧹 Reiniciar barra al limpiar el formulario
btnBorrar.addEventListener("click", () => {
  setTimeout(() => {
    actualizarProgreso();
  }, 100); // pequeño retraso para que reset() borre los campos primero
});

// 🚀 Inicializar progreso al cargar la página
document.addEventListener("DOMContentLoaded", actualizarProgreso);
