//編集と追加を表示
import { useRouter } from 'next/router';

export default function Post(){
  const router = useRouter();
  const {id,title} = router.query;

  return(
    <h1>ポストID：{id},タイトル：{title}</h1>
  )
}