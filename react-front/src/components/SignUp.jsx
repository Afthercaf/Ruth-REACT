import React, { useState } from "react";
import { useAuth } from '../context/authContext'; // Importa el hook useAuth

const SignUpPage = () => {
  const { signup } = useAuth(); // Usa el hook useAuth para obtener la función signup
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password1 !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      // Llama a la función signup con los datos del formulario
      await signup({ fullname, email, password: password1 });
      setSuccess("¡Registro exitoso! Por favor, inicia sesión.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error durante el registro");
      setSuccess("");
    }
  };

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <form onSubmit={handleSubmit} className="card card-body bg-dark text-white p-5">
            <h3 className="text-center fw-bold mb-4">Registro</h3>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <label htmlFor="fullname">Escribe tu nombre completo:</label>
            <input
              type="text"
              name="fullname"
              placeholder="Nombre Completo"
              className="form-control mb-3"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              autoFocus
            />

            <label htmlFor="email">Escribe tu correo electrónico:</label>
            <input
              type="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password1">Escribe tu contraseña:</label>
            <input
              type="password"
              name="password1"
              placeholder="Contraseña"
              className="form-control mb-3"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />

            <label htmlFor="password2">Confirma tu contraseña:</label>
            <input
              type="password"
              name="password2"
              placeholder="Confirmar Contraseña"
              className="form-control mb-3"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />

            <button className="btn btn-success btn-block">
              Registrar
            </button>
          </form>

          <p className="fs-5 text-center text-white mt-3">
            ¿Ya tienes una cuenta?{" "}
            <a href="/signin" className="text-info">Iniciar sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
