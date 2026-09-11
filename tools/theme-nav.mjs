// Give the theme its own navigation so it matches the redesign out of the box,
// instead of inheriting whatever the store's Shopify menu happens to contain.
// A setting lets the owner switch back to Shopify menus later.
import fs from 'node:fs';
import path from 'node:path';
const T = path.resolve(import.meta.dirname, '../shopify-theme');
const log = [];

/* ---------- header ---------- */
const hp = path.join(T, 'sections/header.liquid');
let h = fs.readFileSync(hp, 'utf8');

// The redesign's nav. url_key is resolved against real page handles at render time.
const NAV = `{%- comment -%} The redesign's own navigation, used unless the owner opts into Shopify menus. {%- endcomment -%}
{%- assign theme_nav = 'Home~/~home,Utilities~/pages/utilities~wrench,About~/pages/about~info,Affiliates~/pages/affiliates~users,Contact~/pages/contact~envelope' | split: ',' -%}
`;
if (!h.includes('theme_nav')) {
  h = h.replace(/(\{%- assign nav_menu = linklists\['main-menu'\] -%\})/, NAV + '$1');
  log.push('nav list added');
}

// desktop tabs
const desktopOpen = '<div class="tab-container nav-pill compact">';
const iDesk = h.indexOf(desktopOpen);
if (iDesk > -1 && !h.includes('use_theme_nav')) {
  const after = iDesk + desktopOpen.length;
  const loopStart = h.indexOf('{%- for link in nav_menu.links -%}', after);
  // find the matching endfor for this loop
  const loopEnd = h.indexOf('{%- endfor -%}', loopStart) + '{%- endfor -%}'.length;
  const original = h.slice(loopStart, loopEnd);
  const themeBlock = `{%- if section.settings.use_theme_nav -%}
        {%- for entry in theme_nav -%}
          {%- assign bits = entry | split: '~' -%}
          {%- assign t_title = bits[0] -%}
          {%- assign t_url = bits[1] -%}
          {%- assign t_icon = bits[2] -%}
          {%- assign is_active = false -%}
          {%- if t_url == '/' and request.path == '/' -%}{%- assign is_active = true -%}{%- endif -%}
          {%- if t_url != '/' and request.path contains t_url -%}{%- assign is_active = true -%}{%- endif -%}
          <a class="nav-tab{% if is_active %} active{% endif %}" href="{{ t_url }}"{% if is_active %} aria-current="page"{% endif %}><span class="icon-wrapper">{% render 'icon', name: t_icon %}</span><span>{{ t_title }}</span><span class="active-tab-underline" aria-hidden="true"></span></a>
        {%- endfor -%}
      {%- else -%}
        ${original}
      {%- endif -%}`;
  h = h.slice(0, loopStart) + themeBlock + h.slice(loopEnd);
  log.push('desktop tabs wrapped');
}

// mobile drawer
const mobileOpen = 'id="mobile-menu"';
const iMob = h.indexOf(mobileOpen);
if (iMob > -1) {
  const loopStart = h.indexOf('{%- for link in nav_menu.links -%}', iMob);
  if (loopStart > -1) {
    const loopEnd = h.indexOf('{%- endfor -%}', loopStart) + '{%- endfor -%}'.length;
    const original = h.slice(loopStart, loopEnd);
    const themeBlock = `{%- if section.settings.use_theme_nav -%}
      {%- for entry in theme_nav -%}
        {%- assign bits = entry | split: '~' -%}
        {%- assign t_title = bits[0] -%}
        {%- assign t_url = bits[1] -%}
        {%- assign t_icon = bits[2] -%}
        {%- assign is_active = false -%}
        {%- if t_url == '/' and request.path == '/' -%}{%- assign is_active = true -%}{%- endif -%}
        {%- if t_url != '/' and request.path contains t_url -%}{%- assign is_active = true -%}{%- endif -%}
        <a class="mobile-menu-item{% if is_active %} active{% endif %}" href="{{ t_url }}"{% if is_active %} aria-current="page"{% endif %}>{% render 'icon', name: t_icon %}<span>{{ t_title }}</span></a>
      {%- endfor -%}
    {%- else -%}
      ${original}
    {%- endif -%}`;
    h = h.slice(0, loopStart) + themeBlock + h.slice(loopEnd);
    log.push('mobile drawer wrapped');
  }
}

// schema setting
h = h.replace(/("settings"\s*:\s*\[)/, `$1
      {
        "type": "checkbox",
        "id": "use_theme_nav",
        "label": "Use the theme's own navigation",
        "info": "On: Home, Utilities, About, Affiliates and Contact, matching the redesign. Off: use the Shopify menu chosen below.",
        "default": true
      },`);
log.push('header setting added');
fs.writeFileSync(hp, h);

/* ---------- footer: same idea for the Navigate column ---------- */
const fp = path.join(T, 'sections/footer.liquid');
let f = fs.readFileSync(fp, 'utf8');
if (!f.includes('theme_nav')) {
  const loopStart = f.indexOf('{%- for link in');
  if (loopStart > -1) {
    const loopEnd = f.indexOf('{%- endfor -%}', loopStart) + '{%- endfor -%}'.length;
    const original = f.slice(loopStart, loopEnd);
    const block = `{%- assign theme_nav = 'Home~/,Utilities~/pages/utilities,About~/pages/about,Affiliates~/pages/affiliates,Contact~/pages/contact' | split: ',' -%}
      {%- if section.settings.use_theme_nav -%}
        {%- for entry in theme_nav -%}
          {%- assign bits = entry | split: '~' -%}
          <a class="nav-link" href="{{ bits[1] }}">{{ bits[0] }}</a>
        {%- endfor -%}
      {%- else -%}
        ${original}
      {%- endif -%}`;
    f = f.slice(0, loopStart) + block + f.slice(loopEnd);
    f = f.replace(/("settings"\s*:\s*\[)/, `$1
      {
        "type": "checkbox",
        "id": "use_theme_nav",
        "label": "Use the theme's own navigation",
        "info": "On: the redesign's links. Off: use the Shopify menu chosen below.",
        "default": true
      },`);
    fs.writeFileSync(fp, f);
    log.push('footer wrapped');
  }
}
console.log(log.join(' | '));
