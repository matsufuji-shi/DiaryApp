import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DiaryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [diary, setDiary] = useState(null);  // 状態を単一のアイテム用に変更
  const [error, setError] = useState(null);  // エラーステート追加
  const [confirmDelete, setConfirmDelete] = useState(false); // 削除確認のステート追加

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/diaries/${id}`)
        .then(res => res.json())
        .then(data => setDiary(data))  // dataをdiaryにセット
        .catch(err => console.error('データ取得エラー:', err));
    }
  }, [id]);

  const handleDelete = async () => {
    const url = `http://localhost:3001/api/diaries/${diary.id}`;
  
    try {
      const res = await fetch(url, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        router.push('/');  // 削除成功後トップページに遷移
      } else {
        const err = await res.json();
        setError({ global: err.message });
      }
    } catch (err) {
      console.error(err);
      setError({ global: 'サーバーエラーが発生しました' });
    }
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);  // 削除確認ダイアログを表示
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);  // 削除確認ダイアログを閉じる
  };

  return (
    <div>
      <h1>詳細表示</h1>
      {diary ? (
        <>
          <div>
            <h2>{diary.title} - {diary.date}</h2>
            <p>{diary.content}</p>
            <Link href={`/customers/${diary.id}`}><button>編集</button></Link>
            <button onClick={handleConfirmDelete}>削除</button>  {/* 削除確認を呼び出す */}
          </div>
          
          {/* 削除確認ダイアログ */}
          {confirmDelete && (
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <p>本当に削除しますか？</p>
              <button onClick={handleDelete}>削除</button>
              <button onClick={handleCancelDelete}>キャンセル</button>
            </div>
          )}
        </>
      ) : (
        <p>タスクが存在しません。</p>
      )}
      {error && <div style={{ color: 'red' }}>{error.global}</div>}  {/* エラーメッセージ表示 */}
    </div>
  );
}