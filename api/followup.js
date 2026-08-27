export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'POST only'});
 const {company='お客様',industry='企業',stage='new',interest='集客改善'}=req.body||{};
 const sequences={
  new:[{day:0,subject:'AI集客診断の結果について',body:`${company}様の診断結果をもとに、まず優先すべき改善項目を3つに整理しました。`},{day:1,subject:'最初に変えるならここです',body:`${industry}では、施策を増やすより問い合わせまでの導線を先に整える方が効果を測りやすくなります。`},{day:3,subject:'ORDNIXで自動化できる範囲',body:`${interest}に向けて、発信・リード管理・追客・改善までを一つの流れにできます。`},{day:7,subject:'7日後のご確認',body:'診断内容について不明点があれば、このメールへの返信で確認できます。'}],
  engaged:[{day:0,subject:'御社向け90日プラン',body:'御社向けに90日間の実行プランを準備できます。'},{day:2,subject:'導入後の動き',body:'初期設定後は毎週の実行内容と改善内容をダッシュボードで確認できます。'}]
 };
 return res.status(200).json({stage,sequence:sequences[stage]||sequences.new,sendMode:'DRAFT_UNTIL_CHANNEL_CONNECTED',unsubscribeRequired:true});
}