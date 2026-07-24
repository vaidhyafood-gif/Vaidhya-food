/* ===================== VAIDHYA FOODS — CORE JS ===================== */

const WHATSAPP_NUMBER = "916266387666";
const ENQUIRY_EMAIL = "vaidhyafood@gmail.com";

/* ---------- Load shared header/footer partials ---------- */
async function loadPartials(){
  const headerSlot = document.getElementById('site-header-slot');
  const footerSlot = document.getElementById('site-footer-slot');
  if(headerSlot){
    const res = await fetch('partials/header.html');
    headerSlot.innerHTML = await res.text();
    initHeader();
  }
  if(footerSlot){
    const res = await fetch('partials/footer.html');
    footerSlot.innerHTML = await res.text();
  }
  applyLanguage(getLanguage());
  hardenDriveImages();
}

function initHeader(){
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');
  if(hamburger) hamburger.addEventListener('click', ()=> mobileMenu.classList.add('open'));
  if(closeBtn) closeBtn.addEventListener('click', ()=> mobileMenu.classList.remove('open'));

  const langSelect = document.getElementById('langSelect');
  if(langSelect){
    langSelect.value = getLanguage();
    langSelect.addEventListener('change', (e)=> applyLanguage(e.target.value));
  }
  const langSelectMobile = document.getElementById('langSelectMobile');
  if(langSelectMobile){
    langSelectMobile.value = getLanguage();
    langSelectMobile.addEventListener('change', (e)=> applyLanguage(e.target.value));
  }

  // highlight current page in nav
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(a=>{
    if(a.getAttribute('href') === path) a.style.color = '#6f9438';
  });
}

/* ---------- Language switching ---------- */
// Full-site translation is rolled out page by page. This stores the
// preference site-wide and swaps any element tagged data-i18n on pages
// that have a translation dictionary loaded (window.I18N).
function getLanguage(){
  return localStorage.getItem('vf_lang') || 'en';
}
function applyLanguage(lang){
  localStorage.setItem('vf_lang', lang);
  document.querySelectorAll('[id^="langSelect"]').forEach(el=> el.value = lang);
  if(window.I18N && window.I18N[lang]){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(window.I18N[lang][key]) el.innerHTML = window.I18N[lang][key];
    });
  }
}

/* ---------- Enquiry Modal ---------- */
function openEnquiry(productName, extraFieldsHtml){
  let overlay = document.getElementById('enquiryOverlay');
  if(!overlay){ buildEnquiryModal(); overlay = document.getElementById('enquiryOverlay'); }
  document.getElementById('enquiryOverlay').classList.add('open');
  document.getElementById('enquiryModal').classList.add('open');
  document.getElementById('productField').value = productName || '';
  document.body.style.overflow = 'hidden';
}
function closeEnquiry(){
  document.getElementById('enquiryOverlay').classList.remove('open');
  document.getElementById('enquiryModal').classList.remove('open');
  document.body.style.overflow = '';
}

function buildEnquiryModal(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="enquiryOverlay" class="modal-overlay" onclick="closeEnquiry()"></div>
    <div id="enquiryModal" class="modal-box">
      <button class="close" onclick="closeEnquiry()">&times;</button>
      <p class="eyebrow">Send an Enquiry</p>
      <h3 class="display h2" style="margin:0 0 6px;">LET'S TALK SUPPLY</h3>
      <p class="muted" style="margin:0 0 20px; font-size:13px;">We'll reply by phone or WhatsApp shortly.</p>
      <form id="enquiryForm">
        <div class="field"><label>Business Name</label><input required name="business" type="text"></div>
        <div class="field-row">
          <div class="field"><label>Contact Person</label><input required name="contact" type="text"></div>
          <div class="field"><label>Phone</label><input required name="phone" type="tel"></div>
        </div>
        <div class="field"><label>Location / City</label><input required name="location" type="text"></div>
        <div class="field"><label>Business Type</label>
          <select name="businessType">
            <option>Hotel/Restaurant</option><option>Caterer</option><option>Distributor</option>
            <option>Institution</option><option>Other</option>
          </select>
        </div>
        <div class="field-row">
          <div class="field"><label>Product Interested In</label><input id="productField" name="product" type="text"></div>
          <div class="field"><label>Quantity Required</label><input name="quantity" type="text" placeholder="e.g. 100 kg/week"></div>
        </div>
        <div class="field"><label>Message</label><textarea name="message" rows="3"></textarea></div>
        <button type="submit" class="btn btn-solid" style="width:100%;">Send Enquiry</button>
        <p class="muted" style="font-size:11px; text-align:center; margin-top:10px;">Opens WhatsApp with your details, and emails our team.</p>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);
  document.getElementById('enquiryForm').addEventListener('submit', handleEnquirySubmit);
}

function handleEnquirySubmit(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  const waText = `New Enquiry from Website%0A`+
    `Business: ${encodeURIComponent(data.business||'')}%0A`+
    `Contact: ${encodeURIComponent(data.contact||'')}%0A`+
    `Phone: ${encodeURIComponent(data.phone||'')}%0A`+
    `Location: ${encodeURIComponent(data.location||'')}%0A`+
    `Type: ${encodeURIComponent(data.businessType||'')}%0A`+
    `Product: ${encodeURIComponent(data.product||'')}%0A`+
    `Quantity: ${encodeURIComponent(data.quantity||'')}%0A`+
    `Message: ${encodeURIComponent(data.message||'')}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, '_blank');
  fetch('/api/enquiry', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).catch(()=>{});
  closeEnquiry();
  alert('Thanks! WhatsApp is opening with your enquiry — please hit send there, and our team will also receive it by email.');
  e.target.reset();
}

/* ---------- Brochure download (language picker) ---------- */
const BROCHURE_LINKS = {
  en: "https://drive.google.com/file/d/1hcRucStUS23H_gMXj0e2DNPpcJRqctBs/view",
  hi: "https://drive.google.com/file/d/1ZrDTTbMVa31xzZl4Fq1O25soDluKpGlT/view",
  or: "https://drive.google.com/file/d/1msT0VJp5K4iXOeMlZOk98rRUsXzByrmY/view"
};
function openBrochurePicker(){
  let overlay = document.getElementById('brochureOverlay');
  if(!overlay){ buildBrochureModal(); }
  document.getElementById('brochureOverlay').classList.add('open');
  document.getElementById('brochureModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBrochure(){
  document.getElementById('brochureOverlay').classList.remove('open');
  document.getElementById('brochureModal').classList.remove('open');
  document.body.style.overflow = '';
}
function pickBrochure(lang){
  window.open(BROCHURE_LINKS[lang], '_blank');
  closeBrochure();
}
function buildBrochureModal(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="brochureOverlay" class="modal-overlay" onclick="closeBrochure()"></div>
    <div id="brochureModal" class="modal-box" style="max-width:380px; text-align:center;">
      <button class="close" onclick="closeBrochure()">&times;</button>
      <p class="eyebrow">Download Brochure</p>
      <h3 class="display h2" style="margin:0 0 20px;">CHOOSE A LANGUAGE</h3>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn btn-solid" onclick="pickBrochure('en')">English</button>
        <button class="btn btn-outline" onclick="pickBrochure('hi')">हिंदी (Hindi)</button>
        <button class="btn btn-outline" onclick="pickBrochure('or')">ଓଡ଼ିଆ (Odia)</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
}

/* ---------- Private Label upload ---------- */
function handlePackagingUpload(input){
  const statusEl = document.getElementById('uploadStatus');
  const file = input.files[0];
  if(!file) return;
  if(file.size > 5 * 1024 * 1024){
    statusEl.textContent = 'File is larger than 5MB — please upload a smaller file.';
    statusEl.style.color = '#c22a2a';
    input.value = '';
    return;
  }
  statusEl.textContent = 'Uploading "' + file.name + '"...';
  statusEl.style.color = '';

  const reader = new FileReader();
  reader.onload = async function(){
    try{
      await fetch('/api/private-label-upload', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          dataBase64: reader.result.split(',')[1],
          business: document.getElementById('plBusiness')?.value || '',
          phone: document.getElementById('plPhone')?.value || ''
        })
      });
      statusEl.textContent = 'Design received! Opening WhatsApp so you can confirm details with our team.';
      statusEl.style.color = '#6f9438';
      const waText = `Hi Vaidhya Foods, I just uploaded a packaging design ("${file.name}") on your website for custom Private Label packing. Please confirm receipt.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
    }catch(err){
      statusEl.textContent = 'Upload failed — please try again or WhatsApp the file directly.';
      statusEl.style.color = '#c22a2a';
    }
  };
  reader.readAsDataURL(file);
}

/* ---------- Make every Google Drive hotlinked image resilient ---------- */
// Rewrites lh3.googleusercontent.com/d/<ID> images to Google's thumbnail
// endpoint (more reliable for hotlinking) and falls back to the original
// lh3 URL automatically if that ever fails to load.
function hardenDriveImages(){
  document.querySelectorAll('img[src*="lh3.googleusercontent.com/d/"]').forEach(img=>{
    if(img.dataset.hardened) return;
    img.dataset.hardened = "1";
    const original = img.getAttribute('src');
    const match = original.match(/\/d\/([^=]+)/);
    if(!match) return;
    const id = match[1];
    const thumb = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    img.dataset.fallback = original;
    img.addEventListener('error', function onErr(){
      img.removeEventListener('error', onErr);
      img.src = img.dataset.fallback;
    });
    img.src = thumb;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartials();
  hardenDriveImages();
});
// Partials load asynchronously, so re-run after they're injected too.
window.addEventListener('load', hardenDriveImages);

