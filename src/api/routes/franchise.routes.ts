const { Router } = require('express');
const { FranchiseController } = require('../controllers/franchise.controller');

const router = Router();

/**
 * @swagger
 * /api/franchises:
 *   get:
 *     summary: 프랜차이즈 전체 목록 조회
 *     description: 모든 프랜차이즈 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: 성공적으로 프랜차이즈 목록을 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: 프랜차이즈 ID
 *                   name:
 *                     type: string
 *                     description: 프랜차이즈 이름
 *                   addr:
 *                     type: string
 *                     description: 주소
 *                   tel:
 *                     type: string
 *                     description: 전화번호
 *       500:
 *         description: 서버 오류
 */
router.get('/', FranchiseController.getAllFranchises);

/**
 * @swagger
 * /api/franchises:
 *   post:
 *     summary: 새로운 프랜차이즈 생성
 *     description: 새로운 프랜차이즈 정보를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 프랜차이즈 이름
 *               addr:
 *                 type: string
 *                 description: 주소
 *               tel:
 *                 type: string
 *                 description: 전화번호
 *     responses:
 *       201:
 *         description: 성공적으로 프랜차이즈가 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                 data:
 *                   type: object
 *                   description: 생성된 프랜차이즈 정보
 *       400:
 *         description: 필수 필드 누락 또는 유효성 검사 실패
 *       500:
 *         description: 서버 오류
 */
router.post('/', FranchiseController.createFranchise);



/**
 * @swagger
 * /api/franchises/{id}:
 *   patch:
 *     summary: 프랜차이즈 정보 수정
 *     description: 특정 프랜차이즈 정보를 부분적으로 수정합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 프랜차이즈 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 프랜차이즈 이름
 *               addr:
 *                 type: string
 *                 description: 주소
 *               tel:
 *                 type: string
 *                 description: 전화번호
 *     responses:
 *       200:
 *         description: 성공적으로 프랜차이즈 정보가 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                 data:
 *                   type: object
 *                   description: 수정된 프랜차이즈 정보
 *       400:
 *         description: 잘못된 ID 형식 또는 유효성 검사 실패
 *       404:
 *         description: 프랜차이즈를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch('/:id', FranchiseController.updateFranchise);

/**
 * @swagger
 * /api/franchises/{id}:
 *   delete:
 *     summary: 프랜차이즈 삭제
 *     description: 특정 프랜차이즈 정보를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 프랜차이즈 ID
 *     responses:
 *       200:
 *         description: 성공적으로 프랜차이즈가 삭제됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 삭제 성공 메시지
 *                 deletedCount:
 *                   type: number
 *                   description: 삭제된 문서 수
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: 삭제 시간
 *       400:
 *         description: 잘못된 ID 형식
 *       404:
 *         description: 프랜차이즈를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', FranchiseController.deleteFranchise);

module.exports = router;
