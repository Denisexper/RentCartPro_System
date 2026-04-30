-- AlterTable: add tenantId to RolePermission
ALTER TABLE "RolePermission" ADD COLUMN "tenantId" TEXT NOT NULL DEFAULT '';

-- Update the default so existing rows don't break (table is empty at this point)
ALTER TABLE "RolePermission" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropIndex: old unique constraint
DROP INDEX "RolePermission_role_permissionId_key";

-- CreateIndex: new unique constraint including tenantId
CREATE UNIQUE INDEX "RolePermission_tenantId_role_permissionId_key" ON "RolePermission"("tenantId", "role", "permissionId");
