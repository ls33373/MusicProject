const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Food = require('../models/Food');

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
        reason: req.body.reason
    });

    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 일주일 급식 불러오기
router.get("/food", async (req, res) => {
    try {
        const response = await Food.find({"week": new Date().getDay()}).sort({"sorting": 1});
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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

module.exports = router; 