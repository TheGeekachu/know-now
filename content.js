const popup = document.createElement("div");
popup.id = "knownow-popup";
Object.assign(popup.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "360px",
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(12px) saturate(160%)",
    color: "#000000",
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(31,38,135,0.2)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    zIndex: "999999",
    display: "none",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    transition: "box-shadow 0.3s ease",
    cursor: "grab"
});
popup.innerHTML = `
  <div id="knownow-header" style="font-weight: 800; letter-spacing: 0.5px; margin-bottom: 12px; color: #000000; display: flex; justify-content: space-between; align-items: center; user-select: none; cursor: move; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
    <span style="display: flex; align-items: center; gap: 6px;">Context by KnowNow</span>
    <span id="knownow-close" style="cursor:pointer; color: #ff4e50; font-size: 20px; line-height: 1; padding: 2px 6px;">×</span>
  </div>
  <div id="knownow-content" style="font-size: 14px; line-height: 1.5; white-space: pre-wrap;">
    <style>
      #knownow-content strong { color: #fff677; font-weight: 600; } /* Bright yellow for bold highlights */
      #knownow-content em { color: #e0e0e0; }
      #knownow-content code { background-color: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #ffffff; }
    </style>
  </div>
`;
document.body.appendChild(popup);
document.getElementById("knownow-close").addEventListener("click", (e) => {
    e.stopPropagation();
    popup.style.display = "none";
});
function parseMarkdown(text) {
    let html = text;
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    html = html.replace(/(?:^|\n)[-*]\s+(.+)/g, '<div style="margin-left: 12px; margin-top: 4px;">• $1</div>');
    html = html.replace(/\n/g, '<br>');
    return html;
}
let isDragging = false;
let startX, startY, initialLeft, initialRight, initialTop, initialBottom;
const header = document.getElementById("knownow-header");
header.addEventListener("mousedown", (e) => {
    isDragging = true;
    popup.style.cursor = "grabbing";
    const rect = popup.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    popup.style.top = rect.top + "px";
    popup.style.left = rect.left + "px";
    popup.style.bottom = "auto";
    popup.style.right = "auto";
    e.preventDefault();
});
document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const currentLeft = parseFloat(popup.style.left);
    const currentTop = parseFloat(popup.style.top);
    popup.style.left = (currentLeft + dx) + "px";
    popup.style.top = (currentTop + dy) + "px";
    startX = e.clientX;
    startY = e.clientY;
});
document.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        popup.style.cursor = "grab";
    }
});
chrome.runtime.onMessage.addListener((message) => {
    const contentDiv = document.getElementById("knownow-content");
    if (message.action === "showLoading") {
        popup.style.display = "block";
        contentDiv.innerHTML = "<i style='color: #a6e3a1;'>Thinking...</i>";
    }
    if (message.action === "showResult") {
        popup.style.display = "block";
        let formattedText = parseMarkdown(message.text);
        formattedText = formattedText.replace(
            /(https?:\/\/[^\s<)]+)/g, 
            '<a href="$1" target="_blank" style="color: #800080; text-decoration: underline; word-break: break-all;">$1</a>'
        );
        contentDiv.innerHTML = formattedText;
    }
});