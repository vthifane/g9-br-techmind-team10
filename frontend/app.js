const categories = ["Backend", "Frontend", "Data Science", "Cloud", "Database", "Security"];

const initialContents = [
  {
    id: "CNT-001",
    title: "Introdução ao Spring Boot",
    text: "Conceitos básicos para criação de APIs REST com Java e Spring Boot.",
    category: "Backend"
  },
  {
    id: "CNT-002",
    title: "Validação de dados com Bean Validation",
    text: "Uso de anotações como @NotBlank e @Valid para validar entradas da API.",
    category: "Backend"
  },
  {
    id: "CNT-003",
    title: "Tratamento de erros com ControllerAdvice",
    text: "Padronização de respostas de erro em aplicações Spring Boot.",
    category: "Backend"
  },

  {
    id: "CNT-004",
    title: "Componentização com React",
    text: "Uso de componentes, estado e eventos para construir interfaces reutilizáveis.",
    category: "Frontend"
  },
  {
    id: "CNT-005",
    title: "Formulários com JavaScript",
    text: "Captura de dados do usuário, validação simples e manipulação do DOM.",
    category: "Frontend"
  },
  {
    id: "CNT-006",
    title: "Design responsivo com CSS Grid",
    text: "Organização de telas adaptáveis usando grid, media queries e espaçamentos fluidos.",
    category: "Frontend"
  },

  {
    id: "CNT-007",
    title: "TF-IDF na classificação de textos",
    text: "Representação numérica de textos para modelos de machine learning.",
    category: "Data Science"
  },
  {
    id: "CNT-008",
    title: "Regressão Logística para classificação",
    text: "Modelo supervisionado usado para prever categorias a partir de atributos extraídos.",
    category: "Data Science"
  },
  {
    id: "CNT-009",
    title: "Similaridade textual com cosseno",
    text: "Técnica usada para encontrar conteúdos relacionados a partir de vetores de texto.",
    category: "Data Science"
  },

  {
    id: "CNT-010",
    title: "Object Storage na OCI",
    text: "Armazenamento de arquivos, modelos e resultados JSON em buckets.",
    category: "Cloud"
  },
  {
    id: "CNT-011",
    title: "Deploy em OCI Compute",
    text: "Uso de uma máquina virtual para hospedar frontend, backend e serviços auxiliares.",
    category: "Cloud"
  },
  {
    id: "CNT-012",
    title: "Infraestrutura como código com Terraform",
    text: "Criação de recursos de cloud por meio de arquivos versionados no GitHub.",
    category: "Cloud"
  },

  {
    id: "CNT-013",
    title: "Modelagem relacional básica",
    text: "Definição de tabelas, chaves primárias e relacionamentos entre entidades.",
    category: "Database"
  },
  {
    id: "CNT-014",
    title: "Consultas SQL com filtros",
    text: "Uso de SELECT, WHERE e ORDER BY para recuperar dados específicos.",
    category: "Database"
  },
  {
    id: "CNT-015",
    title: "Persistência com JPA",
    text: "Mapeamento de entidades Java para tabelas em bancos relacionais.",
    category: "Database"
  },

  {
    id: "CNT-016",
    title: "Autenticação com tokens",
    text: "Uso de tokens para identificar usuários e proteger endpoints da aplicação.",
    category: "Security"
  },
  {
    id: "CNT-017",
    title: "Controle de acesso por perfil",
    text: "Definição de permissões diferentes para usuários comuns e administradores.",
    category: "Security"
  },
  {
    id: "CNT-018",
    title: "Boas práticas para variáveis de ambiente",
    text: "Proteção de senhas, chaves e dados sensíveis fora do código-fonte.",
    category: "Security"
  }
];

const storageKey = "techmind.contents";
const screens = {
  home: document.querySelector("#home-screen"),
  success: document.querySelector("#success-screen"),
  library: document.querySelector("#library-screen"),
  category: document.querySelector("#category-screen"),
  document: document.querySelector("#document-screen")
};

const catalogForm = document.querySelector("#catalog-form");
const searchInput = document.querySelector("#library-search");
const categoryGrid = document.querySelector("#category-grid");
const contentGrid = document.querySelector("#content-grid");
const libraryEmpty = document.querySelector("#library-empty");
const categoryEmpty = document.querySelector("#category-empty");
const categoryTitle = document.querySelector("#category-title");
const documentCategory = document.querySelector("#document-category");
const documentTitle = document.querySelector("#document-title");
const documentText = document.querySelector("#document-text");
const backToCategoryButton = document.querySelector("#back-to-category");

let selectedCategory = "";

function getContents() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(initialContents));
    return initialContents;
  }

  return JSON.parse(saved);
}

function saveContents(contents) {
  localStorage.setItem(storageKey, JSON.stringify(contents));
}

function createContentId() {
  return `CNT-${Date.now().toString().slice(-8)}`;
}

function suggestCategory(text) {
  const normalized = text.toLowerCase();

  if (normalized.includes("react") || normalized.includes("css") || normalized.includes("html")) {
    return "Frontend";
  }

  if (normalized.includes("python") || normalized.includes("tf-idf") || normalized.includes("modelo")) {
    return "Data Science";
  }

  if (normalized.includes("oci") || normalized.includes("cloud") || normalized.includes("bucket")) {
    return "Cloud";
  }

  if (normalized.includes("sql") || normalized.includes("banco") || normalized.includes("database")) {
    return "Database";
  }

  if (normalized.includes("seguranca") || normalized.includes("segurança") || normalized.includes("security") || normalized.includes("token")) {
    return "Security";
  }

  return "Backend";
}

function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[screenName].classList.add("is-active");

  if (screenName === "library") {
    renderLibrary();
  }
}

function renderLibrary() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const contents = getContents();

  const filteredContents = contents.filter((content) => {
    const searchable = `${content.title} ${content.text} ${content.category}`.toLowerCase();
    return searchable.includes(searchTerm);
  });

  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const total = filteredContents.filter((content) => content.category === category).length;

    if (searchTerm && total === 0) {
      return;
    }

    const card = document.createElement("button");
    card.className = "folder-card";
    card.type = "button";
    card.innerHTML = `
      <span class="folder-icon" aria-hidden="true"></span>
      <strong>${category}</strong>
      <span>${total} conteúdo${total === 1 ? "" : "s"}</span>
    `;
    card.addEventListener("click", () => openCategory(category));
    categoryGrid.appendChild(card);
  });

  libraryEmpty.classList.toggle("is-visible", categoryGrid.children.length === 0);
}

function openCategory(category) {
  selectedCategory = category;
  categoryTitle.textContent = category;
  renderCategoryContents();
  showScreen("category");
}

function renderCategoryContents() {
  const contents = getContents().filter((content) => content.category === selectedCategory);
  contentGrid.innerHTML = "";

  contents.forEach((content) => {
    const card = document.createElement("button");
    card.className = "content-card";
    card.type = "button";
    card.innerHTML = `
      <span class="file-icon" aria-hidden="true"></span>
      <strong>${content.title}</strong>
    `;
    card.addEventListener("click", () => openDocument(content));
    contentGrid.appendChild(card);
  });

  categoryEmpty.classList.toggle("is-visible", contents.length === 0);
}

function openDocument(content) {
  documentCategory.textContent = content.category;
  documentTitle.textContent = content.title;
  documentText.textContent = content.text;
  showScreen("document");
}


catalogForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(catalogForm);
  const title = formData.get("title").trim();
  const text = formData.get("text").trim();
  const informedCategory = formData.get("category");

  const newContent = {
    id: createContentId(),
    title,
    text,
    category: informedCategory || suggestCategory(`${title} ${text}`)
  };

  const contents = getContents();
  contents.unshift(newContent);
  saveContents(contents);

  catalogForm.reset();
  showScreen("success");
});

searchInput.addEventListener("input", renderLibrary);

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.view);
  });
});

backToCategoryButton.addEventListener("click", () => {
  showScreen("category");
});

document.querySelector(".login-button").addEventListener("click", () => {
  alert("Função de login será implementada em uma próxima etapa.");
});