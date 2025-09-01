import type { Request, Response } from "express";
import { api_data } from "../repository/mongoose";

//read 함수 정의
class FranchiseController {
  async getAllFranchises(req: Request, res: Response) {
    const franchise = await api_data.find({}); //현재 db에 명륜진사갈비 데이터 밖에 없기에 Find에 조건 없음 (전제데이터조회)
    res.send(franchise);
  }

  async createFranchise(req: Request, res: Response) {
    const { name, addr, tel, period } = req.body;
    const franchise = await api_data.create({ name, addr, tel, period });
    res.send(franchise);
  }

  async updateFranchise(req: Request, res: Response) {
    const { id } = req.params;
    const { name, addr, tel, period } = req.body;
    const franchise = await api_data.findByIdAndUpdate(id, {
      name,
      addr,
      tel,
      period,
    });
    res.send(franchise);
  }

  async deleteFranchise(req: Request, res: Response) {
    const { id } = req.params;
    const franchise = await api_data.findByIdAndDelete(id);
    res.send(franchise);
  }
}

export { FranchiseController };
