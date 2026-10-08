// --- SAFE INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            
            if (window.pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            const toolGrid = document.getElementById('tool-grid');
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const fileListContainer = document.getElementById('file-list-container');
            const fileList = document.getElementById('file-list');
            const optionsArea = document.getElementById('options-area');
            const executeBtn = document.getElementById('execute-btn');
            const clearBtn = document.getElementById('clear-btn');
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-msg');

            let currentTool = 'merge';
            let selectedFiles = [];

            const MAX_BYTES = 50 * 1024 * 1024;
            const tools = {
                'merge': { title: 'Merge PDF', desc: 'Combine multiple PDFs into one file, in the order listed.', accept: 'application/pdf', multiple: true, options: [] },
                'split': { title: 'Split PDF', desc: 'Save a range of pages as a new PDF.', accept: 'application/pdf', multiple: false, options: [
                    { id: 'split-from', label: 'From page', type: 'number', default: 1 },
                    { id: 'split-to', label: 'To page', type: 'number', default: 1 }
                ]},
                'organize': { title: 'Organize pages', desc: 'Keep, remove or reorder pages. Example: 3,1,2,5-8', accept: 'application/pdf', multiple: false, options: [
                    { id: 'page-range', label: 'Pages to keep (in order)', type: 'text', default: '1-999' }
                ]},
                'rotate': { title: 'Rotate PDF', desc: 'Rotate every page of a PDF.', accept: 'application/pdf', multiple: false, options: [
                    { id: 'rotate-deg', label: 'Rotation (clockwise)', type: 'select', options: ['90', '180', '270'] }
                ]},
                'page-numbers': { title: 'Page numbers', desc: 'Stamp "Page X of Y" on every page.', accept: 'application/pdf', multiple: false, options: [
                    { id: 'pn-position', label: 'Position', type: 'select', options: ['Bottom Right', 'Bottom Left', 'Bottom Center', 'Top Right', 'Top Left', 'Top Center'] },
                    { id: 'pn-size', label: 'Font size', type: 'number', default: 12 }
                ]},
                'watermark': { title: 'Watermark', desc: 'Stamp diagonal text across every page.', accept: 'application/pdf', multiple: false, options: [
                    { id: 'wm-text', label: 'Watermark text', type: 'text', default: 'DRAFT' },
                    { id: 'wm-opacity', label: 'Opacity (0.1 - 1.0)', type: 'text', default: '0.3' }
                ]},
                'crop': { title: 'Crop margins', desc: 'Trim the same percentage from every edge of each page.', accept: 'application/pdf', multiple: false, options: [
                    { id: 'crop-margin', label: 'Margin % to remove', type: 'number', default: 10 }
                ]},
                'compress': { title: 'Optimize PDF', desc: 'Re-save the PDF with compact object streams. Works best on PDFs that are not image-heavy.', accept: 'application/pdf', multiple: false, options: [] },
                'repair': { title: 'Repair PDF', desc: 'Rebuild a PDF that other apps refuse to open.', accept: 'application/pdf', multiple: false, options: [] },
                'jpg-to-pdf': { title: 'Images to PDF', desc: 'Turn JPG, PNG or WEBP images into a PDF, one image per page.', accept: 'image/jpeg,image/png,image/webp', multiple: true, options: [
                    { id: 'img-size', label: 'Page size', type: 'select', options: ['Fit Image', 'A4', 'Letter'] }
                ]},
                'pdf-to-jpg': { title: 'PDF to JPG', desc: 'Save every page as a JPG image (downloaded as a ZIP).', accept: 'application/pdf', multiple: false, options: [] },
                'pdf-to-png': { title: 'PDF to PNG', desc: 'Save every page as a PNG image (downloaded as a ZIP).', accept: 'application/pdf', multiple: false, options: [] },
                'image-convert': { title: 'Image converter', desc: 'Convert images between JPG, PNG and WEBP, and optionally resize them.', accept: 'image/*', multiple: true, options: [
                    { id: 'ic-format', label: 'Convert to', type: 'select', options: ['JPG', 'PNG', 'WEBP'] },
                    { id: 'ic-width', label: 'Max width in px (blank = keep)', type: 'number', default: '' },
                    { id: 'ic-quality', label: 'Quality for JPG/WEBP (0.1 - 1.0)', type: 'text', default: '0.9' }
                ]},
                'pdf-to-txt': { title: 'PDF to Text', desc: 'Extract the text from a PDF into a .txt file.', accept: 'application/pdf', multiple: false, options: [] },
                'pdf-to-word': { title: 'PDF to Word', desc: 'Extract the text from a PDF into a Word document.', accept: 'application/pdf', multiple: false, options: [] },
                'word-to-pdf': { title: 'Word to PDF', desc: 'Convert .docx or .txt files to PDF (text only).', accept: '.docx,.txt,text/plain', multiple: true, options: [] },
                'pdf-to-excel': { title: 'PDF to Excel', desc: 'Extract the text from a PDF into a spreadsheet, one line per row.', accept: 'application/pdf', multiple: false, options: [] },
                'excel-to-pdf': { title: 'Excel to PDF', desc: 'Convert .csv, .xls or .xlsx sheets to PDF.', accept: '.csv,.xls,.xlsx,text/csv', multiple: true, options: [] },
                'ppt-to-pdf': { title: 'PowerPoint to PDF', desc: 'Convert the text of .pptx slides to PDF.', accept: '.pptx,.txt', multiple: true, options: [] },
                'pdf-to-html': { title: 'PDF to HTML', desc: 'Extract the text from a PDF into a web page.', accept: 'application/pdf', multiple: false, options: [] },
                'pdf-to-rtf': { title: 'PDF to RTF', desc: 'Extract the text from a PDF into a Rich Text file.', accept: 'application/pdf', multiple: false, options: [] }
            };

            const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

            function buildToolCards() {
                let html = '';
                const icons = {
                    'merge': 'fa-object-group', 'split': 'fa-cut', 'compress': 'fa-compress-arrows-alt',
                    'pdf-to-jpg': 'fa-file-image', 'jpg-to-pdf': 'fa-images', 'rotate': 'fa-sync-alt',
                    'watermark': 'fa-stamp', 'organize': 'fa-sort-numeric-down', 'image-convert': 'fa-exchange-alt',
                    'pdf-to-png': 'fa-file-export', 'page-numbers': 'fa-hashtag', 'crop': 'fa-crop',
                    'pdf-to-word': 'fa-file-word', 'word-to-pdf': 'fa-file-pdf', 'pdf-to-excel': 'fa-file-excel',
                    'excel-to-pdf': 'fa-file-csv', 'ppt-to-pdf': 'fa-file-powerpoint', 'pdf-to-txt': 'fa-align-left',
                    'repair': 'fa-wrench', 'pdf-to-html': 'fa-laptop-code', 'pdf-to-rtf': 'fa-file-alt'
                };
                
                let count = 1;
                for (const key in tools) {
                    const tool = tools[key];
                    html += `
                        <div class="tool-card p-4 ${key === 'merge' ? 'active' : ''}" data-tool="${key}">
                            <div class="flex justify-between items-start mb-2">
                                <span class="dim-text text-xs">${String(count).padStart(2, '0')}</span>
                                <i class="fas ${icons[key] || 'fa-cog'} neon-text"></i>
                            </div>
                            <h4 class="heading-font text-lg silver-text">${tool.title}</h4>
                            <p class="text-xs dim-text mt-1">${tool.desc.split('. ')[0].replace(/\.?$/, '.')}</p>
                        </div>
                    `;
                    count++;
                }
                toolGrid.innerHTML = html;

                document.querySelectorAll('.tool-card').forEach(card => {
                    card.addEventListener('click', () => selectTool(card.dataset.tool));
                });
            }

            function selectTool(toolName) {
                currentTool = toolName;
                const tool = tools[toolName];
                if(!tool) return;

                document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
                const activeCard = document.querySelector(`[data-tool="${toolName}"]`);
                if(activeCard) activeCard.classList.add('active');
                
                document.getElementById('workspace-title').innerText = tool.title;
                document.getElementById('workspace-desc').innerText = tool.desc;
                document.getElementById('accept-hint').innerText = tool.accept === 'application/pdf' ? 'PDF files'
                    : tool.accept.startsWith('image') ? 'images' : tool.accept.split(',').filter(a => a.startsWith('.')).join(' ');
                
                fileInput.accept = tool.accept;
                fileInput.multiple = tool.multiple;

                optionsArea.innerHTML = '';
                if (tool.options.length > 0) {
                    tool.options.forEach(opt => {
                        const div = document.createElement('div');
                        div.className = 'flex flex-col';
                        let inputHtml = '';
                        if (opt.type === 'select') {
                            inputHtml = `<select id="${opt.id}" class="bg-base border border-silver px-3 py-2 text-sm silver-text focus:outline-none focus:border-[#FF5A00]">`;
                            opt.options.forEach(o => {
                                inputHtml += `<option value="${o}" ${o === opt.default ? 'selected' : ''}>${o}</option>`;
                            });
                            inputHtml += '</select>';
                        } else {
                            inputHtml = `<input type="${opt.type}" id="${opt.id}" value="${opt.default || ''}" class="bg-base border border-silver px-3 py-2 text-sm silver-text focus:outline-none focus:border-[#FF5A00]">`;
                        }
                        div.innerHTML = `<label class="text-xs dim-text uppercase tracking-widest mb-1">${opt.label}</label>${inputHtml}`;
                        optionsArea.appendChild(div);
                    });
                }
                clearFiles();
            }

            function handleFiles(files) {
                const tool = tools[currentTool];
                const incoming = Array.from(files);
                const ok = incoming.filter(f => f.size <= MAX_BYTES);
                if (ok.length < incoming.length) showToast('Skipped files larger than 50 MB.');
                if (ok.length === 0) return;
                if (!tool.multiple) {
                    selectedFiles = [ok[0]];
                } else {
                    selectedFiles = [...selectedFiles, ...ok];
                }
                renderFileList();
            }

            function renderFileList() {
                fileList.innerHTML = '';
                if (selectedFiles.length === 0 || !selectedFiles[0]) {
                    fileListContainer.classList.add('hidden');
                    return;
                }
                fileListContainer.classList.remove('hidden');
                
                selectedFiles.forEach((file, index) => {
                    if(!file) return;
                    const li = document.createElement('li');
                    li.className = 'flex justify-between items-center bg-base border border-silver px-4 py-2 text-sm';
                    let icon = 'fa-file';
                    if (file.type.includes('pdf')) icon = 'fa-file-pdf';
                    else if (file.type.includes('image')) icon = 'fa-image';
                    else if (file.name.match(/\.(doc|docx)$/i)) icon = 'fa-file-word';
                    else if (file.name.match(/\.(xls|xlsx|csv)$/i)) icon = 'fa-file-excel';
                    else if (file.name.match(/\.(ppt|pptx)$/i)) icon = 'fa-file-powerpoint';
                    
                    li.innerHTML = `
                        <div class="flex items-center space-x-3 truncate">
                            <i class="fas ${icon} neon-text"></i>
                            <span class="silver-text truncate">${escapeHtml(file.name)}</span>
                        </div>
                        <div class="flex items-center space-x-4 flex-shrink-0">
                            <span class="dim-text text-xs">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <button class="dim-text hover:text-[#FF5A00] rm-btn" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    fileList.appendChild(li);
                });

                document.querySelectorAll('.rm-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectedFiles.splice(parseInt(btn.dataset.index), 1);
                        renderFileList();
                    });
                });
            }

            function clearFiles() {
                selectedFiles = [];
                fileInput.value = '';
                renderFileList();
            }

            function showToast(msg) {
                toastMsg.innerText = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 5000);
            }

            function downloadBlob(blob, filename) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }

            async function executeOperation() {
                if (selectedFiles.length === 0 || !selectedFiles[0]) {
                    showToast('Add a file first.');
                    return;
                }

                showToast('Working on it...');
                executeBtn.innerText = 'Converting...';
                executeBtn.disabled = true;

                try {
                    switch(currentTool) {
                        case 'merge': await mergePDFs(); break;
                        case 'split': await splitPDF(); break;
                        case 'compress': await compressPDF(); break;
                        case 'pdf-to-jpg': await pdfToImages('jpg'); break;
                        case 'jpg-to-pdf': await imageToPdf(); break;
                        case 'rotate': await rotatePDF(); break;
                        case 'image-convert': await convertImages(); break;
                        case 'pdf-to-txt': await pdfToTxt(); break;
                        case 'watermark': await watermarkPDF(); break;
                        case 'organize': await organizePDF(); break;
                        case 'pdf-to-png': await pdfToImages('png'); break;
                        case 'page-numbers': await addPageNumbers(); break;
                        case 'crop': await cropPDF(); break;
                        case 'pdf-to-word': await pdfToWord(); break;
                        case 'word-to-pdf': await wordToPdf(); break;
                        case 'pdf-to-excel': await pdfToExcel(); break;
                        case 'excel-to-pdf': await excelToPdf(); break;
                        case 'ppt-to-pdf': await pptToPdf(); break;
                        case 'repair': await repairPDF(); break;
                        case 'pdf-to-html': await pdfToHtml(); break;
                        case 'pdf-to-rtf': await pdfToRtf(); break;
                    }
                    showToast('Done! Your download has started.');
                } catch (e) {
                    console.error(e);
                    showToast('Error: ' + e.message);
                } finally {
                    executeBtn.innerText = 'Convert';
                    executeBtn.disabled = false;
                }
            }

            // --- BULLETPROFF OFFICE XML EXTRACTOR ---
            // This function uses Regex to eliminate all whitespace between XML tags
            // BEFORE removing the tags, which completely fixes the "t h e   s p a c i n g" bug.
            function extractTextFromXml(xml) {
                // 1. Remove all whitespace between tags (fixes letter-by-letter spacing issue)
                let text = xml.replace(/>\s+</g, '><');
                
                // 2. Replace paragraph ends with newlines
                text = text.replace(/<\/w:p>/g, '\n');
                text = text.replace(/<\/a:p>/g, '\n');
                
                // 3. Replace tabs and line breaks
                text = text.replace(/<w:tab[^>]*\/>/g, '\t');
                text = text.replace(/<w:br[^>]*\/>/g, '\n');
                text = text.replace(/<a:br[^>]*\/>/g, '\n');
                
                // 4. Remove all remaining tags
                text = text.replace(/<[^>]+>/g, '');
                
                // 5. Decode HTML entities
                text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
                
                // 6. Clean up excessive blank lines
                text = text.replace(/\n{3,}/g, '\n\n');
                
                return text.trim();
            }

            async function extractDocxText(file) {
                try {
                    const zip = await JSZip.loadAsync(file);
                    const docXml = await zip.file("word/document.xml").async("string");
                    return extractTextFromXml(docXml);
                } catch (e) {
                    console.error("DOCX Parse Error", e);
                    throw new Error("Could not parse .docx file. It might be a legacy .doc file or corrupted.");
                }
            }

            async function extractPptxText(file) {
                try {
                    const zip = await JSZip.loadAsync(file);
                    const slideFiles = Object.keys(zip.files).filter(name => name.match(/^ppt\/slides\/slide\d+\.xml$/));
                    slideFiles.sort((a, b) => {
                        const numA = parseInt(a.match(/slide(\d+)\.xml/)[1]);
                        const numB = parseInt(b.match(/slide(\d+)\.xml/)[1]);
                        return numA - numB;
                    });
                    
                    let fullText = [];
                    for (const slideFile of slideFiles) {
                        const xml = await zip.file(slideFile).async("string");
                        fullText.push(extractTextFromXml(xml));
                    }
                    return fullText.join("\n\n");
                } catch(e) {
                    console.error("PPTX Parse Error", e);
                    throw new Error("Could not parse .pptx file. It might be a legacy .ppt file or corrupted.");
                }
            }

            // --- PDF OPERATIONS LOGIC ---
            
            async function mergePDFs() {
                const { PDFDocument } = PDFLib;
                const mergedPdf = await PDFDocument.create();
                for (const file of selectedFiles) {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach(p => mergedPdf.addPage(p));
                }
                const pdfBytes = await mergedPdf.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'merged.pdf');
            }

            async function splitPDF() {
                const { PDFDocument } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const from = parseInt(document.getElementById('split-from').value);
                const to = parseInt(document.getElementById('split-to').value);
                if (isNaN(from) || isNaN(to) || from < 1 || to > pdf.getPageCount() || from > to) throw new Error('Invalid page numbers.');
                const splitPdf = await PDFDocument.create();
                const pageIndices = [];
                for (let i = from - 1; i <= to - 1; i++) pageIndices.push(i);
                const copiedPages = await splitPdf.copyPages(pdf, pageIndices);
                copiedPages.forEach(p => splitPdf.addPage(p));
                const pdfBytes = await splitPdf.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'split.pdf');
            }

            async function compressPDF() {
                const { PDFDocument } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const pdfBytes = await pdf.save({ useObjectStreams: true });
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'compressed.pdf');
            }

            async function pdfToImages(format) {
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const zip = new JSZip();
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
                    const imgData = canvas.toDataURL(mimeType, 0.8);
                    const base64Data = imgData.replace(/^data:image\/(jpeg|png);base64,/, "");
                    zip.file(`page-${i}.${format}`, base64Data, { base64: true });
                }
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                downloadBlob(zipBlob, `pdf_images_${format}.zip`);
            }

            async function imageToPdf() {
                const { PDFDocument } = PDFLib;
                const pdfDoc = await PDFDocument.create();
                const sizeOption = document.getElementById('img-size').value;
                for (const file of selectedFiles) {
                    let img;
                    if (file.type === 'image/png') img = await pdfDoc.embedPng(await file.arrayBuffer());
                    else if (file.type === 'image/jpeg') img = await pdfDoc.embedJpg(await file.arrayBuffer());
                    else img = await pdfDoc.embedPng(await (await imageToBlob(file, 'image/png')).arrayBuffer());
                    let page;
                    if (sizeOption === 'Fit Image') {
                        page = pdfDoc.addPage([img.width, img.height]);
                        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
                    } else {
                        const w = sizeOption === 'A4' ? 595.28 : 612;
                        const h = sizeOption === 'A4' ? 841.89 : 792;
                        page = pdfDoc.addPage([w, h]);
                        const scale = Math.min(w / img.width, h / img.height);
                        const x = (w - img.width * scale) / 2;
                        const y = (h - img.height * scale) / 2;
                        page.drawImage(img, { x, y, width: img.width * scale, height: img.height * scale });
                    }
                }
                const pdfBytes = await pdfDoc.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'images.pdf');
            }

            async function rotatePDF() {
                const { PDFDocument, degrees } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const deg = parseInt(document.getElementById('rotate-deg').value);
                const pages = pdf.getPages();
                pages.forEach(p => {
                    const currentRotation = p.getRotation().angle;
                    p.setRotation(degrees(currentRotation + deg));
                });
                const pdfBytes = await pdf.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'rotated.pdf');
            }

            async function watermarkPDF() {
                const { PDFDocument, rgb, degrees } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const text = document.getElementById('wm-text').value;
                const opacity = parseFloat(document.getElementById('wm-opacity').value);
                const helveticaFont = await pdf.embedFont(PDFLib.StandardFonts.HelveticaBold);
                const pages = pdf.getPages();
                pages.forEach(p => {
                    const { width, height } = p.getSize();
                    const textWidth = helveticaFont.widthOfTextAtSize(text, 50);
                    p.drawText(text, {
                        x: (width - textWidth) / 2, y: height / 2, size: 50, font: helveticaFont,
                        color: rgb(1, 0.35, 0), opacity: opacity, rotate: degrees(45)
                    });
                });
                const pdfBytes = await pdf.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'watermarked.pdf');
            }

            async function organizePDF() {
                const { PDFDocument } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const rangeStr = document.getElementById('page-range').value;
                const pagesToKeep = [];
                const parts = rangeStr.split(',');
                for (let part of parts) {
                    part = part.trim();
                    if (part.includes('-')) {
                        const range = part.split('-');
                        const start = parseInt(range[0]);
                        const end = parseInt(range[1]);
                        for (let i = start; i <= end; i++) pagesToKeep.push(i - 1);
                    } else {
                        pagesToKeep.push(parseInt(part) - 1);
                    }
                }
                const validIndices = pagesToKeep.filter(idx => idx >= 0 && idx < pdf.getPageCount());
                if (validIndices.length === 0) throw new Error('No valid pages selected.');
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(pdf, validIndices);
                copiedPages.forEach(p => newPdf.addPage(p));
                const pdfBytes = await newPdf.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'organized.pdf');
            }

            async function addPageNumbers() {
                const { PDFDocument, rgb } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const position = document.getElementById('pn-position').value;
                const fontSize = parseInt(document.getElementById('pn-size').value);
                const helveticaFont = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
                const pages = pdf.getPages();
                const totalPages = pages.length;
                pages.forEach((p, index) => {
                    const { width, height } = p.getSize();
                    const text = `Page ${index + 1} of ${totalPages}`;
                    const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
                    let x, y; const margin = 20;
                    if (position.includes('Right')) x = width - textWidth - margin;
                    else if (position.includes('Left')) x = margin;
                    else x = (width - textWidth) / 2;
                    if (position.includes('Top')) y = height - margin;
                    else y = margin;
                    p.drawText(text, { x, y, size: fontSize, font: helveticaFont, color: rgb(0.2, 0.2, 0.2) });
                });
                const pdfBytes = await pdf.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'page_numbers.pdf');
            }

            async function cropPDF() {
                const { PDFDocument } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const cropPercent = parseInt(document.getElementById('crop-margin').value) / 100;
                const pages = pdf.getPages();
                pages.forEach(p => {
                    const { width, height } = p.getSize();
                    const cropW = width * cropPercent;
                    const cropH = height * cropPercent;
                    p.setCropBox(cropW, cropH, width - 2 * cropW, height - 2 * cropH);
                    p.setMediaBox(cropW, cropH, width - 2 * cropW, height - 2 * cropH);
                });
                const pdfBytes = await pdf.save();
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'cropped.pdf');
            }

            async function extractPdfText(file) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
                }
                return fullText;
            }

            async function pdfToWord() {
                const file = selectedFiles[0];
                const text = await extractPdfText(file);
                const wordHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Extracted</title></head><body style="font-family: Calibri; font-size: 11pt;"><pre>${escapeHtml(text)}</pre></body></html>`;
                const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
                downloadBlob(blob, 'extracted.doc');
            }

            // FIXED: Properly unzips and reads .docx files, crushing whitespace between tags
            async function wordToPdf() {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                doc.setFont("helvetica", "normal"); 
                doc.setFontSize(12); 
                doc.setTextColor(50, 50, 50);
                
                for(let i=0; i<selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    let text = "";
                    const fileName = file.name.toLowerCase();
                    
                    if (fileName.endsWith('.docx')) {
                        text = await extractDocxText(file);
                    } else if (fileName.endsWith('.txt')) {
                        text = await file.text();
                    } else if (fileName.endsWith('.doc')) {
                        throw new Error("Legacy .doc files are not supported. Please save as .docx or .txt.");
                    } else {
                        text = await file.text();
                    }
                    
                    if(i > 0) doc.addPage();
                    
                    const splitText = doc.splitTextToSize(text, 170);
                    let y = 20;
                    for(let j=0; j<splitText.length; j++) {
                        if(y > 280) { 
                            doc.addPage(); 
                            y = 20; 
                        }
                        doc.text(splitText[j], 20, y);
                        y += 7;
                    }
                }
                doc.save('word-to-pdf.pdf');
            }

            async function pdfToExcel() {
                const file = selectedFiles[0];
                const text = await extractPdfText(file);
                const data = text.split('\n').map(line => [line.replace(/--- PAGE \d+ ---/, '').trim()]);
                const ws = XLSX.utils.aoa_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Extracted Text");
                XLSX.writeFile(wb, 'extracted.xlsx');
            }

            async function excelToPdf() {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(50, 50, 50);
                for(let i=0; i<selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    const data = await file.arrayBuffer();
                    const wb = XLSX.read(data);
                    if(i > 0) doc.addPage();
                    let y = 20;
                    wb.SheetNames.forEach(sheetName => {
                        const ws = wb.Sheets[sheetName];
                        const csv = XLSX.utils.sheet_to_csv(ws);
                        const lines = csv.split('\n');
                        doc.text(`Sheet: ${sheetName}`, 20, y); y += 6;
                        lines.forEach(line => {
                            const splitText = doc.splitTextToSize(line, 170);
                            doc.text(splitText, 20, y);
                            y += 6;
                            if(y > 280) { doc.addPage(); y = 20; }
                        });
                    });
                }
                doc.save('excel-to-pdf.pdf');
            }

            // FIXED: Properly unzips and reads .pptx files, crushing whitespace between tags
            async function pptToPdf() {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'landscape' });
                doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(50, 50, 50);
                for(let i=0; i<selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    let text = "";
                    const fileName = file.name.toLowerCase();
                    
                    if (fileName.endsWith('.pptx')) {
                        text = await extractPptxText(file);
                    } else if (fileName.endsWith('.txt')) {
                        text = await file.text();
                    } else if (fileName.endsWith('.ppt')) {
                        throw new Error("Legacy .ppt files are not supported. Please save as .pptx or .txt.");
                    } else {
                        text = await file.text();
                    }

                    if(i > 0) doc.addPage();
                    const splitText = doc.splitTextToSize(text, 250);
                    let y = 20;
                    for(let j=0; j<splitText.length; j++) {
                        if(y > 180) { 
                            doc.addPage(); 
                            y = 20; 
                        }
                        doc.text(splitText[j], 20, y);
                        y += 7;
                    }
                }
                doc.save('ppt-to-pdf.pdf');
            }

            async function repairPDF() {
                const { PDFDocument } = PDFLib;
                const file = selectedFiles[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true, throwOnInvalidObject: false });
                const pdfBytes = await pdf.save({ useObjectStreams: true });
                downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'repaired.pdf');
            }

            async function pdfToHtml() {
                const file = selectedFiles[0];
                const text = await extractPdfText(file);
                const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Extracted text</title></head><body><pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(text)}</pre></body></html>`;
                downloadBlob(new Blob([htmlContent], { type: 'text/html' }), 'extracted.html');
            }

            async function pdfToRtf() {
                const file = selectedFiles[0];
                const text = await extractPdfText(file);
                const rtfContent = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}\\viewkind4\\uc1\\pard\\f0\\fs28 ${text.replace(/\n/g, '\\par')}}`;
                downloadBlob(new Blob([rtfContent], { type: 'application/rtf' }), 'extracted.rtf');
            }

            async function pdfToTxt() {
                const text = await extractPdfText(selectedFiles[0]);
                downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), 'extracted.txt');
            }

            function imageToBlob(file, mime, maxWidth, quality) {
                return new Promise((resolve, reject) => {
                    const url = URL.createObjectURL(file);
                    const img = new Image();
                    img.onload = () => {
                        const scale = maxWidth && img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1;
                        const canvas = document.createElement('canvas');
                        canvas.width = Math.round(img.naturalWidth * scale);
                        canvas.height = Math.round(img.naturalHeight * scale);
                        const ctx = canvas.getContext('2d');
                        // JPG has no transparency, so paint a white background first
                        if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        URL.revokeObjectURL(url);
                        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Could not convert ' + file.name)), mime, quality);
                    };
                    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image ' + file.name)); };
                    img.src = url;
                });
            }

            async function convertImages() {
                const fmt = document.getElementById('ic-format').value;
                const mime = { JPG: 'image/jpeg', PNG: 'image/png', WEBP: 'image/webp' }[fmt];
                const ext = fmt.toLowerCase();
                const maxWidth = parseInt(document.getElementById('ic-width').value) || 0;
                let quality = parseFloat(document.getElementById('ic-quality').value);
                if (!(quality > 0 && quality <= 1)) quality = 0.9;
                const outputs = [];
                for (const file of selectedFiles) {
                    const blob = await imageToBlob(file, mime, maxWidth, quality);
                    outputs.push({ name: file.name.replace(/\.[^.]+$/, '') + '.' + ext, blob });
                }
                if (outputs.length === 1) return downloadBlob(outputs[0].blob, outputs[0].name);
                const zip = new JSZip();
                outputs.forEach(o => zip.file(o.name, o.blob));
                downloadBlob(await zip.generateAsync({ type: 'blob' }), `images_${ext}.zip`);
            }

            // --- EVENT LISTENERS ---
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                if(e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
            });
            dropZone.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                if(e.target.files.length > 0) handleFiles(e.target.files);
            });
            clearBtn.addEventListener('click', clearFiles);
            executeBtn.addEventListener('click', executeOperation);

            // Initialize
            buildToolCards();
            selectTool('merge');
        });
