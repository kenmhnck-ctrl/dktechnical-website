import crypto from 'node:crypto';
function safe(v){return String(v||'').toLowerCase().replace(/[^a-z0-9_-]/g,'-').slice(0,80)}
function keys(){try{return JSON.parse(process.env.ORDNIX_TENANT_KEYS||'{}')}catch{return {}}}
function timingEqual(a,b){const aa=Buffer.from(String(a||'')),bb=Buffer.from(String(b||''));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
export function authenticate(req){const map=keys(),configured=Object.keys(map).length>0; if(!configured)return{ok:false,status:503,error:'AUTH_NOT_CONFIGURED'};const h=String(req.headers?.authorization||''),token=h.startsWith('Bearer ')?h.slice(7).trim():'';if(!token)return{ok:false,status:401,error:'AUTH_REQUIRED'};for(const [tenant,key] of Object.entries(map)){if(key&&timingEqual(token,key))return{ok:true,tenant:safe(tenant)}}return{ok:false,status:403,error:'INVALID_CREDENTIALS'}}
export function enforceTenant(req,res){const a=authenticate(req);if(!a.ok){res.status(a.status).json({error:a.error});return null}req.body={...(req.body||{}),tenant:a.tenant};return a}
export function authConfigured(){return Object.keys(keys()).length>0}
