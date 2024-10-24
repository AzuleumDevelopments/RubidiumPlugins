install({
  name: "YouTube Transcript to Conversation", // Plugin Name
  description: "[Buggy] Attach a YouTube Transcript to your conversation",
  icon: "youtube_activity" // Icon from https://fonts.google.com/icons
}, async function(event, end) {
  const validQueryDomains = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'gaming.youtube.com',
  ]);
  const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
  const getURLVideoID = link => {
    const parsed = new URL(link.trim());
    let id = parsed.searchParams.get('v');
    if (validPathDomains.test(link.trim()) && !id) {
      const paths = parsed.pathname.split('/');
      id = parsed.host === 'youtu.be' ? paths[1] : paths[2];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
      throw Error('Not a YouTube domain');
    }
    if (!id) {
      throw Error(`No video id found: "${link}"`);
    }
    id = id.substring(0, 11);
    if (!validateID(id)) {
      throw TypeError(`Video id (${id}) does not match expected ` +
        `format (${idRegex.toString()})`);
    }
    return id;
  };
  const urlRegex = /^https?:\/\//;
  const getVideoID = str => {
    if (validateID(str)) {
      return str;
    } else if (urlRegex.test(str.trim())) {
      return getURLVideoID(str);
    } else {
      throw Error(`No video id found: ${str}`);
    }
  };
  const idRegex = /^[a-zA-Z0-9-_]{11}$/;
  const validateID = id => idRegex.test(id.trim());
  const youtubeVideo = prompt("Enter a YouTube Video URL");
  try {
    const videoId = getVideoID(youtubeVideo);
    const youtubeTranscript = `/proxy/youtubetranscript.com/?server_vid2=${videoId}`;
    const youtubeTitle = `https://yt-title-parser.utils.lhost.dev/?videoId=${videoId}&noAI=true`;
    const videoTitle = await fetch(youtubeTitle).then(resp => resp.json());
    fetch(youtubeTranscript).then(async resp => {
      const data = await resp.text();
      const xmlData = new DOMParser().parseFromString(data, "text/xml");
      const transcriptElement = xmlData.firstChild;
      const textContents = Array.from(transcriptElement.children).map(e => e.textContent).join("\n")
      event.utils.addContext([
        `=== User Uploaded Attachment ===`,
        `Type: YouTube Transcript`,
        `Video Title: ${videoTitle.title}`,
        `Video Author: ${videoTitle.author}`,
        ``,
        textContents
      ].join("\n"))
      document.querySelector(`.chat-content`).appendChild(event.utils.generateMessage(`*<span style="color: gray;">Youtube Transcript</span>*\n\n**${videoTitle.title}**\n\nby ${videoTitle.author}`));
      end();
    })
  } catch {
    alert("No Video ID found");
    end();
  }
});
