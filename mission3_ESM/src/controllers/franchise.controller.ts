import type { Request, Response } from "express";
import { api_data } from "../repository/mongoose";

//read
class FranchiseController {
  async getAllFranchises(req: Request, res: Response) {
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
      const { name, addr, tel, period } = req.body;

      // 필수 필드 검증
      if (!name || !addr || !tel) {
        return res.status(400).json({ error: "필수 필드가 누락되었습니다." });
      }

      const franchise = await api_data.create({ name, addr, tel, period });
      res.status(201).json({
        message: "성공적으로 프랜차이즈가 생성되었습니다.",
        data: franchise,
      });
    } catch (error) {
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  }
  //update
  async updateFranchise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, addr, tel, period } = req.body;

      const franchise = await api_data.findByIdAndUpdate(
        id,
        {
          name,
          addr,
          tel,
          period,
        },
        { new: true } //new: true 옵션은 수정된 데이터를 반환하는 옵션
      );

      if (!name || !addr || !tel || !period) {
        return res.status(400).json({ error: "필수 필드가 누락되었습니다." });
      }

      res.status(200).json({
        message: "성공적으로 프랜차이즈 정보가 수정되었습니다.",
        data: franchise,
      });
    } catch (error) {
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
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
