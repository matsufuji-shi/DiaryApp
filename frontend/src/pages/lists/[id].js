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
    <div className='idPage'>
      <h1 className='idTitle'>詳細表示</h1>
      {diary ? (
        <>
          <div className='detail'>
            <h2 className='title'>{diary.title} - {diary.date}</h2>
            <p className='content'>{diary.content}</p>

            <div className='btns'>
            <Link href={`/customers/${diary.id}`}><button className='editBtn2'>編集</button></Link>
            <button onClick={handleConfirmDelete} className='deleteBtn2'>削除</button>  {/* 削除確認を呼び出す */}
            </div>
          </div>
          
          {/* 削除確認ダイアログ */}
          {confirmDelete && (
            <div className='deleteLog'>
              <p>本当に削除しますか？</p>
              <button onClick={handleDelete} className='deleteBtn3'>削除</button>
              <button onClick={handleCancelDelete} className='cancelBtn'>キャンセル</button>
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