class Prompt {
    static descriptions = {
        5: "Explain Like I'm 5 – a very simple explanation using childlike language.",
        50: "Explain Like I'm 50 – a clear, straightforward explanation for an adult unfamiliar with the topic.",
        300: "Explain Like I'm 300 – a detailed, technical explanation for an expert audience."
      };

    static prompt = {

    }  
    static getDescription(lvl) {
        lvl = Number(lvl);
        return this.descriptions[lvl] || 'level no found';
    }

    static buildPrompt(text, lvl) {
        if (!lvl) throw new Error('lvl must be defined');
        const description = this.getDescription(lvl);
        const prompt = 
        `Please explain the following sentence or word with the level of detail appropriate for the audience described below.
        Audience: ${description}
        Text to explain:
        ${text}
        Keep the explanation tailored precisely to the audience level.`;
        return prompt;

    }
}