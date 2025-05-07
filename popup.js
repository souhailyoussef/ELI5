console.warn('extension started!');

const API_KEY = 'oY774j7yjNGDJ3n8m5vKYtqEbONSTQ4r224Ew1rL';

const descriptions = {
    5: "Explain Like I'm 5 – a very simple explanation using childlike language.",
    50: "Explain Like I'm 50 – a clear, straightforward explanation for an adult unfamiliar with the topic.",
    300: "Explain Like I'm 300 – a detailed, technical explanation for an expert audience."
  };

const buttons = document.querySelectorAll('.eli-button');
const descriptionElement = document.querySelector('i.eli-description');
let currentLevel = 5;
chrome.runtime.sendMessage({type: 'getEliLevel'}, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
        return;
      }
      currentLevel = response?.text ?? 5;
      const button = document.querySelector(`.eli-button[level="${currentLevel}"]`);
      if (button) {
        document.querySelectorAll('.eli-button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
      }
      const descriptionElement = document.querySelector('i.eli-description');
      if (descriptionElement) {
        descriptionElement.textContent = Prompt.getDescription(currentLevel);
      }

})

buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      const level = button.getAttribute('level');
      currentLevel = level;
      descriptionElement.textContent = Prompt.getDescription(currentLevel);
      chrome.runtime.sendMessage({ type: 'eliLevel', eliLevel: Number(level) });
    });
  });


chrome.runtime.sendMessage({ type: 'getEliLevel' }, (response) => {
    if (response && response.text) {
        currentLevel = Number(response.text);
    }
});


chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
        return;
      }
      if (response?.selectedText) {
        updateSelectionContent(response.selectedText);
      }
    });
  });

function updateSelectionContent(content) {
    if (!content || content.trim() === '') return;
    document.getElementById("selection").textContent = content;
    
}

document.getElementById("btn-submit").addEventListener('click', (e) => {
    updateResponseContent(null);
    const content = document.getElementById("selection").value.trim();
    if (!content) return;
    showSkeletons();
    simplifyText(content, Prompt.getDescription(currentLevel)).then(updateResponseContent);
})


function updateResponseContent(response) {
    hideSkeleton();
    document.getElementById('response').textContent = response;
} 

function showSkeletons() {
    document.querySelectorAll('.skeleton.line').forEach(elt => elt.classList.remove('hidden'));
}

function hideSkeleton() {
    document.querySelectorAll('.skeleton.line').forEach(elt => elt.classList.add('hidden'));
}

async function simplifyText(text) {
    const prompt = Prompt.buildPrompt(text, currentLevel);

    const requestPayload = {
        prompt: prompt,
        max_tokens: 300,
    };
    const response = await fetch(`https://api.cohere.ai/v1/generate`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestPayload),
        }
    );

    if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.generations[0]?.text;

    return responseText;
}


