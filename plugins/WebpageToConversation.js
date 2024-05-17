install({
  name: "Webpage to Conversation", // Plugin Name
  icon: "language" // Icon from https://fonts.google.com/icons
}, async function(event, end) {
  // Number.prototype.fileSize()
  if (!("fileSize" in Number.prototype)) {
    Object.defineProperty(Number.prototype,'fileSize',{value:function(a,b,c,d){
     return (a=a?[1e3,'k','B']:[1024,'K','iB'],b=Math,c=b.log,
     d=c(this)/c(a[0])|0,this/b.pow(a[0],d)).toFixed(2)
     +' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
    },writable:false,enumerable:false});
  }
  // Get Page Contents
  const fetchPageContents = async function(url) {
    try {
      const _url = new URL(url, location.href);
      const proxyUrl = "https://rubidium.lhost.dev/proxy/";
      const compiledProxy = proxyUrl + _url.hostname + _url.pathname;
      const req = await fetch(compiledProxy);
      if (req.status !== 400 && req.headers.get("Content-Type") === "text/plain") {
        const contents = await req.text();
        const dom = new DOMParser().parseFromString(contents, "text/html");
        Array.from(dom.querySelectorAll("script")||[]).forEach(s => s.remove());
        Array.from(dom.querySelectorAll("style")||[]).forEach(s => s.remove());
        return (dom.body.innerText || dom.body.textContent).trim();
      }
    } catch (err) {
      return "No content available. Reason: Invalid Webpage";
    }
  }
  const site = prompt("Enter a valid URL to a webpage");
  if (!site) return console.log(`Canceled`);
  const content = fetchPageContents(site);
  if (!content) return console.log(`Internal Error. Please report`);
  event.utils.addContext([
      `=== User Uploaded Attachment ===`,
      `Type: (Approved, Public Resource) Website Content`,
      `Site Origin: ${site}`,
      ``,
      content
  ].join("\n"))
  document.querySelector(`.chat-content`).appendChild(event.utils.generateMessage(`*<span style="color: gray;">Attachment:</span>*\n\n**${site}** *(${content.length.fileSize()})*`)); 
  end();
});
