const API_BASE_URL = "http://localhost:8080";
const contentStorageKey = "techmind.contents.v4";
const authStorageKey = "techmind.auth";

const fallbackTagCatalog = [
  {
    key: "backend",
    label: "Backend",
    subTags: [
      { key: "java", label: "Java" },
      { key: "spring-boot", label: "Spring Boot" },
      { key: "api-rest", label: "API REST" },
      { key: "dto", label: "DTO" },
      { key: "validation", label: "Validation" }
    ]
  },
  {
    key: "frontend",
    label: "Frontend",
    subTags: [
      { key: "html", label: "HTML" },
      { key: "css", label: "CSS" },
      { key: "javascript", label: "JavaScript" },
      { key: "react", label: "React" },
      { key: "responsive-design", label: "Responsive Design" }
    ]
  },
  {
    key: "data-science",
    label: "Data Science",
    subTags: [
      { key: "python", label: "Python" },
      { key: "pandas", label: "Pandas" },
      { key: "scikit-learn", label: "Scikit-Learn" },
      { key: "tf-idf", label: "TF-IDF" },
      { key: "machine-learning", label: "Machine Learning" }
    ]
  },
  {
    key: "cloud",
    label: "Cloud",
    subTags: [
      { key: "oci", label: "OCI" },
      { key: "compute", label: "Compute" },
      { key: "docker", label: "Docker" },
      { key: "object-storage", label: "Object Storage" },
      { key: "terraform", label: "Terraform" }
    ]
  },
  {
    key: "database",
    label: "Database",
    subTags: [
      { key: "sql", label: "SQL" },
      { key: "nosql", label: "NoSQL" },
      { key: "h2", label: "H2" },
      { key: "jpa", label: "JPA" },
      { key: "repository", label: "Repository" }
    ]
  },
  {
    key: "security",
    label: "Security",
    subTags: [
      { key: "authentication", label: "Authentication" },
      { key: "authorization", label: "Authorization" },
      { key: "jwt", label: "JWT" },
      { key: "token", label: "Token" },
      { key: "spring-security", label: "Spring Security" }
    ]
  }
];

const initialContents = [
  {
    id: "CNT-001",
    title: "Introdução ao Spring Boot",
    text: "Conceitos básicos para criação de APIs REST com Java e Spring Boot.",
    category: "backend",
    probability: 0.89,
    tags: ["backend", "java", "spring-boot", "api-rest"]
  },
  {
    id: "CNT-002",
    title: "Validação de dados com Bean Validation",
    text: "Uso de anotações como @NotBlank e @Valid para validar entradas da API.",
    category: "backend",
    probability: 0.84,
    tags: ["backend", "java", "validation", "dto"]
  },
  {
    id: "CNT-003",
    title: "Componentização com React",
    text: "Uso de componentes, estado e eventos para construir interfaces reutilizáveis.",
    category: "frontend",
    probability: 0.91,
    tags: ["frontend", "react", "javascript"]
  },
  {
    id: "CNT-004",
    title: "Design responsivo com CSS Grid",
    text: "Organização de telas adaptáveis usando CSS, grid, media queries e espaçamentos fluidos.",
    category: "frontend",
    probability: 0.87,
    tags: ["frontend", "css", "responsive-design"]
  },
  {
    id: "CNT-005",
    title: "TF-IDF na classificação de textos",
    text: "Representação numérica de textos para modelos de machine learning com Python.",
    category: "data-science",
    probability: 0.88,
    tags: ["data-science", "python", "tf-idf", "machine-learning"]
  },
  {
    id: "CNT-006",
    title: "Classificação com Scikit-Learn",
    text: "Treinamento de modelos com pandas, scikit-learn e regressão logística.",
    category: "data-science",
    probability: 0.86,
    tags: ["data-science", "python", "pandas", "scikit-learn"]
  },
  {
    id: "CNT-007",
    title: "Object Storage na OCI",
    text: "Armazenamento de arquivos, modelos e resultados JSON em buckets da OCI.",
    category: "cloud",
    probability: 0.86,
    tags: ["cloud", "oci", "object-storage"]
  },
  {
    id: "CNT-008",
    title: "Deploy com Docker em OCI Compute",
    text: "Uso de uma máquina virtual para hospedar frontend, backend e serviços auxiliares com Docker.",
    category: "cloud",
    probability: 0.9,
    tags: ["cloud", "oci", "compute", "docker"]
  },
  {
    id: "CNT-009",
    title: "Consultas SQL com filtros",
    text: "Uso de SELECT, WHERE e ORDER BY para recuperar dados específicos.",
    category: "database",
    probability: 0.84,
    tags: ["database", "sql"]
  },
  {
    id: "CNT-010",
    title: "Persistência com JPA",
    text: "Mapeamento de entidades Java para tabelas e uso de repositories.",
    category: "database",
    probability: 0.83,
    tags: ["database", "jpa", "repository", "java"]
  },
  {
    id: "CNT-011",
    title: "Autenticação com JWT",
    text: "Uso de token JWT para autenticar usuários em uma API Spring Security.",
    category: "security",
    probability: 0.82,
    tags: ["security", "authentication", "jwt", "token", "spring-security"]
  },
  {
    id: "CNT-012",
    title: "Autorização em APIs",
    text: "Controle de acesso a endpoints protegidos com regras de autorização.",
    category: "security",
    probability: 0.81,
    tags: ["security", "authorization", "spring-security"]
  }
];

const screens = {
  library: document.querySelector("#library-screen"),
  submit: document.querySelector("#submit-screen"),
  auth: document.querySelector("#auth-screen"),
  success: document.querySelector("#success-screen"),
  document: document.querySelector("#document-screen")
};

const catalogForm = document.querySelector("#catalog-form");
const searchInput = document.querySelector("#library-search");
const tagSuggestions = document.querySelector("#tag-suggestions");
const toggleSearchButton = document.querySelector("#toggle-search");
const manualSearch = document.querySelector("#manual-search");
const tagGroupList = document.querySelector("#tag-group-list");
const subtagSection = document.querySelector("#subtag-section");
const subtagList = document.querySelector("#subtag-list");
const selectedTagsContainer = document.querySelector("#selected-tags");
const applyFiltersButton = document.querySelector("#apply-filters");
const clearFiltersButton = document.querySelector("#clear-filters");
const contentGrid = document.querySelector("#content-grid");
const libraryEmpty = document.querySelector("#library-empty");
const resultCount = document.querySelector("#result-count");
const documentCategory = document.querySelector("#document-category");
const documentTitle = document.querySelector("#document-title");
const documentTags = document.querySelector("#document-tags");
const documentText = document.querySelector("#document-text");

const authActionButton = document.querySelector("#auth-action-button");
const userStatus = document.querySelector("#user-status");
const authForm = document.querySelector("#auth-form");
const loginTab = document.querySelector("#login-tab");
const registerTab = document.querySelector("#register-tab");
const nameGroup = document.querySelector("#name-group");
const authName = document.querySelector("#auth-name");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authTitle = document.querySelector("#auth-title");
const authDescription = document.querySelector("#auth-description");
const authSubmitButton = document.querySelector("#auth-submit-button");
const authSecondaryAction = document.querySelector("#auth-secondary-action");
const authFeedback = document.querySelector("#auth-feedback");

let tagCatalog = [];
let activeGroupKey = "";
let selectedTags = [];
let appliedTags = [];
let hasSearched = false;
let authMode = "login";

function getContents() {
  const saved = localStorage.getItem(contentStorageKey);

  if (!saved) {
    localStorage.setItem(contentStorageKey, JSON.stringify(initialContents));
    return initialContents;
  }

  return JSON.parse(saved);
}

function saveContents(contents) {
  localStorage.setItem(contentStorageKey, JSON.stringify(contents));
}

function getSession() {
  const saved = localStorage.getItem(authStorageKey);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    localStorage.removeItem(authStorageKey);
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(authStorageKey, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(authStorageKey);
}

function isAuthenticated() {
  const session = getSession();
  return Boolean(session?.token);
}

function requireAuthentication(message) {
  if (isAuthenticated()) {
    return true;
  }

  setAuthMode("login");
  showScreen("auth");
  showAuthFeedback(message, "info");

  return false;
}

function createContentId() {
  return `CNT-${Date.now().toString().slice(-8)}`;
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("-", " ")
    .trim();
}

function getAllTagsFromCatalog() {
  return tagCatalog.flatMap((group) => [
    { key: group.key, label: group.label, groupKey: group.key },
    ...group.subTags.map((tag) => ({
      ...tag,
      groupKey: group.key
    }))
  ]);
}

function getTagLabel(key) {
  const tag = getAllTagsFromCatalog().find((item) => item.key === key);
  return tag ? tag.label : key;
}

function getCategoryLabel(categoryKey) {
  const group = tagCatalog.find((item) => item.key === categoryKey);
  return group ? group.label : categoryKey;
}

function getCurrentTypedTag() {
  const value = searchInput.value;
  const parts = value.split(",");
  return normalizeText(parts[parts.length - 1]);
}

function findTagByTerm(term) {
  const normalizedTerm = normalizeText(term);

  if (!normalizedTerm) {
    return null;
  }

  return getAllTagsFromCatalog().find((tag) => {
    const normalizedKey = normalizeText(tag.key);
    const normalizedLabel = normalizeText(tag.label);

    return normalizedKey === normalizedTerm || normalizedLabel === normalizedTerm;
  });
}

function addTagToSelection(tagKey) {
  if (!selectedTags.includes(tagKey)) {
    selectedTags = [...selectedTags, tagKey];
  }
}

function clearManualSearch() {
  searchInput.value = "";
  tagSuggestions.hidden = true;
  tagSuggestions.innerHTML = "";
}

function addTagFromSuggestion(tagKey) {
  addTagToSelection(tagKey);
  clearManualSearch();

  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
}

function processCommaSeparatedTags() {
  if (!searchInput.value.includes(",")) {
    return;
  }

  const parts = searchInput.value.split(",");
  const pendingTerm = parts.pop();
  let addedAnyTag = false;

  parts.forEach((part) => {
    const matchedTag = findTagByTerm(part);

    if (matchedTag) {
      addTagToSelection(matchedTag.key);
      addedAnyTag = true;
    }
  });

  searchInput.value = pendingTerm.trimStart();

  if (addedAnyTag) {
    renderTagGroups();
    renderSubTags();
    renderSelectedTags();
  }
}

function renderTagSuggestions() {
  processCommaSeparatedTags();

  const typedTag = getCurrentTypedTag();
  tagSuggestions.innerHTML = "";

  if (!typedTag) {
    tagSuggestions.hidden = true;
    return;
  }

  const suggestions = getAllTagsFromCatalog()
    .filter((tag) => {
      const normalizedKey = normalizeText(tag.key);
      const normalizedLabel = normalizeText(tag.label);
      const alreadySelected = selectedTags.includes(tag.key);

      return !alreadySelected &&
        (normalizedKey.includes(typedTag) || normalizedLabel.includes(typedTag));
    })
    .slice(0, 8);

  if (suggestions.length === 0) {
    tagSuggestions.hidden = true;
    return;
  }

  suggestions.forEach((tag) => {
    const button = document.createElement("button");
    button.className = "suggestion-chip";
    button.type = "button";
    button.textContent = tag.label;

    button.addEventListener("click", () => {
      addTagFromSuggestion(tag.key);
    });

    tagSuggestions.appendChild(button);
  });

  tagSuggestions.hidden = false;
}

async function fetchTags() {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`);

    if (!response.ok) {
      throw new Error("Unable to load tag catalog.");
    }

    tagCatalog = await response.json();
  } catch (error) {
    tagCatalog = fallbackTagCatalog;
    console.warn("Tag catalog API unavailable. Local catalog was loaded.", error);
  }

  activeGroupKey = "";
  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
  renderContents();
}

function showScreen(screenName) {
  if (screenName === "submit" && !requireAuthentication("Faça login para enviar novos conteúdos.")) {
    return;
  }

  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[screenName].classList.add("is-active");

  if (screenName === "library") {
    renderContents();
  }

  if (screenName === "auth") {
    clearAuthFeedback();
    authEmail.focus();
  }
}

function renderTagGroups() {
  tagGroupList.innerHTML = "";

  tagCatalog.forEach((group) => {
    const button = document.createElement("button");
    button.className = "tag-group-button";
    button.type = "button";
    button.textContent = group.label;

    const isOpen = group.key === activeGroupKey;
    const hasSelectedTag =
      selectedTags.includes(group.key) ||
      group.subTags.some((tag) => selectedTags.includes(tag.key));

    button.classList.toggle("is-active", isOpen);
    button.classList.toggle("is-selected", hasSelectedTag);

    button.addEventListener("click", () => {
      addTagToSelection(group.key);
      activeGroupKey = activeGroupKey === group.key ? "" : group.key;

      renderTagGroups();
      renderSubTags();
      renderSelectedTags();
    });

    tagGroupList.appendChild(button);
  });
}

function renderSubTags() {
  const activeGroup = tagCatalog.find((group) => group.key === activeGroupKey);
  subtagList.innerHTML = "";

  if (!activeGroup) {
    subtagSection.hidden = true;
    return;
  }

  subtagSection.hidden = false;

  activeGroup.subTags.forEach((tag) => {
    const button = document.createElement("button");
    button.className = "tag-chip";
    button.type = "button";
    button.textContent = tag.label;
    button.classList.toggle("is-selected", selectedTags.includes(tag.key));

    button.addEventListener("click", () => toggleSelectedTag(tag.key));

    subtagList.appendChild(button);
  });
}

function toggleSelectedTag(tagKey) {
  if (selectedTags.includes(tagKey)) {
    selectedTags = selectedTags.filter((key) => key !== tagKey);
  } else {
    selectedTags = [...selectedTags, tagKey];
  }

  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
}

function renderSelectedTags() {
  selectedTagsContainer.innerHTML = "";

  if (selectedTags.length === 0) {
    selectedTagsContainer.innerHTML = '<span class="muted-text">Nenhuma tag selecionada.</span>';
    return;
  }

  selectedTags.forEach((tagKey) => {
    const button = document.createElement("button");
    button.className = "selected-tag";
    button.type = "button";
    button.innerHTML = `${getTagLabel(tagKey)} <span aria-hidden="true">×</span>`;
    button.setAttribute("aria-label", `Remover tag ${getTagLabel(tagKey)}`);

    button.addEventListener("click", () => toggleSelectedTag(tagKey));

    selectedTagsContainer.appendChild(button);
  });
}

function applyFilters() {
  if (!requireAuthentication("Faça login para consultar os conteúdos da biblioteca.")) {
    return;
  }

  const typedTag = getCurrentTypedTag();
  const matchedTag = findTagByTerm(typedTag);

  if (matchedTag) {
    addTagToSelection(matchedTag.key);
    clearManualSearch();
    renderTagGroups();
    renderSubTags();
    renderSelectedTags();
  }

  appliedTags = [...selectedTags];
  hasSearched = true;
  renderContents();
}

function clearFilters() {
  selectedTags = [];
  appliedTags = [];
  activeGroupKey = "";
  hasSearched = false;

  clearManualSearch();

  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
  renderContents();
}

function renderContents() {
  contentGrid.innerHTML = "";

  if (!hasSearched) {
    resultCount.textContent = "0 conteúdos";
    libraryEmpty.textContent = "Selecione uma ou mais tags e clique em Filtrar para consultar a biblioteca.";
    libraryEmpty.classList.add("is-visible");
    return;
  }

  if (appliedTags.length === 0) {
    resultCount.textContent = "0 conteúdos";
    libraryEmpty.textContent = "Selecione pelo menos uma tag antes de iniciar a pesquisa.";
    libraryEmpty.classList.add("is-visible");
    return;
  }

  const contents = getContents();

  const filteredContents = contents.filter((content) => {
    const contentTags = content.tags || [];
    return appliedTags.some((tag) => contentTags.includes(tag));
  });

  filteredContents.forEach((content) => {
    const card = document.createElement("button");
    card.className = "content-card";
    card.type = "button";
    card.innerHTML = `
      <span class="content-category">${getCategoryLabel(content.category)}</span>
      <strong>${content.title}</strong>
      <p>${content.text}</p>
      <div class="card-tags">
        ${(content.tags || []).slice(0, 4).map((tag) => `<span>${getTagLabel(tag)}</span>`).join("")}
      </div>
    `;

    card.addEventListener("click", () => openDocument(content));
    contentGrid.appendChild(card);
  });

  resultCount.textContent = `${filteredContents.length} conteúdo${filteredContents.length === 1 ? "" : "s"}`;

  if (filteredContents.length === 0) {
    libraryEmpty.textContent = "Nenhum conteúdo encontrado para os filtros selecionados.";
    libraryEmpty.classList.add("is-visible");
  } else {
    libraryEmpty.classList.remove("is-visible");
  }
}

function openDocument(content) {
  documentCategory.textContent = getCategoryLabel(content.category);
  documentTitle.textContent = content.title;
  documentText.textContent = content.text;
  documentTags.innerHTML = (content.tags || [])
    .map((tag) => `<span>${getTagLabel(tag)}</span>`)
    .join("");

  showScreen("document");
}

function suggestCategory(normalizedText) {
  if (normalizedText.includes("react") || normalizedText.includes("css") || normalizedText.includes("html")) {
    return "frontend";
  }

  if (normalizedText.includes("python") || normalizedText.includes("tf idf") || normalizedText.includes("modelo")) {
    return "data-science";
  }

  if (normalizedText.includes("oci") || normalizedText.includes("cloud") || normalizedText.includes("docker") || normalizedText.includes("bucket")) {
    return "cloud";
  }

  if (normalizedText.includes("sql") || normalizedText.includes("banco") || normalizedText.includes("database")) {
    return "database";
  }

  if (normalizedText.includes("seguranca") || normalizedText.includes("security") || normalizedText.includes("token") || normalizedText.includes("jwt")) {
    return "security";
  }

  return "backend";
}

function suggestTags(title, text, informedCategory) {
  const normalizedContent = normalizeText(`${title} ${text}`);
  const tags = new Set();

  const category = informedCategory || suggestCategory(normalizedContent);
  tags.add(category);

  getAllTagsFromCatalog().forEach((tag) => {
    const normalizedKey = normalizeText(tag.key);
    const normalizedLabel = normalizeText(tag.label);

    if (normalizedContent.includes(normalizedKey) || normalizedContent.includes(normalizedLabel)) {
      tags.add(tag.key);
    }
  });

  return Array.from(tags);
}

function setAuthMode(mode) {
  authMode = mode;
  clearAuthFeedback();
  authForm.reset();

  const isLogin = authMode === "login";

  loginTab.classList.toggle("is-active", isLogin);
  registerTab.classList.toggle("is-active", !isLogin);

  nameGroup.hidden = isLogin;
  authName.required = !isLogin;

  authTitle.textContent = isLogin ? "Entrar na plataforma" : "Criar conta";
  authDescription.textContent = isLogin
    ? "Acesse sua conta para manter seu histórico de conteúdos e futuras consultas personalizadas."
    : "Crie uma conta para registrar conteúdos, organizar conhecimento e preparar consultas personalizadas.";

  authSubmitButton.textContent = isLogin ? "Entrar" : "Criar conta";
  authSecondaryAction.textContent = isLogin ? "Ainda não tenho conta" : "Já tenho conta";
}

function showAuthFeedback(message, type = "error") {
  authFeedback.textContent = message;
  authFeedback.className = `auth-feedback is-${type}`;
  authFeedback.hidden = false;
}

function clearAuthFeedback() {
  authFeedback.textContent = "";
  authFeedback.hidden = true;
  authFeedback.className = "auth-feedback";
}

async function sendAuthRequest(endpoint, payload) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  let data = {};

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      data = { message: responseText };
    }
  }

  if (!response.ok) {
    const message = data.message || data.error || "Não foi possível concluir a operação.";
    throw new Error(message);
  }

  return data;
}

function extractToken(data) {
  return data.token || data.accessToken || data.jwt || data.bearerToken || "";
}

async function handleRegister(name, email, password) {
  await sendAuthRequest("/auth/register", {
    name,
    email,
    password
  });

  setAuthMode("login");
  authEmail.value = email;
  showAuthFeedback("Cadastro realizado com sucesso. Informe sua senha para entrar.", "success");
}

async function handleLogin(email, password) {
  const data = await sendAuthRequest("/auth/login", {
    email,
    password
  });

  const token = extractToken(data);

  if (!token) {
    throw new Error("Login realizado, mas o token não foi encontrado na resposta da API.");
  }

  saveSession({
    token,
    email,
    name: data.name || email,
    createdAt: new Date().toISOString()
  });

  renderAuthState();
  authForm.reset();
  showScreen("library");
}

function renderAuthState() {
  const session = getSession();

  if (!session) {
    userStatus.hidden = true;
    userStatus.textContent = "";
    authActionButton.textContent = "Login";
    authActionButton.classList.remove("is-logout");
    return;
  }

  userStatus.hidden = false;
  userStatus.textContent = session.name || session.email;
  authActionButton.textContent = "Sair";
  authActionButton.classList.add("is-logout");
}

function logout() {
  clearSession();
  renderAuthState();
  clearFilters();
  showScreen("library");
}

catalogForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!requireAuthentication("Faça login para catalogar novos conteúdos.")) {
    return;
  }

  const formData = new FormData(catalogForm);
  const title = formData.get("title").trim();
  const text = formData.get("text").trim();
  const informedCategory = formData.get("category");
  const normalizedContent = normalizeText(`${title} ${text}`);
  const category = informedCategory || suggestCategory(normalizedContent);

  const newContent = {
    id: createContentId(),
    title,
    text,
    category,
    probability: 0.8,
    tags: suggestTags(title, text, category)
  };

  const contents = getContents();
  contents.unshift(newContent);
  saveContents(contents);

  catalogForm.reset();
  showScreen("success");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearAuthFeedback();

  const name = authName.value.trim();
  const email = authEmail.value.trim();
  const password = authPassword.value;

  authSubmitButton.disabled = true;
  authSubmitButton.textContent = authMode === "login" ? "Entrando..." : "Criando conta...";

  try {
    if (authMode === "login") {
      await handleLogin(email, password);
    } else {
      await handleRegister(name, email, password);
    }
  } catch (error) {
    showAuthFeedback(error.message);
  } finally {
    authSubmitButton.disabled = false;
    authSubmitButton.textContent = authMode === "login" ? "Entrar" : "Criar conta";
  }
});

loginTab.addEventListener("click", () => setAuthMode("login"));
registerTab.addEventListener("click", () => setAuthMode("register"));

authSecondaryAction.addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "register" : "login");
});

authActionButton.addEventListener("click", () => {
  const session = getSession();

  if (session) {
    logout();
    return;
  }

  setAuthMode("login");
  showScreen("auth");
});

toggleSearchButton.addEventListener("click", () => {
  manualSearch.hidden = !manualSearch.hidden;

  if (!manualSearch.hidden) {
    searchInput.focus();
    renderTagSuggestions();
  } else {
    clearManualSearch();
  }
});

searchInput.addEventListener("input", renderTagSuggestions);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const typedTag = getCurrentTypedTag();
    const matchedTag = findTagByTerm(typedTag);

    if (matchedTag) {
      addTagFromSuggestion(matchedTag.key);
    }
  }

  if (event.key === "Escape") {
    tagSuggestions.hidden = true;
  }
});

applyFiltersButton.addEventListener("click", applyFilters);
clearFiltersButton.addEventListener("click", clearFilters);

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.view);
  });
});

setAuthMode("login");
renderAuthState();
fetchTags();