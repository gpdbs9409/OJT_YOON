import type { Request, Response } from "express";
import { api_data } from "../model/api_data";

//read
class FranchiseController {
  async getAllFranchises(req: Request, res: Response) {
    //전체 데이터 조회 현재로써는 request없음
    try {
      const franchise = await api_data.find({}); //현재 db에 명륜진사갈비 데이터 밖에 없기에 Find에 조건 없음 (전제데이터조회)
      res.status(200).json(franchise);
    } catch (error) {
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  }

  //create
  async createFranchise(req: Request, res: Response) {
    try {
      const franchise = await api_data.create(req.body);
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
