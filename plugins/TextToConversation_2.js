install({
  name: "Text to Conversation", // Plugin Name
  icon: "text_snippet" // Icon from https://fonts.google.com/icons
}, async function(event, end) {
  // Number.prototype.fileSize()
  Object.defineProperty(Number.prototype,'fileSize',{value:function(a,b,c,d){
   return (a=a?[1e3,'k','B']:[1024,'K','iB'],b=Math,c=b.log,
   d=c(this)/c(a[0])|0,this/b.pow(a[0],d)).toFixed(2)
   +' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
  },writable:false,enumerable:false});
  // Get Text Files
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
  const file = await getTextFile();
  if (!file) return console.log(`Canceled`);
  event.utils.addContext([
      `=== User Uploaded Attachment ===`,
      `Type: Text File`,
      `File Name: ${file.fileName}`,
      `File Size: ${file.fileSize.fileSize()} (${file.fileSize})`,
      ``,
      file.fileContents
  ].join("\n"))
  document.querySelector(`.chat-content`).appendChild(event.utils.generateMessage(`*<span style="color: gray;">Attachment:</span>*\n\n**${file.fileName}** *(${file.fileSize.fileSize()})*`)); 
  end();
});
