const popup = document.createElement("div");
popup.id = "knownow-popup";
Object.assign(popup.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "320px",
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    fontFamily: "sans-serif",
    zIndex: "999999",
    display: "none",
    border: "1px solid #45475a",
    transition: "all 0.3s ease"
});
popup.innerHTML = `
  <div style="font-weight: bold; margin-bottom: 8px; color: #89b4fa; display: flex; justify-content: space-between;">
    <span>⚡ KnowNow Context</span>
    <span id="knownow-close" style="cursor:pointer; color: #f38ba8; font-size: 18px; line-height: 1;">×</span>
  </div>
  <div id="knownow-content" style="font-size: 14px; line-height: 1.4; white-space: pre-wrap;"></div>
`;
document.body.appendChild(popup);
document.getElementById("knownow-close").addEventListener("click", () => {
    popup.style.display = "none";
});
chrome.runtime.onMessage.addListener((message) => {
    const contentDiv = document.getElementById("knownow-content");
    if (message.action === "showLoading") {
        popup.style.display = "block";
        contentDiv.innerHTML = "<i style='color: #a6e3a1;'>Thinking...</i>";
    }
    if (message.action === "showResult") {
        popup.style.display = "block";
        const formattedText = message.text.replace(
            /(https?:\/\/[^\s)]+)/g, 
            '<a href="$1" target="_blank" style="color: #a6e3a1; text-decoration: underline; word-break: break-all;">$1</a>'
        );
        contentDiv.innerHTML = formattedText;
    }
});