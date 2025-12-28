-- DropIndex
DROP INDEX "Class_startTime_idx";

-- CreateIndex
CREATE INDEX "Class_startTime_instructorId_idx" ON "Class"("startTime", "instructorId");
