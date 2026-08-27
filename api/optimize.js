export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'POST only'});
 const {visits=0,leads=0,meetings=0,contracts=0,spend=0}=req.body||{};
 const leadRate=visits?leads/visits:0, meetingRate=leads?meetings/leads:0, closeRate=meetings?contracts/meetings:0, cac=contracts?spend/contracts:null;
 let priority='TRAFFIC'; let action='SEO・SNS・広告クリエイティブを増やし、質の高い流入を増やす';
 if(visits>=100 && leadRate<0.08){priority='CONVERSION';action='LPの見出し・無料診断CTA・入力項目を改善する'}
 else if(leads>=10 && meetingRate<0.3){priority='NURTURE';action='診断結果と追客シナリオを改善し、相談への移行率を上げる'}
 else if(meetings>=5 && closeRate<0.2){priority='OFFER';action='料金・導入メリット・リスク低減策を改善する'}
 else if(contracts>=1){priority='SCALE';action='最も成約率の高い業界・チャネルへ予算とコンテンツを寄せる'}
 return res.status(200).json({metrics:{visits,leads,meetings,contracts,spend,leadRate:+(leadRate*100).toFixed(1),meetingRate:+(meetingRate*100).toFixed(1),closeRate:+(closeRate*100).toFixed(1),cac},priority,action,nextReview:'7 days'});
}