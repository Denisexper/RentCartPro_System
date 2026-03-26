import { Request, Response } from "express";
import { VehicleRepositoryInterface } from "../../interfaces/vehicle/vehicle.repository.interface";
import { CreateVehicleInput, UpdateVehicleInput } from "../../types/vehicle/vehicle.types";

export class VehicleControllerService {

    private repository : VehicleRepositoryInterface;

    constructor (
        repository: VehicleRepositoryInterface,
    ){
        this.repository = repository;
    }

    async getById (req: Request<{id: string}>, res: Response) {

        const { id } = req.params;

        try {
            
            const response = await this.repository.getById(id)

            if(!response){
                return res.status(404).json({
                    msj: "Vehicle not found"
                });
            }

            return res.status(200).json({
                msj: "Vehicle retrived successfully",
                data: {
                    id: response.id,
                    tenantId: response.tenantId,
                    plate: response.plate,
                    brand: response.brand,
                    model: response.model,
                    year: response.year,
                    category: response.category,
                    color: response.color,
                }
            });
        } catch (error: any) {
            console.error(`[VehicleController] Error in getById(${id})`, error)

            //validamos por si cambia en un pequeno lapso es objeto(prisma error code)
            if(error.code === 'P2025'){
                return res.status(404).json({
                    msj: "Vehicle not found2"
                })
            }

            return res.status(500).json({
                msj: "Server error",
                error: error.message
            })
        }
    }

    async getAll(req: Request, res: Response){
        
    }
}