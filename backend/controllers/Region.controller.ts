import { Request, Response } from "express";
import Region from "../database/models/Region.model";

export default class RegionController {
  static async getAllRegions(req: Request, res: Response) {
    const regions = await Region.findAll();
    res.json(regions);
  }

  static async getRegionById(req: Request<{ id: string }>, res: Response) {
    const region = await Region.findByPk(req.params.id);
    if (region) {
      res.json(region);
    } else {
      res.status(404).send("Region not found");
    }
  }

  static async createRegion(req: Request, res: Response) {
    const newRegion = await Region.create(req.body);
    res.json(newRegion);
  }

  static async updateRegion(req: Request<{ id: string }>, res: Response) {
    const region = await Region.findByPk(req.params.id);
    if (region) {
      const updatedRegion = await region.update(req.body);
      res.json(updatedRegion);
    } else {
      res.status(404).send("Region not found");
    }
  }

  static async deleteRegion(req: Request<{ id: string }>, res: Response) {
    const region = await Region.findByPk(req.params.id);
    if (region) {
      await region.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("Region not found");
    }
  }
}
