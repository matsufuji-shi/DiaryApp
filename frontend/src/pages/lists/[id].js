// 詳細
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DiaryDetail(){
  const router = useRouter();
  const { id } = router.query;
  console.log(id)
  const [lists, setLists] = useState([]);

  
    useEffect(() => {
      if(id){
      fetch(`http://localhost:3001/api/diaries/${id}`)
        .then(res => res.json())
        .then(data => setLists(data))
        .catch(err => console.error('データ取得エラー:', err));
    };
  }, [id]);
  console.log(lists)

  return(
    <div>
      <h1>詳細表示</h1>
      {lists ? (
        <>
        <div>
          <h2>{lists.title}-{lists.date}</h2>
          <p>{lists.content}</p>
    <Link href={`/DiaryForm`}><button>編集</button></Link>
    </div>
    </>
      ) : (
        <p>タスクが存在しません。</p>
      )}
    </div>

  )
};