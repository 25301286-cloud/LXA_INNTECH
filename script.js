
const STORE_CONFIG = {
  contactEmail: "lxainntech@gmail.com",
  socials: {
    instagram: "https://www.instagram.com/lxa_inntech?psln=MXVtNjgwOWp4d2xqNQ%3D%3D&utm_source=qr",
    tiktok: "https://www.tiktok.com/@lxa.inntech?_r=1&_t=ZS-9AhgiNpNMnw",
    youtube: "https://youtube.com/@lxainntech?si=Kn0OJlCjPfIyQOGr",
    facebook: "https://www.facebook.com/share/1HzWT6g3nc/?mibextid=wwXIfr"
  }
};

const PRODUCTS = {
  lite: { name: "Mirr-X Day Lite", price: 8999 },
  plus: { name: "Mirr-X Day Plus", price: 13499 },
  pro: { name: "Mirr-X Day Pro Max", price: 19999 }
};

const DEMO_CONTENT = {
  rutina: {
    label: "Rutina diaria",
    title: "Organiza tu día antes de salir.",
    text: "Agrega clases, reuniones, gimnasio, entregas y recordatorios para verlos directamente en el espejo."
  },
  clima: {
    label: "Clima del día",
    title: "Prepárate según lo que pasa afuera.",
    text: "Consulta temperatura y condición del día para anticiparte antes de salir de casa."
  },
  outfit: {
    label: "Outfit sugerido",
    title: "Recibe una sugerencia acorde al clima.",
    text: "Mirr-X Day puede combinar información del clima con tus preferencias para proponerte una opción de vestimenta."
  },
  ia: {
    label: "Asistente IA",
    title: "Pregunta mientras continúas con tu rutina.",
    text: "Utiliza la IA para resolver dudas, pedir recomendaciones o consultar información útil sin salir de la experiencia del espejo."
  }
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function currency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$('#mainNav a').forEach(link => link.addEventListener('click', () => mainNav.classList.remove('open')));

const header = $(".site-header");
const progress = $("#scrollProgress");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (window.scrollY / height) * 100 : 0;
  progress.style.width = `${percent}%`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

const tilt = $('[data-tilt]');
if (tilt && window.matchMedia('(pointer:fine)').matches) {
  tilt.addEventListener('mousemove', (event) => {
    const rect = tilt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    tilt.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 6}deg)`;
  });
  tilt.addEventListener('mouseleave', () => tilt.style.transform = 'perspective(1100px) rotateY(0) rotateX(0)');
}

const demoTitle = $("#demoTitle");
const demoText = $("#demoText");
const demoPanel = $("#demoPanel");
const aiExample = $("#aiExample");
const demoLabel = $(".demo-label", demoPanel);
$$('.demo-tab').forEach(button => {
  button.addEventListener('click', () => {
    $$('.demo-tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    const key = button.dataset.demo;
    const data = DEMO_CONTENT[key];
    demoPanel.animate([{opacity:.25, transform:'translateY(8px)'},{opacity:1, transform:'translateY(0)'}], {duration:320, easing:'ease'});
    demoLabel.textContent = data.label;
    demoTitle.textContent = data.title;
    demoText.textContent = data.text;
    aiExample.hidden = key !== 'ia';
  });
});

let cart = JSON.parse(localStorage.getItem("lxaCart") || "[]");
const cartDrawer = $("#cartDrawer");
const cartItems = $("#cartItems");
const cartEmpty = $("#cartEmpty");
const cartCount = $("#cartCount");
const cartTotal = $("#cartTotal");
const drawerOverlay = $("#drawerOverlay");

function saveCart() {
  localStorage.setItem("lxaCart", JSON.stringify(cart));
}

function renderCart() {
  cartItems.innerHTML = "";
  cartCount.textContent = cart.length;
  cartEmpty.style.display = cart.length ? "none" : "block";
  let total = 0;

  cart.forEach((key, index) => {
    const product = PRODUCTS[key];
    total += product.price;
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <div>
        <h4>${product.name}</h4>
        <p>${currency(product.price)}</p>
      </div>
      <button type="button" data-remove="${index}">Quitar</button>
    `;
    cartItems.appendChild(item);
  });

  cartTotal.textContent = currency(total);
  $$('[data-remove]', cartItems).forEach(button => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.remove), 1);
      saveCart();
      renderCart();
    });
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  drawerOverlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  drawerOverlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
}

$$('.add-cart').forEach(button => {
  button.addEventListener('click', () => {
    cart.push(button.dataset.product);
    saveCart();
    renderCart();
    showToast(`${PRODUCTS[button.dataset.product].name} se agregó al carrito.`);
    openCart();
  });
});

$("#cartButton").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
drawerOverlay.addEventListener("click", closeCart);
renderCart();

const orderModal = $("#orderModal");
const orderSummary = $("#orderSummary");
const modalClose = $("#modalClose");

$("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Agrega al menos un modelo antes de continuar.");
    return;
  }
  const lines = cart.map((key, i) => `${i + 1}. ${PRODUCTS[key].name} — ${currency(PRODUCTS[key].price)}`);
  const total = cart.reduce((sum, key) => sum + PRODUCTS[key].price, 0);
  orderSummary.textContent = `LXA-INNTECH — Resumen de pedido\n\n${lines.join("\n")}\n\nTotal estimado: ${currency(total)}\n\n`;
  orderModal.classList.add("show");
  orderModal.setAttribute("aria-hidden", "false");
  closeCart();
});
function closeModal() {
  orderModal.classList.remove("show");
  orderModal.setAttribute("aria-hidden", "true");
}
modalClose.addEventListener("click", closeModal);
orderModal.addEventListener("click", e => { if (e.target === orderModal) closeModal(); });

$("#copyOrder").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(orderSummary.textContent);
    showToast("Resumen copiado.");
  } catch {
    showToast("Selecciona y copia el resumen manualmente.");
  }
});

$("#contactForm").addEventListener("submit", async event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Solicitud de información LXA-INNTECH\nNombre: ${data.get('name')}\nCorreo: ${data.get('email')}\nModelo: ${data.get('model')}\nMensaje: ${data.get('message') || 'Sin mensaje adicional'}`;
  try {
    await navigator.clipboard.writeText(message);
    $("#formStatus").textContent = "Mensaje preparado y copiado. Ahora puedes pegarlo en tu canal real de contacto.";
    showToast("Mensaje copiado. No se almacenó ningún dato.");
  } catch {
    $("#formStatus").textContent = "El sitio no envía ni almacena datos. Copia manualmente tu información para contactar al negocio.";
  }
});

function isConfigured(value) {
  return typeof value === "string" && value.startsWith("http");
}
$$('[data-social]').forEach(link => {
  const network = link.dataset.social;
  const url = STORE_CONFIG.socials[network];
  if (isConfigured(url)) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener('click', e => {
      e.preventDefault();
      showToast(`Agrega el enlace de ${network} en STORE_CONFIG.socials dentro de script.js.`);
    });
  }
});

const emailLink = $("#emailLink");
if (STORE_CONFIG.contactEmail.includes('@') && !STORE_CONFIG.contactEmail.includes('PEGA_AQUI')) {
  emailLink.href = `mailto:${STORE_CONFIG.contactEmail}`;
  emailLink.textContent = STORE_CONFIG.contactEmail;
} else {
  emailLink.addEventListener('click', e => {
    e.preventDefault();
    showToast('Agrega tu correo en STORE_CONFIG.contactEmail dentro de script.js.');
  });
}


window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    closeModal();
    mainNav.classList.remove('open');
  }
});
