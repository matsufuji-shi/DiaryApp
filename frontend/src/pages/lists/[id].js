// 詳細
import Link from 'next/link';


export default function DiaryDetail(){
  return(
    <div>
      <h1>詳細表示</h1>
    <Link href={`/lists/[id]/[title]`}><button>編集</button></Link>
    </div>

  )
};