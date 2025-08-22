require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { createSwaggerSpec } = require("../utils/swagger");
const { connectMongoose } = require("../utils/mongoose");
const Franchise = require("../models/branches_from_api");
const PORT = Number(process.env.PORT || 3000);
const specs = createSwaggerSpec(PORT);

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

connectMongoose().then(() => {
  app.get("/api/franchises", async (_req: any, res: any) => {
    try {
      const items = await Franchise.find().sort({ _id: -1 }).lean();
      res.json(items);
    } catch (e: any) {
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  // 생성 (스키마 검증 적용)
  app.post("/api/franchises", async (req: any, res: any) => {
    try {
      const doc = await Franchise.create(req.body);
      res.status(201).json(doc);
    } catch (e: any) {
      res.status(400).json({ error: e.message || String(e) });
    }
  });

  // 수정 (검증 포함)
  app.patch("/api/franchises/:id", async (req: any, res: any) => {
    try {
      const doc = await Franchise.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).lean();
      if (!doc) return res.status(404).json({ error: "not found" });
      res.json(doc);
    } catch (e: any) {
      res.status(400).json({ error: e.message || String(e) });
    }
  });

  // 삭제
  app.delete("/api/franchises/:id", async (req: any, res: any) => {
    try {
      const r = await Franchise.deleteOne({ _id: req.params.id });
      if (!r.deletedCount) return res.status(404).json({ error: "not found" });
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message || String(e) });
    }
  });

  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
});

// ===== Swagger API 문서화 =====

/**
 * @swagger
 * /api/franchises:
 *   get:
 *     summary: 프랜차이즈 목록 조회
 *     description: 프랜차이즈 목록을 페이지네이션과 필터링을 통해 조회합니다.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: 프랜차이즈 이름으로 검색 (부분 일치)
 *       - in: query
 *         name: addr
 *         schema:
 *           type: string
 *         description: 주소로 검색 (부분 일치)
 *       - in: query
 *         name: tel
 *         schema:
 *           type: string
 *         description: 전화번호로 검색 (부분 일치)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 200
 *         description: 페이지당 항목 수 (최대 200)
 *     responses:
 *       200:
 *         description: 성공적으로 프랜차이즈 목록을 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: 현재 페이지 번호
 *                 limit:
 *                   type: integer
 *                   description: 페이지당 항목 수
 *                 total:
 *                   type: integer
 *                   description: 전체 항목 수
 *                 items:
 *                   type: array
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
 *                         description: 운영 기간
 *       500:
 *         description: 서버 오류
 */

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
 *             required:
 *               - name
 *               - addr
 *               - tel
 *             properties:
 *               name:
 *                 type: string
 *                 description: 프랜차이즈 이름
 *                 example: "스타벅스 강남점"
 *               addr:
 *                 type: string
 *                 description: 주소
 *                 example: "서울시 강남구 테헤란로 123"
 *               tel:
 *                 type: string
 *                 description: 전화번호
 *                 example: "02-1234-5678"
 *               period:
 *                 type: string
 *                 description: 운영 기간 (선택사항)
 *                 example: "평일 07:00-22:00, 주말 08:00-21:00"
 *     responses:
 *       201:
 *         description: 성공적으로 프랜차이즈가 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: 생성된 프랜차이즈 ID
 *                 name:
 *                   type: string
 *                   description: 프랜차이즈 이름
 *                 addr:
 *                   type: string
 *                   description: 주소
 *                 tel:
 *                   type: string
 *                   description: 전화번호
 *                 period:
 *                   type: string
 *                   description: 운영 기간
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */

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
 *               period:
 *                 type: string
 *                 description: 운영 기간
 *     responses:
 *       200:
 *         description: 성공적으로 프랜차이즈 정보가 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: 프랜차이즈 ID
 *                 name:
 *                   type: string
 *                   description: 프랜차이즈 이름
 *                 addr:
 *                   type: string
 *                   description: 주소
 *                 tel:
 *                   type: string
 *                   description: 전화번호
 *                 period:
 *                   type: string
 *                   description: 운영 기간
 *       400:
 *         description: 잘못된 ID 형식
 *       500:
 *         description: 서버 오류
 */

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
 *       204:
 *         description: 성공적으로 프랜차이즈가 삭제됨
 *       400:
 *         description: 잘못된 ID 형식
 *       404:
 *         description: 프랜차이즈를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
