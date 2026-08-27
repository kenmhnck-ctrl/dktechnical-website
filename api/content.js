export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'POST only'});
 const {company='御社',industry='企業',service='サービス',region='全国',topic='集客',tone='信頼感'}=req.body||{};
 const base=`${region}で${service}を検討している方へ。${company}では、${topic}について分かりやすくご案内しています。`;
 return res.status(200).json({status:'READY_FOR_REVIEW',assets:{seo:{title:`${region}の${industry}｜${service}なら${company}`,description:`${service}について、選び方・注意点・相談方法を解説。${company}がサポートします。`,outline:['よくある悩み','選び方のポイント','失敗しないための注意点','相談から利用までの流れ','よくある質問']},social:[`${base} 気になる点があればお気軽にご相談ください。`,`${service}選びで迷っていませんか？ ${company}が大切にしているポイントを3つにまとめました。`,`${company}の強み：${tone}を大切に、${service}の相談から実行までサポートします。`],google:`${company}からのお知らせ：${service}に関するご相談を受け付けています。${region}でお困りの方はお気軽にお問い合わせください。`}});
}