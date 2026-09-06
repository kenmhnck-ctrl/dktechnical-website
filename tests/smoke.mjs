import core from '../api/core.js';
import automation from '../api/automation.js';
function call(fn,action,body={}){return new Promise((resolve,reject)=>{const req={method:'POST',query:{action},body};const res={statusCode:200,status(c){this.statusCode=c;return this},json(x){this.statusCode>=400?reject(new Error(JSON.stringify(x))):resolve(x)}};Promise.resolve(fn(req,res)).catch(reject)})}
const p={company:'株式会社DKテクニカル',industry:'建設・設備',region:'全国',service:'空調工事・設備工事',target:'法人・店舗・施設',goal:'問い合わせ増加'};
const d=await call(core,'diagnose',{...p,channel:'ホームページ',problem:'問い合わせが少ない'});if(!(d.score>0&&d.actions?.length>=3))throw Error('diagnose');
const plan=await call(core,'plan',p);if(plan.days!==90||plan.weeks?.length!==12)throw Error('plan');
const a=await call(core,'autopilot',p);if(a.mode!=='ORDNIX_AUTOPILOT'||a.today?.length<5)throw Error('autopilot');
const c=await call(core,'content',p);if(!c.assets)throw Error('content');
const f=await call(core,'followup',{...p,stage:'new'});if(f.sequence?.length!==4)throw Error('followup');
const o=await call(core,'optimize',{visits:200,leads:18,meetings:6,contracts:1});if(!o.priority||!o.action)throw Error('optimize');
const ap=await call(core,'approval',{assetId:'test',action:'approve'});if(!ap.publishEligibility)throw Error('approval');
const q=await call(automation,'scheduler',{assetId:'test',approved:true,channel:'SEO'});if(q.status!=='QUEUED')throw Error('scheduler');
const g=await call(automation,'guard',{channel:'email',approved:false,connected:false,consent:false});if(g.allowed)throw Error('guard');
const ad=await call(core,'ai_diagnose',p);if(!(ad.summary||ad.insights))throw Error('ai_diagnose');
const aiPlan=await call(core,'ai_plan',p);if(!(aiPlan.strategy||aiPlan.priorities))throw Error('ai_plan');
const aiContent=await call(core,'ai_content',p);if(!(aiContent.seoTitle||aiContent.social))throw Error('ai_content');
const r=await call(core,'readiness',{});if(typeof r.database!=='boolean'||typeof r.aiAuth!=='boolean')throw Error('readiness');
console.log('ORDNIX SMOKE TEST: PASS 13/13');