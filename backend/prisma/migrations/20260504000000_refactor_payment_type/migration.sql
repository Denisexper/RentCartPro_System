-- Recreate PaymentType enum with new business-aligned values
-- Maps old values: Payment→PagoAlquiler, Deposit→Deposito, Refund→Devolucion, Extra→CobroDano

-- Step 1: Create new enum
CREATE TYPE "PaymentType_new" AS ENUM ('Deposito', 'PagoAlquiler', 'CobroDano', 'CobroCombustible', 'CobrodiaExtra', 'Devolucion');

-- Step 2: Add temp column
ALTER TABLE "Payment" ADD COLUMN "type_temp" "PaymentType_new";

-- Step 3: Migrate existing data
UPDATE "Payment" SET "type_temp" = CASE
  WHEN "type" = 'Payment'  THEN 'PagoAlquiler'::"PaymentType_new"
  WHEN "type" = 'Deposit'  THEN 'Deposito'::"PaymentType_new"
  WHEN "type" = 'Refund'   THEN 'Devolucion'::"PaymentType_new"
  WHEN "type" = 'Extra'    THEN 'CobroDano'::"PaymentType_new"
  ELSE 'PagoAlquiler'::"PaymentType_new"
END;

-- Step 4: Make temp column non-nullable with default
ALTER TABLE "Payment" ALTER COLUMN "type_temp" SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN "type_temp" SET DEFAULT 'PagoAlquiler'::"PaymentType_new";

-- Step 5: Drop old column and old enum
ALTER TABLE "Payment" DROP COLUMN "type";
DROP TYPE "PaymentType";

-- Step 6: Rename temp column and new enum to final names
ALTER TABLE "Payment" RENAME COLUMN "type_temp" TO "type";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
