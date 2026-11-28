// One entry point for /api/*. Routes are listed here so the whole API reads in one place.
import type { Env } from './env';
import { HttpError, checkOrigin, errorResponse, json } from './http';
import { type Ctx, loadSession } from './session';
import * as auth from './auth';
import * as account from './account';
import * as contrib from './contrib';
import * as forum from './forum';
import * as mod from './moderation';
import * as votes from './votes';

type Handler = (ctx: Ctx, ...params: string[]) => Promise<unknown>;
const routes: [string, RegExp, Handler][] = [];
const on = (method: string, path: string, h: Handler) => routes.push([method, new RegExp(`^${path.replace(/:\w+/g, '([a-z0-9_-]+)')}$`, 'i'), h]);

on('GET', '/api/me', account.me);
// Sign in and sign up
on('POST', '/api/auth/passkey/register/options', auth.passkeyRegisterOptions);
on('POST', '/api/auth/passkey/register/verify', auth.passkeyRegisterVerify);
on('POST', '/api/auth/passkey/login/options', auth.passkeyLoginOptions);
on('POST', '/api/auth/passkey/login/verify', auth.passkeyLoginVerify);
on('POST', '/api/auth/email/start', auth.emailStart);
on('POST', '/api/auth/email/verify', auth.emailVerify);
on('POST', '/api/auth/complete-signup', auth.completeSignup);
on('GET', '/api/auth/google/start', auth.googleStart);
on('GET', '/api/auth/google/callback', auth.googleCallback);
on('GET', '/api/auth/microsoft/start', auth.microsoftStart);
on('GET', '/api/auth/microsoft/callback', auth.microsoftCallback);
on('POST', '/api/auth/signout', account.signOut);
on('POST', '/api/auth/signout-everywhere', account.signOutEverywhere);
// Your account
on('POST', '/api/account/profile', account.updateProfile);
on('GET', '/api/account/security', account.security);
on('DELETE', '/api/account/passkeys/:id', (c, id) => auth.removePasskey(c, id!));
on('DELETE', '/api/account/sessions/:id', (c, id) => account.endOtherSession(c, id!));
on('DELETE', '/api/account/email', account.removeEmail);
on('DELETE', '/api/account/identities/:provider', (c, p) => account.unlinkIdentity(c, p!));
on('POST', '/api/account/claim-admin', auth.claimAdmin);
on('GET', '/api/account/export', account.exportData);
on('POST', '/api/account/delete', account.deleteAccount);
on('GET', '/api/account/contributions', contrib.myContributions);
// Lists
on('GET', '/api/lists', account.getLists);
on('POST', '/api/lists', account.setListItem);
on('POST', '/api/lists/merge', account.mergeLists);
// Votes (thumbs up and down on records)
on('GET', '/api/votes', votes.read);
on('POST', '/api/votes', votes.cast);
// Suggestions and uploads
on('POST', '/api/suggestions', contrib.createSuggestion);
on('GET', '/api/uploads', contrib.listUploads);
on('POST', '/api/uploads', contrib.createUpload);
on('GET', '/api/uploads/:id', (c, id) => contrib.getUpload(c, id!));
on('DELETE', '/api/uploads/:id', (c, id) => contrib.withdrawUpload(c, id!));
on('PUT', '/api/uploads/:id/file', (c, id) => contrib.putUploadFile(c, id!));
on('GET', '/api/uploads/:id/file', (c, id) => contrib.getUploadFile(c, id!));
// Forums
on('GET', '/api/forum/categories', forum.categories);
on('GET', '/api/forum/topics', forum.listTopics);
on('POST', '/api/forum/topics', forum.createTopic);
on('GET', '/api/forum/topics/:id', (c, id) => forum.getTopic(c, id!));
on('POST', '/api/forum/topics/:id/posts', (c, id) => forum.createPost(c, id!));
on('PATCH', '/api/forum/posts/:id', (c, id) => forum.editPost(c, id!));
on('DELETE', '/api/forum/posts/:id', (c, id) => forum.deletePost(c, id!));
on('POST', '/api/reports', forum.report);
on('GET', '/api/members/:handle', (c, h) => forum.profile(c, h!));
// Moderation
on('GET', '/api/mod/queue', mod.queue);
on('POST', '/api/mod/action', mod.act);
on('GET', '/api/mod/members', mod.findMember);
on('GET', '/api/mod/log', mod.auditLog);
on('GET', '/api/mod/votes', votes.alerts);
on('POST', '/api/mod/votes', votes.decide);
on('GET', '/api/mod/votes/removals', votes.removals);
on('POST', '/api/takedowns', mod.createTakedown);

export async function handle(req: Request, env: Env, waitUntil?: (p: Promise<unknown>) => void): Promise<Response> {
  const ctx: Ctx = { env, req, user: null, sessionHash: null, setCookies: [], waitUntil };
  let res: Response;
  try {
    const url = new URL(req.url);
    const match = routes.find(([m, re]) => m === req.method && re.test(url.pathname));
    if (!match) {
      const exists = routes.some(([, re]) => re.test(url.pathname));
      throw new HttpError(exists ? 405 : 404, exists ? 'method_not_allowed' : 'not_found');
    }
    if (!env.DB) {
      // Accounts aren't set up on this deployment yet: say so plainly, so pages can fall back.
      if (url.pathname === '/api/me') return json({ user: null, config: { features: { accounts: false } } });
      throw new HttpError(503, 'not_configured', 'Accounts are not switched on for this version of the site yet.');
    }
    checkOrigin(req);
    await loadSession(ctx);
    const out = await match[2](ctx, ...(match[1].exec(url.pathname)!.slice(1)));
    res = out instanceof Response ? new Response(out.body, out) : json(out);
  } catch (e) {
    res = errorResponse(e);
  }
  for (const c of ctx.setCookies) res.headers.append('Set-Cookie', c);
  return res;
}
