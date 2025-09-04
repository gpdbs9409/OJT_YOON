import type { Request, Response } from "express";
import { api_data } from "../model/api_data";

//read
class FranchiseController {
  async getFranchisesByLimitAndCursor(limit: number, req: Request) {
    try {
      const cursor = req.query.cursor as string;

      console.log("Limit:", limit);
      console.log("Cursor:", cursor);
      // cursor가 있을 때의 로직

      if (cursor) {
        const nextFranchise = await api_data // cursor값을 기준으로 다음 아이템을 조회
          .find({ _id: { $gt: cursor } })
          .limit(limit);
        const nextCursor = //nextCursor는 nextFranchise의 마지막 아이템의 _id
          nextFranchise.length > 0
            ? nextFranchise[nextFranchise.length - 1]?._id
            : null;
        return { data: nextFranchise, nextCursor };
      }

      // cursor가 없을 때는 처음 limit개만 반환
      const limitedFranchise = await api_data.find({}).limit(limit);
      const nextCursor =
        limitedFranchise.length > 0
          ? limitedFranchise[limitedFranchise.length - 1]?._id
          : null;
      return { data: limitedFranchise, nextCursor };
    } catch (error) {
      console.error("Error in getAllFranchises:", error);
      throw new Error("서버 오류가 발생했습니다.");
    }
  }

  //create
  async createFranchise(req: Request, res: Response) {
    //
    try {
      const { name, addr, tel, period } = req.body;
      if (!name || !addr || !tel || !period) {
        return res.status(400).json({
          error: "필수 필드가 누락되었습니다.",
          required: ["name", "addr", "tel", "period"],
          received: Object.keys(req.body),
        });
      }
      const franchise = await api_data.create(req.body);
      console.log("franchise", franchise);
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

  //

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
