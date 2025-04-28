function formatDateToJST(date) {
  const jst = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // 9時間足す
  return jst.toISOString().split('T')[0];
}

const express = require("express");
const router = express.Router();
const db = require("../config/database"); 


//タスク一覧を取得 (GET /diaries)
router.get('/',  (req, res) => {
 
  const sql = "SELECT * FROM diaries ";
  db.query(sql,(err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("タスクの取得に失敗しました");
    }
    const formattedResult = result.map(diary => ({
      ...diary,
      date: formatDateToJST(diary.date) 
    }));
    res.json(formattedResult);
  });
});

//特定のタスクを取得 (GET /diaries/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM diaries WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("タスクの取得に失敗しました");
    }
    if (result.length === 0) {
      return res.status(404).send("タスクが見つかりません");
    }
    const diary = {
      ...result[0],
      date: formatDateToJST(result[0].date)
    };

    res.json(diary);
  });
});

// 新しいタスクを追加 (POST /diaries)
router.post('/', (req, res) => {
  const { title, content } = req.body;

  if ( !title|| !content) {
    return res.status(400).json({ message: '全ての必須項目を入力してください。' });
  }

  const date = new Date();

  const sql = `
    INSERT INTO diaries (date, title, content)
    VALUES ( ?,?, ?)
  `;

  db.query(sql, [date, title, content], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '日記の追加に失敗しました' });
    }

    const insertedCustomer = {
      id: result.insertId,
      date: formatDateToJST(date),
      title,
      content
    };

    res.status(201).json(insertedCustomer);
  });
});

// 特定のタスクを更新 (PUT /diaries/:id)
router.put("/:id", (req, res) => {
  const { title, content } = req.body; 
  const { id } = req.params;

  if (!title || !content) {
    return res.status(400).json({ message: "タイトル/内容の入力が必要です" });
  }

  const date = new Date();
  const sql = `
    UPDATE diaries
    SET date = ?, title = ?, content = ?
    WHERE id = ?
  `;

  db.query(sql, [date, title, content, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "タスクの更新に失敗しました" });
    }

    // 更新後の情報を返す（ここで日付を整形！）
    const updatedDiary = {
      id,
      date: formatDateToJST(date),
      title,
      content
    };

    res.status(200).json(updatedDiary);
  });
});

//特定のタスクを削除 (DELETE /diaries/:id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM diaries WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("日記の削除に失敗しました");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("日記が見つかりません");
    }
    res.status(200).json({ message: "日記を削除しました" });
  });
});

module.exports = router;