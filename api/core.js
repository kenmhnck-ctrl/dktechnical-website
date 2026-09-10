import core from '../lib/core.js';
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'POST_ONLY'});
  const action=(req.query&&req.query.action)||(req.body&&req.body.action)||'';
  if(action!=='diagnose')return res.status(404).json({error:'NOT_FOUND'});
  req.body={...(req.body||{}),tenant:process.env.ORDNIX_PUBLIC_TENANT||'ordnix-sales'};
  return core(req,res);
}
