function mostrarAlerta() {
  alert("Tu carrito está vacio");
}



function enviarMensaje() {
  alert("Guardado exitosamente");
}


function slug(nombre) {
      return nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    let carrito = [];

    function ajustarProducto(nombre, precio, cantidad) {
      const index = carrito.findIndex(p => p.nombre === nombre);
      if (index >= 0) {
        carrito[index].cantidad += cantidad;
        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
      } else if (cantidad > 0) {
        carrito.push({ nombre, precio, cantidad });
      }
      actualizarCarrito();
      actualizarCantidadUI(nombre);
      mostrarMensaje(`${nombre}: ${cantidad > 0 ? 'Agregado' : 'Quitado'}`);
    }

    function actualizarCantidadUI(nombre) {
      const prod = carrito.find(p => p.nombre === nombre);
      const cantidad = prod ? prod.cantidad : 0;
      const span = document.getElementById("qty-" + slug(nombre));
      if (span) span.textContent = cantidad;
    }

    function actualizarCarrito() {
      const contenedor = document.getElementById("cart-items");
      const subtotalEl = document.getElementById("cart-subtotal");
      const ivaEl = document.getElementById("cart-iva");
      const totalIvaEl = document.getElementById("cart-total-iva");
      const envioEl = document.getElementById("cart-envio");
      const totalEl = document.getElementById("cart-total");
      const section = document.getElementById("cart-section");

      if (carrito.length === 0) {
        section.style.display = "none";
        return;
      }

      section.style.display = "block";
      contenedor.innerHTML = "";
      let totalConIVA = 0;

      carrito.forEach((prod, i) => {
        const precioTotal = prod.precio * prod.cantidad;
        totalConIVA += precioTotal;

        const div = document.createElement("div");
        div.className = "cart__item";
        div.innerHTML = `
          <span class="cart__item-name">${prod.nombre}</span>
          <div class="cart__controls">
            <button onclick="ajustarProducto('${prod.nombre}', ${prod.precio}, -1)" class="btn btn-sm btn-secondary cart__button">−</button>
            <span>${prod.cantidad}</span>
            <button onclick="ajustarProducto('${prod.nombre}', ${prod.precio}, 1)" class="btn btn-sm btn-primary cart__button">+</button>
            <button onclick="eliminar(${i})" class="btn btn-sm cart__button cart__button--delete">Eliminar</button>
          </div>
          <span class="cart__price">$${(precioTotal).toLocaleString()}</span>
        `;
        contenedor.appendChild(div);
      });

      const neto = Math.round(totalConIVA / 1.19);
      const iva = totalConIVA - neto;
      const despacho = totalConIVA < 100000 ? Math.round(totalConIVA * 0.05) : 0;
      const totalFinal = totalConIVA + despacho;

      subtotalEl.textContent = neto.toLocaleString();
      ivaEl.textContent = iva.toLocaleString();
      totalIvaEl.textContent = totalConIVA.toLocaleString();
      envioEl.textContent = despacho.toLocaleString();
      totalEl.textContent = totalFinal.toLocaleString();
    }

    function eliminar(index) {
      const nombre = carrito[index].nombre;
      carrito.splice(index, 1);
      actualizarCarrito();
      actualizarCantidadUI(nombre);
      mostrarMensaje(`Producto eliminado`);
    }

    function vaciarCarrito() {
      carrito = [];
      document.querySelectorAll(".product__quantity").forEach(span => span.textContent = 0);
      actualizarCarrito();
      mostrarMensaje("Carrito vacío");
    }


function finalizarCompra() {
  const cartSection = document.getElementById('cart-section');
  const formSection = document.getElementById('datos-despacho');

  
  const cantidades = document.querySelectorAll('.product__quantity');
  let hayProductos = false;
  cantidades.forEach(c => {
    if (parseInt(c.textContent) > 0) hayProductos = true;
  });

  if (!hayProductos) {
    alert("No hay productos seleccionados.");
    return;
  }

  
  cartSection.style.display = "none";
  formSection.style.display = "block";
}


function generarBoleta() {
  const form = document.getElementById('form-despacho');
  if (!form.checkValidity()) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const direccion = document.getElementById('direccion').value;
  const comuna = document.getElementById('comuna').value;
  const region = document.getElementById('region').value;
  const nombreReceptor = document.getElementById('nombre-receptor').value;
  const emailComprador = document.getElementById('email-comprador').value;
  const emailBoleta = document.getElementById('email-boleta').value;

  const formSection = document.getElementById('datos-despacho');
  const boletaSection = document.getElementById('boleta-section');
  const boletaDetalle = document.getElementById('boleta-detalle');


  const cantidades = document.querySelectorAll('.product__quantity');
  const productosComprados = [];

  cantidades.forEach(cantEl => {
    const cantidad = parseInt(cantEl.textContent);
    if (cantidad > 0) {
      const productCard = cantEl.closest('.product');
      const nombre = productCard.querySelector('.product__title').textContent;
      const precioText = productCard.querySelector('.product__price').textContent;
      const precio = parseInt(precioText.replace(/[^\d]/g, ''));
      productosComprados.push({ nombre, cantidad, precio });
    }
  });


  let subtotal = 0;
  productosComprados.forEach(item => {
    subtotal += item.precio * item.cantidad;
  });

  const neto = Math.round(subtotal / 1.19);
  const iva = subtotal - neto;
  const envio = subtotal >= 100000 ? 0 : 5000;
  const total = subtotal + envio;


  const boletaNum = Math.floor(Math.random() * 900000 + 100000);
  const fecha = new Date().toLocaleString("es-CL");


  let detalleHTML = `
    <p><strong>Te Lo Vendo</strong><br>
    Boleta N° <strong>${boletaNum}</strong><br>
    Fecha: ${fecha}</p>

    <hr>
    <h5>📦 Datos de despacho</h5>
    <p>
      <strong>Nombre receptor:</strong> ${nombreReceptor}<br>
      <strong>Dirección:</strong> ${direccion}, ${comuna}, ${region}<br>
      <strong>Correo comprador:</strong> ${emailComprador}<br>
      <strong>Enviar boleta a:</strong> ${emailBoleta}
    </p>

    <hr>
   <h5>🛒 Detalle de compra</h5>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
  `;

  productosComprados.forEach(item => {
    detalleHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio.toLocaleString('es-CL')}</td>
        <td>$${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
      </tr>`;
  });

  detalleHTML += `
      </tbody>
    </table>
    <hr>
    <p>Valor neto (sin IVA): <strong>$${neto.toLocaleString('es-CL')}</strong></p>
    <p>IVA (19%): <strong>$${iva.toLocaleString('es-CL')}</strong></p>
    <p>Despacho: <strong>$${envio.toLocaleString('es-CL')}</strong> ${envio === 0 ? "(Gratis)" : ""}</p>
    <h5>Total a pagar: <strong>$${total.toLocaleString('es-CL')}</strong></h5>
    <hr>
    <p>¡Gracias por comprar en <strong>Te Lo Vendo</strong>!</p>

    <button class="btn btn-outline-primary" onclick="enviarBoleta('${emailBoleta}', '${boletaNum}')">
      Enviar boleta por correo
    </button>
  `;

  boletaDetalle.innerHTML = detalleHTML;

 
  formSection.style.display = "none";
  boletaSection.style.display = "block";
}


function enviarBoleta(emailDestino, numeroBoleta) {
  const asunto = encodeURIComponent(`Boleta de compra N° ${numeroBoleta} - Te Lo Vendo`);
  const cuerpo = encodeURIComponent("Estimado cliente,\n\nAdjuntamos el detalle de su compra en Te Lo Vendo.\nGracias por preferirnos.\n\nAtentamente,\nTe Lo Vendo");
  window.location.href = `mailto:${emailDestino}?subject=${asunto}&body=${cuerpo}`;
}
    function mostrarMensaje(texto) {
      const mensaje = document.getElementById("feedback-message");
      mensaje.textContent = texto;
      mensaje.style.display = "block";
      setTimeout(() => mensaje.style.display = "none", 2000);
    }


    