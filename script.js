"use strict";

/* =========================================================
   ÚTILHUB V12 — GRAN-MASTER-NOVA
   NOVA FLOW 3.0
========================================================= */

const STORAGE = {
  favorites: "utilhub_v12_favorites",
  recent: "utilhub_v12_recent",
  notes: "utilhub_v12_notes",
  tasks: "utilhub_v12_tasks",
  shopping: "utilhub_v12_shopping",
  study: "utilhub_v12_study",
  agenda: "utilhub_v12_agenda",
  expenses: "utilhub_v12_expenses",
  settings: "utilhub_v12_settings",
  currency: "utilhub_v12_currency"
};

const defaultSettings = {
  dark: true,
  animations: true,
  cursor: true,
  performance: false
};

let settings = {
  ...defaultSettings,
  ...load(STORAGE.settings, {})
};

let activeCategory = "all";
let timerState = {
  total: 0,
  remaining: 0,
  running: false,
  startedAt: 0,
  interval: null
};

let stopwatchState = {
  elapsed: 0,
  running: false,
  startedAt: 0,
  interval: null
};

/* =========================================================
   TOOLS
========================================================= */

const tools = [
  {
    id: "calculator",
    icon: "🧮",
    name: "Calculadora",
    description: "Calcula operaciones de forma segura.",
    category: "calculo",
    keywords: "sumar restar multiplicar dividir operación matemáticas"
  },
  {
    id: "percentage",
    icon: "📊",
    name: "Porcentajes",
    description: "Calcula porcentajes rápidamente.",
    category: "calculo",
    keywords: "porcentaje porcentaje de cantidad"
  },
  {
    id: "discount",
    icon: "💸",
    name: "Descuentos",
    description: "Calcula precio final y ahorro.",
    category: "dinero",
    keywords: "descuento oferta precio ahorro"
  },
  {
    id: "rule3",
    icon: "🔢",
    name: "Regla de tres",
    description: "Resuelve proporciones.",
    category: "calculo",
    keywords: "proporción regla tres"
  },
  {
    id: "converter",
    icon: "📏",
    name: "Conversor",
    description: "Convierte longitud, peso, volumen y tiempo.",
    category: "calculo",
    keywords: "metros kilos litros segundos unidades"
  },
  {
    id: "temperature",
    icon: "🌡️",
    name: "Temperatura",
    description: "Convierte Celsius, Fahrenheit y Kelvin.",
    category: "calculo",
    keywords: "celsius fahrenheit kelvin temperatura"
  },
  {
    id: "currency",
    icon: "💱",
    name: "Monedas",
    description: "Convierte monedas usando tasas disponibles.",
    category: "dinero",
    keywords: "soles dólares euros dinero moneda cambio"
  },
  {
    id: "finance",
    icon: "📈",
    name: "Finanzas",
    description: "Interés simple, compuesto y ahorro.",
    category: "dinero",
    keywords: "interés ahorro inversión finanzas"
  },
  {
    id: "expenses",
    icon: "🧾",
    name: "Gastos",
    description: "Registra y calcula tus gastos.",
    category: "dinero",
    keywords: "gastos presupuesto dinero"
  },
  {
    id: "dates",
    icon: "📅",
    name: "Fechas",
    description: "Calcula diferencias entre fechas.",
    category: "tiempo",
    keywords: "fecha días calendario"
  },
  {
    id: "age",
    icon: "🎂",
    name: "Edad",
    description: "Calcula una edad aproximada.",
    category: "tiempo",
    keywords: "cumpleaños edad años"
  },
  {
    id: "timer",
    icon: "⏲️",
    name: "Temporizador",
    description: "Cuenta regresiva precisa.",
    category: "tiempo",
    keywords: "temporizador cuenta regresiva"
  },
  {
    id: "stopwatch",
    icon: "⏱️",
    name: "Cronómetro",
    description: "Mide el tiempo con precisión.",
    category: "tiempo",
    keywords: "cronómetro tiempo"
  },
  {
    id: "notes",
    icon: "📝",
    name: "Notas",
    description: "Guarda tus notas localmente.",
    category: "organizacion",
    keywords: "notas escribir guardar"
  },
  {
    id: "tasks",
    icon: "✅",
    name: "Tareas",
    description: "Organiza tareas pendientes.",
    category: "organizacion",
    keywords: "tareas pendientes checklist"
  },
  {
    id: "shoppingList",
    icon: "🛒",
    name: "Lista de compras",
    description: "Productos, cantidades y precios.",
    category: "organizacion",
    keywords: "compras supermercado lista productos"
  },
  {
    id: "agenda",
    icon: "📆",
    name: "Agenda",
    description: "Guarda eventos y fechas importantes.",
    category: "organizacion",
    keywords: "agenda evento cita calendario"
  },
  {
    id: "study",
    icon: "📚",
    name: "Organizador de estudio",
    description: "Planifica materias y tareas.",
    category: "estudio",
    keywords: "estudio materias tareas examen"
  },
  {
    id: "password",
    icon: "🔐",
    name: "Contraseña",
    description: "Genera contraseñas aleatorias.",
    category: "utilidades",
    keywords: "seguridad contraseña password"
  },
  {
    id: "random",
    icon: "🎯",
    name: "Número aleatorio",
    description: "Obtén un número dentro de un rango.",
    category: "utilidades",
    keywords: "aleatorio random número"
  },
  {
    id: "dice",
    icon: "🎲",
    name: "Dados",
    description: "Lanza dados virtuales.",
    category: "utilidades",
    keywords: "dado juego"
  },
  {
    id: "qr",
    icon: "▣",
    name: "Generador QR",
    description: "Crea un código QR desde un texto o enlace.",
    category: "utilidades",
    keywords: "qr código enlace url"
  },
  {
    id: "text",
    icon: "🔤",
    name: "Herramientas de texto",
    description: "Cuenta, limpia y transforma texto.",
    category: "texto",
    keywords: "texto palabras letras contar"
  },
  {
    id: "case",
    icon: "Aa",
    name: "Mayúsculas y minúsculas",
    description: "Cambia rápidamente el formato.",
    category: "texto",
    keywords: "mayúsculas minúsculas texto"
  },
  {
    id: "dictionary",
    icon: "📖",
    name: "Diccionario",
    description: "Busca definiciones en español.",
    category: "texto",
    keywords: "palabra definición significado"
  },
  {
    id: "food",
    icon: "🍔",
    name: "Comida",
    description: "Busca restaurantes y comida.",
    category: "utilidades",
    keywords: "restaurante comida pizza hamburguesa"
  },
  {
    id: "shopping",
    icon: "🛍️",
    name: "Compras",
    description: "Busca productos y tiendas.",
    category: "utilidades",
    keywords: "tienda comprar producto compras"
  },
  {
    id: "nearby",
    icon: "📍",
    name: "Cerca de mí",
    description: "Busca lugares y servicios.",
    category: "utilidades",
    keywords: "cerca farmacia banco supermercado"
  }
];

/* =========================================================
   STORAGE
========================================================= */

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   NOVA FLOW 3.0
========================================================= */

function createNova() {
  const particles = document.getElementById("novaParticles");
  const stars = document.getElementById("novaStars");

  if (!particles || !stars) return;

  particles.innerHTML = "";
  stars.innerHTML = "";

  const particleCount = window.innerWidth < 600 ? 18 : 38;
  const starCount = window.innerWidth < 600 ? 12 : 28;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("span");

    p.className = "nova-particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.setProperty("--drift", `${(Math.random() * 240 - 120).toFixed(0)}px`);
    p.style.animationDuration = `${10 + Math.random() * 18}s`;
    p.style.animationDelay = `${Math.random() * -20}s`;

    particles.appendChild(p);
  }

  for (let i = 0; i < starCount; i++) {
    const s = document.createElement("span");

    s.className = "nova-star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = `${Math.random() * -3}s`;

    stars.appendChild(s);
  }
}

function setupCursor() {
  const orbs = document.querySelectorAll(".nova-orb");

  document.addEventListener("pointermove", event => {
    if (!settings.cursor || settings.performance) return;

    const x = event.clientX / window.innerWidth - .5;
    const y = event.clientY / window.innerHeight - .5;

    orbs.forEach((orb, index) => {
      const strength = (index + 1) * 10;

      orb.style.marginLeft = `${x * strength}px`;
      orb.style.marginTop = `${y * strength}px`;
    });
  });
}

/* =========================================================
   SETTINGS
========================================================= */

function applySettings() {
  document.body.classList.toggle("light", !settings.dark);
  document.body.classList.toggle("no-animation", !settings.animations);
  document.body.classList.toggle("performance", settings.performance);

  document.getElementById("themeToggle")?.classList.toggle("active", settings.dark);
  document.getElementById("animationToggle")?.classList.toggle("active", settings.animations);
  document.getElementById("cursorToggle")?.classList.toggle("active", settings.cursor);
  document.getElementById("performanceToggle")?.classList.toggle("active", settings.performance);

  document.getElementById("themeBtn").textContent = settings.dark ? "☀️" : "🌙";
}

function toggleSetting(key) {
  settings[key] = !settings[key];
  save(STORAGE.settings, settings);
  applySettings();

  if (key === "animations" && settings.animations) {
    createNova();
  }

  toast("Ajuste actualizado.");
}

/* =========================================================
   RENDER TOOLS
========================================================= */

function renderTools(search = "") {
  const grid = document.getElementById("toolGrid");
  const noResults = document.getElementById("noResults");

  const query = search.trim().toLowerCase();

  const filtered = tools.filter(tool => {
    const categoryMatch =
      activeCategory === "all" || tool.category === activeCategory;

    const text =
      `${tool.name} ${tool.description} ${tool.keywords}`.toLowerCase();

    return categoryMatch && (!query || text.includes(query));
  });

  grid.innerHTML = filtered.map(toolCard).join("");

  noResults.classList.toggle("hidden", filtered.length > 0);

  document.getElementById("toolCount").textContent = tools.length;
}

function toolCard(tool) {
  const favorites = load(STORAGE.favorites, []);
  const active = favorites.includes(tool.id);

  return `
    <article class="tool-card">
      <div class="tool-top">
        <div class="tool-icon">${tool.icon}</div>

        <button
          class="favorite ${active ? "active" : ""}"
          title="Favorito"
          onclick="toggleFavorite('${tool.id}')"
        >
          ${active ? "★" : "☆"}
        </button>
      </div>

      <h3>${esc(tool.name)}</h3>
      <p>${esc(tool.description)}</p>

      <button class="tool-open" onclick="openTool('${tool.id}')">
        Abrir →
      </button>
    </article>
  `;
}

function renderQuick() {
  const box = document.getElementById("quickTools");
  const recent = load(STORAGE.recent, []);
  const favorites = load(STORAGE.favorites, []);

  const ids = [...favorites, ...recent];

  const unique = [...new Set(ids)]
    .map(id => tools.find(tool => tool.id === id))
    .filter(Boolean)
    .slice(0, 8);

  if (!unique.length) {
    unique.push(
      tools.find(t => t.id === "calculator"),
      tools.find(t => t.id === "notes"),
      tools.find(t => t.id === "tasks"),
      tools.find(t => t.id === "timer")
    );
  }

  box.innerHTML = unique.map(tool => `
    <div class="quick-card" onclick="openTool('${tool.id}')">
      <span class="emoji">${tool.icon}</span>
      <strong>${esc(tool.name)}</strong>
      <small>${esc(tool.description)}</small>
    </div>
  `).join("");

  document.getElementById("favoriteCount").textContent = favorites.length;
  document.getElementById("recentCount").textContent = recent.length;
}

function toggleFavorite(id) {
  let favorites = load(STORAGE.favorites, []);

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
    toast("Eliminado de favoritos.");
  } else {
    favorites.push(id);
    toast("Añadido a favoritos.");
  }

  save(STORAGE.favorites, favorites);

  renderTools(document.getElementById("globalSearch").value);
  renderQuick();
}

/* =========================================================
   MODAL
========================================================= */

function openModal(html) {
  const modal = document.getElementById("modal");
  document.getElementById("modalContent").innerHTML = html;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("modal");

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openTool(id) {

  if (id !== "favorites") {
    addRecent(id);
  }

  const content = toolContent(id);

  if (!content) return;

  openModal(content);
}

function addRecent(id) {
  let recent = load(STORAGE.recent, []);

  recent = [id, ...recent.filter(item => item !== id)].slice(0, 12);

  save(STORAGE.recent, recent);
  renderQuick();
}

/* =========================================================
   TOOL CONTENT
========================================================= */

function header(title, description) {
  return `
    <div class="modal-title">
      <h2>${title}</h2>
      <p>${description}</p>
    </div>
  `;
}

function toolContent(id) {

  switch (id) {

    case "calculator":
      return `
        ${header("🧮 Calculadora", "Realiza operaciones sin usar eval().")}

        <div class="tool-form">
          <input id="calcInput" placeholder="Ejemplo: (25 + 10) * 2 - 5">

          <div class="tool-buttons">
            <button class="btn primary" onclick="calculate()">Calcular</button>
            <button class="btn secondary" onclick="copyText('calcResult')">Copiar</button>
          </div>

          <div class="result-box">
            <div id="calcResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "percentage":
      return `
        ${header("📊 Porcentajes", "Calcula el porcentaje de una cantidad.")}

        <div class="tool-form">
          <div class="form-row">
            <div>
              <label>Porcentaje</label>
              <input id="percentValue" type="number" placeholder="20">
            </div>

            <div>
              <label>Cantidad</label>
              <input id="percentBase" type="number" placeholder="500">
            </div>
          </div>

          <button class="btn primary" onclick="calculatePercentage()">Calcular</button>

          <div class="result-box">
            Resultado:
            <div id="percentResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "discount":
      return `
        ${header("💸 Descuento", "Calcula ahorro y precio final.")}

        <div class="tool-form">
          <div class="form-row">
            <div>
              <label>Precio</label>
              <input id="discountPrice" type="number" placeholder="100">
            </div>

            <div>
              <label>Descuento %</label>
              <input id="discountPercent" type="number" placeholder="20">
            </div>
          </div>

          <button class="btn primary" onclick="calculateDiscount()">Calcular</button>

          <div class="result-box">
            <p>Ahorro</p>
            <div id="discountSave" class="result-big">—</div>
            <br>
            <p>Precio final</p>
            <div id="discountFinal" class="result-big">—</div>
          </div>
        </div>
      `;

    case "rule3":
      return `
        ${header("🔢 Regla de tres", "Calcula una proporción directa.")}

        <div class="tool-form">
          <div class="form-row">
            <input id="ruleA" type="number" placeholder="A">
            <input id="ruleB" type="number" placeholder="B">
          </div>

          <div class="form-row">
            <input id="ruleC" type="number" placeholder="C">
            <input value="X" disabled>
          </div>

          <button class="btn primary" onclick="calculateRule3()">Calcular X</button>

          <div class="result-box">
            <div id="ruleResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "converter":
      return `
        ${header("📏 Conversor", "Convierte unidades comunes.")}

        <div class="tool-form">
          <select id="converterType" onchange="updateConverterUnits()">
            <option value="length">Longitud</option>
            <option value="weight">Peso</option>
            <option value="volume">Volumen</option>
            <option value="time">Tiempo</option>
          </select>

          <input id="convertValue" type="number" placeholder="Cantidad">

          <div class="form-row">
            <select id="convertFrom"></select>
            <select id="convertTo"></select>
          </div>

          <button class="btn primary" onclick="convertUnits()">Convertir</button>

          <div class="result-box">
            <div id="convertResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "temperature":
      return `
        ${header("🌡️ Temperatura", "Convierte entre Celsius, Fahrenheit y Kelvin.")}

        <div class="tool-form">
          <input id="tempValue" type="number" placeholder="Temperatura">

          <div class="form-row">
            <select id="tempFrom">
              <option value="C">Celsius</option>
              <option value="F">Fahrenheit</option>
              <option value="K">Kelvin</option>
            </select>

            <select id="tempTo">
              <option value="F">Fahrenheit</option>
              <option value="C">Celsius</option>
              <option value="K">Kelvin</option>
            </select>
          </div>

          <button class="btn primary" onclick="convertTemperature()">Convertir</button>

          <div class="result-box">
            <div id="tempResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "currency":
      return `
        ${header("💱 Monedas", "Convierte monedas con tasas disponibles. Se necesita conexión para actualizar las tasas.")}

        <div class="tool-form">
          <input id="currencyAmount" type="number" value="1">

          <div class="form-row">
            <select id="currencyFrom">
              ${currencyOptions()}
            </select>

            <select id="currencyTo">
              ${currencyOptions("PEN")}
            </select>
          </div>

          <div class="tool-buttons">
            <button class="btn primary" onclick="convertCurrency()">Convertir</button>
            <button class="btn secondary" onclick="updateCurrencyRates()">Actualizar tasas</button>
          </div>

          <div class="result-box">
            <div id="currencyResult" class="result-big">—</div>
            <small id="currencyInfo"></small>
          </div>
        </div>
      `;

    case "finance":
      return `
        ${header("📈 Finanzas", "Calcula interés y crecimiento de un ahorro.")}

        <div class="tool-form">
          <input id="financeCapital" type="number" placeholder="Capital inicial">

          <div class="form-row">
            <input id="financeRate" type="number" placeholder="Tasa anual %">
            <input id="financeYears" type="number" placeholder="Años">
          </div>

          <select id="financeType">
            <option value="simple">Interés simple</option>
            <option value="compound">Interés compuesto</option>
          </select>

          <button class="btn primary" onclick="calculateFinance()">Calcular</button>

          <div class="result-box">
            <div id="financeResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "expenses":
      return `
        ${header("🧾 Gastos", "Registra gastos y consulta el total.")}

        <div class="tool-form">
          <input id="expenseName" placeholder="Nombre del gasto">
          <input id="expenseAmount" type="number" placeholder="Monto">

          <button class="btn primary" onclick="addExpense()">Agregar gasto</button>

          <div id="expenseList" class="list"></div>

          <div class="result-box">
            Total:
            <div id="expenseTotal" class="result-big">S/ 0.00</div>
          </div>
        </div>
      `;

    case "dates":
      return `
        ${header("📅 Fechas", "Calcula cuántos días hay entre dos fechas.")}

        <div class="tool-form">
          <div class="form-row">
            <input id="dateOne" type="date">
            <input id="dateTwo" type="date">
          </div>

          <button class="btn primary" onclick="calculateDates()">Calcular</button>

          <div class="result-box">
            <div id="dateResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "age":
      return `
        ${header("🎂 Edad", "Calcula la edad a partir de la fecha de nacimiento.")}

        <div class="tool-form">
          <input id="birthDate" type="date">
          <button class="btn primary" onclick="calculateAge()">Calcular edad</button>

          <div class="result-box">
            <div id="ageResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "timer":
      setTimeout(updateTimerDisplay, 0);

      return `
        ${header("⏲️ Temporizador", "Cuenta regresiva basada en tiempo real.")}

        <div class="tool-form">
          <div class="form-row">
            <input id="timerMinutes" type="number" min="0" placeholder="Minutos">
            <input id="timerSeconds" type="number" min="0" max="59" placeholder="Segundos">
          </div>

          <div id="timerDisplay" class="timer-display">
            ${formatTime(timerState.remaining)}
          </div>

          <div class="tool-buttons">
            <button class="btn primary" onclick="startTimer()">Iniciar</button>
            <button class="btn secondary" onclick="pauseTimer()">Pausar</button>
            <button class="btn secondary" onclick="resetTimer()">Reiniciar</button>
          </div>
        </div>
      `;

    case "stopwatch":
      setTimeout(updateStopwatchDisplay, 0);

      return `
        ${header("⏱️ Cronómetro", "Cronómetro basado en Date.now().")}

        <div class="tool-form">
          <div id="stopwatchDisplay" class="stopwatch-display">
            ${formatMilliseconds(stopwatchState.elapsed)}
          </div>

          <div class="tool-buttons">
            <button class="btn primary" onclick="startStopwatch()">Iniciar</button>
            <button class="btn secondary" onclick="pauseStopwatch()">Pausar</button>
            <button class="btn secondary" onclick="resetStopwatch()">Reiniciar</button>
          </div>
        </div>
      `;

    case "notes":
      return `
        ${header("📝 Notas", "Tus notas quedan guardadas en este navegador.")}

        <div class="tool-form">
          <input id="noteTitle" placeholder="Título">
          <textarea id="noteText" placeholder="Escribe tu nota..."></textarea>

          <button class="btn primary" onclick="addNote()">Guardar nota</button>

          <div id="notesList" class="list"></div>
        </div>
      `;

    case "tasks":
      return `
        ${header("✅ Tareas", "Organiza tus pendientes.")}

        <div class="tool-form">
          <input id="taskInput" placeholder="Nueva tarea">
          <button class="btn primary" onclick="addTask()">Agregar</button>

          <div id="tasksList" class="list"></div>
        </div>
      `;

    case "shoppingList":
      return `
        ${header("🛒 Lista de compras", "Controla productos, cantidades y precios.")}

        <div class="tool-form">
          <input id="shopName" placeholder="Producto">

          <div class="form-row">
            <input id="shopQty" type="number" min="1" value="1" placeholder="Cantidad">
            <input id="shopPrice" type="number" min="0" value="0" placeholder="Precio">
          </div>

          <button class="btn primary" onclick="addShoppingItem()">Agregar</button>

          <div id="shoppingList" class="list"></div>

          <div class="result-box">
            Total:
            <div id="shoppingTotal" class="result-big">S/ 0.00</div>
          </div>
        </div>
      `;

    case "agenda":
      return `
        ${header("📆 Agenda", "Guarda eventos importantes localmente.")}

        <div class="tool-form">
          <input id="agendaTitle" placeholder="Evento">

          <div class="form-row">
            <input id="agendaDate" type="date">
            <input id="agendaTime" type="time">
          </div>

          <button class="btn primary" onclick="addAgenda()">Guardar evento</button>

          <div id="agendaList" class="list"></div>
        </div>
      `;

    case "study":
      return `
        ${header("📚 Organizador de estudio", "Planifica tus materias y actividades.")}

        <div class="tool-form">
          <input id="studySubject" placeholder="Materia">

          <input id="studyTask" placeholder="Actividad o tarea">

          <div class="form-row">
            <input id="studyDate" type="date">

            <select id="studyPriority">
              <option value="Alta">Prioridad alta</option>
              <option value="Media" selected>Prioridad media</option>
              <option value="Baja">Prioridad baja</option>
            </select>
          </div>

          <button class="btn primary" onclick="addStudy()">Agregar</button>

          <div id="studyList" class="list"></div>
        </div>
      `;

    case "password":
      return `
        ${header("🔐 Generador de contraseñas", "Genera contraseñas usando el generador criptográfico del navegador.")}

        <div class="tool-form">
          <label>Longitud</label>
          <input id="passwordLength" type="number" min="8" max="64" value="16">

          <label>
            <input id="passwordNumbers" type="checkbox" checked>
            Números
          </label>

          <label>
            <input id="passwordSymbols" type="checkbox" checked>
            Símbolos
          </label>

          <button class="btn primary" onclick="generatePassword()">Generar</button>

          <div class="result-box">
            <div id="passwordResult" class="result-big password-output">—</div>
          </div>

          <button class="btn secondary" onclick="copyText('passwordResult')">
            Copiar
          </button>
        </div>
      `;

    case "random":
      return `
        ${header("🎯 Número aleatorio", "Genera un número dentro de un rango.")}

        <div class="tool-form">
          <div class="form-row">
            <input id="randomMin" type="number" value="1">
            <input id="randomMax" type="number" value="100">
          </div>

          <button class="btn primary" onclick="generateRandom()">Generar</button>

          <div class="result-box">
            <div id="randomResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "dice":
      return `
        ${header("🎲 Dados", "Lanza uno o varios dados.")}

        <div class="tool-form">
          <input id="diceCount" type="number" min="1" max="20" value="1">

          <button class="btn primary" onclick="rollDice()">Lanzar dados</button>

          <div class="result-box">
            <div id="diceResult" class="result-big">—</div>
          </div>
        </div>
      `;

    case "qr":
      return `
        ${header("▣ Generador QR", "Crea un QR a partir de texto o enlace. Esta función necesita conexión a Internet.")}

        <div class="tool-form">
          <input id="qrText" placeholder="https://ejemplo.com">

          <button class="btn primary" onclick="generateQR()">Crear QR</button>

          <div id="qrResult"></div>
        </div>
      `;

    case "text":
      return `
        ${header("🔤 Herramientas de texto", "Analiza rápidamente un texto.")}

        <div class="tool-form">
          <textarea id="textInput" placeholder="Escribe o pega texto..."></textarea>

          <button class="btn primary" onclick="analyzeText()">Analizar</button>

          <div class="result-box">
            <p>Caracteres</p>
            <div id="charCount" class="result-big">0</div>

            <br>

            <p>Palabras</p>
            <div id="wordCount" class="result-big">0</div>

            <br>

            <p>Líneas</p>
            <div id="lineCount" class="result-big">0</div>
          </div>
        </div>
      `;

    case "case":
      return `
        ${header("Aa Mayúsculas y minúsculas", "Transforma el texto.")}

        <div class="tool-form">
          <textarea id="caseInput" placeholder="Escribe texto..."></textarea>

          <div class="tool-buttons">
            <button class="btn primary" onclick="changeCase('upper')">MAYÚSCULAS</button>
            <button class="btn secondary" onclick="changeCase('lower')">minúsculas</button>
            <button class="btn secondary" onclick="changeCase('title')">Título</button>
          </div>

          <textarea id="caseOutput" readonly></textarea>
        </div>
      `;

    case "dictionary":
      return `
        ${header("📖 Diccionario", "Busca definiciones en español.")}

        <div class="tool-form">
          <input id="dictionaryWord" placeholder="Ejemplo: planeta">

          <button class="btn primary" onclick="searchDictionary()">Buscar</button>

          <div id="dictionaryResult" class="result-box">
            Escribe una palabra para comenzar.
          </div>

          <div id="dictionaryHistory" class="list"></div>
        </div>
      `;

    case "food":
      return `
        ${header("🍔 Buscar comida", "Busca restaurantes mediante mapas.")}

        <div class="tool-form">
          <input id="foodQuery" placeholder="Ejemplo: pizza, cevichería, hamburguesas">

          <input id="foodLocation" placeholder="Ciudad o zona">

          <button class="btn primary" onclick="searchFood()">Buscar</button>
        </div>
      `;

    case "shopping":
      return `
        ${header("🛍️ Buscar compras", "Busca tiendas y productos. La compra la realiza el usuario.")}

        <div class="tool-form">
          <input id="shoppingQuery" placeholder="Ejemplo: zapatillas, laptop, mochila">

          <div class="tool-buttons">
            <button class="btn primary" onclick="searchShopping('web')">
              Buscar productos
            </button>

            <button class="btn secondary" onclick="searchShopping('maps')">
              Buscar tiendas
            </button>
          </div>
        </div>
      `;

    case "nearby":
      return `
        ${header("📍 Cerca de mí", "Selecciona el tipo de lugar que quieres buscar.")}

        <div class="tool-form">

          <div class="tool-buttons">
            <button class="btn secondary" onclick="searchNearby('restaurantes')">🍔 Restaurantes</button>
            <button class="btn secondary" onclick="searchNearby('farmacias')">💊 Farmacias</button>
            <button class="btn secondary" onclick="searchNearby('supermercados')">🛒 Supermercados</button>
            <button class="btn secondary" onclick="searchNearby('bancos')">🏦 Bancos</button>
            <button class="btn secondary" onclick="searchNearby('hospitales')">🏥 Hospitales</button>
            <button class="btn secondary" onclick="searchNearby('tiendas')">🏪 Tiendas</button>
          </div>

        </div>
      `;

    case "favorites":
      return `
        ${header("⭐ Mis favoritos", "Tus herramientas favoritas.")}

        <div class="list">
          ${renderFavoritesHTML()}
        </div>
      `;

    default:
      return "";
  }
}

/* =========================================================
   CALCULATOR
========================================================= */

function safeCalculate(expression) {

  let input = expression
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");

  if (!/^[0-9+\-*/().%]+$/.test(input)) {
    throw new Error("Expresión no permitida.");
  }

  let pos = 0;

  function parseExpression() {
    let value = parseTerm();

    while (input[pos] === "+" || input[pos] === "-") {
      const op = input[pos++];
      const right = parseTerm();
      value = op === "+" ? value + right : value - right;
    }

    return value;
  }

  function parseTerm() {
    let value = parseFactor();

    while (input[pos] === "*" || input[pos] === "/") {
      const op = input[pos++];
      const right = parseFactor();

      if (op === "/" && right === 0) {
        throw new Error("No se puede dividir entre cero.");
      }

      value = op === "*" ? value * right : value / right;
    }

    return value;
  }

  function parseFactor() {

    if (input[pos] === "+") {
      pos++;
      return parseFactor();
    }

    if (input[pos] === "-") {
      pos++;
      return -parseFactor();
    }

    if (input[pos] === "(") {
      pos++;

      const value = parseExpression();

      if (input[pos] !== ")") {
        throw new Error("Paréntesis incorrectos.");
      }

      pos++;
      return value;
    }

    const match = input.slice(pos).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);

    if (!match) {
      throw new Error("Número inválido.");
    }

    pos += match[0].length;

    let value = Number(match[0]);

    if (input[pos] === "%") {
      pos++;
      value /= 100;
    }

    return value;
  }

  const result = parseExpression();

  if (pos !== input.length || !Number.isFinite(result)) {
    throw new Error("Operación inválida.");
  }

  return result;
}

function calculate() {
  const input = document.getElementById("calcInput");
  const result = document.getElementById("calcResult");

  try {
    result.textContent = formatNumber(safeCalculate(input.value));
  } catch (error) {
    result.textContent = "Expresión inválida";
  }
}

/* =========================================================
   CALCULATIONS
========================================================= */

function number(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 8
  }).format(value);
}

function calculatePercentage() {
  const result = number("percentValue") * number("percentBase") / 100;

  document.getElementById("percentResult").textContent =
    formatNumber(result);
}

function calculateDiscount() {
  const price = number("discountPrice");
  const discount = number("discountPercent");

  const saving = price * discount / 100;
  const final = price - saving;

  document.getElementById("discountSave").textContent =
    `S/ ${formatNumber(saving)}`;

  document.getElementById("discountFinal").textContent =
    `S/ ${formatNumber(final)}`;
}

function calculateRule3() {
  const a = number("ruleA");
  const b = number("ruleB");
  const c = number("ruleC");

  if (a === 0) {
    document.getElementById("ruleResult").textContent = "A no puede ser 0.";
    return;
  }

  document.getElementById("ruleResult").textContent =
    formatNumber((b * c) / a);
}

function calculateFinance() {
  const capital = number("financeCapital");
  const rate = number("financeRate") / 100;
  const years = number("financeYears");
  const type = document.getElementById("financeType").value;

  const total = type === "simple"
    ? capital * (1 + rate * years)
    : capital * Math.pow(1 + rate, years);

  document.getElementById("financeResult").textContent =
    `S/ ${formatNumber(total)}`;
}

/* =========================================================
   CONVERTERS
========================================================= */

const converterUnits = {
  length: {
    m: 1,
    km: 1000,
    cm: .01,
    mm: .001,
    mi: 1609.344,
    yd: .9144,
    ft: .3048,
    in: .0254
  },

  weight: {
    kg: 1,
    g: .001,
    mg: .000001,
    lb: .45359237,
    oz: .028349523125
  },

  volume: {
    L: 1,
    mL: .001,
    m3: 1000,
    cm3: .001,
    gal: 3.785411784
  },

  time: {
    s: 1,
    min: 60,
    h: 3600,
    day: 86400
  }
};

function updateConverterUnits() {
  const type = document.getElementById("converterType").value;
  const units = Object.keys(converterUnits[type]);

  const labels = {
    m: "Metros",
    km: "Kilómetros",
    cm: "Centímetros",
    mm: "Milímetros",
    mi: "Millas",
    yd: "Yardas",
    ft: "Pies",
    in: "Pulgadas",
    kg: "Kilogramos",
    g: "Gramos",
    mg: "Miligramos",
    lb: "Libras",
    oz: "Onzas",
    L: "Litros",
    mL: "Mililitros",
    m3: "Metros cúbicos",
    cm3: "Centímetros cúbicos",
    gal: "Galones",
    s: "Segundos",
    min: "Minutos",
    h: "Horas",
    day: "Días"
  };

  const from = document.getElementById("convertFrom");
  const to = document.getElementById("convertTo");

  from.innerHTML = units.map(unit =>
    `<option value="${unit}">${labels[unit] || unit}</option>`
  ).join("");

  to.innerHTML = units.map(unit =>
    `<option value="${unit}">${labels[unit] || unit}</option>`
  ).join("");

  if (units.length > 1) {
    to.value = units[1];
  }
}

function convertUnits() {
  const type = document.getElementById("converterType").value;
  const value = number("convertValue");
  const from = document.getElementById("convertFrom").value;
  const to = document.getElementById("convertTo").value;

  const base = value * converterUnits[type][from];
  const result = base / converterUnits[type][to];

  document.getElementById("convertResult").textContent =
    formatNumber(result);
}

function convertTemperature() {
  const value = number("tempValue");
  const from = document.getElementById("tempFrom").value;
  const to = document.getElementById("tempTo").value;

  let celsius;

  if (from === "C") celsius = value;
  if (from === "F") celsius = (value - 32) * 5 / 9;
  if (from === "K") celsius = value - 273.15;

  let result;

  if (to === "C") result = celsius;
  if (to === "F") result = celsius * 9 / 5 + 32;
  if (to === "K") result = celsius + 273.15;

  document.getElementById("tempResult").textContent =
    `${formatNumber(result)} °${to}`;
}

/* =========================================================
   CURRENCY
========================================================= */

const currencies = {
  USD: "Dólar",
  PEN: "Sol peruano",
  EUR: "Euro",
  GBP: "Libra",
  JPY: "Yen",
  CAD: "Dólar canadiense",
  AUD: "Dólar australiano",
  MXN: "Peso mexicano",
  BRL: "Real brasileño",
  CLP: "Peso chileno",
  COP: "Peso colombiano"
};

function currencyOptions(selected = "USD") {
  return Object.entries(currencies)
    .map(([code, name]) =>
      `<option value="${code}" ${code === selected ? "selected" : ""}>
        ${code} — ${name}
      </option>`
    )
    .join("");
}

async function updateCurrencyRates() {

  const info = document.getElementById("currencyInfo");

  if (info) {
    info.textContent = "Actualizando tasas...";
  }

  try {

    const response = await fetch(
      "https://open.er-api.com/v6/latest/USD",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener la tasa.");
    }

    const data = await response.json();

    if (!data.rates) {
      throw new Error("Datos inválidos.");
    }

    const payload = {
      rates: data.rates,
      updated: Date.now()
    };

    save(STORAGE.currency, payload);

    if (info) {
      info.textContent = "Tasas actualizadas.";
    }

    toast("Tasas actualizadas.");
    return payload;

  } catch {

    const cached = load(STORAGE.currency, null);

    if (info) {
      info.textContent = cached
        ? "Sin conexión. Usando última tasa guardada."
        : "No hay tasas guardadas. Conéctate a Internet.";
    }

    return cached;
  }
}

async function convertCurrency() {

  const amount = number("currencyAmount");
  const from = document.getElementById("currencyFrom").value;
  const to = document.getElementById("currencyTo").value;

  let data = load(STORAGE.currency, null);

  if (!data) {
    data = await updateCurrencyRates();
  }

  if (!data || !data.rates) {
    document.getElementById("currencyResult").textContent =
      "No hay tasas disponibles.";
    return;
  }

  const fromRate = from === "USD" ? 1 : data.rates[from];
  const toRate = to === "USD" ? 1 : data.rates[to];

  if (!fromRate || !toRate) {
    document.getElementById("currencyResult").textContent =
      "Moneda no disponible.";
    return;
  }

  const result = (amount / fromRate) * toRate;

  document.getElementById("currencyResult").textContent =
    `${formatNumber(result)} ${to}`;

  const date = new Date(data.updated);

  document.getElementById("currencyInfo").textContent =
    `Última actualización guardada: ${date.toLocaleString("es-PE")}`;
}

/* =========================================================
   DATES
========================================================= */

function calculateDates() {
  const a = new Date(document.getElementById("dateOne").value);
  const b = new Date(document.getElementById("dateTwo").value);

  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
    return;
  }

  const diff = Math.abs(b - a);
  const days = Math.round(diff / 86400000);

  document.getElementById("dateResult").textContent =
    `${formatNumber(days)} días`;
}

function calculateAge() {
  const input = document.getElementById("birthDate").value;

  if (!input) return;

  const birth = new Date(input + "T00:00:00");
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const month =
    today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  document.getElementById("ageResult").textContent =
    `${Math.max(0, age)} años`;
}

/* =========================================================
   TIMER
========================================================= */

function updateTimerDisplay() {
  const element = document.getElementById("timerDisplay");

  if (element) {
    element.textContent = formatTime(timerState.remaining);
  }
}

function formatTime(totalSeconds) {
  totalSeconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0")
  ].join(":");
}

function startTimer() {

  if (!timerState.running) {

    if (timerState.remaining <= 0) {
      const minutes = number("timerMinutes");
      const seconds = number("timerSeconds");

      timerState.total =
        Math.max(0, Math.floor(minutes * 60 + seconds));

      timerState.remaining = timerState.total;
    }

    if (timerState.remaining <= 0) {
      toast("Configura un tiempo primero.");
      return;
    }

    timerState.startedAt = Date.now();
    timerState.running = true;

    clearInterval(timerState.interval);

    timerState.interval = setInterval(() => {

      const elapsed =
        Math.floor((Date.now() - timerState.startedAt) / 1000);

      timerState.remaining =
        Math.max(0, timerState.remaining - elapsed);

      timerState.startedAt = Date.now();

      updateTimerDisplay();

      if (timerState.remaining <= 0) {
        pauseTimer();
        toast("⏰ Temporizador terminado.");
      }

    }, 250);
  }
}

function pauseTimer() {
  if (!timerState.running) return;

  timerState.running = false;
  clearInterval(timerState.interval);
}

function resetTimer() {
  pauseTimer();
  timerState.total = 0;
  timerState.remaining = 0;
  updateTimerDisplay();
}

/* =========================================================
   STOPWATCH
========================================================= */

function updateStopwatchDisplay() {
  const element = document.getElementById("stopwatchDisplay");

  if (element) {
    element.textContent =
      formatMilliseconds(stopwatchState.elapsed);
  }
}

function formatMilliseconds(ms) {
  const total = Math.max(0, ms);

  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const millis = Math.floor((total % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(2, "0")}`;
}

function startStopwatch() {

  if (stopwatchState.running) return;

  stopwatchState.startedAt = Date.now() - stopwatchState.elapsed;
  stopwatchState.running = true;

  clearInterval(stopwatchState.interval);

  stopwatchState.interval = setInterval(() => {
    stopwatchState.elapsed =
      Date.now() - stopwatchState.startedAt;

    updateStopwatchDisplay();
  }, 50);
}

function pauseStopwatch() {
  stopwatchState.running = false;
  clearInterval(stopwatchState.interval);
}

function resetStopwatch() {
  pauseStopwatch();
  stopwatchState.elapsed = 0;
  updateStopwatchDisplay();
}

/* =========================================================
   NOTES
========================================================= */

function renderNotes() {
  const list = document.getElementById("notesList");

  if (!list) return;

  const notes = load(STORAGE.notes, []);

  list.innerHTML = notes.length
    ? notes.map((note, index) => `
      <div class="list-item">
        <div>
          <strong>${esc(note.title || "Sin título")}</strong>
          <small>${esc(note.text)}</small>
        </div>

        <button class="delete-btn" onclick="deleteNote(${index})">
          Eliminar
        </button>
      </div>
    `).join("")
    : `<p style="color:var(--muted)">No hay notas todavía.</p>`;
}

function addNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const text = document.getElementById("noteText").value.trim();

  if (!text) {
    toast("Escribe algo en la nota.");
    return;
  }

  const notes = load(STORAGE.notes, []);

  notes.unshift({
    title,
    text,
    created: Date.now()
  });

  save(STORAGE.notes, notes);

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteText").value = "";

  renderNotes();
  toast("Nota guardada.");
}

function deleteNote(index) {
  const notes = load(STORAGE.notes, []);
  notes.splice(index, 1);
  save(STORAGE.notes, notes);
  renderNotes();
}

/* =========================================================
   TASKS
========================================================= */

function renderTasks() {
  const list = document.getElementById("tasksList");

  if (!list) return;

  const tasks = load(STORAGE.tasks, []);

  list.innerHTML = tasks.length
    ? tasks.map((task, index) => `
      <div class="list-item ${task.done ? "done" : ""}">
        <div>
          <strong>${esc(task.text)}</strong>
        </div>

        <div class="tool-buttons">
          <button class="delete-btn" onclick="toggleTask(${index})">
            ${task.done ? "↩" : "✓"}
          </button>

          <button class="delete-btn" onclick="deleteTask(${index})">
            ×
          </button>
        </div>
      </div>
    `).join("")
    : `<p style="color:var(--muted)">No hay tareas.</p>`;
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (!text) return;

  const tasks = load(STORAGE.tasks, []);

  tasks.unshift({
    text,
    done: false,
    created: Date.now()
  });

  save(STORAGE.tasks, tasks);

  input.value = "";
  renderTasks();
}

function toggleTask(index) {
  const tasks = load(STORAGE.tasks, []);

  tasks[index].done = !tasks[index].done;

  save(STORAGE.tasks, tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = load(STORAGE.tasks, []);

  tasks.splice(index, 1);

  save(STORAGE.tasks, tasks);
  renderTasks();
}

/* =========================================================
   SHOPPING LIST
========================================================= */

function renderShopping() {
  const list = document.getElementById("shoppingList");
  const totalElement = document.getElementById("shoppingTotal");

  if (!list) return;

  const items = load(STORAGE.shopping, []);

  let total = 0;

  items.forEach(item => {
    total += item.qty * item.price;
  });

  list.innerHTML = items.length
    ? items.map((item, index) => `
      <div class="list-item">
        <div>
          <strong>${esc(item.name)}</strong>
          <small>${item.qty} × S/ ${formatNumber(item.price)}</small>
        </div>

        <button class="delete-btn" onclick="deleteShoppingItem(${index})">
          ×
        </button>
      </div>
    `).join("")
    : `<p style="color:var(--muted)">Lista vacía.</p>`;

  totalElement.textContent = `S/ ${formatNumber(total)}`;
}

function addShoppingItem() {
  const name = document.getElementById("shopName").value.trim();
  const qty = Math.max(1, number("shopQty"));
  const price = Math.max(0, number("shopPrice"));

  if (!name) {
    toast("Escribe un producto.");
    return;
  }

  const items = load(STORAGE.shopping, []);

  items.push({
    name,
    qty,
    price
  });

  save(STORAGE.shopping, items);

  document.getElementById("shopName").value = "";

  renderShopping();
}

function deleteShoppingItem(index) {
  const items = load(STORAGE.shopping, []);

  items.splice(index, 1);

  save(STORAGE.shopping, items);

  renderShopping();
}

/* =========================================================
   AGENDA
========================================================= */

function renderAgenda() {
  const list = document.getElementById("agendaList");

  if (!list) return;

  const events = load(STORAGE.agenda, []);

  list.innerHTML = events.length
    ? events.map((event, index) => `
      <div class="list-item">
        <div>
          <strong>${esc(event.title)}</strong>
          <small>${esc(event.date)} ${esc(event.time)}</small>
        </div>

        <button class="delete-btn" onclick="deleteAgenda(${index})">
          ×
        </button>
      </div>
    `).join("")
    : `<p style="color:var(--muted)">No hay eventos.</p>`;
}

function addAgenda() {
  const title = document.getElementById("agendaTitle").value.trim();
  const date = document.getElementById("agendaDate").value;
  const time = document.getElementById("agendaTime").value;

  if (!title || !date) {
    toast("Completa el evento y la fecha.");
    return;
  }

  const events = load(STORAGE.agenda, []);

  events.push({
    title,
    date,
    time
  });

  events.sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
  );

  save(STORAGE.agenda, events);

  renderAgenda();
}

function deleteAgenda(index) {
  const events = load(STORAGE.agenda, []);

  events.splice(index, 1);

  save(STORAGE.agenda, events);

  renderAgenda();
}

/* =========================================================
   STUDY
========================================================= */

function renderStudy() {
  const list = document.getElementById("studyList");

  if (!list) return;

  const items = load(STORAGE.study, []);

  list.innerHTML = items.length
    ? items.map((item, index) => `
      <div class="list-item ${item.done ? "done" : ""}">
        <div>
          <strong>${esc(item.subject)}</strong>
          <small>
            ${esc(item.task)} · ${esc(item.date || "Sin fecha")} ·
            ${esc(item.priority)}
          </small>
        </div>

        <div class="tool-buttons">
          <button class="delete-btn" onclick="toggleStudy(${index})">
            ${item.done ? "↩" : "✓"}
          </button>

          <button class="delete-btn" onclick="deleteStudy(${index})">
            ×
          </button>
        </div>
      </div>
    `).join("")
    : `<p style="color:var(--muted)">No hay actividades.</p>`;
}

function addStudy() {
  const subject =
    document.getElementById("studySubject").value.trim();

  const task =
    document.getElementById("studyTask").value.trim();

  const date =
    document.getElementById("studyDate").value;

  const priority =
    document.getElementById("studyPriority").value;

  if (!subject || !task) {
    toast("Completa materia y actividad.");
    return;
  }

  const items = load(STORAGE.study, []);

  items.push({
    subject,
    task,
    date,
    priority,
    done: false
  });

  save(STORAGE.study, items);

  renderStudy();
}

function toggleStudy(index) {
  const items = load(STORAGE.study, []);

  items[index].done = !items[index].done;

  save(STORAGE.study, items);
  renderStudy();
}

function deleteStudy(index) {
  const items = load(STORAGE.study, []);

  items.splice(index, 1);

  save(STORAGE.study, items);
  renderStudy();
}

/* =========================================================
   EXPENSES
========================================================= */

function addExpense() {
  const name = document.getElementById("expenseName").value.trim();
  const amount = Math.max(0, number("expenseAmount"));

  if (!name || !amount) {
    toast("Completa el gasto.");
    return;
  }

  const expenses = load(STORAGE.expenses, []);

  expenses.push({
    name,
    amount,
    date: Date.now()
  });

  save(STORAGE.expenses, expenses);

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  renderExpenses();
}

function renderExpenses() {
  const list = document.getElementById("expenseList");
  const totalElement = document.getElementById("expenseTotal");

  if (!list) return;

  const expenses = load(STORAGE.expenses, []);

  const total =
    expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  list.innerHTML = expenses.length
    ? expenses.map((item, index) => `
      <div class="list-item">
        <div>
          <strong>${esc(item.name)}</strong>
          <small>S/ ${formatNumber(item.amount)}</small>
        </div>

        <button class="delete-btn" onclick="deleteExpense(${index})">
          ×
        </button>
      </div>
    `).join("")
    : `<p style="color:var(--muted)">No hay gastos.</p>`;

  totalElement.textContent = `S/ ${formatNumber(total)}`;
}

function deleteExpense(index) {
  const expenses = load(STORAGE.expenses, []);

  expenses.splice(index, 1);

  save(STORAGE.expenses, expenses);

  renderExpenses();
}

/* =========================================================
   PASSWORD
========================================================= */

function randomChar(chars) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  return chars[array[0] % chars.length];
}

function generatePassword() {

  const length =
    Math.min(64, Math.max(8, number("passwordLength")));

  const numbers =
    document.getElementById("passwordNumbers").checked;

  const symbols =
    document.getElementById("passwordSymbols").checked;

  let chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()-_=+[]{}?";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += randomChar(chars);
  }

  document.getElementById("passwordResult").textContent =
    password;
}

/* =========================================================
   RANDOM / DICE
========================================================= */

function generateRandom() {
  let min = Math.floor(number("randomMin"));
  let max = Math.floor(number("randomMax"));

  if (min > max) {
    [min, max] = [max, min];
  }

  const result =
    Math.floor(Math.random() * (max - min + 1)) + min;

  document.getElementById("randomResult").textContent = result;
}

function rollDice() {
  const count =
    Math.min(20, Math.max(1, Math.floor(number("diceCount"))));

  const rolls = [];

  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }

  const total = rolls.reduce((a, b) => a + b, 0);

  document.getElementById("diceResult").textContent =
    `${rolls.join(" + ")} = ${total}`;
}

/* =========================================================
   QR
========================================================= */

function generateQR() {
  const text = document.getElementById("qrText").value.trim();

  if (!text) {
    toast("Escribe un texto o enlace.");
    return;
  }

  const encoded = encodeURIComponent(text);

  document.getElementById("qrResult").innerHTML = `
    <img
      class="qr-image"
      src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}"
      alt="Código QR generado"
    >

    <div class="result-box">
      <small>
        El QR se genera mediante un servicio externo y requiere conexión.
      </small>
    </div>
  `;
}

/* =========================================================
   TEXT
========================================================= */

function analyzeText() {
  const text =
    document.getElementById("textInput").value;

  const chars = text.length;

  const words =
    text.trim() ? text.trim().split(/\s+/).length : 0;

  const lines =
    text ? text.split(/\r?\n/).length : 0;

  document.getElementById("charCount").textContent = chars;
  document.getElementById("wordCount").textContent = words;
  document.getElementById("lineCount").textContent = lines;
}

function changeCase(type) {
  const input =
    document.getElementById("caseInput").value;

  let result = input;

  if (type === "upper") {
    result = input.toUpperCase();
  }

  if (type === "lower") {
    result = input.toLowerCase();
  }

  if (type === "title") {
    result = input
      .toLowerCase()
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  document.getElementById("caseOutput").value = result;
}

/* =========================================================
   DICTIONARY
========================================================= */

async function searchDictionary() {

  const word =
    document.getElementById("dictionaryWord").value.trim();

  const result =
    document.getElementById("dictionaryResult");

  if (!word) return;

  result.innerHTML = "Buscando...";

  try {

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/es/${encodeURIComponent(word)}`
    );

    if (!response.ok) {
      throw new Error("No encontrada");
    }

    const data = await response.json();

    const entry = data[0];

    const meanings = entry.meanings || [];

    result.innerHTML = meanings.slice(0, 3).map(meaning => {

      const definition =
        meaning.definitions?.[0]?.definition || "";

      return `
        <p>
          <strong>${esc(meaning.partOfSpeech || "Definición")}</strong><br>
          ${esc(definition)}
        </p>
      `;

    }).join("<br>");

    saveDictionaryHistory(word);

  } catch {

    result.innerHTML =
      "No se encontró la palabra o no hay conexión.";
  }
}

function saveDictionaryHistory(word) {
  const key = "utilhub_v12_dictionary_history";

  let history = load(key, []);

  history = [
    word,
    ...history.filter(item => item.toLowerCase() !== word.toLowerCase())
  ].slice(0, 8);

  save(key, history);

  renderDictionaryHistory();
}

function renderDictionaryHistory() {
  const box = document.getElementById("dictionaryHistory");

  if (!box) return;

  const history =
    load("utilhub_v12_dictionary_history", []);

  box.innerHTML = history.map(word => `
    <button
      class="btn secondary"
      onclick="document.getElementById('dictionaryWord').value='${esc(word)}'; searchDictionary()"
    >
      ${esc(word)}
    </button>
  `).join("");
}

/* =========================================================
   FOOD / SHOPPING / NEARBY
========================================================= */

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function searchFood() {
  const query =
    document.getElementById("foodQuery").value.trim();

  const location =
    document.getElementById("foodLocation").value.trim();

  const text =
    [query || "restaurantes", location]
      .filter(Boolean)
      .join(" ");

  openExternal(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`
  );
}

function searchShopping(type) {
  const query =
    document.getElementById("shoppingQuery").value.trim();

  if (!query) {
    toast("Escribe qué producto buscas.");
    return;
  }

  if (type === "maps") {
    openExternal(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + " tiendas")}`
    );
  } else {
    openExternal(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`
    );
  }
}

function searchNearby(type) {
  openExternal(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(type)}`
  );
}

/* =========================================================
   FAVORITES
========================================================= */

function renderFavoritesHTML() {

  const favorites =
    load(STORAGE.favorites, []);

  if (!favorites.length) {
    return `
      <div class="result-box">
        Todavía no tienes herramientas favoritas.
      </div>
    `;
  }

  return favorites.map(id => {

    const tool =
      tools.find(item => item.id === id);

    if (!tool) return "";

    return `
      <div class="list-item">
        <div>
          <strong>${tool.icon} ${esc(tool.name)}</strong>
          <small>${esc(tool.description)}</small>
        </div>

        <button
          class="btn secondary"
          onclick="openTool('${tool.id}')"
        >
          Abrir
        </button>
      </div>
    `;

  }).join("");
}

/* =========================================================
   EXPORT / IMPORT
========================================================= */

function exportData() {

  const data = {};

  Object.values(STORAGE).forEach(key => {
    data[key] = load(key, null);
  });

  const blob =
    new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    "utilhub-v12-backup.json";

  link.click();

  URL.revokeObjectURL(url);

  toast("Copia de seguridad creada.");
}

function importData(file) {

  const reader = new FileReader();

  reader.onload = () => {

    try {

      const data =
        JSON.parse(reader.result);

      Object.values(STORAGE).forEach(key => {

        if (Object.prototype.hasOwnProperty.call(data, key)) {
          save(key, data[key]);
        }

      });

      settings = {
        ...defaultSettings,
        ...load(STORAGE.settings, {})
      };

      applySettings();
      renderTools();
      renderQuick();

      toast("Datos restaurados.");

    } catch {

      toast("Archivo de respaldo inválido.");
    }
  };

  reader.readAsText(file);
}

function clearAllData() {

  const confirmed =
    confirm(
      "¿Seguro que quieres borrar los datos guardados de ÚtilHub?"
    );

  if (!confirmed) return;

  Object.values(STORAGE).forEach(key =>
    localStorage.removeItem(key)
  );

  settings = { ...defaultSettings };

  applySettings();
  renderTools();
  renderQuick();

  toast("Datos eliminados.");
}

/* =========================================================
   COPY
========================================================= */

async function copyText(id) {

  const element =
    document.getElementById(id);

  if (!element) return;

  const text =
    element.value ?? element.textContent;

  if (!text || text === "—") return;

  try {
    await navigator.clipboard.writeText(text);
    toast("Copiado.");
  } catch {
    toast("No se pudo copiar automáticamente.");
  }
}

/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function toast(message) {

  const element =
    document.getElementById("toast");

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {
      element.classList.remove("show");
    }, 2200);
}

/* =========================================================
   CONNECTION
========================================================= */

function updateConnection() {

  const status =
    document.getElementById("connectionStatus");

  const text =
    document.getElementById("connectionText");

  if (!status || !text) return;

  if (navigator.onLine) {
    status.textContent = "●";
    status.style.color = "#55f2c2";
    text.textContent = "Conectado";
  } else {
    status.textContent = "●";
    status.style.color = "#ff6685";
    text.textContent = "Sin conexión";
  }
}

/* =========================================================
   INITIALIZATION
========================================================= */

function setupFilters() {

  document.querySelectorAll(".filter")
    .forEach(button => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll(".filter")
          .forEach(item =>
            item.classList.remove("active")
          );

        button.classList.add("active");

        activeCategory =
          button.dataset.category;

        renderTools(
          document.getElementById("globalSearch").value
        );
      });

    });
}

function setupSearch() {

  const search =
    document.getElementById("globalSearch");

  search.addEventListener("input", () => {
    renderTools(search.value);
  });

  document
    .getElementById("quickSearchBtn")
    .addEventListener("click", () => {

      search.focus();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  document.addEventListener("keydown", event => {

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search.focus();
    }

    if (event.key === "Escape") {
      closeModal();
    }
  });
}

function setupMobileMenu() {

  const button =
    document.getElementById("menuBtn");

  const nav =
    document.getElementById("mainNav");

  button.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

function setupSettings() {

  document
    .getElementById("themeBtn")
    .addEventListener("click", () =>
      toggleSetting("dark")
    );

  document
    .getElementById("themeToggle")
    .addEventListener("click", () =>
      toggleSetting("dark")
    );

  document
    .getElementById("animationToggle")
    .addEventListener("click", () =>
      toggleSetting("animations")
    );

  document
    .getElementById("cursorToggle")
    .addEventListener("click", () =>
      toggleSetting("cursor")
    );

  document
    .getElementById("performanceToggle")
    .addEventListener("click", () =>
      toggleSetting("performance")
    );

  document
    .getElementById("importFile")
    .addEventListener("change", event => {

      const file =
        event.target.files[0];

      if (file) {
        importData(file);
      }
    });
}

function init() {

  createNova();
  setupCursor();

  applySettings();

  renderTools();
  renderQuick();

  setupFilters();
  setupSearch();
  setupMobileMenu();
  setupSettings();

  updateConnection();

  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);

  window.addEventListener("resize", () => {
    if (settings.animations && !settings.performance) {
      createNova();
    }
  });

  document
    .getElementById("converterType")
    ?.dispatchEvent(new Event("change"));
}

document.addEventListener("DOMContentLoaded", init);

/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.openTool = openTool;
window.closeModal = closeModal;
window.toggleFavorite = toggleFavorite;

window.calculate = calculate;
window.calculatePercentage = calculatePercentage;
window.calculateDiscount = calculateDiscount;
window.calculateRule3 = calculateRule3;
window.calculateFinance = calculateFinance;

window.updateConverterUnits = updateConverterUnits;
window.convertUnits = convertUnits;
window.convertTemperature = convertTemperature;
window.convertCurrency = convertCurrency;
window.updateCurrencyRates = updateCurrencyRates;

window.calculateDates = calculateDates;
window.calculateAge = calculateAge;

window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;

window.startStopwatch = startStopwatch;
window.pauseStopwatch = pauseStopwatch;
window.resetStopwatch = resetStopwatch;

window.addNote = addNote;
window.deleteNote = deleteNote;

window.addTask = addTask;
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

window.addShoppingItem = addShoppingItem;
window.deleteShoppingItem = deleteShoppingItem;

window.addAgenda = addAgenda;
window.deleteAgenda = deleteAgenda;

window.addStudy = addStudy;
window.toggleStudy = toggleStudy;
window.deleteStudy = deleteStudy;

window.addExpense = addExpense;
window.deleteExpense = deleteExpense;

window.generatePassword = generatePassword;
window.generateRandom = generateRandom;
window.rollDice = rollDice;
window.generateQR = generateQR;

window.analyzeText = analyzeText;
window.changeCase = changeCase;

window.searchDictionary = searchDictionary;

window.searchFood = searchFood;
window.searchShopping = searchShopping;
window.searchNearby = searchNearby;

window.copyText = copyText;

window.exportData = exportData;
window.clearAllData = clearAllData;
