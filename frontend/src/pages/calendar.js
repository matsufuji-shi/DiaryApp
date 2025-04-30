import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const DiaryCalendar = ({ diaries }) => {
  const [highlightDates, setHighlightDates] = useState([]);

  useEffect(() => {
    console.log('Diaries:', diaries);  // diariesの中身を確認
    const dates = diaries.map(diary => {
      const date = new Date(diary.date);
      const formattedDate = date.toISOString().split('T')[0];
      console.log('Formatted Date:', formattedDate);  // フォーマットされた日付を確認
      return formattedDate;
    });
    setHighlightDates(dates);
  }, [diaries]);

  const formatDateToJST = (date) => {
    const jstOffset = 9 * 60; // 9時間分
    const utc = date.getTime() + (jstOffset * 60 * 1000);
    const jstDate = new Date(utc);
    return jstDate.toISOString().split('T')[0];
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = formatDateToJST(date); 
      if (highlightDates.includes(dateString)) {
        return 'highlight';
      }
    }
    return null;
  };

  return (
    <div className='calendar'>
      <h2>日記カレンダー</h2>
      <Calendar tileClassName={tileClassName} />
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const res = await axios.get('http://localhost:3001/api/diaries');
    console.log('API Response:', res.data);  // レスポンス内容を確認
    return { props: { diaries: res.data } };
  } catch (err) {
    console.error('Error fetching diaries:', err);
    return { props: { diaries: [] } };  // データ取得エラー時
  }
}

export default DiaryCalendar;