const db = require("../config/database");

// 全顧客を取得する
const getDiaries = (req, res) => {
    const sqlSelect = "SELECT * FROM diaries ORDER BY id";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving users from the database");
        } else {
            res.send(result);
        }
    });
};

// 新しいタスクを追加する
const addDiaries = (req, res) => {
    const { date, title, content } = req.body;
    const sqlInsert = "INSERT INTO diaries ( date, title, content ) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlInsert, [date, title, content], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to add new diaries");
        } else {
            res.status(200).send("diaries added successfully");
        }
    });
};

// 特定のタスクを更新する
const updateDiaries = (req, res) => {
    const { id } = req.params;
    const { date, title, content } = req.body;
    const sqlUpdate = "UPDATE diaries SET date = ?, title = ?, content = ? WHERE id = ?";
    db.query(sqlUpdate, [date, title, content, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to add new diaries");
        } else {
            res.status(200).send("diaries updated successfully");
        }
    });
};

// 特定のタスクを削除する
const deleteDiaries = (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM diaries WHERE id = ?";
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to delete diaries");
        } else {
            res.status(200).send("diaries deleted successfully");
        }
    });
};

module.exports = { getDiaries, addDiaries, updateDiaries, deleteDiaries };