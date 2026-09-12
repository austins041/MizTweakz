# Password reset is broken. Here is the one-line fix.

**Who needs this:** whoever owns the Cloudflare account behind
`miztweakz-auth.miztweakz.workers.dev` (workers.dev subdomain `miztweakz`).
Mason's two accounts do not have it, so he cannot deploy this himself.

**File:** `backend/auth-worker.js`, function `performReset` (~line 353)

## The bug

`hashPassword()` returns an object, `{ hash, salt }`. `performReset` bound that
whole object as `pw_hash`:

```js
const salt = bytesToB64(crypto.getRandomValues(new Uint8Array(16)));
await env.DB.prepare("UPDATE users SET pw_hash=?, pw_salt=? WHERE id=?")
  .bind(await hashPassword(password, salt), salt, userId).run();   // <-- object, not string
```

D1 rejects an object bind, so `performReset` throws and returns **500**. The
password is never written. And because `consumeToken` burns the reset token on
the line above, the link is already spent, so every fresh link fails the same
way. The account is locked out permanently.

`signup` and `login` both destructure correctly. This was the only bad call site.

## The fix

```js
const { hash, salt } = await hashPassword(password);
await env.DB.prepare("UPDATE users SET pw_hash=?, pw_salt=? WHERE id=?")
  .bind(hash, salt, userId).run();
```

## Deploy

```bash
cd backend
npx wrangler deploy --config wrangler.auth.toml
```

## Proof this is the bug

Run against the live worker with a disposable inbox, before the fix:

| step | result |
| --- | --- |
| signup | ok |
| verification email | arrived in 2s |
| reset email | arrived in 2s |
| `POST /password/reset` with the **real** token | **500** |
| login with the **new** password | 401 bad_credentials |
| login with the **old** password | 200 ok |

Email delivery is fine and was never the problem.

Note: testing with a fake token proves nothing. `invalid_or_expired` returns
before the broken line ever runs, which is how this survived earlier testing.

## Also worth fixing while you are in there

`consumeToken` burns the token before the UPDATE runs, so any future failure in
that UPDATE still costs the user their link. Consuming it only after a
successful write would make resets safely retryable.

## Leftover

A diagnostic account is sitting in D1 from the test above: `mtzmtyp5bmh@uberip.com`.
Safe to delete.
