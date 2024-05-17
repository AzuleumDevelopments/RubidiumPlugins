install({
  name: "Spin Off", // Plugin Name
  icon: "cognition" // Icon from https://fonts.google.com/icons
}, async function(event, end) {
  // Get Character Files
  const getCharFile = async function() {
    const fileHandles = await window.showOpenFilePicker({ multiple: false, startIn: "downloads", excludeAcceptAllOption: true, types: [{
        description: "Rubidium AI Character files",
        accept: {
            "application/character": [".rbchr"]
        }
    }]});
    if (!fileHandles || !fileHandles[0]) return null;
    const file = await fileHandles[0].getFile();
    const contents = await file.text();
    return Object.freeze({
        fileName: file.name,
        fileSize: file.size,
        fileContents: contents
    });
  };
  const file = await getCharFile();
  if (!file) return console.log(`Canceled`), end();
  
  try {
    const charContents = JSON.parse(file.fileContents);
    const characterName = charContents.name;
    const characterSetup = charContents.payload;
    if (!(characterSetup instanceof Array)) throw new Error("Not a Valid Message Payload");
    event.utils.resetChat();
    event.utils.changeTitle(`Chat with ${characterName} - Rubidium AI`)
    window._messages = characterSetup;
    document.querySelector(`.chat-content`).appendChild(event.utils.generateMessage(`> *<span style="color: var(--text-warning);">You are now chatting with </span>**${characterName}***\n\n> <span style="color: var(--text-disabled);">This will last until the conversation is cleared<span>`));
  } catch {
    document.querySelector(`.chat-content`).appendChild(event.utils.generateMessage(`*<span style="color: var(--text-error);">Invalid Character Data!</span>*`));
  } 
  end();
});
