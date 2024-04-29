install({
  name: "Plugin Manager", // Plugin Name
  author: "Rubidium Plugins", // (optional) Plugin Author
  icon: "extension" // Icon from https://fonts.google.com/icons
}, async function(event, end) {
  const pluginUrl = prompt(`Paste a valid link to a plugin`);
  try {
    const { hostname, pathname } = new URL(pluginUrl, location.href);
    const proxyLocation = (location.protocol + "//" + location.hostname + "/proxy/" + hostname + pathname);
    const pluginMeta = await rubidiumPlugins.getPluginMetadata(proxyLocation);
    if (pluginMeta) {
      console.log(`[Rubidium Plugins] Install request:`, pluginMeta);
      const confirmation = confirm(`You are about to install:\n${pluginMeta.details.name}\nby ${pluginMeta.details.author ?? "Unknown Author"}`);
      if (confirmation === true) {
        console.log(`[Rubidium Plugins] Installing...`);
        rubidiumPlugins.requestPluginInstall(proxyLocation);
      } else {
        console.log(`[Rubidium Plugins] Installed cancelled.`);
      }
    } else {
      alert(`Invalid plugin link`)
      console.log(`[Rubidium Plugins] Invalid plugin link.`);
    };
  } catch {
    alert("Invalid plugin link")
    console.log(`[Rubidium Plugins] Invalid plugin link.`);
  }
  end();
});
