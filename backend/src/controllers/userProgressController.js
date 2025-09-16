const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserProgressController {
  /**
   * Get user's overall progress and stats
   */
  static async getUserProgress(req, res) {
    try {
      const userId = req.user.id;

      // Get user's profile for streak and session data
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId },
        select: {
          currentStreakDays: true,
          totalStreakDays: true,
          completedLoopchains: true,
          vibesShared: true,
          positiveReactions: true
        }
      });

      // Count total session participations
      const totalSessions = await prisma.sessionParticipant.count({
        where: {
          userId,
          status: 'JOINED'
        }
      });

      // Calculate total time spent in sessions
      const sessionParticipations = await prisma.sessionParticipant.findMany({
        where: {
          userId,
          status: 'JOINED'
        },
        select: {
          totalTimeInSession: true
        }
      });

      const totalTimeSpent = sessionParticipations.reduce((total, session) =>
        total + (session.totalTimeInSession || 0), 0
      );

      // Get user's achievements (mock for now - you can implement a proper achievement system)
      const achievements = [
        {
          id: 'first-session',
          title: 'Welcome to VYBE',
          description: 'Joined your first session',
          earnedAt: new Date().toISOString(),
          type: 'milestone'
        },
        {
          id: 'week-streak',
          title: '7-Day Streak',
          description: 'Maintained a 7-day active streak',
          earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'streak'
        },
        {
          id: 'community-supporter',
          title: 'Community Supporter',
          description: 'Shared positive reactions with the community',
          earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'social'
        }
      ].slice(0, Math.min(3, totalSessions)); // Show achievements based on activity

      const progressData = {
        totalSessions,
        streak: userProfile?.currentStreakDays || 0,
        totalTimeSpent,
        completedJourneys: userProfile?.completedLoopchains || 0,
        achievements
      };

      res.status(200).json({
        success: true,
        data: progressData,
        message: 'User progress retrieved successfully'
      });

    } catch (error) {
      console.error('Error retrieving user progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user progress',
        error: error.message
      });
    }
  }

  /**
   * Get user's active journeys (loopchains in progress)
   */
  static async getActiveJourneys(req, res) {
    try {
      const userId = req.user.id;

      // Get user's active loopchain progress
      const activeProgress = await prisma.userProgress.findMany({
        where: {
          userId,
          status: 'IN_PROGRESS'
        },
        include: {
          loopchain: {
            include: {
              steps: {
                orderBy: { stepNumber: 'asc' },
                include: {
                  looproom: {
                    select: {
                      title: true,
                      category: {
                        select: {
                          slug: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Transform to expected format
      const activeJourneys = activeProgress.map(progress => {
        const categorySlug = progress.loopchain.steps[0]?.looproom?.category?.slug || 'recovery';
        let theme = 'recovery';

        if (categorySlug.includes('meditation') || categorySlug.includes('mindful')) theme = 'meditation';
        else if (categorySlug.includes('fitness') || categorySlug.includes('movement')) theme = 'fitness';

        // Find next session
        const nextStep = progress.loopchain.steps[progress.currentStep - 1];
        const nextSession = nextStep ? nextStep.title || nextStep.looproom.title : 'Complete';

        return {
          id: progress.loopchainId,
          title: progress.loopchain.title,
          description: progress.loopchain.description,
          theme,
          currentStep: progress.currentStep,
          totalSteps: progress.totalSteps,
          progress: progress.progressPercent,
          nextSession,
          nextSessionTime: '9:00 AM', // Mock - you could implement actual scheduling
          timeSpent: Math.floor(progress.timeSpent / 60), // Convert to minutes
          daysActive: Math.floor((Date.now() - new Date(progress.startedAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
        };
      });

      res.status(200).json({
        success: true,
        data: activeJourneys,
        message: 'Active journeys retrieved successfully'
      });

    } catch (error) {
      console.error('Error retrieving active journeys:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active journeys',
        error: error.message
      });
    }
  }

  /**
   * Start a new journey (loopchain)
   */
  static async startJourney(req, res) {
    try {
      const userId = req.user.id;
      const { loopchainId } = req.body;

      // Check if loopchain exists
      const loopchain = await prisma.loopchain.findUnique({
        where: { id: loopchainId },
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' }
          }
        }
      });

      if (!loopchain) {
        return res.status(404).json({
          success: false,
          message: 'Journey (Loopchain) not found'
        });
      }

      // Check if user already has progress on this loopchain
      const existingProgress = await prisma.userProgress.findUnique({
        where: {
          userId_loopchainId: {
            userId,
            loopchainId
          }
        }
      });

      if (existingProgress) {
        return res.status(409).json({
          success: false,
          message: 'You have already started this journey'
        });
      }

      // Create new progress record
      const progress = await prisma.userProgress.create({
        data: {
          userId,
          loopchainId,
          status: 'IN_PROGRESS',
          currentStep: 1,
          totalSteps: loopchain.steps.length,
          progressPercent: 0,
          timeSpent: 0
        }
      });

      res.status(201).json({
        success: true,
        data: progress,
        message: 'Journey started successfully'
      });

    } catch (error) {
      console.error('Error starting journey:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start journey',
        error: error.message
      });
    }
  }

  /**
   * Update journey progress
   */
  static async updateJourneyProgress(req, res) {
    try {
      const userId = req.user.id;
      const { loopchainId, stepCompleted, timeSpent, confidenceLevel, moodBefore, moodAfter } = req.body;

      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_loopchainId: {
            userId,
            loopchainId
          }
        },
        include: {
          loopchain: {
            include: {
              steps: true
            }
          }
        }
      });

      if (!progress) {
        return res.status(404).json({
          success: false,
          message: 'Journey progress not found'
        });
      }

      // Calculate new progress
      const completedSteps = progress.completedSteps + (stepCompleted ? 1 : 0);
      const newProgressPercent = (completedSteps / progress.totalSteps) * 100;
      const newStatus = newProgressPercent >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

      // Update progress
      const updatedProgress = await prisma.userProgress.update({
        where: {
          userId_loopchainId: {
            userId,
            loopchainId
          }
        },
        data: {
          ...(stepCompleted && {
            currentStep: Math.min(progress.currentStep + 1, progress.totalSteps),
            completedSteps
          }),
          progressPercent: newProgressPercent,
          status: newStatus,
          timeSpent: progress.timeSpent + (timeSpent || 0),
          ...(confidenceLevel && { confidenceLevel }),
          ...(moodBefore && { moodBefore: JSON.stringify(moodBefore) }),
          ...(moodAfter && { moodAfter: JSON.stringify(moodAfter) }),
          lastActiveAt: new Date(),
          ...(newStatus === 'COMPLETED' && { completedAt: new Date() })
        }
      });

      // Update user profile if journey completed
      if (newStatus === 'COMPLETED') {
        await prisma.userProfile.update({
          where: { userId },
          data: {
            completedLoopchains: { increment: 1 }
          }
        });
      }

      res.status(200).json({
        success: true,
        data: updatedProgress,
        message: 'Journey progress updated successfully'
      });

    } catch (error) {
      console.error('Error updating journey progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update journey progress',
        error: error.message
      });
    }
  }

  /**
   * Get available journeys (loopchains) to start
   */
  static async getAvailableJourneys(req, res) {
    try {
      const userId = req.user.id;

      // Get published loopchains
      const loopchains = await prisma.loopchain.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          steps: {
            orderBy: { stepNumber: 'asc' },
            include: {
              looproom: {
                select: {
                  category: {
                    select: {
                      slug: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              userProgress: {
                where: { status: 'COMPLETED' }
              }
            }
          }
        }
      });

      // Get user's existing progress to filter out started journeys
      const userProgress = await prisma.userProgress.findMany({
        where: { userId },
        select: { loopchainId: true }
      });

      const startedLoopchainIds = new Set(userProgress.map(p => p.loopchainId));

      // Format available journeys
      const availableJourneys = loopchains
        .filter(loopchain => !startedLoopchainIds.has(loopchain.id))
        .map(loopchain => {
          const categorySlug = loopchain.steps[0]?.looproom?.category?.slug || 'recovery';
          let theme = 'recovery';

          if (categorySlug.includes('meditation') || categorySlug.includes('mindful')) theme = 'meditation';
          else if (categorySlug.includes('fitness') || categorySlug.includes('movement')) theme = 'fitness';

          return {
            id: loopchain.id,
            title: loopchain.title,
            description: loopchain.description,
            theme,
            steps: loopchain.steps.length,
            duration: loopchain.estimatedDuration ? `${loopchain.estimatedDuration} min` : 'Variable',
            difficulty: loopchain.difficulty || 'All Levels',
            completions: loopchain._count.userProgress,
            rating: 4.5 + Math.random() * 0.5, // Mock rating
            creator: loopchain.creator.profile?.displayName ||
                    `${loopchain.creator.profile?.firstName || ''} ${loopchain.creator.profile?.lastName || ''}`.trim() ||
                    'VYBE Creator',
            isPopular: loopchain._count.userProgress > 10,
            isNew: (Date.now() - new Date(loopchain.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
          };
        });

      res.status(200).json({
        success: true,
        data: availableJourneys,
        message: 'Available journeys retrieved successfully'
      });

    } catch (error) {
      console.error('Error retrieving available journeys:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve available journeys',
        error: error.message
      });
    }
  }
}

module.exports = UserProgressController;