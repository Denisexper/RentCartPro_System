import { PrismaClient, PhotoType } from "@prisma/client";

export class RentalPhotoRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: { rentalId: string; type: PhotoType; url: string; publicId: string }) {
    return this.prisma.rentalPhoto.create({ data });
  }

  findByRental(rentalId: string, type?: PhotoType) {
    return this.prisma.rentalPhoto.findMany({
      where: { rentalId, ...(type ? { type } : {}) },
      orderBy: { takenAt: "asc" },
    });
  }

  findRentalTenant(rentalId: string) {
    return this.prisma.rental.findUnique({
      where: { id: rentalId },
      select: { tenantId: true },
    });
  }
}
