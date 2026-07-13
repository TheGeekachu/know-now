async function fetchLiveWebResults(query) {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        const response = await fetch(searchUrl);
        if (!response.ok) return [];
        
        const data = await response.json();
        const searchResults = data.query?.search || [];
        
        const results = [];
        for (let i = 0; i < Math.min(searchResults.length, 2); i++) {
            const page = searchResults[i];
            const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
            const snippet = page.snippet.replace(/<[^>]*>/g, '').trim();
            
            results.push({ url, snippet: `${page.title}: ${snippet}` });
        }
        return results;
    } catch (e) {
        console.error("Wikipedia lookup failed:", e);
        return [];
    }
}
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
        const webContext = await fetchLiveWebResults(highlightedText);
        let liveSearchContextText = "No live web results found.";
        if (webContext.length > 0) {
            liveSearchContextText = webContext.map((res, index) => 
                `[Result ${index + 1}]\nURL: ${res.url}\nSnippet: ${res.snippet}`
            ).join("\n\n");
        }
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "qwen/qwen3.6-27b",
                    messages: [
                        {
                            role: "system",
                            content: `You are 'KnowNow', an adaptive AI reading assistant utilizing real-time live web results to cross-verify facts.
                            
                            CRITICAL DIRECTIONS:
                            1. ACCURACY CHECK: Compare your internal knowledge with the provided [LIVE WEB CONTEXT]. If there's a contradiction, prioritize the live web information so you are 100% accurate to current events.
                            
                            2. ADAPTIVE LENGTH & STYLE (MAX 12 SENTENCES):
                               - For simple vocabulary/slang: give a rapid definition/context (1-2 sentences).
                               - For deep concepts/bugs/history: provide structured research summaries. Always stay strictly under 12 sentences total.
                               
                            3. VERIFIED RELEVANT LINKS:
                               - At the absolute end of your response, create a section titled "Relevant Links:".
                               - You MUST list the exact URLs provided in the [LIVE WEB CONTEXT] so the user gets real, non-broken, clickable links.`
                        },
                        {
                            role: "user",
                            content: `[LIVE WEB CONTEXT]\n${liveSearchContextText}\n\n[USER HIGHLIGHTED TEXT TO EXPLAIN]\n${highlightedText}`
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