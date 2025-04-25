export default async function handler(req, res) {
  const response = await fetch('http://localhost:3001/api/diaries');
  //サーバ側のapiで”タスク管理用のAPIルートを追加”の欄に記載しているパスを記載する。
  const text = await response.text();
  
  try {
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (err) {
    console.error('JSONパースエラー:', err);
    console.error('受け取ったレスポンス:', text);
    res.status(500).json({ message: 'JSONではないレスポンスを受け取りました' });
  }
}