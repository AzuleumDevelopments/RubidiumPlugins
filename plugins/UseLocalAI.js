install({
  name: "Use Local AI", // Plugin Name
  author: "Rubidium Plugins", // (optional) Plugin Author
  description: "[Incomplete] Use Local AI Models instead of Rubidium",
  icon: "robot_2" // Icon from https://fonts.google.com/icons
}, async function(event, end) {
  const eventButton = event.button;
  const pluginSource = eventButton.getAttribute(`ps`);
  const checkCompatibility = async function() {
    if (!("ai" in window)) return false;
    if (!("AI" in globalThis)) return false;
    if (!("AITextSession" in globalThis)) return false;
    if (!("createTextSession" in window.ai)) return false;
    if (!("canCreateTextSession" in window.ai)) return false;
    const canCreate = (await window.ai.canCreateTextSession()) === "readily";
    if (!canCreate) return false;
    const session = await window.ai.createTextSession();
    if (!(session instanceof AITextSession)) return false;
    return true;
  }
  try {
    const compatible = await checkCompatibility();
    // System is not compatible.
    const incompatibilityMessage = event.utils.generateMessage(`*<span style="color: red;">Use Local AI was uninstalled because it isn't compatible with your browser.</span>*`);
    const patchedMessage = event.utils.generateMessage(`*<span style="color: dodgerblue;">Use Local AI successfully patched this AI session!</span>*`);
    if (!compatible) return rubidiumPlugins.removePlugin(pluginSource),eventButton.remove(),end(),document.querySelector(`.chat-content`).appendChild(incompatibilityMessage);
    const defaultSession = await window.ai.createTextSession();
    window.chatWithAI = function(prompt = "") {
      window._messages.push({
        role: "user",
        content: prompt
      });
      const promptMessages = "Conversation History:\n" + window._messages.map(e => ("[Message]\n- Message Hidden from User: " + (e._hidden || "False") + "\n- Author Role: " + e.role + "\n- Message Content: " + e.content)).join("\n\n")
      window._isThinking = !0;
      defaultSession.prompt(promptMessages).then(result => {
        const msg = document.querySelector(`.chat-content`).appendChild(generateMessage("assistant", s, !1));
         window._messages.push({
           role: "assistant",
           content: result
         })
         msg.scrollIntoView({
           behavior: "smooth",
           block: "end"
         })
         window._isThinking = !1;
       }).catch(() => {
         window._isThinking = !1;
       });
    }
    document.querySelector(`.chat-content`).appendChild(patchedMessage), end();
  } catch {
    console.log(`Something went wrong!`);
    const errorMessage = event.utils.generateMessage(`*<span style="color: red;">Use Local AI failed to run. Try reloading or clicking again to patch.</span>*`);
    document.querySelector(`.chat-content`).appendChild(errorMessage)
  }
  end();
})
