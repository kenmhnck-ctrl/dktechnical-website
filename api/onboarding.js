export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'POST only'});
 const b=req.body||{};
 const profile={company:b.company||'',industry:b.industry||'その他',region:b.region||'全国',service:b.service||'',target:b.target||'',avgTicket:Number(b.avgTicket||0),monthlyGoal:Number(b.monthlyGoal||0),website:b.website||'',sns:b.sns||[]};
 const readiness=[profile.company,profile.service,profile.target].filter(Boolean).length;
 return res.status(200).json({profile,setupScore:Math.round(readiness/3*100),next:['無料診断','90日プラン生成','AUTOPILOT初期化'],status:readiness===3?'READY':'NEEDS_INPUT'});
}