install({
    name: "OCR to Conversation",
    description: "Converts Images to Text for Rubidium",
    author: "Rubidium Plugins",
    icon: "document_scanner"
}, async function(event, end) {
    // Number.prototype.fileSize()
    if (!("fileSize" in Number.prototype)) {
        Object.defineProperty(Number.prototype,'fileSize',{value:function(a,b,c,d){
            return (a=a?[1e3,'k','B']:[1024,'K','iB'],b=Math,c=b.log,
            d=c(this)/c(a[0])|0,this/b.pow(a[0],d)).toFixed(2)
            +' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
        },writable:false,enumerable:false});
    }
    const getImageFile = async function() {
        const fileHandles = await window.showOpenFilePicker({ multiple: false, startIn: "pictures", excludeAcceptAllOption: true, types: [{
            description: "Images",
            accept: {
                "image/*": [".png", ".jpg", ".jpeg"]
            }
        }]});
        if (!fileHandles || !fileHandles[0]) return null;
        const file = await fileHandles[0].getFile();
        const contents = await file.arrayBuffer();
        return Object.freeze({
            fileName: file.name,
            fileSize: file.size,
            fileContents: contents
        });
    };
    const file = await getImageFile();
    if (!file) return console.log(`Canceled`), end();
    const getTesseractWorker = async function(lang = "eng") {
        const { default: s } = await import(`https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js`);
        const worker = await s.createWorker();
        return worker;
    }
    const worker = await getTesseractWorker();
    const ret = await worker.recognize(file.fileContents, {rotateAuto: true});
    event.utils.addContext([
        `=== User Uploaded Attachment ===`,
        `Type: OCR Document (from Image)`,
        `Image Name: ${file.fileName}`,
        `Image Size: ${file.fileSize.fileSize()} (${file.fileSize})`,
        ``,
        ret.data.text
    ].join("\n"));
    document.querySelector(`.chat-content`).appendChild(event.utils.generateMessage(`*<span style="color: gray;">OCR Attachment:</span>*\n\n**${file.fileName}** *(${file.fileSize.fileSize()})*`));
    return worker.terminate(), end();
})
