const API_BASE_URL = "http://localhost:8080";
const authStorageKey = "techmind.auth";

const screens = {
  library: document.querySelector("#library-screen"),
  submit: document.querySelector("#submit-screen"),
  auth: document.querySelector("#auth-screen"),
  success: document.querySelector("#success-screen"),
  document: document.querySelector("#document-screen")
};

const catalogForm = document.querySelector("#catalog-form");
const catalogSubmitButton = document.querySelector("#catalog-submit-button");
const contentFeedback = document.querySelector("#content-feedback");

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

const successTitle = document.querySelector("#success-title");
const successMessage = document.querySelector("#success-message");
const successTags = document.querySelector("#success-tags");

let tagCatalog = [];
let activeGroupKey = "";
let selectedTags = [];
let appliedTags = [];
let loadedContents = [];
let hasSearched = false;
let isLoadingContents = false;
let libraryErrorMessage = "";
let authMode = "login";

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

function getAuthToken() {
  const session = getSession();
  return session?.token || "";
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("-", " ")
    .trim();
}

function getAllTagsFromCatalog() {
  return tagCatalog.flatMap((group) => [
    { key: group.key, label: group.label, groupKey: group.key },
    ...(group.subTags || []).map((tag) => ({
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

  if (!typedTag || tagCatalog.length === 0) {
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

async function apiRequest(endpoint, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (options.auth) {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Sessão não encontrada. Faça login novamente.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      data = { message: responseText };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.detail ||
      data?.title ||
      data?.error ||
      "Não foi possível concluir a operação.";

    throw new Error(message);
  }

  return data;
}

async function fetchTags() {
  try {
    tagCatalog = await apiRequest("/tags");
    libraryErrorMessage = "";
  } catch (error) {
    tagCatalog = [];
    libraryErrorMessage = "Não foi possível carregar o catálogo de tags da API.";
  }

  activeGroupKey = "";
  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
  renderContents();
}

async function fetchContentsByTags(tags) {
  const params = new URLSearchParams();

  tags.forEach((tag) => {
    params.append("tags", tag);
  });

  return apiRequest(`/content/search?${params.toString()}`, {
    auth: true
  });
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

  if (screenName === "submit") {
    clearContentFeedback();
  }
}

function renderTagGroups() {
  tagGroupList.innerHTML = "";

  if (tagCatalog.length === 0) {
    tagGroupList.innerHTML = '<span class="muted-text">Catálogo de tags indisponível.</span>';
    return;
  }

  tagCatalog.forEach((group) => {
    const button = document.createElement("button");
    button.className = "tag-group-button";
    button.type = "button";
    button.textContent = group.label;

    const isOpen = group.key === activeGroupKey;
    const hasSelectedTag =
      selectedTags.includes(group.key) ||
      (group.subTags || []).some((tag) => selectedTags.includes(tag.key));

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

  (activeGroup.subTags || []).forEach((tag) => {
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

async function applyFilters() {
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
  loadedContents = [];
  libraryErrorMessage = "";

  if (appliedTags.length === 0) {
    renderContents();
    return;
  }

  isLoadingContents = true;
  renderContents();

  try {
    const data = await fetchContentsByTags(appliedTags);
    loadedContents = Array.isArray(data) ? data : [];
  } catch (error) {
    loadedContents = [];
    libraryErrorMessage = error.message || "Não foi possível consultar os conteúdos.";
  } finally {
    isLoadingContents = false;
    renderContents();
  }
}

function clearFilters() {
  selectedTags = [];
  appliedTags = [];
  activeGroupKey = "";
  hasSearched = false;
  loadedContents = [];
  libraryErrorMessage = "";

  clearManualSearch();

  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
  renderContents();
}

function renderContents() {
  contentGrid.innerHTML = "";
  applyFiltersButton.disabled = isLoadingContents;

  if (libraryErrorMessage) {
    resultCount.textContent = "0 conteúdos";
    libraryEmpty.textContent = libraryErrorMessage;
    libraryEmpty.classList.add("is-visible");
    return;
  }

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

  if (isLoadingContents) {
    resultCount.textContent = "Buscando...";
    libraryEmpty.textContent = "Consultando conteúdos na API.";
    libraryEmpty.classList.add("is-visible");
    return;
  }

  loadedContents.forEach((content) => {
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

  resultCount.textContent = `${loadedContents.length} conteúdo${loadedContents.length === 1 ? "" : "s"}`;

  if (loadedContents.length === 0) {
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

function showContentFeedback(message, type = "error") {
  contentFeedback.textContent = message;
  contentFeedback.className = `form-feedback is-${type}`;
  contentFeedback.hidden = false;
}

function clearContentFeedback() {
  contentFeedback.textContent = "";
  contentFeedback.hidden = true;
  contentFeedback.className = "form-feedback";
}

function extractToken(data) {
  return data.token || data.accessToken || data.jwt || data.bearerToken || "";
}

async function handleRegister(name, email, password) {
  await apiRequest("/auth/register", {
    method: "POST",
    body: {
      name,
      email,
      password
    }
  });

  setAuthMode("login");
  authEmail.value = email;
  showAuthFeedback("Cadastro realizado com sucesso. Informe sua senha para entrar.", "success");
}

async function handleLogin(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: {
      email,
      password
    }
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

async function submitContent(title, text) {
  return apiRequest("/content", {
    method: "POST",
    auth: true,
    body: {
      title,
      text
    }
  });
}

function renderContentSuccess(response) {
  successTitle.textContent = "Texto enviado com sucesso.";
  successMessage.textContent = "O conteúdo foi processado pela API e salvo para consulta na biblioteca.";
  successTags.innerHTML = "";

  const tags = response?.additionalInformation || [];

  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.textContent = getTagLabel(tag);
    successTags.appendChild(span);
  });
}

catalogForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!requireAuthentication("Faça login para catalogar novos conteúdos.")) {
    return;
  }

  clearContentFeedback();

  const formData = new FormData(catalogForm);
  const title = formData.get("title").trim();
  const text = formData.get("text").trim();

  catalogSubmitButton.disabled = true;
  catalogSubmitButton.textContent = "Enviando...";

  try {
    const response = await submitContent(title, text);
    renderContentSuccess(response);
    catalogForm.reset();

    hasSearched = false;
    loadedContents = [];
    appliedTags = [];
    selectedTags = [];
    activeGroupKey = "";

    renderTagGroups();
    renderSubTags();
    renderSelectedTags();

    showScreen("success");
  } catch (error) {
    showContentFeedback(error.message || "Não foi possível enviar o conteúdo.");
  } finally {
    catalogSubmitButton.disabled = false;
    catalogSubmitButton.textContent = "Catalogar conteúdo";
  }
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