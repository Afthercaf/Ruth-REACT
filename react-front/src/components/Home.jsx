import React from 'react';

function HomePage() {
  return (
    <main className="index">
      <header className="bg-image d-flex">
        <div className="text-center m-auto p-5 bg-dark">
          <h1 className="mb-1 display-1">TecnoShop</h1>
          <h3 className="mb-5">
            <em>Compra tus Productos favoritos en nuestro sitio</em>
          </h3>
          <a className="btn btn-primary btn-lg" href="/signin">
            Empecemos
          </a>
        </div>
        <div className="overlay"></div>
      </header>
    </main>
  );
}

export default HomePage;
