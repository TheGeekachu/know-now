chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "knowNowSearch",
        title: "KnowNow",
        contexts: ["selection"]
    });
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if(info.menuItemId === "knowNowSearch") {
        const highlightedText = info.selectionText;
        const apiKey = "PASTE_GROQ_KEY_HERE";
        chrome.tabs.sendMessage(tab.id, {action: "showLoading"});
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "system",
                            content: `You are 'KnowNow', an adaptive AI reading assistant. Analyze the user's text and use your best judgment to determine what format, depth, and length of information they need based on the context.

                            1. ADAPTIVE LENGTH & STYLE (MAX 12 SENTENCES):
                               - For simple vocabulary words, internet slang, or simple acronyms: give a ultra-brief definition and quick contextual usage (1-2 sentences).
                               - For complex theories, coding bugs, historical events, or multi-faceted concepts: deliver a deep, structured research overview.
                               - You can use brief paragraphs if necessary, but the entire response must strictly remain UNDER 12 sentences total.

                            2. HIGHLY RELEVANT LINKS:
                               - At the very end of your explanation, include a section titled "Relevant Links:".
                               - Dynamically predict 1 to 3 highly accurate, stable target URLs where the user can read more (e.g., standard Wikipedia links formatted like https://en.wikipedia.org/wiki/Topic, MDN Web Docs for web dev, or official documentation). Keep the raw URLs visible.`
                        },
                        {
                            role: "user",
                            content: highlightedText
                        }
                    ]
                })
            });
            const data = await response.json();
            
            if (data.error) {
                console.error("Groq Error:", data.error);
                chrome.tabs.sendMessage(tab.id, { action: "showResult", text: `Groq Error: ${data.error.message}`});
                return;
            }
            const aiResult = data.choices[0].message.content;
            chrome.tabs.sendMessage(tab.id, { action: "showResult", text: aiResult});
        } catch (error) {
            console.error("Network Error:", error);
            chrome.tabs.sendMessage(tab.id, {action: "showResult", text: "Error fetching context from Groq."}); 
        }
    }
});