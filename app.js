/*
 * MiraCars Premium Car Rental – JavaScript logic
 *
 * This script powers the front‑end interactivity for the MiraCars web app.
 * It handles car rendering, booking validation, modal behaviour, toast
 * notifications, theme customisation and an owner admin panel with
 * configurable options. All persisted data (cars, extras, config and
 * credentials) are stored in localStorage so that the owner can manage
 * the site without a backend. Replace the storage layer with API calls
 * or a database in production.
 */

// Utility shortcuts
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Default dataset for cars. Each car can optionally specify an image stored
// under the assets/ folder. If no image is provided, an SVG placeholder is
// rendered.
const defaultCars = [
  { id: 'c1', name: 'Horizon Mirage', type: 'city', seats: 4, luggage: 2, price: 39, image: 'hero1.png' },
  { id: 'c2', name: 'Zephyr Stratos', type: 'van', seats: 9, luggage: 6, price: 79, image: 'hero4.png' },
  { id: 'c3', name: 'Aurora Nebula', type: 'suv', seats: 5, luggage: 4, price: 69, image: 'hero2.webp' },
  { id: 'c4', name: 'Vanguard Hybrid', type: 'city', seats: 5, luggage: 3, price: 49, image: 'hero3.jpg' },
  { id: 'c5', name: 'Cocoon LX', type: 'luxury', seats: 4, luggage: 3, price: 129, image: 'banner.avif' },
  { id: 'c6', name: 'Ikon Voyager', type: 'suv', seats: 5, luggage: 4, price: 89 }
];

// Default extras dataset. The owner may add or remove extras via the admin panel.
const defaultExtras = [
  { id: 'basic_insurance', name: 'Basic insurance', price: 10 },
  { id: 'full_insurance', name: 'Full insurance', price: 20 },
  { id: 'gps', name: 'GPS navigation', price: 5 },
  { id: 'child_seat', name: 'Child seat', price: 7 }
];

const defaultVipExtras = [
  { id: 'vip_upgrade', name: 'VIP upgrade', price: 30 },
  { id: 'executive_transfer', name: 'Executive transfer', price: 50 }
];

// Configuration with sensible defaults. The owner can modify these options
// through the admin panel; they will persist between sessions.
const defaultConfig = {
  layout: 'grid',               // 'grid' or 'list' for car display
  vipCode: 'VIP123',            // code required to unlock VIP extras
  requiredFields: {
    location: true,
    type: true,
    start: true,
    end: true,
    name: true,
    email: true,
    phone: false
  },
  theme: {
    bg: '#0b0c10',
    card: '#121418',
    muted: '#aab2c0',
    text: '#ffffff',
    brandPrimary: '#00d1b2',
    brandSecondary: '#ffb200'
  }
};

// Local storage helpers
function loadState(key, def) {
  try {
    const json = localStorage.getItem('miracars.' + key);
    return json ? JSON.parse(json) : def;
  } catch (err) {
    console.warn('Error loading', key, err);
    return def;
  }
}
function saveState(key, value) {
  localStorage.setItem('miracars.' + key, JSON.stringify(value));
}

// Application state
let cars = loadState('cars', defaultCars);
let extras = loadState('extras', defaultExtras);
let vipExtras = loadState('vipextras', defaultVipExtras);
let config = loadState('config', defaultConfig);

// Credentials storage. In production, this would be replaced by a secure
// authentication backend. For demonstration, we allow the admin to set an
// initial password. The hashed password is stored and compared on login.
let credentials = loadState('credentials', null);

// Simple hashing (NOT secure) used only for demonstration. Replace with
// bcrypt or Argon2 on your server in production.
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Toast notifications
function showToast(message, type = 'info') {
  const container = $('.toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'success') toast.classList.add('toast-success');
  if (type === 'error') toast.classList.add('toast-error');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

// Render functions
function renderCars(filter = 'all') {
  const grid = $('#carsGrid');
  grid.innerHTML = '';
  const list = cars.filter(c => filter === 'all' ? true : c.type === filter);
  list.forEach(car => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.type = car.type;
    card.tabIndex = 0;
    card.setAttribute('aria-label', `${car.name}, ${car.price} euro per day`);
    // Media section
    const media = document.createElement('div');
    media.className = 'media';
    if (car.image) {
      const img = document.createElement('img');
      img.src = `assets/${car.image}`;
      img.alt = car.name;
      img.style.maxHeight = '100%';
      img.style.maxWidth = '100%';
      media.appendChild(img);
    } else {
      // Fallback SVG placeholder
      media.innerHTML = `
        <svg class="car-svg" viewBox="0 0 160 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="36" width="148" height="18" rx="9" fill="#1d222a" />
          <circle cx="44" cy="56" r="10" fill="#0e1116" stroke="#8a93a3" stroke-width="3"/>
          <circle cx="116" cy="56" r="10" fill="#0e1116" stroke="#8a93a3" stroke-width="3"/>
          <path d="M16 48c14-20 56-22 84-22 12 0 20 3 34 12v10H16z" fill="var(--brand-primary)" />
        </svg>`;
    }
    card.appendChild(media);
    // Content section
    const content = document.createElement('div');
    content.className = 'content';
    const row1 = document.createElement('div');
    row1.className = 'row';
    row1.innerHTML = `<strong>${car.name}</strong><span class="price">€${car.price}/day</span>`;
    const row2 = document.createElement('div');
    row2.className = 'row';
    row2.innerHTML = `<span>👥 ${car.seats} seats</span><span>🧳 ${car.luggage} bags</span>`;
    const rentBtn = document.createElement('button');
    rentBtn.className = 'btn brand';
    rentBtn.dataset.book = car.id;
    rentBtn.setAttribute('aria-label', `Rent ${car.name}`);
    rentBtn.textContent = 'Rent';
    content.appendChild(row1);
    content.appendChild(row2);
    content.appendChild(rentBtn);
    card.appendChild(content);
    grid.appendChild(card);
  });
}

// Render extras checkboxes for booking form
function renderExtras(container, extrasList) {
  container.innerHTML = '';
  extrasList.forEach(ex => {
    const div = document.createElement('div');
    div.className = 'extra-item';
    const id = `extra-${ex.id}`;
    div.innerHTML = `
      <label>
        <input type="checkbox" id="${id}" data-extra="${ex.id}" value="${ex.price}">
        ${ex.name} (+€${ex.price}/day)
      </label>`;
    container.appendChild(div);
  });
}

// Apply theme variables from config
function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--card', theme.card);
  root.style.setProperty('--muted', theme.muted);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--brand-primary', theme.brandPrimary);
  root.style.setProperty('--brand-secondary', theme.brandSecondary);
}

// Modal handling
function openModal() {
  const backdrop = $('#modalBackdrop');
  backdrop.style.display = 'flex';
  backdrop.removeAttribute('aria-hidden');
  // Focus trap
  const focusable = backdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  function trap(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  backdrop.addEventListener('keydown', trap);
  $('#btnCloseModal').onclick = () => closeModal(trap);
  $('#btnEdit').onclick = () => closeModal(trap);
  $('#btnConfirm').onclick = () => {
    showToast('Demo: booking confirmed!', 'success');
    closeModal(trap);
  };
  $('#btnCloseModal').focus();
}
function closeModal(trap) {
  const backdrop = $('#modalBackdrop');
  backdrop.style.display = 'none';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.removeEventListener('keydown', trap);
}

// Booking form handling
function validateDates() {
  const startInput = $('#start');
  const endInput   = $('#end');
  const s = new Date(startInput.value);
  const e = new Date(endInput.value);
  const err = $('#formError');
  if (startInput.value && endInput.value && e <= s) {
    err.textContent = 'Return must be after pick‑up.';
    return false;
  }
  err.textContent = '';
  return true;
}

function handleBookingForm() {
  const form = $('#bookingForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Check required fields based on config
    const fields = ['location','carType','start','end','name','email','phone'];
    for (const field of fields) {
      const input = $('#' + field);
      if (!input) continue;
      if (config.requiredFields[field] && !input.value) {
        $('#formError').textContent = 'Please complete all required fields.';
        return;
      }
    }
    if (!validateDates()) return;
    // Prepare summary
    const start = new Date($('#start').value);
    const end   = new Date($('#end').value);
    const diff  = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const carType = $('#carType').value;
    const selectedExtras = $$('input[data-extra]:checked').map(el => el.dataset.extra);
    const summaryLines = [];
    summaryLines.push(`<p><strong>Name:</strong> ${$('#name').value || ''}</p>`);
    summaryLines.push(`<p><strong>Email:</strong> ${$('#email').value || ''}</p>`);
    summaryLines.push(`<p><strong>Phone:</strong> ${$('#phone').value || ''}</p>`);
    summaryLines.push(`<p><strong>Location:</strong> ${$('#location').value}</p>`);
    summaryLines.push(`<p><strong>Type:</strong> ${carType.toUpperCase()}</p>`);
    summaryLines.push(`<p><strong>Pick‑up:</strong> ${start.toLocaleString()}</p>`);
    summaryLines.push(`<p><strong>Return:</strong> ${end.toLocaleString()}</p>`);
    summaryLines.push(`<p><strong>Days:</strong> ${diff}</p>`);
    // Extras details
    if (selectedExtras.length > 0) {
      const exList = selectedExtras.map(id => {
        const ex = extras.find(e => e.id === id) || vipExtras.find(e => e.id === id);
        return `${ex.name} (€${ex.price}/day)`;
      }).join(', ');
      summaryLines.push(`<p><strong>Extras:</strong> ${exList}</p>`);
    }
    // Calculate approximate cost for demonstration
    const carSelected = cars.find(c => c.type === carType) || cars[0];
    let total = carSelected.price * diff;
    selectedExtras.forEach(id => {
      const ex = extras.find(e => e.id === id) || vipExtras.find(e => e.id === id);
      if (ex) total += ex.price * diff;
    });
    summaryLines.push(`<p><strong>Estimated cost:</strong> €${total}</p>`);
    summaryLines.push('<p style="color:var(--muted);">Select a car from the grid or confirm to proceed.</p>');
    $('#modalBody').innerHTML = summaryLines.join('');
    openModal();
  });
  // Validate date fields on change
  ['start','end'].forEach(id => {
    const input = $('#' + id);
    if (input) input.addEventListener('change', validateDates);
  });
}

// Car rent button handler
function handleRentButtonClicks() {
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-book]');
    if (!btn) return;
    const carId = btn.dataset.book;
    const car   = cars.find(c => c.id === carId);
    const saved = {
      location: $('#location').value,
      type: $('#carType').value,
      start: $('#start').value,
      end: $('#end').value,
      name: $('#name').value,
      email: $('#email').value,
      phone: $('#phone').value
    };
    const lines = [];
    lines.push(`<p><strong>Car:</strong> ${car.name}</p>`);
    lines.push(`<p><strong>Rate:</strong> €${car.price}/day</p>`);
    if (saved.location) lines.push(`<p><strong>Location:</strong> ${saved.location}</p>`);
    if (saved.start) lines.push(`<p><strong>Pick‑up:</strong> ${new Date(saved.start).toLocaleString()}</p>`);
    if (saved.end) lines.push(`<p><strong>Return:</strong> ${new Date(saved.end).toLocaleString()}</p>`);
    lines.push(`<p style="color:var(--muted);">This is a demo confirmation. Hook this up to your backend.</p>`);
    $('#modalBody').innerHTML = lines.join('');
    openModal();
  });
}

// Filter chips handling
function handleFilterChips() {
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderCars(chip.dataset.filter);
  }));
}

// Sign‑in / Admin panel
function initAuth() {
  const signInBtn = $('#btnSignIn');
  const signInModal = $('#signInModal');
  if (!signInBtn) return;
  signInBtn.addEventListener('click', () => {
    // Display sign‑in modal
    signInModal.style.display = 'flex';
    signInModal.querySelector('input[type="email"]').focus();
  });
  // Close sign‑in modal
  $('#btnCloseSignIn').addEventListener('click', () => {
    signInModal.style.display = 'none';
  });
  // Register or login flow
  $('#signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = $('#adminEmail').value.trim();
    const password = $('#adminPassword').value.trim();
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }
    // First‑time setup: create credentials
    if (!credentials) {
      const hashed = await hashPassword(password);
      credentials = { email, passwordHash: hashed };
      saveState('credentials', credentials);
      signInModal.style.display = 'none';
      showToast('Owner profile created. Welcome!', 'success');
      revealAdminPanel();
      return;
    }
    // Validate credentials
    const hashed = await hashPassword(password);
    if (email === credentials.email && hashed === credentials.passwordHash) {
      signInModal.style.display = 'none';
      showToast('Welcome back, owner!', 'success');
      revealAdminPanel();
    } else {
      showToast('Invalid credentials', 'error');
    }
  });
  // Biometric login (WebAuthn). This requires HTTPS and a real authenticator.
  $('#btnBiometric').addEventListener('click', async () => {
    if (!credentials) {
      showToast('Set up a password before enabling biometrics', 'error');
      return;
    }
    if (!('credentials' in navigator)) {
      showToast('WebAuthn not supported on this browser', 'error');
      return;
    }
    try {
      // Challenge would normally be provided by the server
      const publicKey = {
        challenge: new Uint8Array(26),
        timeout: 60000,
        userVerification: 'preferred'
      };
      const cred = await navigator.credentials.get({ publicKey });
      console.log('WebAuthn credential', cred);
      // In real usage, send to server for verification
      signInModal.style.display = 'none';
      showToast('Biometric authentication successful!', 'success');
      revealAdminPanel();
    } catch (err) {
      console.error(err);
      showToast('Biometric authentication failed', 'error');
    }
  });
}

// Reveal admin panel and populate values
function revealAdminPanel() {
  $('#adminContainer').style.display = 'block';
  // Populate theme controls
  $('#themeBg').value = config.theme.bg;
  $('#themeCard').value = config.theme.card;
  $('#themeMuted').value = config.theme.muted;
  $('#themeText').value = config.theme.text;
  $('#themePrimary').value = config.theme.brandPrimary;
  $('#themeSecondary').value = config.theme.brandSecondary;
  // Populate required fields toggles
  Object.keys(config.requiredFields).forEach(key => {
    const cb = $('#req-' + key);
    if (cb) cb.checked = !!config.requiredFields[key];
  });
  // Populate VIP code
  $('#vipCode').value = config.vipCode;
  // Render cars & extras list in admin
  renderAdminCars();
  renderAdminExtras();
}

// Admin: update theme on input change
function initThemeEditor() {
  const themeInputs = $$('.theme-input');
  themeInputs.forEach(input => {
    input.addEventListener('change', () => {
      const key = input.dataset.key;
      config.theme[key] = input.value;
      applyTheme(config.theme);
      saveState('config', config);
    });
  });
}

// Admin: required fields toggles
function initRequiredFieldsEditor() {
  const reqInputs = $$('.req-input');
  reqInputs.forEach(cb => {
    cb.addEventListener('change', () => {
      const key = cb.dataset.field;
      config.requiredFields[key] = cb.checked;
      saveState('config', config);
    });
  });
}

// Admin: VIP code update
function initVipEditor() {
  $('#vipCode').addEventListener('change', () => {
    config.vipCode = $('#vipCode').value.trim();
    saveState('config', config);
  });
}

// Admin: render cars in editable list
function renderAdminCars() {
  const list = $('#adminCarsList');
  list.innerHTML = '';
  cars.forEach((car, index) => {
    const row = document.createElement('div');
    row.className = 'admin-car-row';
    row.innerHTML = `<strong>${car.name}</strong> (${car.type}) – €${car.price}/day <button class="btn ghost" data-remove-car="${car.id}">Remove</button>`;
    list.appendChild(row);
  });
}

// Admin: render extras in editable list
function renderAdminExtras() {
  const list = $('#adminExtrasList');
  list.innerHTML = '';
  extras.concat(vipExtras).forEach(ex => {
    const row = document.createElement('div');
    row.className = 'admin-extra-row';
    const isVip = vipExtras.includes(ex);
    row.innerHTML = `${ex.name} (€${ex.price}/day) ${isVip ? '<em>[VIP]</em>' : ''} <button class="btn ghost" data-remove-extra="${ex.id}">Remove</button>`;
    list.appendChild(row);
  });
}

// Admin: form to add new car
function initAddCarForm() {
  $('#addCarForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = $('#newCarName').value.trim();
    const type    = $('#newCarType').value;
    const seats   = parseInt($('#newCarSeats').value, 10);
    const luggage = parseInt($('#newCarLuggage').value, 10);
    const price   = parseFloat($('#newCarPrice').value);
    const image   = $('#newCarImage').value.trim();
    if (!name || !type || !price) {
      showToast('Name, type and price are required for a new car', 'error');
      return;
    }
    const id = 'c' + (Date.now());
    cars.push({ id, name, type, seats, luggage, price, image });
    saveState('cars', cars);
    renderCars($('.chip.active')?.dataset.filter || 'all');
    renderAdminCars();
    e.target.reset();
    showToast('Car added successfully', 'success');
  });
  // Remove car event
  $('#adminCarsList').addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-remove-car]');
    if (!btn) return;
    const id = btn.dataset.removeCar;
    cars = cars.filter(c => c.id !== id);
    saveState('cars', cars);
    renderCars($('.chip.active')?.dataset.filter || 'all');
    renderAdminCars();
    showToast('Car removed', 'success');
  });
}

// Admin: form to add new extra
function initAddExtraForm() {
  $('#addExtraForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = $('#newExtraName').value.trim();
    const price = parseFloat($('#newExtraPrice').value);
    const vip   = $('#newExtraVip').checked;
    if (!name || !price) {
      showToast('Name and price are required for a new extra', 'error');
      return;
    }
    const id = name.toLowerCase().replace(/\s+/g, '_');
    const list = vip ? vipExtras : extras;
    list.push({ id, name, price });
    if (vip) saveState('vipextras', vipExtras); else saveState('extras', extras);
    renderExtras($('#extrasContainer'), extras);
    renderAdminExtras();
    e.target.reset();
    showToast('Extra added successfully', 'success');
  });
  // Remove extra event
  $('#adminExtrasList').addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-remove-extra]');
    if (!btn) return;
    const id = btn.dataset.removeExtra;
    if (extras.find(e => e.id === id)) {
      extras = extras.filter(e => e.id !== id);
      saveState('extras', extras);
    } else {
      vipExtras = vipExtras.filter(e => e.id !== id);
      saveState('vipextras', vipExtras);
    }
    renderExtras($('#extrasContainer'), extras);
    renderAdminExtras();
    showToast('Extra removed', 'success');
  });
}

// VIP code unlocking
function initVipCodeInput() {
  $('#vipInput').addEventListener('input', () => {
    const code = $('#vipInput').value.trim();
    const vipSection = $('#vipExtrasSection');
    if (code && code === config.vipCode) {
      // Render VIP extras
      renderExtras($('#vipExtrasContainer'), vipExtras);
      vipSection.style.display = 'block';
    } else {
      vipSection.style.display = 'none';
    }
  });
}

// On document ready
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(config.theme);
  renderCars();
  handleFilterChips();
  handleBookingForm();
  handleRentButtonClicks();
  initAuth();
  initThemeEditor();
  initRequiredFieldsEditor();
  initVipEditor();
  initAddCarForm();
  initAddExtraForm();
  initVipCodeInput();
  // Render extras in booking section
  renderExtras($('#extrasContainer'), extras);
  // Year for footer
  const yearSpan = $('#year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});