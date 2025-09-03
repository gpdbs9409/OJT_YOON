import type { Request, Response } from "express";
import { api_data } from "../model/api_data";

//read
class FranchiseController {
  async getAllFranchises(req: Request, res: Response) {
    //전체 데이터 조회 현재로써는 request없음
    try {
      console.log("Query parameters:", req.query);
      console.log("Cursor:", req.query.cursor);

      const franchise = await api_data.find({});
      const cursor = req.query.cursor || null; // GET 요청은 query 사용
      console.log("Processed cursor:", cursor);

      if (cursor) {
        // cursor가 있을 때의 로직
        const nextFranchise = await api_data
          .find({ _id: { $gt: cursor } })
          .limit(10);
        const nextCursor =
          nextFranchise.length > 0
            ? nextFranchise[nextFranchise.length - 1]?._id
            : null;
        return res.status(200).json({ data: nextFranchise, nextCursor });
      }

      // cursor가 없을 때는 처음 10개만 반환
      const limitedFranchise = await api_data.find({}).limit(10);
      const nextCursor =
        limitedFranchise.length > 0
          ? limitedFranchise[limitedFranchise.length - 1]?._id
          : null;
      return res.status(200).json({ data: limitedFranchise, nextCursor });
    } catch (error) {
      console.error("Error in getAllFranchises:", error);
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  }

  //create
  async createFranchise(req: Request, res: Response) {
    //
    try {
      const franchise = await api_data.create(req.body);
      console.log("franchise", franchise);
      console.log("req.body", req.body);
      console.log("typeof req.body", typeof req.body);
      res.status(201).json({
        message: "성공적으로 프랜차이즈가 생성되었습니다.",
        data: franchise,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  //update
  async updateFranchise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log("Update ID:", id);
      console.log("Update Body:", req.params);

      const franchise = await api_data.findByIdAndUpdate(
        id,
        req.body,

        { new: true, runValidators: true } // 스키마 검증 실행
      );

      if (!franchise) {
        return res
          .status(404)
          .json({ error: "프랜차이즈를 찾을 수 없습니다." });
      }

      res.status(200).json({
        message: "성공적으로 프랜차이즈 정보가 수정되었습니다.",
        data: franchise,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  //delete
  async deleteFranchise(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await api_data.findByIdAndDelete(id);

      res.status(200).json({
        message: "성공적으로 프랜차이즈가 삭제되었습니다.",
      });
    } catch (error) {
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  }
}

export { FranchiseController };
