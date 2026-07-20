const API_BASE_URL = (() => {
  const isLocalDevServer =
    ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
    window.location.port === "5173";

  return isLocalDevServer ? "http://localhost:8080" : "/api";
})();

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
const resultsTitle = document.querySelector("#results-title");
const historyButton = document.querySelector("#history-button");
const favoritesButton = document.querySelector("#favorites-button");

const documentCategory = document.querySelector("#document-category");
const documentTitle = document.querySelector("#document-title");
const documentTags = document.querySelector("#document-tags");
const documentText = document.querySelector("#document-text");
const documentFavoriteButton = document.querySelector("#document-favorite-button");
const documentFeedback = document.querySelector("#document-feedback");
const documentReviewPanel = document.querySelector("#document-review-panel");
const documentReviewTitle = document.querySelector("#document-review-title");
const documentReviewMessage = document.querySelector("#document-review-message");
const documentConfidence = document.querySelector("#document-confidence");
const documentReviewStatus = document.querySelector("#document-review-status");
const confirmTagsButton = document.querySelector("#confirm-tags-button");
const tagCorrectionForm = document.querySelector("#tag-correction-form");
const correctionSelectedTagsContainer = document.querySelector("#correction-selected-tags");
const correctionTagGroupList = document.querySelector("#correction-tag-group-list");
const correctionSubtagSection = document.querySelector("#correction-subtag-section");
const correctionSubtagList = document.querySelector("#correction-subtag-list");
const correctionTagsButton = document.querySelector("#correction-tags-button");

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
let currentListMode = "search";
let currentDocument = null;
let favoriteContentIds = new Set();
let isLoadingDocument = false;
let authMode = "login";
let correctionSelectedTags = [];
let correctionActiveGroupKey = "";
let isReviewActionLoading = false;

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

function getAuthToken() {
  const session = getSession();
  return session?.token || "";
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

  if (currentDocument) {
    renderDocumentReview(currentDocument);
  }
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

async function fetchContentDetail(contentId) {
  return apiRequest(`/content/${contentId}`, {
    auth: true
  });
}

async function fetchFavorites() {
  return apiRequest("/content/favorites", {
    auth: true
  });
}

async function fetchHistory() {
  return apiRequest("/content/history", {
    auth: true
  });
}

async function favoriteContent(contentId) {
  return apiRequest(`/content/${contentId}/favorite`, {
    method: "POST",
    auth: true
  });
}

async function unfavoriteContent(contentId) {
  return apiRequest(`/content/${contentId}/favorite`, {
    method: "DELETE",
    auth: true
  });
}

async function confirmContentTags(contentId) {
  return apiRequest(`/content/${contentId}/tags/confirm`, {
    method: "PATCH",
    auth: true
  });
}

async function updateContentTags(contentId, tags) {
  return apiRequest(`/content/${contentId}/tags`, {
    method: "PUT",
    auth: true,
    body: {
      tags
    }
  });
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

async function refreshFavoritesCache() {
  if (!isAuthenticated()) {
    favoriteContentIds = new Set();
    return [];
  }

  const data = await fetchFavorites();
  const favorites = Array.isArray(data) ? data : [];
  favoriteContentIds = new Set(favorites.map((content) => Number(content.id)));

  return favorites;
}

function hasPendingLowConfidence(content) {
  return Boolean(content?.lowConfidenceAlert) && content?.revised !== true;
}

function formatConfidence(probability) {
  if (typeof probability !== "number") {
    return "Confiança não informada";
  }

  return `Confiança: ${new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(probability)}`;
}

function getUniqueTagKeys(tagKeys) {
  return [...new Set((tagKeys || []).filter(Boolean))];
}

function isReviewFormEditable() {
  return Boolean(currentDocument?.id) && hasPendingLowConfidence(currentDocument) && !isReviewActionLoading;
}

function setCorrectionSelectedTags(tagKeys = []) {
  correctionSelectedTags = getUniqueTagKeys(tagKeys);
  renderCorrectionTags();
}

function addCorrectionTagToSelection(tagKey) {
  if (!correctionSelectedTags.includes(tagKey)) {
    correctionSelectedTags = [...correctionSelectedTags, tagKey];
  }
}

function toggleCorrectionSelectedTag(tagKey) {
  if (!isReviewFormEditable()) {
    return;
  }

  if (correctionSelectedTags.includes(tagKey)) {
    correctionSelectedTags = correctionSelectedTags.filter((key) => key !== tagKey);
  } else {
    correctionSelectedTags = [...correctionSelectedTags, tagKey];
  }

  renderCorrectionTags();
}

function renderCorrectionSelectedTags() {
  correctionSelectedTagsContainer.innerHTML = "";

  if (correctionSelectedTags.length === 0) {
    correctionSelectedTagsContainer.innerHTML = '<span class="muted-text">Nenhuma tag selecionada.</span>';
    return;
  }

  correctionSelectedTags.forEach((tagKey) => {
    const button = document.createElement("button");
    button.className = "selected-tag";
    button.type = "button";
    button.disabled = !isReviewFormEditable();
    button.innerHTML = `${getTagLabel(tagKey)} <span aria-hidden="true">×</span>`;
    button.setAttribute("aria-label", `Remover tag ${getTagLabel(tagKey)}`);

    button.addEventListener("click", () => toggleCorrectionSelectedTag(tagKey));

    correctionSelectedTagsContainer.appendChild(button);
  });
}

function renderCorrectionTagGroups() {
  correctionTagGroupList.innerHTML = "";

  if (tagCatalog.length === 0) {
    correctionTagGroupList.innerHTML = '<span class="muted-text">Catálogo de tags indisponível.</span>';
    return;
  }

  tagCatalog.forEach((group) => {
    const button = document.createElement("button");
    button.className = "tag-group-button";
    button.type = "button";
    button.textContent = group.label;
    button.disabled = !isReviewFormEditable();

    const isOpen = group.key === correctionActiveGroupKey;
    const hasSelectedTag =
      correctionSelectedTags.includes(group.key) ||
      (group.subTags || []).some((tag) => correctionSelectedTags.includes(tag.key));

    button.classList.toggle("is-active", isOpen);
    button.classList.toggle("is-selected", hasSelectedTag);

    button.addEventListener("click", () => {
      if (!isReviewFormEditable()) {
        return;
      }

      addCorrectionTagToSelection(group.key);
      correctionActiveGroupKey = correctionActiveGroupKey === group.key ? "" : group.key;

      renderCorrectionTags();
    });

    correctionTagGroupList.appendChild(button);
  });
}

function renderCorrectionSubTags() {
  const activeGroup = tagCatalog.find((group) => group.key === correctionActiveGroupKey);
  correctionSubtagList.innerHTML = "";

  if (!activeGroup) {
    correctionSubtagSection.hidden = true;
    return;
  }

  correctionSubtagSection.hidden = false;

  (activeGroup.subTags || []).forEach((tag) => {
    const button = document.createElement("button");
    button.className = "tag-chip";
    button.type = "button";
    button.textContent = tag.label;
    button.disabled = !isReviewFormEditable();
    button.classList.toggle("is-selected", correctionSelectedTags.includes(tag.key));

    button.addEventListener("click", () => toggleCorrectionSelectedTag(tag.key));

    correctionSubtagList.appendChild(button);
  });
}

function renderCorrectionTags() {
  renderCorrectionSelectedTags();
  renderCorrectionTagGroups();
  renderCorrectionSubTags();
}

function updateLoadedContent(updatedContent) {
  if (!updatedContent?.id) {
    return;
  }

  loadedContents = loadedContents.map((content) => {
    if (Number(content.id) !== Number(updatedContent.id)) {
      return content;
    }

    return {
      ...content,
      ...updatedContent
    };
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

  currentListMode = "search";
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
  currentListMode = "search";
  hasSearched = false;
  loadedContents = [];
  libraryErrorMessage = "";

  clearManualSearch();

  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
  renderContents();
}

function getResultsTitle() {
  if (currentListMode === "favorites") {
    return "Favoritos";
  }

  if (currentListMode === "history") {
    return "Histórico de leitura";
  }

  return "Conteúdos encontrados";
}

function getEmptyMessage() {
  if (currentListMode === "favorites") {
    return "Você ainda não favoritou nenhum conteúdo.";
  }

  if (currentListMode === "history") {
    return "Seu histórico ainda está vazio. Abra algum conteúdo para registrá-lo aqui.";
  }

  return "Nenhum conteúdo encontrado para os filtros selecionados.";
}

function createContentCard(content) {
  const card = document.createElement("button");
  const needsReview = hasPendingLowConfidence(content);

  card.className = needsReview ? "content-card needs-review" : "content-card";
  card.type = "button";

  const summaryText = content.text || "Clique para abrir o conteúdo completo.";
  const tagsMarkup = Array.isArray(content.tags) && content.tags.length > 0
    ? `<div class="card-tags">${content.tags.slice(0, 4).map((tag) => `<span>${getTagLabel(tag)}</span>`).join("")}</div>`
    : "";
  const reviewBadge = needsReview
    ? '<span class="review-badge">Baixa confiança</span>'
    : "";

  card.innerHTML = `
    <div class="card-topline">
      <span class="content-category">${getCategoryLabel(content.category)}</span>
      ${reviewBadge}
    </div>
    <strong>${content.title}</strong>
    <p>${summaryText}</p>
    ${tagsMarkup}
  `;

  card.addEventListener("click", () => openDocument(content.id));

  return card;
}

function renderContents() {
  contentGrid.innerHTML = "";
  applyFiltersButton.disabled = isLoadingContents;
  resultsTitle.textContent = getResultsTitle();

  if (libraryErrorMessage) {
    resultCount.textContent = "0 conteúdos";
    libraryEmpty.textContent = libraryErrorMessage;
    libraryEmpty.classList.add("is-visible");
    return;
  }

  if (currentListMode === "search" && !hasSearched) {
    resultCount.textContent = "0 conteúdos";
    libraryEmpty.textContent = "Selecione uma ou mais tags e clique em Filtrar para consultar a biblioteca.";
    libraryEmpty.classList.add("is-visible");
    return;
  }

  if (currentListMode === "search" && appliedTags.length === 0) {
    resultCount.textContent = "0 conteúdos";
    libraryEmpty.textContent = "Selecione pelo menos uma tag antes de iniciar a pesquisa.";
    libraryEmpty.classList.add("is-visible");
    return;
  }

  if (isLoadingContents) {
    resultCount.textContent = "Buscando...";
    libraryEmpty.textContent = currentListMode === "search"
      ? "Consultando conteúdos na API."
      : "Carregando conteúdos da API.";
    libraryEmpty.classList.add("is-visible");
    return;
  }

  loadedContents.forEach((content) => {
    contentGrid.appendChild(createContentCard(content));
  });

  resultCount.textContent = `${loadedContents.length} conteúdo${loadedContents.length === 1 ? "" : "s"}`;

  if (loadedContents.length === 0) {
    libraryEmpty.textContent = getEmptyMessage();
    libraryEmpty.classList.add("is-visible");
  } else {
    libraryEmpty.classList.remove("is-visible");
  }
}

function renderDocument(content) {
  currentDocument = content;
  documentCategory.textContent = getCategoryLabel(content.category);
  documentTitle.textContent = content.title;
  documentText.textContent = content.text;
  documentTags.innerHTML = (content.tags || [])
    .map((tag) => `<span>${getTagLabel(tag)}</span>`)
    .join("");

  renderDocumentReview(content);
  updateDocumentFavoriteButton();
}

function renderDocumentReview(content) {
  const hasTrustData = Boolean(content?.lowConfidenceAlert) ||
    typeof content?.probability === "number" ||
    content?.revised === true;

  if (!hasTrustData) {
    documentReviewPanel.hidden = true;
    correctionSelectedTags = [];
    correctionActiveGroupKey = "";
    renderCorrectionTags();
    return;
  }

  const pendingReview = hasPendingLowConfidence(content);
  const revised = content?.revised === true;

  documentReviewPanel.hidden = false;
  documentReviewPanel.classList.toggle("is-warning", pendingReview);
  documentReviewPanel.classList.toggle("is-reviewed", revised);

  documentReviewTitle.textContent = pendingReview
    ? "Classificação com baixa confiança"
    : "Classificação revisada";

  documentReviewMessage.textContent = pendingReview
    ? "Este conteúdo foi classificado com baixa confiança. Confira as tags sugeridas e confirme ou selecione as tags corretas no catálogo."
    : "As tags deste conteúdo já foram revisadas ou confirmadas.";

  documentConfidence.textContent = formatConfidence(content.probability);
  documentReviewStatus.textContent = revised ? "Tags revisadas" : "Revisão pendente";

  confirmTagsButton.hidden = !pendingReview;
  confirmTagsButton.disabled = !pendingReview || isReviewActionLoading;
  tagCorrectionForm.hidden = !pendingReview;
  correctionTagsButton.disabled = !pendingReview || isReviewActionLoading;

  if (pendingReview) {
    correctionSelectedTags = getUniqueTagKeys(content.tags || correctionSelectedTags);
  } else {
    correctionSelectedTags = [];
    correctionActiveGroupKey = "";
  }

  renderCorrectionTags();
}

async function openDocument(contentId) {
  if (!requireAuthentication("Faça login para acessar o conteúdo.")) {
    return;
  }

  currentDocument = null;
  isLoadingDocument = true;
  clearDocumentFeedback();

  documentCategory.textContent = "Carregando";
  documentTitle.textContent = "Carregando conteúdo...";
  documentText.textContent = "Buscando detalhe do conteúdo na API.";
  documentTags.innerHTML = "";
  documentReviewPanel.hidden = true;
  correctionSelectedTags = [];
  correctionActiveGroupKey = "";
  renderCorrectionTags();
  updateDocumentFavoriteButton();
  showScreen("document");

  try {
    try {
      await refreshFavoritesCache();
    } catch (error) {
      favoriteContentIds = new Set();
    }

    const content = await fetchContentDetail(contentId);
    renderDocument(content);
  } catch (error) {
    documentCategory.textContent = "Erro";
    documentTitle.textContent = "Não foi possível abrir o conteúdo";
    documentText.textContent = error.message || "Tente novamente em alguns instantes.";
    documentTags.innerHTML = "";
    documentReviewPanel.hidden = true;
  } finally {
    isLoadingDocument = false;
    updateDocumentFavoriteButton();
  }
}

function updateDocumentFavoriteButton() {
  if (!currentDocument?.id || isLoadingDocument) {
    documentFavoriteButton.disabled = true;
    documentFavoriteButton.textContent = isLoadingDocument ? "Carregando..." : "Favoritar conteúdo";
    documentFavoriteButton.classList.remove("is-active");
    return;
  }

  const contentId = Number(currentDocument.id);
  const isFavorite = favoriteContentIds.has(contentId);

  documentFavoriteButton.disabled = false;
  documentFavoriteButton.textContent = isFavorite ? "Remover dos favoritos" : "Favoritar conteúdo";
  documentFavoriteButton.classList.toggle("is-active", isFavorite);
}

function showDocumentFeedback(message, type = "info") {
  documentFeedback.textContent = message;
  documentFeedback.className = `document-feedback is-${type}`;
  documentFeedback.hidden = false;
}

function clearDocumentFeedback() {
  documentFeedback.textContent = "";
  documentFeedback.className = "document-feedback";
  documentFeedback.hidden = true;
}

async function toggleDocumentFavorite() {
  if (!currentDocument?.id || !requireAuthentication("Faça login para favoritar conteúdos.")) {
    return;
  }

  const contentId = Number(currentDocument.id);
  const isFavorite = favoriteContentIds.has(contentId);

  documentFavoriteButton.disabled = true;
  clearDocumentFeedback();

  try {
    if (isFavorite) {
      await unfavoriteContent(contentId);
      favoriteContentIds.delete(contentId);

      if (currentListMode === "favorites") {
        loadedContents = loadedContents.filter((content) => Number(content.id) !== contentId);
      }

      showDocumentFeedback("Conteúdo removido dos favoritos.", "info");
    } else {
      await favoriteContent(contentId);
      favoriteContentIds.add(contentId);
      showDocumentFeedback("Conteúdo adicionado aos favoritos.", "success");
    }

    renderContents();
  } catch (error) {
    showDocumentFeedback(error.message || "Não foi possível atualizar os favoritos.", "error");
  } finally {
    updateDocumentFavoriteButton();
  }
}

async function handleConfirmTags() {
  if (!currentDocument?.id || !requireAuthentication("Faça login para confirmar as tags.")) {
    return;
  }

  isReviewActionLoading = true;
  confirmTagsButton.disabled = true;
  correctionTagsButton.disabled = true;
  renderCorrectionTags();
  clearDocumentFeedback();

  try {
    const updatedContent = await confirmContentTags(currentDocument.id);
    renderDocument(updatedContent);
    updateLoadedContent(updatedContent);
    renderContents();
    showDocumentFeedback("Tags confirmadas como corretas.", "success");
  } catch (error) {
    showDocumentFeedback(error.message || "Não foi possível confirmar as tags.", "error");
  } finally {
    isReviewActionLoading = false;
    if (currentDocument) {
      renderDocumentReview(currentDocument);
    }
    updateDocumentFavoriteButton();
  }
}

async function handleTagCorrection(event) {
  event.preventDefault();

  if (!currentDocument?.id || !requireAuthentication("Faça login para corrigir as tags.")) {
    return;
  }

  const tags = [...correctionSelectedTags];

  if (tags.length === 0) {
    showDocumentFeedback("Selecione pelo menos uma tag para corrigir o conteúdo.", "error");
    return;
  }

  isReviewActionLoading = true;
  confirmTagsButton.disabled = true;
  correctionTagsButton.disabled = true;
  correctionTagsButton.textContent = "Enviando...";
  renderCorrectionTags();
  clearDocumentFeedback();

  try {
    const updatedContent = await updateContentTags(currentDocument.id, tags);
    renderDocument(updatedContent);
    updateLoadedContent(updatedContent);
    renderContents();
    showDocumentFeedback("Tags corrigidas com sucesso.", "success");
  } catch (error) {
    showDocumentFeedback(error.message || "Não foi possível corrigir as tags.", "error");
  } finally {
    isReviewActionLoading = false;
    correctionTagsButton.textContent = "Enviar tags corrigidas";
    if (currentDocument) {
      renderDocumentReview(currentDocument);
    }
    updateDocumentFavoriteButton();
  }
}

function resetLibraryFiltersForUserList() {
  selectedTags = [];
  appliedTags = [];
  activeGroupKey = "";

  clearManualSearch();

  renderTagGroups();
  renderSubTags();
  renderSelectedTags();
}

async function loadFavoriteContents() {
  if (!requireAuthentication("Faça login para consultar seus favoritos.")) {
    return;
  }

  currentListMode = "favorites";
  hasSearched = true;
  loadedContents = [];
  libraryErrorMessage = "";
  isLoadingContents = true;

  resetLibraryFiltersForUserList();
  showScreen("library");

  try {
    const data = await fetchFavorites();
    loadedContents = Array.isArray(data) ? data : [];
    favoriteContentIds = new Set(loadedContents.map((content) => Number(content.id)));
  } catch (error) {
    loadedContents = [];
    libraryErrorMessage = error.message || "Não foi possível carregar seus favoritos.";
  } finally {
    isLoadingContents = false;
    renderContents();
  }
}

async function loadHistoryContents() {
  if (!requireAuthentication("Faça login para consultar seu histórico.")) {
    return;
  }

  currentListMode = "history";
  hasSearched = true;
  loadedContents = [];
  libraryErrorMessage = "";
  isLoadingContents = true;

  resetLibraryFiltersForUserList();
  showScreen("library");

  try {
    const data = await fetchHistory();
    loadedContents = Array.isArray(data) ? data : [];
  } catch (error) {
    loadedContents = [];
    libraryErrorMessage = error.message || "Não foi possível carregar seu histórico.";
  } finally {
    isLoadingContents = false;
    renderContents();
  }
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

  try {
    await refreshFavoritesCache();
  } catch (error) {
    favoriteContentIds = new Set();
  }

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
  favoriteContentIds = new Set();
  currentDocument = null;
  renderAuthState();
  clearFilters();
  showScreen("library");
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
    currentListMode = "search";

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
historyButton.addEventListener("click", loadHistoryContents);
favoritesButton.addEventListener("click", loadFavoriteContents);
documentFavoriteButton.addEventListener("click", toggleDocumentFavorite);
confirmTagsButton.addEventListener("click", handleConfirmTags);
tagCorrectionForm.addEventListener("submit", handleTagCorrection);

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.view);
  });
});

setAuthMode("login");
renderAuthState();
fetchTags();