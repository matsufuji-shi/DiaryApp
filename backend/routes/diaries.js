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
    res.json(result);
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
    res.json(result[0]);
  });
});

// 新しいタスクを追加 (POST /diaries)
router.post('/', (req, res) => {
  const { date, title, content } = req.body;

  if (!date|| !title|| !content) {
    return res.status(400).json({ message: '全ての必須項目を入力してください。' });
  }

  const sql = `
    INSERT INTO diaries (date, title, content)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [date, title, content], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '日記の追加に失敗しました' });
    }

    const insertedCustomer = {
      id: result.insertId,
      date, title, content
    };

    res.status(201).json(insertedCustomer);
  });
});

// 特定のタスクを更新 (PUT /diaries/:id)
router.put("/:id", (req, res) => {
  const { date, title, content } = req.body;
  const { id } = req.params;

  if (!date|| !title|| !content) {
    return res.status(400).send("入力日/タイトル/内容の入力が必要です");
  }

  // まずは元の created_at を取得
  const getSql = "SELECT created_at FROM diaries WHERE id = ?";
  db.query(getSql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("データ取得に失敗しました");
    }

    if (results.length === 0) {
      return res.status(404).send("指定された日記が見つかりません");
    }

    const updateSql = `
      UPDATE diaries
      SET date = ?, title = ?, content = ?
      WHERE id = ?
    `;
    db.query(updateSql, [date, title, content, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("日記の更新に失敗しました");
      }
      res.status(200).json({ message: "日記を更新しました" });
    });
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