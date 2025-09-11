-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MEMBER', 'CREATOR', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'APPLE');

-- CreateEnum
CREATE TYPE "public"."PrivacyLevel" AS ENUM ('PUBLIC', 'FRIENDS_ONLY', 'PRIVATE', 'ANONYMOUS');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('VIDEO', 'AUDIO', 'TEXT', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."LooproomStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "public"."LoopchainStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "public"."SharedVybeType" AS ENUM ('REFLECTION', 'MILESTONE', 'INSPIRATION', 'GRATITUDE', 'PROGRESS_UPDATE');

-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('HEART', 'CLAP', 'FIRE', 'PEACE', 'INSPIRE', 'STRENGTH', 'GRATITUDE', 'MINDFUL');

-- CreateEnum
CREATE TYPE "public"."ReactableType" AS ENUM ('LOOPROOM', 'SHARED_VYBE', 'COMMENT');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'TRIAL');

-- CreateEnum
CREATE TYPE "public"."SubscriptionTier" AS ENUM ('FREE', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY', 'CREATOR_PRO');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'SAFETY_CONCERN', 'COPYRIGHT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authProvider" "public"."AuthProvider" NOT NULL,
    "authProviderId" TEXT,
    "passwordHash" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "allowsAnonymousMode" BOOLEAN NOT NULL DEFAULT true,
    "defaultPrivacyLevel" "public"."PrivacyLevel" NOT NULL DEFAULT 'PUBLIC',
    "blockedUsers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "currentMood" TEXT,
    "wellnessGoals" TEXT[],
    "totalStreakDays" INTEGER NOT NULL DEFAULT 0,
    "currentStreakDays" INTEGER NOT NULL DEFAULT 0,
    "completedLoopchains" INTEGER NOT NULL DEFAULT 0,
    "vibesShared" INTEGER NOT NULL DEFAULT 0,
    "positiveReactions" INTEGER NOT NULL DEFAULT 0,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "showProgress" BOOLEAN NOT NULL DEFAULT true,
    "allowDirectMessages" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "iconUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."looprooms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "contentType" "public"."ContentType" NOT NULL,
    "contentUrl" TEXT NOT NULL,
    "duration" INTEGER,
    "status" "public"."LooproomStatus" NOT NULL DEFAULT 'DRAFT',
    "creatorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION,
    "transcription" TEXT,
    "keywords" TEXT[],
    "difficulty" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "previewDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "looprooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."looproom_tags" (
    "id" TEXT NOT NULL,
    "looproomId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "looproom_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."loopchains" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "status" "public"."LoopchainStatus" NOT NULL DEFAULT 'DRAFT',
    "creatorId" TEXT NOT NULL,
    "estimatedDuration" INTEGER,
    "difficulty" TEXT,
    "goals" TEXT[],
    "enrollmentCount" INTEGER NOT NULL DEFAULT 0,
    "completionCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "loopchains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."loopchain_steps" (
    "id" TEXT NOT NULL,
    "loopchainId" TEXT NOT NULL,
    "looproomId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "minCompletionTime" INTEGER,
    "requiresInteraction" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "loopchain_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loopchainId" TEXT NOT NULL,
    "loopchainStepId" TEXT,
    "status" "public"."ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL,
    "progressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "confidenceLevel" INTEGER,
    "moodBefore" TEXT,
    "moodAfter" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shared_vybes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."SharedVybeType" NOT NULL DEFAULT 'REFLECTION',
    "content" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "privacyLevel" "public"."PrivacyLevel" NOT NULL DEFAULT 'PUBLIC',
    "looproomId" TEXT,
    "loopchainId" TEXT,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "isReported" BOOLEAN NOT NULL DEFAULT false,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "moderatedAt" TIMESTAMP(3),
    "moderatorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shared_vybes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."ReactionType" NOT NULL,
    "reactableType" "public"."ReactableType" NOT NULL,
    "reactableId" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharedVybeId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isReported" BOOLEAN NOT NULL DEFAULT false,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "moderatedAt" TIMESTAMP(3),
    "moderatorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."looplist_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "looproomId" TEXT NOT NULL,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "looplist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "public"."SubscriptionTier" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "priceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedType" TEXT NOT NULL,
    "reportedId" TEXT NOT NULL,
    "type" "public"."ReportType" NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "actionTaken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "pageViews" INTEGER NOT NULL DEFAULT 1,
    "interactions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_analytics" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "reactions" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "content_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CategoryToUserProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToUserProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "public"."user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "public"."tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "looprooms_slug_key" ON "public"."looprooms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "looproom_tags_looproomId_tagId_key" ON "public"."looproom_tags"("looproomId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "loopchains_slug_key" ON "public"."loopchains"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "loopchain_steps_loopchainId_stepNumber_key" ON "public"."loopchain_steps"("loopchainId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_userId_loopchainId_key" ON "public"."user_progress"("userId", "loopchainId");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_userId_reactableType_reactableId_type_key" ON "public"."reactions"("userId", "reactableType", "reactableId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "looplist_items_userId_looproomId_key" ON "public"."looplist_items"("userId", "looproomId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "public"."subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "content_analytics_contentType_contentId_date_key" ON "public"."content_analytics"("contentType", "contentId", "date");

-- CreateIndex
CREATE INDEX "_CategoryToUserProfile_B_index" ON "public"."_CategoryToUserProfile"("B");

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."looprooms" ADD CONSTRAINT "looprooms_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."looprooms" ADD CONSTRAINT "looprooms_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."looproom_tags" ADD CONSTRAINT "looproom_tags_looproomId_fkey" FOREIGN KEY ("looproomId") REFERENCES "public"."looprooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."looproom_tags" ADD CONSTRAINT "looproom_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."loopchains" ADD CONSTRAINT "loopchains_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."loopchain_steps" ADD CONSTRAINT "loopchain_steps_loopchainId_fkey" FOREIGN KEY ("loopchainId") REFERENCES "public"."loopchains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."loopchain_steps" ADD CONSTRAINT "loopchain_steps_looproomId_fkey" FOREIGN KEY ("looproomId") REFERENCES "public"."looprooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_loopchainId_fkey" FOREIGN KEY ("loopchainId") REFERENCES "public"."loopchains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_loopchainStepId_fkey" FOREIGN KEY ("loopchainStepId") REFERENCES "public"."loopchain_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shared_vybes" ADD CONSTRAINT "shared_vybes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shared_vybes" ADD CONSTRAINT "shared_vybes_looproomId_fkey" FOREIGN KEY ("looproomId") REFERENCES "public"."looprooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_looproom_fkey" FOREIGN KEY ("reactableId") REFERENCES "public"."looprooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_sharedvybe_fkey" FOREIGN KEY ("reactableId") REFERENCES "public"."shared_vybes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_sharedVybeId_fkey" FOREIGN KEY ("sharedVybeId") REFERENCES "public"."shared_vybes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."looplist_items" ADD CONSTRAINT "looplist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."looplist_items" ADD CONSTRAINT "looplist_items_looproomId_fkey" FOREIGN KEY ("looproomId") REFERENCES "public"."looprooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToUserProfile" ADD CONSTRAINT "_CategoryToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToUserProfile" ADD CONSTRAINT "_CategoryToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
