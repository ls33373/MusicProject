const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');

// 모든 신청 목록 조회
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 새로운 신청 생성
router.post('/', async (req, res) => {
    
    const request = new Request({
        title: req.body.title,
        artist: req.body.artist,
        reason: req.body.reason,
        writer: req.body.writer,
        isBlank: req.body.isBlank,
        isAnnonymous: req.body.isAnnonymous
    });

    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 도서 신청
router.post('/books', async (req, res) => {
    const request = new Book({
        title: req.body.title,
        author: req.body.author,
        writer: req.body.writer
    });

    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 도서 목록 불러오기
router.get("/books", async (req, res) => {
    try {
        const response = await Book.find().sort({ createdAt: -1 })
        res.json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// 방송부 전용 신청 목록 불러오기
router.get("/broadcast", async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
});

// 데이터베이스 초기화
router.post('/reset', async (req, res) => {
    try {
        const result = await Request.deleteMany({});
        res.status(200).json({ 
            message: '데이터베이스가 성공적으로 초기화되었습니다.',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 노래 삭제
router.delete("/delete", async (req, res) => {
    try {
        const { createdAt } = req.body;
        const date = new Date(createdAt); // 데이터베이스에 저장된 형태(Date)에 맞게 수정
        const result = await Request.deleteOne({ createdAt: date });

        res.status(201).json({
            message: "데이터를 성공적으로 삭제했습니다.",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 책 삭제
router.delete("/delete/book", async (req, res) => {
    try {
        const { createdAt } = req.body;
        const date = new Date(createdAt);
        const result = await Book.deleteOne({ createdAt: date });
    
        res.status(201).json({
            message: "책 데이터를 성공적으로 삭제했습니다.",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router; 