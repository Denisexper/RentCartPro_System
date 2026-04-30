import { CustomRole } from "@prisma/client";

export type CreateCustomRoleInput = {
  tenantId: string;
  name: string;
  description?: string;
};

export type UpdateCustomRoleInput = Partial<Omit<CreateCustomRoleInput, "tenantId">> & {
  active?: boolean;
};
