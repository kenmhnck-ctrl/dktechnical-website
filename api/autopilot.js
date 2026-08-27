export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'POST only'});
 const {company='御社',industry='企業',region='全国',service='サービス',goal='問い合わせ増加'}=req.body||{};
 const channels=industry.includes('美容')?['Instagram','Googleビジネスプロフィール','SEO']:industry.includes('飲食')?['Googleビジネスプロフィール','Instagram','リピート施策']:industry.includes('建設')?['SEO','Googleビジネスプロフィール','施工事例']:industry.includes('不動産')?['SEO','Instagram','物件LP']:['SEO','SNS','Google'];
 const today=[
  {type:'CONTENT',channel:channels[0],title:`${industry}向け：${service}で失敗しない3つのポイント`,status:'READY_FOR_REVIEW'},
  {type:'SOCIAL',channel:channels[1],title:`${company}の強みを伝える短文投稿を3本生成`,status:'READY_FOR_REVIEW'},
  {type:'SEO',channel:'Website',title:`「${region} ${industry} ${service}」の検索意図に合わせた記事構成を作成`,status:'READY_FOR_REVIEW'},
  {type:'FOLLOWUP',channel:'CRM',title:'新規リードへの24時間・3日・7日追客シナリオを準備',status:'READY_FOR_REVIEW'},
  {type:'OPTIMIZE',channel:'ORDNIX',title:`目標「${goal}」に対する週次KPIを設定`,status:'ACTIVE'}
 ];
 const content={headline:`${company}の集客を、止めない。`,cta:'無料相談・問い合わせはこちら',social:[`${service}を検討中の方へ。選ぶ前に確認したいポイントをまとめました。`,`${company}が大切にしているのは、売ることより「選んでよかった」と思える結果です。`,`よくある質問にお答えします。まずは気軽にご相談ください。`]};
 return res.status(200).json({mode:'ORDNIX_AUTOPILOT',company,industry,region,channels,today,content,nextReview:'7 days',humanApprovalRequired:true});
}