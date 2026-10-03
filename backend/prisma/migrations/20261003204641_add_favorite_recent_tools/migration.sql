-- CreateTable
CREATE TABLE "favorite_tools" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recent_tools" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "useCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "recent_tools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_tools_userId_idx" ON "favorite_tools"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_tools_userId_toolId_key" ON "favorite_tools"("userId", "toolId");

-- CreateIndex
CREATE INDEX "recent_tools_userId_lastUsedAt_idx" ON "recent_tools"("userId", "lastUsedAt");

-- CreateIndex
CREATE UNIQUE INDEX "recent_tools_userId_toolId_key" ON "recent_tools"("userId", "toolId");

-- AddForeignKey
ALTER TABLE "favorite_tools" ADD CONSTRAINT "favorite_tools_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_tools" ADD CONSTRAINT "recent_tools_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
