-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'RECRUITER', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING (
  CASE "role"::text
    WHEN 'USER' THEN 'STUDENT'::"Role_new"
    WHEN 'COACH' THEN 'RECRUITER'::"Role_new"
    ELSE "role"::text::"Role_new"
  END
);
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- CreateTable
CREATE TABLE "role_audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "oldRole" "Role" NOT NULL,
    "newRole" "Role" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "role_audit_logs" ADD CONSTRAINT "role_audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_audit_logs" ADD CONSTRAINT "role_audit_logs_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
