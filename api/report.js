export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'POST only'});
 const {company='御社',period='今週',visits=0,leads=0,meetings=0,contracts=0,contentPublished=0,followups=0}=req.body||{};
 const leadRate=visits?+(leads/visits*100).toFixed(1):0;
 const meetingRate=leads?+(meetings/leads*100).toFixed(1):0;
 const closeRate=meetings?+(contracts/meetings*100).toFixed(1):0;
 return res.status(200).json({company,period,kpis:{visits,leads,meetings,contracts,leadRate,meetingRate,closeRate,contentPublished,followups},summary:`${period}はコンテンツ${contentPublished}件、追客${followups}件を実行。問い合わせ率は${leadRate}%、商談化率は${meetingRate}%です。`,nextFocus:leadRate<8?'LPと集客入口の改善':meetingRate<30?'診断結果と追客の改善':closeRate<20?'オファーと導入説明の改善':'勝ちチャネルへ集中'});
}