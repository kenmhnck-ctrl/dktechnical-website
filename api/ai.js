const GATEWAY='https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL=process.env.AI_MODEL||'openai/gpt-5-mini';

function fallback(type,b){
 const company=(b.company||'御社').trim(),industry=b.industry||'その他',region=b.region||'全国',service=b.service||'サービス',goal=b.goal||'問い合わせを増やす';
 if(type==='diagnose') return {mode:'FALLBACK',summary:`${company}は${industry}の特性に合わせ、${region}での検索流入・問い合わせ導線・追客を一体で改善するのが優先です。`,insights:['新規流入の再現性を作る','問い合わせ導線を短くする','反応別の追客を標準化する'],nextActions:['検索テーマを10件設計','事例コンテンツを1本作成','24時間・3日・7日の追客を準備']};
 if(type==='plan') return {mode:'FALLBACK',strategy:`${goal}に向けて、1〜30日で基盤、31〜60日で流入、61〜90日で成約率を改善します。`,priorities:['計測とCTA整備','勝ちチャネルへ集中','追客とオファー改善']};
 return {mode:'FALLBACK',seoTitle:`${region}の${industry}｜${service}なら${company}`,social:[`${region}で${service}をご検討中の方へ。比較時のポイントと実績をご案内します。`,`${service}は価格だけでなく、対応範囲・実績・アフターフォローも確認しましょう。`,`まずは現状の課題整理から。${company}がご相談を承ります。`],followup:`お問い合わせありがとうございます。${service}について、ご状況に合わせた進め方をご案内します。`};
}

function system(type){return `あなたはORDNIXのAI集客戦略エンジンです。日本の中小企業向けに、誇張や保証をせず、実行可能で具体的な提案を作ります。個人情報を推測しません。無差別営業や迷惑送信を推奨しません。外部公開・送信は人間の承認が必要です。必ず有効なJSONだけを返してください。タスク種別:${type}`}
function prompt(type,b){return JSON.stringify({task:type,company:b.company||'',industry:b.industry||'その他',region:b.region||'全国',service:b.service||'サービス',target:b.target||'',goal:b.goal||'問い合わせを増やす',currentChannel:b.channel||'',problem:b.problem||'',instruction:type==='diagnose'?'summary, insights(3), nextActions(3) を返す':type==='plan'?'strategy, priorities(3), risks(2) を返す':'seoTitle, seoDescription, social(3), googlePost, followup を返す'},null,2)}

export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const b=req.body||{},type=(req.query||{}).action||b.action||'content';
 if(!['diagnose','plan','content'].includes(type))return res.status(400).json({error:'unknown AI action'});
 const key=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
 if(!key)return res.status(200).json({...fallback(type,b),ai:{enabled:false,reason:'AI_GATEWAY_NOT_CONFIGURED'}});
 try{
  const r=await fetch(GATEWAY,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,messages:[{role:'system',content:system(type)},{role:'user',content:prompt(type,b)}],temperature:.35,response_format:{type:'json_object'}})});
  if(!r.ok)throw new Error(`gateway_${r.status}`);
  const j=await r.json();let text=j?.choices?.[0]?.message?.content||'{}';text=text.replace(/^```json\s*/i,'').replace(/```$/,'').trim();
  const data=JSON.parse(text);return res.status(200).json({...data,ai:{enabled:true,model:MODEL,provider:'VERCEL_AI_GATEWAY',humanApprovalRequired:true}});
 }catch(e){return res.status(200).json({...fallback(type,b),ai:{enabled:false,reason:'AI_FALLBACK',detail:String(e.message||e)}})}
}