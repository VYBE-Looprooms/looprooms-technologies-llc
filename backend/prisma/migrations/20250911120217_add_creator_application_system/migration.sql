-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "public"."IdentityDocumentType" AS ENUM ('NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE');

-- AlterEnum
ALTER TYPE "public"."ContentType" ADD VALUE 'IMAGE';

-- CreateTable
CREATE TABLE "public"."creator_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "bio" TEXT NOT NULL,
    "interestedCategories" TEXT[],
    "primaryCategory" TEXT NOT NULL,
    "identityDocumentType" "public"."IdentityDocumentType" NOT NULL,
    "identityDocumentUrl" TEXT NOT NULL,
    "identityDocumentNumber" TEXT,
    "faceVerificationUrl" TEXT,
    "faceVerificationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "faceVerificationScore" DOUBLE PRECISION,
    "experience" TEXT,
    "socialMediaLinks" TEXT[],
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "additionalInfoRequested" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "termsAcceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "privacyPolicyAcceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creator_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creator_applications_userId_key" ON "public"."creator_applications"("userId");

-- AddForeignKey
ALTER TABLE "public"."creator_applications" ADD CONSTRAINT "creator_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."creator_applications" ADD CONSTRAINT "creator_applications_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
