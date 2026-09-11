// Give the theme its own navigation so it matches the redesign out of the box,
// instead of inheriting whatever the store's Shopify menu happens to contain.
// A setting lets the owner switch back to Shopify menus.
//
// This replaces the INNER CONTENT of whole elements. An earlier version sliced the
// Liquid loops instead and closed an outer loop against an inner loop's endfor, which
// mis-nested the tags and made Shopify reject the section entirely.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const log = [];

/** Find the inner range of an element, honouring nesting of the same tag name. */
function innerRange(src, openMatch, tagName) {
  const start = src.indexOf(openMatch);
  if (start === -1) return null;
  const innerStart = src.indexOf('>', start) + 1;
  const open = new RegExp(`<${tagName}\\b`, 'g');
  const close = new RegExp(`</${tagName}>`, 'g');
  open.lastIndex = innerStart;
  close.lastIndex = innerStart;
  let depth = 1;
  let i = innerStart;
  while (depth > 0) {
    open.lastIndex = i; close.lastIndex = i;
    const o = open.exec(src);
    const c = close.exec(src);
    if (!c) return null;
    if (o && o.index < c.index) { depth++; i = o.index + 1; }
    else { depth--; i = c.index + 1; if (depth === 0) return { innerStart, innerEnd: c.index }; }
  }
  return null;
}

const NAV_LIST = "{%- assign theme_nav = 'Home~/~home,Utilities~/pages/utilities~wrench,About~/pages/about~info,Affiliates~/pages/affiliates~users,Contact~/pages/contact~envelope' | split: ',' -%}";

const activeLogic = [
  "{%- assign bits = entry | split: '~' -%}",
  '{%- assign t_title = bits[0] -%}',
  '{%- assign t_url = bits[1] -%}',
  '{%- assign t_icon = bits[2] -%}',
  '{%- assign is_active = false -%}',
  "{%- if t_url == '/' -%}",
  "  {%- if request.path == '/' -%}{%- assign is_active = true -%}{%- endif -%}",
  '{%- else -%}',
  '  {%- if request.path contains t_url -%}{%- assign is_active = true -%}{%- endif -%}',
  '{%- endif -%}',
].join('\n            ');

/* ---------------- header ---------------- */
const hp = path.join(ROOT, 'shopify-theme/sections/header.liquid');
let h = fs.readFileSync(hp, 'utf8');

if (!h.includes('theme_nav')) {
  h = h.replace("{%- assign nav_menu = linklists['main-menu'] -%}", NAV_LIST + "\n{%- assign nav_menu = linklists['main-menu'] -%}");

  // desktop tabs
  const tabs = innerRange(h, '<div class="tab-container nav-pill compact">', 'div');
  if (!tabs) { console.error('tab-container not found'); process.exit(1); }
  const tabsOriginal = h.slice(tabs.innerStart, tabs.innerEnd);
  const tabsNew = `
      {%- if section.settings.use_theme_nav -%}
        {%- for entry in theme_nav -%}
            ${activeLogic}
            <a class="nav-tab{% if is_active %} active{% endif %}" href="{{ t_url }}"{% if is_active %} aria-current="page"{% endif %}><span class="icon-wrapper">{% render 'icon', name: t_icon %}</span><span>{{ t_title }}</span><span class="active-tab-underline" aria-hidden="true"></span></a>
        {%- endfor -%}
      {%- else -%}${tabsOriginal}{%- endif -%}
    `;
  h = h.slice(0, tabs.innerStart) + tabsNew + h.slice(tabs.innerEnd);
  log.push('desktop tabs wrapped');

  // mobile drawer
  const drawer = innerRange(h, '<nav class="mobile-menu glass-card" id="mobile-menu"', 'nav');
  if (drawer) {
    const drawerOriginal = h.slice(drawer.innerStart, drawer.innerEnd);
    const drawerNew = `
      {%- if section.settings.use_theme_nav -%}
        {%- for entry in theme_nav -%}
            ${activeLogic}
            <a class="mobile-menu-item{% if is_active %} active{% endif %}" href="{{ t_url }}"{% if is_active %} aria-current="page"{% endif %}>{% render 'icon', name: t_icon %}<span>{{ t_title }}</span></a>
        {%- endfor -%}
      {%- else -%}${drawerOriginal}{%- endif -%}
    `;
    h = h.slice(0, drawer.innerStart) + drawerNew + h.slice(drawer.innerEnd);
    log.push('mobile drawer wrapped');
  } else log.push('mobile drawer NOT FOUND');

  // setting, inserted into the section's own settings array
  const schemaAt = h.indexOf('{% schema %}') > -1 ? h.indexOf('{% schema %}') : h.indexOf('{%- schema -%}');
  const settingsAt = h.indexOf('"settings"', schemaAt);
  const bracketAt = h.indexOf('[', settingsAt) + 1;
  const setting = `
      {
        "type": "checkbox",
        "id": "use_theme_nav",
        "label": "Use the theme's own navigation",
        "info": "On: Home, Utilities, About, Affiliates and Contact, matching the redesign. Off: use the Shopify menu chosen below.",
        "default": true
      },`;
  h = h.slice(0, bracketAt) + setting + h.slice(bracketAt);
  fs.writeFileSync(hp, h);
  log.push('header setting added');
}

/* ---------------- footer ---------------- */
const fp = path.join(ROOT, 'shopify-theme/sections/footer.liquid');
let f = fs.readFileSync(fp, 'utf8');
if (!f.includes('theme_nav')) {
  const navCol = innerRange(f, '<nav class="footer-nav"', 'nav');
  if (navCol) {
    const original = f.slice(navCol.innerStart, navCol.innerEnd);
    const replacement = `
          {%- assign theme_nav = 'Home~/,Utilities~/pages/utilities,About~/pages/about,Affiliates~/pages/affiliates,Contact~/pages/contact' | split: ',' -%}
          {%- if section.settings.use_theme_nav -%}
            {%- for entry in theme_nav -%}
              {%- assign bits = entry | split: '~' -%}
              <a class="nav-link" href="{{ bits[1] }}">{{ bits[0] }}</a>
            {%- endfor -%}
          {%- else -%}${original}{%- endif -%}
        `;
    f = f.slice(0, navCol.innerStart) + replacement + f.slice(navCol.innerEnd);
    const schemaAt = f.indexOf('{% schema %}') > -1 ? f.indexOf('{% schema %}') : f.indexOf('{%- schema -%}');
    const settingsAt = f.indexOf('"settings"', schemaAt);
    const bracketAt = f.indexOf('[', settingsAt) + 1;
    f = f.slice(0, bracketAt) + `
      {
        "type": "checkbox",
        "id": "use_theme_nav",
        "label": "Use the theme's own navigation",
        "info": "On: the redesign's links. Off: use the Shopify menu chosen below.",
        "default": true
      },` + f.slice(bracketAt);
    fs.writeFileSync(fp, f);
    log.push('footer nav wrapped + setting');
  } else log.push('footer nav NOT FOUND');
}

console.log(log.join(' | '));
