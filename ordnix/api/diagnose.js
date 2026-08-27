import { neon } from '@neondatabase/serverless';
import { generateText } from 'ai';

const sql = neon(process.env.DATABASE_URL);
const playbooks = {
  '建設・設備':['施工事例SEO','Google検索・マップ','見積後の追客'],
  '医療・クリニック':['地域検索対策','診療内容コンテンツ','予約導線改善'],
  '美容・サロン':['SNS短尺発信','予約導線','再来店フォロー'],
  '士業・コンサル':['専門記事SEO','相談CTA','見込み客育成'],
  '不動産':['物件・地域コンテンツ','査定・来店CTA','追客シナリオ'],
  '自動車・整備':['車検・整備SEO','査定CTA','定期フォロー'],
  '飲食・店舗':['Googleマップ','SNS発信','再来店施策'],
  'その他':['検索導線','SNS発信','追客設計']
};
function score(channel,problem){let n=55;if(channel==='ほぼ何もしていない')n-=10;if(problem==='追客できていない')n-=8;if(channel==='紹介中心')n-=5;if(channel==='広告')n+=7;if(channel==='SNS'||channel==='ホームページ')n+=5;return Math.max(28,Math.min(82,n))}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false});
  try{
    const {company,email,industry,channel,problem,website=''}=req.body||{};
    if(!company||!email||!industry||!channel||!problem) return res.status(400).json({ok:false,error:'missing_fields'});
    const diagnosisScore=score(channel,problem), actions=playbooks[industry]||playbooks['その他'];
    let summary=`${company}は現在「${channel}」が中心で、主な課題は「${problem}」。まずは「${actions[0]}」「${actions[1]}」「${actions[2]}」を優先してください。`;
    try{const ai=await generateText({model:'openai/gpt-5.4',prompt:`中小企業向け集客診断を日本語で120〜180文字。会社:${company} 業種:${industry} 集客:${channel} 課題:${problem} スコア:${diagnosisScore}/100`});if(ai?.text)summary=ai.text.trim()}catch{}
    const diagnosis={score:diagnosisScore,summary,actions,channel,problem};
    await sql`INSERT INTO leads (company_name,industry,email,website,challenge,diagnosis,status,source) VALUES (${company},${industry},${email},${website},${problem},${JSON.stringify(diagnosis)},'new','ordnix_lp')`;
    return res.status(200).json({ok:true,...diagnosis});
  }catch(error){console.error(error);return res.status(500).json({ok:false,error:'server_error'})}
}
