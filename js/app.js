(function () {
  'use strict';

  // ---------- Storage ----------
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem('realaasti:' + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem('realaasti:' + key, JSON.stringify(value));
      } catch (e) { /* storage unavailable: keep working in memory */ }
    },
  };

  let saved = new Set(store.get('saved', []));
  let myListings = store.get('myListings', []);

  function allListings() {
    return myListings.concat(SAMPLE_LISTINGS);
  }

  function findListing(id) {
    return allListings().find((p) => p.id === id);
  }

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Indian number formatting: 1250000 -> "12,50,000"
  function inr(n) {
    return Math.round(n).toLocaleString('en-IN');
  }

  function shortPrice(n) {
    if (n >= 1e7) return '₹' + trim(n / 1e7) + ' Cr';
    if (n >= 1e5) return '₹' + trim(n / 1e5) + ' L';
    return '₹' + inr(n);
  }

  function trim(x) {
    return parseFloat(x.toFixed(2)).toString();
  }

  function priceLabel(p) {
    return p.purpose === 'rent' ? '₹' + inr(p.price) + '<small>/month</small>' : shortPrice(p.price);
  }

  function perUnit(p) {
    if (p.purpose !== 'sale' || !p.area) return '';
    return '₹' + inr(p.price / p.area) + ' per ' + p.areaUnit;
  }

  function timeAgo(dateStr) {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return days + ' days ago';
    const months = Math.floor(days / 30);
    return months + (months === 1 ? ' month ago' : ' months ago');
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // ---------- Illustrations (no external images needed) ----------
  function art(p) {
    const hue = hashCode(p.id) % 360;
    const sky = `hsl(${190 + (hue % 40)},70%,90%)`;
    const main = `hsl(${(hue + 160) % 360},35%,45%)`;
    const light = `hsl(${(hue + 160) % 360},30%,70%)`;
    const win = '#fef3c7';
    let shape = '';
    const windows = (x0, y0, cols, rows, w, h, gx, gy) => {
      let s = '';
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          s += `<rect x="${x0 + c * gx}" y="${y0 + r * gy}" width="${w}" height="${h}" rx="2" fill="${win}"/>`;
      return s;
    };
    switch (p.type) {
      case 'Apartment':
        shape = `<rect x="120" y="40" width="90" height="170" fill="${main}"/>${windows(132, 55, 3, 7, 16, 14, 26, 21)}
                 <rect x="215" y="80" width="70" height="130" fill="${light}"/>${windows(225, 92, 2, 5, 18, 14, 28, 22)}`;
        break;
      case 'Villa':
        shape = `<rect x="105" y="110" width="190" height="100" fill="${main}"/>
                 <polygon points="95,112 200,55 305,112" fill="${light}"/>
                 <rect x="185" y="155" width="30" height="55" fill="${win}"/>${windows(125, 130, 2, 1, 32, 26, 0, 0)}${windows(240, 130, 1, 1, 34, 26, 0, 0)}
                 <circle cx="70" cy="180" r="28" fill="hsl(140,35%,45%)"/><circle cx="335" cy="185" r="22" fill="hsl(140,35%,45%)"/>`;
        break;
      case 'Independent House':
        shape = `<rect x="130" y="95" width="140" height="115" fill="${main}"/>
                 <polygon points="120,98 200,45 280,98" fill="${light}"/>
                 <rect x="185" y="160" width="30" height="50" fill="${win}"/>${windows(145, 115, 2, 1, 26, 22, 85, 0)}`;
        break;
      case 'Plot':
        shape = `<polygon points="40,215 120,150 360,150 360,215" fill="hsl(90,35%,55%)"/>
                 ${[60, 110, 160, 210, 260, 310].map((x) => `<rect x="${x}" y="165" width="4" height="40" fill="#78350f"/>`).join('')}
                 <rect x="60" y="175" width="254" height="3" fill="#78350f"/><rect x="60" y="192" width="254" height="3" fill="#78350f"/>
                 <rect x="230" y="100" width="4" height="55" fill="#475569"/><rect x="205" y="92" width="60" height="26" rx="3" fill="#fff"/>
                 <text x="235" y="110" font-size="11" text-anchor="middle" font-family="Inter,sans-serif" fill="#0f766e" font-weight="700">PLOT</text>`;
        break;
      default: // Commercial
        shape = `<rect x="90" y="70" width="220" height="140" fill="${main}"/>
                 <rect x="90" y="70" width="220" height="18" fill="${light}"/>${windows(105, 100, 6, 3, 24, 18, 34, 28)}
                 <rect x="175" y="180" width="50" height="30" fill="${win}"/>`;
    }
    return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(p.type)} illustration">
      <rect width="400" height="250" fill="${sky}"/><circle cx="285" cy="62" r="20" fill="#fcd34d" opacity=".9"/>
      ${shape}<rect y="210" width="400" height="40" fill="hsl(140,25%,62%)"/></svg>`;
  }

  // ---------- Components ----------
  function card(p) {
    const isSaved = saved.has(p.id);
    const specs = [];
    if (p.beds) specs.push(`${p.beds} BHK`);
    if (p.area) specs.push(`${inr(p.area)} ${p.areaUnit}`);
    if (p.facing) specs.push(`${p.facing} facing`);
    return `
      <article class="card">
        <a href="#/property/${esc(p.id)}" class="card-media">
          ${art(p)}
          <span class="tag tag-${p.purpose}">${p.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
          ${p.mine ? '<span class="tag tag-mine">Your listing</span>' : ''}
        </a>
        <button class="save-btn ${isSaved ? 'saved' : ''}" data-save="${esc(p.id)}" aria-label="${isSaved ? 'Remove from saved' : 'Save property'}" aria-pressed="${isSaved}">
          ${heart()}
        </button>
        <div class="card-body">
          <div class="price">${priceLabel(p)}</div>
          <h3><a href="#/property/${esc(p.id)}">${esc(p.title)}</a></h3>
          <p class="loc">${pin()} ${esc(p.locality)}, ${esc(p.city)}</p>
          <ul class="specs">${specs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          <div class="card-foot"><span>${esc(p.type)}</span><span>${timeAgo(p.postedOn)}</span></div>
        </div>
      </article>`;
  }

  function heart() {
    return '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
  }

  function pin() {
    return '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
  }

  function options(list, selected, placeholder) {
    return (placeholder ? `<option value="">${esc(placeholder)}</option>` : '') +
      list.map((v) => {
        const [val, label] = Array.isArray(v) ? v : [v, v];
        return `<option value="${esc(val)}" ${String(val) === String(selected) ? 'selected' : ''}>${esc(label)}</option>`;
      }).join('');
  }

  const BUDGETS_SALE = [[2000000, '₹20 L'], [5000000, '₹50 L'], [10000000, '₹1 Cr'], [20000000, '₹2 Cr'], [50000000, '₹5 Cr']];
  const BUDGETS_RENT = [[10000, '₹10,000'], [20000, '₹20,000'], [30000, '₹30,000'], [50000, '₹50,000'], [100000, '₹1 L']];

  // ---------- Pages ----------
  function pageHome() {
    const all = allListings();
    const featured = all.filter((p) => p.featured || p.mine)
      .concat(all.filter((p) => !(p.featured || p.mine)).sort((a, b) => new Date(b.postedOn) - new Date(a.postedOn)))
      .slice(0, 6);
    const counts = {};
    allListings().forEach((p) => { counts[p.city] = (counts[p.city] || 0) + 1; });
    return `
      <section class="hero">
        <div class="container">
          <h1>Find your perfect <span>aasti</span></h1>
          <p class="hero-sub">Homes, plots and commercial spaces across Andhra Pradesh &amp; Telangana — verified details, direct owners, zero brokerage to browse.</p>
          <form class="search-box" id="hero-search">
            <div class="seg" role="radiogroup" aria-label="Purpose">
              <label><input type="radio" name="purpose" value="sale" checked><span>Buy</span></label>
              <label><input type="radio" name="purpose" value="rent"><span>Rent</span></label>
            </div>
            <div class="search-fields">
              <select name="city" aria-label="City">${options(CITIES, '', 'All cities')}</select>
              <select name="type" aria-label="Property type">${options(TYPES, '', 'All property types')}</select>
              <input name="q" type="search" placeholder="Locality, project or keyword" aria-label="Keyword">
              <button class="btn btn-primary" type="submit">Search</button>
            </div>
          </form>
          <div class="hero-stats">
            <div><b>${allListings().length}+</b><span>Active listings</span></div>
            <div><b>${CITIES.length}</b><span>Cities</span></div>
            <div><b>₹0</b><span>To post a property</span></div>
          </div>
        </div>
      </section>

      <section class="container section">
        <div class="section-head">
          <h2>Featured properties</h2>
          <a href="#/properties" class="link">View all &rarr;</a>
        </div>
        <div class="grid">${featured.map(card).join('')}</div>
      </section>

      <section class="section alt">
        <div class="container">
          <div class="section-head"><h2>Explore by city</h2></div>
          <div class="city-grid">
            ${CITIES.map((c) => `
              <a class="city" href="#/properties?city=${encodeURIComponent(c)}">
                <b>${esc(c)}</b><span>${counts[c] || 0} properties</span>
              </a>`).join('')}
          </div>
        </div>
      </section>

      <section class="container section">
        <div class="section-head"><h2>Browse by type</h2></div>
        <div class="type-grid">
          ${TYPES.map((t) => `<a class="type" href="#/properties?type=${encodeURIComponent(t)}">${art({ id: t, type: t })}<span>${esc(t)}</span></a>`).join('')}
        </div>
      </section>

      <section class="section alt">
        <div class="container why">
          <div><h3>Verified details</h3><p>Clear information on area, facing, approvals and amenities so you can shortlist with confidence.</p></div>
          <div><h3>Talk directly</h3><p>Send an enquiry straight from the listing — no middlemen, no spam.</p></div>
          <div><h3>Free to list</h3><p>Owners and builders can post a property in under two minutes, completely free.</p></div>
        </div>
      </section>

      <section class="container section cta">
        <div>
          <h2>Have a property to sell or rent out?</h2>
          <p>Reach buyers and tenants across ${CITIES.length} cities.</p>
        </div>
        <a href="#/post" class="btn btn-accent">Post property — it's free</a>
      </section>`;
  }

  function filterListings(params) {
    const purpose = params.get('purpose') || '';
    const city = params.get('city') || '';
    const type = params.get('type') || '';
    const beds = parseInt(params.get('beds') || '0', 10);
    const max = parseInt(params.get('max') || '0', 10);
    const q = (params.get('q') || '').trim().toLowerCase();
    const sort = params.get('sort') || 'newest';

    let list = allListings().filter((p) =>
      (!purpose || p.purpose === purpose) &&
      (!city || p.city === city) &&
      (!type || p.type === type) &&
      (!beds || p.beds >= beds) &&
      (!max || p.price <= max) &&
      (!q || [p.title, p.locality, p.city, p.type, p.description].join(' ').toLowerCase().includes(q))
    );

    const sorters = {
      newest: (a, b) => new Date(b.postedOn) - new Date(a.postedOn),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'area-desc': (a, b) => b.area - a.area,
    };
    return list.sort(sorters[sort] || sorters.newest);
  }

  function pageListings(params) {
    const purpose = params.get('purpose') || '';
    const list = filterListings(params);
    const budgets = purpose === 'rent' ? BUDGETS_RENT : BUDGETS_SALE;
    const heading = [
      params.get('type') || 'Properties',
      purpose === 'rent' ? 'for rent' : purpose === 'sale' ? 'for sale' : '',
      params.get('city') ? 'in ' + params.get('city') : '',
    ].filter(Boolean).join(' ');

    return `
      <section class="container page">
        <div class="page-head">
          <h1>${esc(heading)}</h1>
          <p>${list.length} ${list.length === 1 ? 'property' : 'properties'} found</p>
        </div>
        <div class="listing-layout">
          <aside class="filters">
            <form id="filters">
              <label>Looking to
                <select name="purpose">${options([['sale', 'Buy'], ['rent', 'Rent']], purpose, 'Buy or rent')}</select>
              </label>
              <label>City<select name="city">${options(CITIES, params.get('city'), 'All cities')}</select></label>
              <label>Property type<select name="type">${options(TYPES, params.get('type'), 'All types')}</select></label>
              <label>Bedrooms<select name="beds">${options([[1, '1+ BHK'], [2, '2+ BHK'], [3, '3+ BHK'], [4, '4+ BHK']], params.get('beds'), 'Any')}</select></label>
              <label>Max budget<select name="max">${options(budgets, params.get('max'), 'No limit')}</select></label>
              <label>Keyword<input name="q" type="search" value="${esc(params.get('q') || '')}" placeholder="e.g. Gachibowli"></label>
              <div class="filter-actions">
                <button class="btn btn-primary" type="submit">Apply</button>
                <a href="#/properties" class="btn btn-ghost">Reset</a>
              </div>
            </form>
          </aside>
          <div>
            <div class="toolbar">
              <label>Sort by
                <select id="sort">${options([['newest', 'Newest first'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['area-desc', 'Largest area']], params.get('sort') || 'newest')}</select>
              </label>
            </div>
            ${list.length
              ? `<div class="grid">${list.map(card).join('')}</div>`
              : `<div class="empty"><h3>No properties match your filters</h3><p>Try widening your budget or choosing a different city.</p><a href="#/properties" class="btn btn-primary">Clear filters</a></div>`}
          </div>
        </div>
      </section>`;
  }

  function pageDetail(id) {
    const p = findListing(id);
    if (!p) return pageNotFound();
    const isSaved = saved.has(p.id);
    const similar = allListings().filter((x) => x.id !== p.id && x.city === p.city && x.purpose === p.purpose).slice(0, 3);
    const facts = [
      ['Property type', p.type],
      ['Area', `${inr(p.area)} ${p.areaUnit}`],
      p.beds ? ['Bedrooms', `${p.beds} BHK`] : null,
      p.baths ? ['Bathrooms', p.baths] : null,
      ['Facing', p.facing],
      ['Status', p.status],
      ['Posted', timeAgo(p.postedOn)],
      perUnit(p) ? ['Price per unit', perUnit(p)] : null,
    ].filter(Boolean);

    return `
      <section class="container page">
        <nav class="crumbs"><a href="#/">Home</a> / <a href="#/properties?city=${encodeURIComponent(p.city)}">${esc(p.city)}</a> / <span>${esc(p.title)}</span></nav>
        <div class="detail-layout">
          <div>
            <div class="detail-media">${art(p)}<span class="tag tag-${p.purpose}">${p.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span></div>
            <div class="detail-head">
              <div>
                <h1>${esc(p.title)}</h1>
                <p class="loc">${pin()} ${esc(p.locality)}, ${esc(p.city)}</p>
              </div>
              <div class="detail-price">${priceLabel(p)}${perUnit(p) ? `<span>${perUnit(p)}</span>` : ''}</div>
            </div>
            <div class="actions">
              <button class="btn btn-ghost save-inline ${isSaved ? 'saved' : ''}" data-save="${esc(p.id)}">${heart()} <span>${isSaved ? 'Saved' : 'Save'}</span></button>
              <button class="btn btn-ghost" id="share-btn">Share</button>
              ${p.mine ? `<button class="btn btn-danger" data-delete="${esc(p.id)}">Delete listing</button>` : ''}
            </div>
            <div class="panel">
              <h2>Overview</h2>
              <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
            </div>
            <div class="panel">
              <h2>About this property</h2>
              <p class="desc">${esc(p.description)}</p>
            </div>
            ${p.amenities && p.amenities.length ? `
            <div class="panel">
              <h2>Amenities</h2>
              <ul class="amenities">${p.amenities.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
            </div>` : ''}
            ${p.purpose === 'sale' ? emiCalculator(p) : ''}
          </div>
          <aside>
            <div class="panel sticky">
              <h2>Contact ${p.mine ? '' : 'owner'}</h2>
              ${p.mine
                ? '<p class="muted">This is your listing. Enquiries from buyers will appear here once a backend is connected.</p>'
                : enquiryForm(p)}
            </div>
          </aside>
        </div>
        ${similar.length ? `
        <div class="section">
          <div class="section-head"><h2>Similar properties in ${esc(p.city)}</h2></div>
          <div class="grid">${similar.map(card).join('')}</div>
        </div>` : ''}
      </section>`;
  }

  function enquiryForm(p) {
    return `
      <form id="enquiry" data-id="${esc(p.id)}" novalidate>
        <label>Your name<input name="name" required autocomplete="name"></label>
        <label>Mobile number<input name="phone" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" required autocomplete="tel-national"></label>
        <label>Email (optional)<input name="email" type="email" autocomplete="email"></label>
        <label>Message<textarea name="message" rows="3">Hi, I am interested in "${esc(p.title)}". Please share more details.</textarea></label>
        <label class="check"><input type="checkbox" name="visit"> I'd like to schedule a site visit</label>
        <p class="form-error" hidden></p>
        <button class="btn btn-primary btn-block" type="submit">Send enquiry</button>
      </form>`;
  }

  function emiCalculator(p) {
    const loan = Math.round(p.price * 0.8);
    return `
      <div class="panel">
        <h2>EMI calculator</h2>
        <form id="emi" class="emi">
          <label>Loan amount (₹)<input name="amount" type="number" min="0" step="10000" value="${loan}"></label>
          <label>Interest rate (% p.a.)<input name="rate" type="number" min="0" step="0.05" value="8.5"></label>
          <label>Tenure (years)<input name="years" type="number" min="1" max="30" value="20"></label>
        </form>
        <div class="emi-result" id="emi-result"></div>
      </div>`;
  }

  function calcEmi() {
    const form = $('#emi');
    if (!form) return;
    const P = parseFloat(form.amount.value) || 0;
    const r = (parseFloat(form.rate.value) || 0) / 1200;
    const n = (parseFloat(form.years.value) || 0) * 12;
    let emi = 0;
    if (P > 0 && n > 0) emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    $('#emi-result').innerHTML = `
      <div><span>Monthly EMI</span><b>₹${inr(emi)}</b></div>
      <div><span>Total interest</span><b>₹${inr(Math.max(total - P, 0))}</b></div>
      <div><span>Total payable</span><b>₹${inr(total)}</b></div>`;
  }

  function pagePost() {
    return `
      <section class="container page narrow">
        <div class="page-head">
          <h1>Post your property for free</h1>
          <p>Fill in the details below. Your listing goes live instantly on this device.</p>
        </div>
        <form id="post-form" class="panel post-form" novalidate>
          <fieldset>
            <legend>Basic details</legend>
            <div class="seg seg-light" role="radiogroup" aria-label="Purpose">
              <label><input type="radio" name="purpose" value="sale" checked><span>Sell</span></label>
              <label><input type="radio" name="purpose" value="rent"><span>Rent out</span></label>
            </div>
            <div class="row">
              <label>Property type<select name="type" required>${options(TYPES, 'Apartment')}</select></label>
              <label>Title<input name="title" required maxlength="80" placeholder="e.g. 2 BHK flat near metro"></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Location</legend>
            <div class="row">
              <label>City<select name="city" required>${options(CITIES, '', 'Select city')}</select></label>
              <label>Locality<input name="locality" required maxlength="60" placeholder="e.g. Kukatpally"></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Property details</legend>
            <div class="row row-3">
              <label><span id="price-label">Expected price (₹)</span><input name="price" type="number" min="1" required></label>
              <label>Area<input name="area" type="number" min="1" required></label>
              <label>Unit<select name="areaUnit">${options(['sqft', 'sq yd'], 'sqft')}</select></label>
            </div>
            <div class="row row-3" id="room-fields">
              <label>Bedrooms<select name="beds">${options([[0, '—'], 1, 2, 3, 4, 5], 2)}</select></label>
              <label>Bathrooms<select name="baths">${options([[0, '—'], 1, 2, 3, 4, 5], 2)}</select></label>
              <label>Facing<select name="facing">${options(['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'], 'East')}</select></label>
            </div>
            <label>Status<select name="status">${options(['Ready to move', 'Under construction', 'Ready to register'], 'Ready to move')}</select></label>
            <label>Description<textarea name="description" rows="4" maxlength="1000" placeholder="Highlight what makes your property special — nearby schools, roads, approvals…"></textarea></label>
          </fieldset>
          <fieldset>
            <legend>Amenities</legend>
            <div class="chips">${AMENITIES.map((a) => `<label class="chip"><input type="checkbox" name="amenities" value="${esc(a)}"><span>${esc(a)}</span></label>`).join('')}</div>
          </fieldset>
          <p class="form-error" hidden></p>
          <button class="btn btn-accent btn-block" type="submit">Publish listing</button>
        </form>
        ${myListings.length ? `
          <div class="section">
            <div class="section-head"><h2>Your listings</h2></div>
            <div class="grid">${myListings.map(card).join('')}</div>
          </div>` : ''}
      </section>`;
  }

  function pageSaved() {
    const list = allListings().filter((p) => saved.has(p.id));
    return `
      <section class="container page">
        <div class="page-head">
          <h1>Saved properties</h1>
          <p>${list.length ? `You have shortlisted ${list.length} ${list.length === 1 ? 'property' : 'properties'}.` : ''}</p>
        </div>
        ${list.length
          ? `<div class="grid">${list.map(card).join('')}</div>`
          : `<div class="empty"><h3>No saved properties yet</h3><p>Tap the heart on any listing to shortlist it here.</p><a href="#/properties" class="btn btn-primary">Browse properties</a></div>`}
      </section>`;
  }

  function pageContact() {
    const wa = SITE.whatsapp ? `<a class="btn btn-primary" href="https://wa.me/${esc(SITE.whatsapp)}" target="_blank" rel="noopener">Chat on WhatsApp</a>` : '';
    return `
      <section class="container page narrow">
        <div class="page-head">
          <h1>Contact us</h1>
          <p>Questions about buying, selling or renting? We're happy to help.</p>
        </div>
        <div class="contact-grid">
          <div class="panel">
            <h2>Get in touch</h2>
            <ul class="contact-list">
              <li><span>Email</span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>
              ${SITE.phone ? `<li><span>Phone</span><a href="tel:${esc(SITE.phone.replace(/\s/g, ''))}">${esc(SITE.phone)}</a></li>` : ''}
              <li><span>Serving</span>${esc(SITE.address)}</li>
            </ul>
            ${wa}
          </div>
          <form id="contact-form" class="panel" novalidate>
            <h2>Send a message</h2>
            <label>Name<input name="name" required autocomplete="name"></label>
            <label>Mobile number<input name="phone" type="tel" inputmode="numeric" maxlength="10" required autocomplete="tel-national"></label>
            <label>Message<textarea name="message" rows="4" required></textarea></label>
            <p class="form-error" hidden></p>
            <button class="btn btn-primary btn-block" type="submit">Send message</button>
          </form>
        </div>
      </section>`;
  }

  function pageNotFound() {
    return `
      <section class="container page">
        <div class="empty">
          <h1>Page not found</h1>
          <p>The property or page you're looking for doesn't exist or has been removed.</p>
          <a href="#/" class="btn btn-primary">Go home</a>
        </div>
      </section>`;
  }

  // ---------- Validation ----------
  const MOBILE = /^[6-9]\d{9}$/;

  function showError(form, msg) {
    const el = $('.form-error', form);
    el.textContent = msg;
    el.hidden = !msg;
  }

  function saveMessage(kind, data) {
    const all = store.get('messages', []);
    all.push(Object.assign({ kind, at: new Date().toISOString() }, data));
    store.set('messages', all);
  }

  function mailtoLink(subject, body) {
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function sentNotice(form, subject, body) {
    form.innerHTML = `
      <div class="success">
        <h3>Thank you!</h3>
        <p>Your message has been recorded. To make sure it reaches us right away, you can also send it by email.</p>
        <a class="btn btn-ghost btn-block" href="${esc(mailtoLink(subject, body))}">Send via email</a>
      </div>`;
  }

  // ---------- Events ----------
  function toggleSave(id) {
    if (saved.has(id)) {
      saved.delete(id);
      toast('Removed from saved');
    } else {
      saved.add(id);
      toast('Saved to your shortlist');
    }
    store.set('saved', Array.from(saved));
    updateSavedCount();
    $$(`[data-save="${CSS.escape(id)}"]`).forEach((btn) => {
      const on = saved.has(id);
      btn.classList.toggle('saved', on);
      btn.setAttribute('aria-pressed', on);
      const label = $('span', btn);
      if (label) label.textContent = on ? 'Saved' : 'Save';
    });
    if (parseRoute().path === '/saved') render();
  }

  function updateSavedCount() {
    const el = $('#saved-count');
    el.textContent = saved.size;
    el.hidden = saved.size === 0;
  }

  function queryFromForm(form, extra) {
    const params = new URLSearchParams();
    new FormData(form).forEach((v, k) => { if (String(v).trim()) params.set(k, String(v).trim()); });
    Object.entries(extra || {}).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k); });
    return params.toString();
  }

  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-save]');
    if (saveBtn) {
      e.preventDefault();
      toggleSave(saveBtn.dataset.save);
      return;
    }
    const delBtn = e.target.closest('[data-delete]');
    if (delBtn) {
      if (!confirm('Delete this listing? This cannot be undone.')) return;
      const id = delBtn.dataset.delete;
      myListings = myListings.filter((p) => p.id !== id);
      store.set('myListings', myListings);
      saved.delete(id);
      store.set('saved', Array.from(saved));
      updateSavedCount();
      toast('Listing deleted');
      location.hash = '#/post';
      return;
    }
    if (e.target.id === 'share-btn') {
      const url = location.href;
      if (navigator.share) {
        navigator.share({ title: document.title, url }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => toast('Link copied'), () => toast(url));
      } else {
        toast(url);
      }
      return;
    }
    if (e.target.closest('.main-nav a')) closeNav();
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    e.preventDefault();

    if (form.id === 'hero-search') {
      location.hash = '#/properties?' + queryFromForm(form);
    } else if (form.id === 'filters') {
      const sort = $('#sort');
      location.hash = '#/properties?' + queryFromForm(form, { sort: sort && sort.value !== 'newest' ? sort.value : '' });
    } else if (form.id === 'enquiry') {
      const d = Object.fromEntries(new FormData(form));
      if (!d.name.trim()) return showError(form, 'Please enter your name.');
      if (!MOBILE.test(d.phone.trim())) return showError(form, 'Please enter a valid 10-digit mobile number.');
      if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) return showError(form, 'Please enter a valid email or leave it blank.');
      const p = findListing(form.dataset.id);
      saveMessage('enquiry', Object.assign({ listingId: p.id }, d));
      sentNotice(form, `Enquiry: ${p.title} (${p.id})`,
        `Name: ${d.name}\nMobile: ${d.phone}\nEmail: ${d.email || '-'}\nSite visit: ${d.visit ? 'Yes' : 'No'}\n\n${d.message}`);
      toast('Enquiry sent');
    } else if (form.id === 'contact-form') {
      const d = Object.fromEntries(new FormData(form));
      if (!d.name.trim()) return showError(form, 'Please enter your name.');
      if (!MOBILE.test(d.phone.trim())) return showError(form, 'Please enter a valid 10-digit mobile number.');
      if (!d.message.trim()) return showError(form, 'Please write a message.');
      saveMessage('contact', d);
      sentNotice(form, 'Message from ' + d.name, `Name: ${d.name}\nMobile: ${d.phone}\n\n${d.message}`);
      toast('Message sent');
    } else if (form.id === 'post-form') {
      submitListing(form);
    }
  });

  function submitListing(form) {
    const fd = new FormData(form);
    const d = Object.fromEntries(fd);
    const required = { title: 'a title', city: 'a city', locality: 'the locality', price: 'the price', area: 'the area' };
    for (const [k, label] of Object.entries(required)) {
      if (!String(d[k] || '').trim()) return showError(form, `Please enter ${label}.`);
    }
    const price = parseFloat(d.price);
    const area = parseFloat(d.area);
    if (!(price > 0)) return showError(form, 'Price must be greater than zero.');
    if (!(area > 0)) return showError(form, 'Area must be greater than zero.');

    const noRooms = d.type === 'Plot' || d.type === 'Commercial';
    const listing = {
      id: 'u' + Date.now().toString(36),
      mine: true,
      title: d.title.trim(),
      purpose: d.purpose,
      type: d.type,
      city: d.city,
      locality: d.locality.trim(),
      price,
      area,
      areaUnit: d.areaUnit,
      beds: noRooms ? 0 : parseInt(d.beds, 10),
      baths: d.type === 'Plot' ? 0 : parseInt(d.baths, 10),
      facing: d.facing,
      status: d.status,
      description: d.description.trim() || 'No description provided.',
      amenities: fd.getAll('amenities'),
      postedOn: new Date().toISOString().slice(0, 10),
    };
    myListings.unshift(listing);
    store.set('myListings', myListings);
    toast('Your property is live!');
    location.hash = '#/property/' + listing.id;
  }

  document.addEventListener('change', (e) => {
    if (e.target.id === 'sort') {
      const { params } = parseRoute();
      if (e.target.value === 'newest') params.delete('sort'); else params.set('sort', e.target.value);
      location.hash = '#/properties?' + params.toString();
    } else if (e.target.form && e.target.form.id === 'filters' && e.target.tagName === 'SELECT') {
      e.target.form.requestSubmit();
    } else if (e.target.form && e.target.form.id === 'post-form') {
      syncPostForm(e.target.form);
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.form && e.target.form.id === 'emi') calcEmi();
  });

  function syncPostForm(form) {
    const rent = form.purpose.value === 'rent';
    $('#price-label').textContent = rent ? 'Monthly rent (₹)' : 'Expected price (₹)';
    const noRooms = form.type.value === 'Plot' || form.type.value === 'Commercial';
    $('#room-fields').classList.toggle('dim', noRooms);
    form.beds.disabled = noRooms;
    form.baths.disabled = form.type.value === 'Plot';
    if (form.type.value === 'Plot') {
      form.areaUnit.value = 'sq yd';
      form.status.value = 'Ready to register';
    }
  }

  // ---------- Mobile nav ----------
  const navToggle = $('.nav-toggle');
  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', open);
  });
  function closeNav() {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  // ---------- Router ----------
  function parseRoute() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const [path, qs = ''] = hash.split('?');
    return { path, params: new URLSearchParams(qs) };
  }

  function setActiveNav(path, params) {
    let key = '';
    if (path === '/properties') {
      if (params.get('type') === 'Plot') key = 'plots';
      else key = params.get('purpose') || '';
    } else {
      key = path.slice(1);
    }
    $$('.main-nav [data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === key));
  }

  const TITLES = { '/': '', '/properties': 'Properties', '/post': 'Post Property', '/saved': 'Saved', '/contact': 'Contact' };

  function render() {
    const { path, params } = parseRoute();
    const app = $('#app');
    let html;
    let title = TITLES[path];
    const detail = path.match(/^\/property\/([\w-]+)$/);
    if (path === '/') html = pageHome();
    else if (path === '/properties') html = pageListings(params);
    else if (detail) {
      html = pageDetail(detail[1]);
      const p = findListing(detail[1]);
      title = p ? p.title : 'Not found';
    } else if (path === '/post') html = pagePost();
    else if (path === '/saved') html = pageSaved();
    else if (path === '/contact') html = pageContact();
    else { html = pageNotFound(); title = 'Not found'; }

    app.innerHTML = html;
    document.title = title ? `${title} | Realaasti` : 'Realaasti — Homes, Plots & Commercial Property';
    setActiveNav(path, params);
    closeNav();
    calcEmi();
    const postForm = $('#post-form');
    if (postForm) syncPostForm(postForm);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // ---------- Init ----------
  $('#year').textContent = new Date().getFullYear();
  $('#footer-cities').innerHTML = CITIES.map((c) => `<a href="#/properties?city=${encodeURIComponent(c)}">${esc(c)}</a>`).join('');
  updateSavedCount();
  window.addEventListener('hashchange', render);
  render();
})();
