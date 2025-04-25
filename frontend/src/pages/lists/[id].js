// 詳細
import Link from 'next/link';
import {getStaticProps} from '../index'

export default function DiaryDetail(){
  return(
    <div>
      <h1>詳細表示</h1>
    <Link href={`/lists/[id]/[title]`}><button>詳細</button></Link>
    </div>

  )
};