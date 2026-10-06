CREATE TABLE "KioskSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1 CHECK ("id" = 1),
    "url" TEXT NOT NULL
);

CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1 CHECK ("id" = 1),
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);
