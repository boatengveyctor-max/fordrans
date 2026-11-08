/* ================= CONFIG: edit contact details here ================= */
const EMAIL = 'fordransadventures@gmail.com';
const PHONE = '0505080735';
const WA    = '233505080735';           // WhatsApp number in international format

/* ================= DATA ================= */
const ico = {
  plane:'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  hotel:'M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01',
  visa:'M5 3h14v18H5zM9 8h6M9 12h6M9 16h3',
  globe:'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20',
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  up:'M12 19V5M5 12l7-7 7 7',
  cup:'M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4zM6 2v3M10 2v3M14 2v3',
  star:'M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z',
  car:'M3 13l2-6h14l2 6v5H3zM7 18v2M17 18v2M3 13h18',
  bag:'M6 7h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2zM9 7V4h6v3'
};
const services = [
  ['Flights','Domestic and international flights','plane'],
  ['Hotel Bookings','Worldwide hotels and resorts','hotel'],
  ['Visa Assistance','Hassle-free visa processing','visa'],
  ['Tours','Group and individual packages','globe'],
  ['Travel Insurance','Travel with confidence','shield'],
  ['Cabin Upgrades','Fly in more comfort','up'],
  ['Airport Lounge Access','Relax before you fly','cup'],
  ['Protocol & Airport Services','VIP assistance at the airport','star'],
  ['Airport Transfers & Car Hire','Safe, reliable and comfortable','car'],
  ['Extra Baggage Purchase','Carry more, worry less','bag']
];

/* ================= HELPERS ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const svg = (d, c = 'h-6 w-6') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

/* Builds one labelled form field with an inline error slot */
function field(label, name, type = 'text', o = {}) {
  const a = `id="${o.p}-${name}" name="${name}" class="inp" ${o.req ? 'required' : ''} ${o.ph ? `placeholder="${o.ph}"` : ''} ${o.attr || ''}`;
  let ctl;
  if (type === 'select') ctl = `<select ${a}><option value="">Choose one</option>${o.opts.map(x => `<option ${x === o.sel ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
  else if (type === 'textarea') ctl = `<textarea ${a} rows="4"></textarea>`;
  else ctl = `<input type="${type}" ${a}>`;
  return `<div class="${o.full ? 'sm:col-span-2' : ''}"><label for="${o.p}-${name}" class="mb-1 block text-sm font-semibold">${label}${o.req ? ' <span class="text-brand">*</span>' : ''}</label>${ctl}<p class="err min-h-[1.25rem] pt-1 text-sm font-medium text-red-600" aria-live="polite"></p></div>`;
}

/* Validates one control and writes the message under it */
function check(el) {
  const v = el.value.trim(); let m = '';
  if (el.required && !v) m = 'This field is required.';
  else if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Enter a valid email, like name@example.com.';
  else if (v && el.type === 'tel' && !/^\+?[0-9\s-]{9,15}$/.test(v)) m = 'Enter a valid phone number with at least 9 digits.';
  else if (v && el.type === 'date' && v < (el.min || today)) m = 'Choose a date that is not in the past.';
  else if (v && el.type === 'number' && (+v < +el.min || +v > +el.max)) m = `Enter a number from ${el.min} to ${el.max}.`;
  el.classList.toggle('!border-red-500', !!m);
  el.setAttribute('aria-invalid', !!m);
  el.parentElement.querySelector('.err').textContent = m;
  return !m;
}

/* Wires live validation + submit handling to a form */
function wire(form, onOk) {
  form.addEventListener('focusout', e => e.target.matches('.inp') && check(e.target));
  form.addEventListener('input', e => e.target.matches('.inp') && e.target.getAttribute('aria-invalid') === 'true' && check(e.target));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = $$('.inp', form).filter(el => !check(el));
    if (bad.length) return bad[0].focus();
    onOk(Object.fromEntries(new FormData(form)), new FormData(form));
  });
}

/* Success state: summary plus WhatsApp / email hand-off (no server needed) */
function success(box, title, data, resetFn) {
  const lines = Object.entries(data).filter(([, v]) => v).map(([k, v]) => [k, v]);
  const msg = `Hello Fordrans Adventures, ${title}\n\n${lines.map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  const first = (data['Name'] || '').split(' ')[0];
  box.innerHTML = `<div role="status" class="text-center">
    <div class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand text-white">${svg('M5 13l4 4L19 7', 'h-8 w-8')}</div>
    <h3 class="text-2xl font-extrabold"></h3>
    <p class="mx-auto mt-2 max-w-md text-slate-600">Send it to our team now so we can start on your quote. Nothing is sent until you tap a button below.</p>
    <dl class="mx-auto mt-5 max-w-md rounded-xl border-2 border-slate-200 bg-white p-4 text-left text-sm">${lines.map(([k, v]) => `<div class="flex justify-between gap-4 py-1"><dt class="text-slate-500">${k}</dt><dd class="text-right font-semibold"></dd></div>`).join('')}</dl>
    <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
      <a class="btn-primary" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}">Send on WhatsApp</a>
      <a class="btn-outline" href="mailto:${EMAIL}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(msg)}">Send by email</a>
    </div>
    <button class="mt-4 text-sm font-semibold text-brand underline" id="again">Start a new request</button></div>`;
  // Fill values with textContent so user input is never parsed as HTML
  $$('dd', box).forEach((dd, i) => dd.textContent = lines[i][1]);
  $('h3', box).textContent = `Thanks, ${first}. Your request is ready.`;
  $('#again', box).onclick = resetFn;
  box.scrollIntoView({ block: 'nearest' });
}

/* ================= BOOKING FORM (modal) ================= */
const bk = $('#bk'), bkBody = $('#bkBody');
function renderBooking(svc = '') {
  const p = 'b';
  bkBody.innerHTML = `<form novalidate class="grid gap-x-4 sm:grid-cols-2">
    ${field('Service', 'service', 'select', { p, req: 1, full: 1, opts: services.map(s => s[0]), sel: svc })}
    ${field('Preferred date', 'date', 'date', { p, req: 1, attr: `min="${today}"` })}
    ${field('Group size', 'size', 'number', { p, req: 1, attr: 'min="1" max="50" value="1"' })}
    ${field('Full name', 'name', 'text', { p, req: 1, full: 1, ph: 'Ama Mensah' })}
    ${field('Phone / WhatsApp', 'phone', 'tel', { p, req: 1, ph: '0505080735' })}
    ${field('Email', 'email', 'email', { p, req: 1, ph: 'you@example.com' })}
    ${field('Notes (optional)', 'notes', 'textarea', { p, full: 1 })}
    <button class="btn-primary sm:col-span-2">Request booking</button></form>`;
  wire($('form', bkBody), d => success(bkBody, `I’d like to book: ${d.service}.`, {
    'Service': d.service, 'Date': d.date, 'Group size': d.size, 'Name': d.name, 'Phone': d.phone, 'Email': d.email, 'Notes': d.notes
  }, () => renderBooking()));
}
function openBooking(svc) { renderBooking(svc); bk.showModal(); }
$$('[data-book]').forEach(b => b.onclick = () => { $('#menu').classList.add('hidden'); openBooking(); });
$('#bkClose').onclick = () => bk.close();
bk.addEventListener('click', e => e.target === bk && bk.close());

/* ================= SERVICES GRID ================= */
$('#svcGrid').innerHTML = services.map(([n, d, i]) => `
  <article class="flex flex-col rounded-xl border-2 border-transparent bg-white p-6 shadow-md hover:border-sky">
    <span class="grid h-12 w-12 place-items-center rounded-full bg-brand text-white">${svg(ico[i])}</span>
    <h3 class="mt-4 text-lg font-bold">${n.replace('&', '&amp;')}</h3>
    <p class="mt-1 flex-1 text-slate-600">${d}</p>
    <button class="btn-outline mt-5 !py-2" data-svc="${n}">Book this</button>
  </article>`).join('');
$$('[data-svc]').forEach(b => b.onclick = () => openBooking(b.dataset.svc));

/* ================= CUSTOM TRIP BUILDER ================= */
const acts = ['Beach & relaxation', 'City breaks', 'Safari & wildlife', 'Culture & history', 'Adventure sports', 'Family fun', 'Honeymoon', 'Pilgrimage'];
function renderTrip() {
  const p = 't', box = $('#tripBox');
  box.innerHTML = `<form novalidate class="grid gap-x-4 sm:grid-cols-2">
    ${field('Where do you want to go?', 'destination', 'text', { p, req: 1, full: 1, ph: 'Dubai, Santorini, Paris… or “surprise me”' })}
    <fieldset class="mb-4 sm:col-span-2"><legend class="mb-2 text-sm font-semibold">What do you want to do?</legend><div class="flex flex-wrap gap-2">
      ${acts.map(a => `<label class="cursor-pointer"><input type="checkbox" name="act" value="${a.replace('&', '&amp;')}" class="peer sr-only"><span class="inline-block rounded-full border-2 border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-sky">${a.replace('&', '&amp;')}</span></label>`).join('')}
    </div></fieldset>
    ${field('Where do you want to stay?', 'stay', 'select', { p, req: 1, opts: ['Budget guesthouse', '3-star hotel', '4-star hotel', '5-star resort', 'Apartment or villa', 'No preference'] })}
    ${field('Budget range (USD)', 'budget', 'select', { p, req: 1, opts: ['Under $1,000', '$1,000 to $3,000', '$3,000 to $7,000', '$7,000 and above', 'Not sure yet'] })}
    ${field('Depart on', 'from', 'date', { p, req: 1, attr: `min="${today}"` })}
    ${field('Return on', 'to', 'date', { p, req: 1, attr: `min="${today}"` })}
    ${field('Travellers', 'size', 'number', { p, req: 1, attr: 'min="1" max="100" value="1"' })}
    ${field('Full name', 'name', 'text', { p, req: 1, ph: 'Kofi Boateng' })}
    ${field('Phone / WhatsApp', 'phone', 'tel', { p, req: 1, ph: '0505080735' })}
    ${field('Email', 'email', 'email', { p, req: 1, ph: 'you@example.com' })}
    ${field('Special requests', 'notes', 'textarea', { p, full: 1, ph: 'Anniversary, dietary needs, wheelchair access, must-see places…' })}
    <button class="btn-primary sm:col-span-2">Build my adventure</button></form>`;
  const f = $('form', box);
  wire(f, (d, fd) => {
    // Return date must not be before departure date
    if (d.to < d.from) { const t = f.elements.to; t.classList.add('!border-red-500'); t.setAttribute('aria-invalid', 'true'); t.parentElement.querySelector('.err').textContent = 'Return date must be on or after your departure date.'; return t.focus(); }
    success(box, `I’d like a custom trip to ${d.destination}.`, {
      'Destination': d.destination, 'Activities': fd.getAll('act').join(', '), 'Stay': d.stay, 'Budget': d.budget,
      'Dates': `${d.from} to ${d.to}`, 'Travellers': d.size, 'Name': d.name, 'Phone': d.phone, 'Email': d.email, 'Notes': d.notes
    }, renderTrip);
  });
  // Keep return-date minimum in step with departure date
  f.elements.from.addEventListener('change', e => { f.elements.to.min = e.target.value || today; });
}
renderTrip();

/* ================= SMALL UI BITS ================= */
const menu = $('#menu'), mb = $('#menuBtn');
mb.onclick = () => { const h = menu.classList.toggle('hidden'); mb.setAttribute('aria-expanded', !h); };
$$('#menu a').forEach(a => a.onclick = () => menu.classList.add('hidden'));
$$('[data-mail]').forEach(a => { a.href = 'mailto:' + EMAIL; if (a.id === 'ftMail') a.textContent = EMAIL; });
$$('[data-tel]').forEach(a => a.href = 'tel:' + PHONE);
$$('[data-wa]').forEach(a => { a.href = 'https://wa.me/' + WA; a.target = '_blank'; a.rel = 'noopener'; });
$('#yr').textContent = new Date().getFullYear();
// Decorative barcode on the hero boarding pass
$('#barcode').innerHTML = Array.from({ length: 40 }, (_, i) => `<span class="bg-navy" style="width:${[2, 4, 3, 6, 2, 5][(i * 7) % 6]}px"></span>`).join('');
