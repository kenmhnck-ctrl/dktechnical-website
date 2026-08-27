export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'POST only'});
 const {assetId='asset-demo',action='approve',note=''}=req.body||{};
 if(!['approve','reject','revise'].includes(action)) return res.status(400).json({error:'invalid action'});
 const status=action==='approve'?'APPROVED':action==='reject'?'REJECTED':'REVISION_REQUESTED';
 return res.status(200).json({assetId,status,note,publishEligibility:status==='APPROVED',timestamp:new Date().toISOString()});
}