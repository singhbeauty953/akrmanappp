// Global news store using localStorage
const KEY = "newspulse_articles";

export function getArticles() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveArticle(article) {
  const articles = getArticles();
  const existing = articles.findIndex(a => a.id === article.id);
  if (existing >= 0) {
    articles[existing] = article;
  } else {
    articles.unshift({ ...article, id: Date.now().toString(), createdAt: new Date().toISOString() });
  }
  localStorage.setItem(KEY, JSON.stringify(articles));
}

export function deleteArticle(id) {
  const articles = getArticles().filter(a => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(articles));
}

export const SECTIONS = [
  { value: "section1", label: "भारत और विश्व" },
  { value: "section2", label: "स्वास्थ्य और जीवनशैली" },
  { value: "section3", label: "तकनीक, खेल और व्यापार" },
  { value: "prime",    label: "प्रमुख लेख (आयुर्वेद)" },
  { value: "hero",     label: "हीरो स्टोरी (Breaking)" },
];

export const BADGES = [
  { value: "badge-red",    label: "भारत / क्रिकेट" },
  { value: "badge-blue",   label: "विश्व / तकनीक / शोध" },
  { value: "badge-green",  label: "स्वास्थ्य / आयुर्वेद / ईवी" },
  { value: "badge-orange", label: "राजनीति / खेल / पोषण" },
  { value: "badge-purple", label: "विज्ञान / व्यापार" },
];
