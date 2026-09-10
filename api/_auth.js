import crypto from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';
const DEFAULT_JWKS='https://ep-falling-cell-arwoxg24.neonauth.c-4.us-west-2.aws.neon.tech/neondb/auth/.well-known/jwks.json';
function safe(v){return String(v||'').toLowerCase().replace(/[^a-z0-9_-]/g,'-').slice(0,80)}
function keys(){try{return JSON.parse(process.env.ORDNIX_TENANT_KEYS||'{}')}catch{return {}}}
function timingEqual(a,b){const aa=Buffer.from(String(a||'')),bb=Buffer.from(String(b||''));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
function bearer(req){const h=String(req.headers?.authorization||'');return h.startsWith('Bearer ')?h.slice(7).trim():''}
function db(){return process.env.DATABASE_URL?neon(process.env.DATABASE_URL):null}
async function jwtAuth(token,requestedTenant){const sql=db();if(!sql)return null;try{const jwks=createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL||DEFAULT_JWKS));const {payload}=await jwtVerify(token,jwks,{clockTolerance:5});const userId=String(payload.sub||'');if(!userId)return null;const t=safe(requestedTenant);if(t){const rows=await sql`SELECT tenant_id,role FROM tenant_members WHERE auth_user_id=${userId} AND tenant_id=${t} LIMIT 1`;if(rows.length)return{ok:true,userId,tenant:t,role:String(rows[0].role||'member'),mode:'JWT'}}const rows=await sql`SELECT tenant_id,role FROM tenant_members WHERE auth_user_id=${userId} ORDER BY created_at ASC LIMIT 1`;if(rows.length)return{ok:true,userId,tenant:safe(rows[0].tenant_id),role:String(rows[0].role||'member'),mode:'JWT'};return{ok:false,status:403,error:'TENANT_MEMBERSHIP_REQUIRED'}}catch{return null}}
function legacyAuth(token){if(process.env.ORDNIX_ALLOW_LEGACY_KEYS!=='true')return null;for(const [tenant,key] of Object.entries(keys()))if(key&&timingEqual(token,key))return{ok:true,tenant:safe(tenant),role:'admin',mode:'LEGACY'};return null}
export async function authenticate(req){const token=bearer(req);if(!token)return{ok:false,status:401,error:'AUTH_REQUIRED'};const requested=req.body?.tenant||req.headers?.['x-ordnix-tenant'];const jwt=await jwtAuth(token,requested);if(jwt)return jwt;const legacy=legacyAuth(token);if(legacy)return legacy;return{ok:false,status:403,error:'INVALID_CREDENTIALS'}}
export async function enforceTenant(req,res,{roles}={}){const a=await authenticate(req);if(!a.ok){res.status(a.status).json({error:a.error});return null}if(Array.isArray(roles)&&roles.length&&!roles.includes(a.role)){res.status(403).json({error:'INSUFFICIENT_ROLE'});return null}req.body={...(req.body||{}),tenant:a.tenant};req.ordnixAuth=a;return a}
export function authConfigured(){return !!process.env.DATABASE_URL||Object.keys(keys()).length>0}
