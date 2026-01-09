const zipInput = document.getElementById('zipInput');
const output = document.getElementById('output');
const actionArea = document.getElementById('actionArea');
const copyBtn = document.getElementById('copyBtn');

// Config: Extensions to ignore (Images, binaries, etc.)
const IGNORE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.zip', '.pdf', '.exe', '.pyc'];

zipInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    output.textContent = "Processing ZIP file... please wait.";
    
    try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        let fileTree = "### FOLDER STRUCTURE ###\n";
        let fileContents = "\n### FILE CONTENTS ###\n";

        // 1. Generate Tree and Extract Content
        const files = Object.keys(contents.files);
        
        for (const path of files) {
            const fileData = contents.files[path];
            
            // Add to Tree
            const depth = path.split('/').filter(p => p).length - 1;
            fileTree += "  ".repeat(depth) + "|-- " + path + "\n";

            // Skip directories and ignored extensions
            const isIgnored = IGNORE_EXTENSIONS.some(ext => path.toLowerCase().endsWith(ext));
            if (!fileData.dir && !isIgnored) {
                const text = await fileData.async("string");
                fileContents += `\n--- START OF FILE: ${path} ---\n`;
                fileContents += text;
                fileContents += `\n--- END OF FILE: ${path} ---\n`;
            }
        }

        const finalResult = fileTree + fileContents;
        output.textContent = finalResult;
        actionArea.style.display = 'flex';

    } catch (err) {
        output.textContent = "Error processing ZIP: " + err.message;
    }
});

// Copy Functionality
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.textContent);
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "Copied!";
    setTimeout(() => copyBtn.innerText = originalText, 2000);
});
