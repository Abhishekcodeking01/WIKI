const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const articleTitle = document.getElementById("articleTitle");
const articleSummary = document.getElementById("articleSummary");
const articleImage = document.getElementById("articleImage");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

// Define alias groups
const aliases = {
  barbie: ["Barbie", "Cinderella", "Rapunzel"],
  ironman: ["Ironman", "Batman", "Superman"],
};

// Current user context
let currentAliasGroup = [];
let currentAliasIndex = 0;
let currentKeyword = "default";

// Load saved chat
function loadChat() {
  const saved = localStorage.getItem(`chat_${currentKeyword}`);
  chatBox.innerHTML = saved ? saved : "";
}

// Save chat
function saveChat() {
  localStorage.setItem(`chat_${currentKeyword}`, chatBox.innerHTML);
}

// Fetch article
async function fetchArticle(keyword) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        keyword
      )}`
    );
    const data = await res.json();

    articleTitle.textContent = data.title || keyword;
    articleSummary.textContent = data.extract || "No summary found.";
    articleImage.src = data.thumbnail ? data.thumbnail.source : "";
  } catch (err) {
    articleTitle.textContent = "Error loading article.";
    articleSummary.textContent = err.message;
  }
}

// Set alias group based on keyword
function setAlias(keyword) {
  keyword = keyword.toLowerCase();
  if (aliases[keyword]) {
    currentAliasGroup = aliases[keyword];
  } else {
    currentAliasGroup = ["Guest1", "Guest2"];
  }
  currentAliasIndex = 0;
}

// Post message
function postMessage() {
  const msg = messageInput.value.trim();
  if (!msg) return;

  const alias = currentAliasGroup[currentAliasIndex];
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `<span class="alias">${alias}:</span> ${msg}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  messageInput.value = "";
  saveChat();

  // Cycle alias
  currentAliasIndex = (currentAliasIndex + 1) % currentAliasGroup.length;
}

// Search button click
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim();
  if (!keyword) return;

  currentKeyword = keyword.toLowerCase();
  setAlias(currentKeyword);
  fetchArticle(currentKeyword);
  loadChat();
});

// Send button click
sendBtn.addEventListener("click", postMessage);

// Enter key to send
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") postMessage();
});

// Load default random article
window.onload = async () => {
  const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary");
  const data = await res.json();
  articleTitle.textContent = data.title;
  articleSummary.textContent = data.extract;
  articleImage.src = data.thumbnail ? data.thumbnail.source : "";
};
