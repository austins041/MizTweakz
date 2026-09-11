// URGENT FIX: Basic and Ultimate are subscription products. Their variants carry
// requires_selling_plan = true, so adding them to the cart without a selling_plan
// fails with "Cart Error: Variant can only be purchased with a selling plan."
// The product form now posts a selling_plan whenever the product has plans.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const tpl = path.join(ROOT, 'shopify-theme/templates/product.liquid');
let s = fs.readFileSync(tpl, 'utf8');

if (s.includes('selling_plan')) { console.log('already patched'); process.exit(0); }

const anchor = `          <div class="commerce-field">
            <label class="form-label" for="commerce-quantity">Quantity</label>`;
if (!s.includes(anchor)) { console.error('anchor not found'); process.exit(1); }

const block = `          {%- if product.selling_plan_groups.size > 0 -%}
            {%- assign requires_plan = current_variant.requires_selling_plan -%}
            <div class="commerce-field">
              <label class="form-label" for="commerce-selling-plan">Billing</label>
              <select class="form-select" name="selling_plan" id="commerce-selling-plan">
                {%- unless requires_plan -%}
                  <option value="">One time purchase</option>
                {%- endunless -%}
                {%- for group in product.selling_plan_groups -%}
                  {%- for plan in group.selling_plans -%}
                    <option value="{{ plan.id }}"{% if forloop.first and requires_plan %} selected{% endif %}>{{ plan.name | escape }}</option>
                  {%- endfor -%}
                {%- endfor -%}
              </select>
            </div>
          {%- endif -%}

`;

s = s.replace(anchor, block + anchor);
fs.writeFileSync(tpl, s);
console.log('selling plan field added:', s.includes('name="selling_plan"'));
