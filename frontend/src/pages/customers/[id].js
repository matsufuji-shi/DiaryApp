import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function CustomerForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = id !== 'new';

  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState({});

  useEffect(() => {
    if (isEditing && id) {
      fetch(`http://localhost:3001/api/diaries/${id}`)
        .then(res => res.json())
        .then(data => setForm(data))
        .catch(err => console.error('取得エラー:', err));
    }
  }, [id, isEditing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:3001/api/diaries/${id}` : `http://localhost:3001/api/diaries`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const err = await res.json();
        setError({ global: err.message });
      }
    } catch (err) {
      console.error(err);
      setError({ global: 'サーバーエラーが発生しました' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <h1>{isEditing ? '日記編集' : '日記作成'}</h1>
      <div className='addList'>
        <p>タイトル</p>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="日記のタイトルを入力してください"
      />
      <p>内容</p>
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="日記の内容を入力してください"
      />
      <br/>
      <button type="submit" className='addBtn'>{isEditing ? '更新' : '作成'}</button>
      {error.global && <p style={{ color: 'red' }}>{error.global}</p>}

      </div>
      
    </form>
  );
}