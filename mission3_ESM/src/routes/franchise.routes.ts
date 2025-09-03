import { Router } from "express";
import { FranchiseController } from "../service/franchise.crud";
import { authMiddleware } from "../middleware/authorization";

const router = Router();
const franchiseController = new FranchiseController();

/**
 * @swagger
 * /api/v1/franchises:
 *   get:
 *     summary: 프랜차이즈 전체 목록 조회
 *     description: 모든 프랜차이즈 목록을 조회합니다. cursor 파라미터를 사용하여 페이지네이션을 지원합니다.
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: 페이지네이션을 위한 커서 (마지막 아이템의 _id)
 *         required: false
 *     responses:
 *       200:
 *         description: 성공적으로 프랜차이즈 목록을 조회함
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   description: 전체 데이터 조회 시
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: 프랜차이즈 ID
 *                       name:
 *                         type: string
 *                         description: 프랜차이즈 이름
 *                       addr:
 *                         type: string
 *                         description: 주소
 *                       tel:
 *                         type: string
 *                         description: 전화번호
 *                       period:
 *                         type: string
 *                         description: 기간
 *                 - type: object
 *                   description: 페이지네이션 조회 시
 *                   properties:
 *                     data:
 *                       type: array
 *                       description: 프랜차이즈 목록
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: 프랜차이즈 ID
 *                           name:
 *                             type: string
 *                             description: 프랜차이즈 이름
 *                           addr:
 *                             type: string
 *                             description: 주소
 *                           tel:
 *                             type: string
 *                             description: 전화번호
 *                           period:
 *                             type: string
 *                             description: 기간
 *                     nextCursor:
 *                       type: string
 *                       description: 다음 페이지 조회를 위한 커서
 *                       nullable: true
 *       401:
 *         description: 인증 헤더 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 *                 message:
 *                   type: string
 *                   description: 상세 메시지
 *       403:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 *                 message:
 *                   type: string
 *                   description: 상세 메시지
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 */
router.get(
  "/",
  authMiddleware,
  franchiseController.getAllFranchises.bind(franchiseController)
);

/**
 * @swagger
 * /api/v1/franchises:
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
 *               period:
 *                 type: string
 *                 description: 기간
 *             required:
 *               - name
 *               - addr
 *               - tel
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 프랜차이즈 ID
 *                     name:
 *                       type: string
 *                       description: 프랜차이즈 이름
 *                     addr:
 *                       type: string
 *                       description: 주소
 *                     tel:
 *                       type: string
 *                       description: 전화번호
 *                     period:
 *                       type: string
 *                       description: 기간
 *       400:
 *         description: 필수 필드 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 */
router.post(
  "/",
  authMiddleware,
  franchiseController.createFranchise.bind(franchiseController)
);

/**
 * @swagger
 * /api/v1/franchises/{id}:
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
 *               period:
 *                 type: string
 *                 description: 기간
 *             required:
 *               - name
 *               - addr
 *               - tel
 *               - period
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 프랜차이즈 ID
 *                     name:
 *                       type: string
 *                       description: 프랜차이즈 이름
 *                     addr:
 *                       type: string
 *                       description: 주소
 *                     tel:
 *                       type: string
 *                       description: 전화번호
 *                     period:
 *                       type: string
 *                       description: 기간
 *       400:
 *         description: 필수 필드 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 */
router.patch(
  "/:id",
  authMiddleware,
  franchiseController.updateFranchise.bind(franchiseController)
);

/**
 * @swagger
 * /api/v1/franchises/{id}:
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
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 */
router.delete(
  "/:id",
  authMiddleware,
  franchiseController.deleteFranchise.bind(franchiseController)
);

export default router;
