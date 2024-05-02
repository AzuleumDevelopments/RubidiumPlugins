install({
  name: "Text to Conversation", // Plugin Name
  icon: "text_snippet" // Icon from https://fonts.google.com/icons
}, function(event, end) {
  const getTextFile = async function() {
    const fileHandles = await window.showOpenFilePicker({ multiple: false, startIn: "documents", excludeAcceptAllOption: true, types: [{
        description: "Text files",
        accept: {
            "text/plain": [".txt"]
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
  console.log(event);
  end();
});
