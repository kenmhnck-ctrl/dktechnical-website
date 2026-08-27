import diagnose from '../api/diagnose.js';import plan from '../api/plan.js';import autopilot from '../api/autopilot.js';import content from '../api/content.js';import followup from '../api/followup.js';import optimize from '../api/optimize.js';
function call(fn,body={}){return new Promise((resolve,reject)=>{const req={method:'POST',body};const res={statusCode:200,status(c){this.statusCode=c;return this},json(x){this.statusCode>=400?reject(new Error(JSON.stringify(x))):resolve(x)}};Promise.resolve(fn(req,res)).catch(reject)})}
const profile={company:'株式会社DKテクニカル',industry:'建設・設備',region:'全国',service:'空調工事・設備工事',target:'法人・店舗・施設',goal:'問い合わせ増加'};
const d=await call(diagnose,{...profile,channel:'ホームページ',problem:'問い合わせが少ない'});if(!(d.score>0&&d.actions?.length>=3))throw new Error('diagnose failed');
const p=await call(plan,profile);if(p.days!==90||p.weeks?.length!==12)throw new Error('plan failed');
const a=await call(autopilot,profile);if(a.mode!=='ORDNIX_AUTOPILOT'||a.today?.length<5)throw new Error('autopilot failed');
const c=await call(content,profile);if(!c.assets)throw new Error('content failed');
const f=await call(followup,{company:profile.company,industry:profile.industry,stage:'new',interest:profile.goal});if(!f.sequence?.length)throw new Error('followup failed');
const o=await call(optimize,{visits:200,leads:18,meetings:6,contracts:1,spend:10000});if(!o.priority||!o.action)throw new Error('optimize failed');
console.log('ORDNIX SMOKE TEST: PASS');