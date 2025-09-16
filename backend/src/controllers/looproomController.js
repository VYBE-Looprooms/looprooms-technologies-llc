const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LooproomController {
  /**
   * Get all published looprooms with filtering and pagination
   */
  static async getAllLooprooms(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        contentType,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        isPremium
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      // Build filter conditions
      const where = {
        status: 'PUBLISHED',
        ...(category && { category: { slug: category } }),
        ...(contentType && { contentType }),
        ...(isPremium !== undefined && { isPremium: isPremium === 'true' }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { keywords: { has: search } }
          ]
        })
      };

      const [looprooms, totalCount] = await Promise.all([
        prisma.looproom.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          include: {
            creator: {
              select: {
                id: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            },
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                }
              }
            },
            _count: {
              select: {
                reactions: true,
                looplistItems: true
              }
            }
          }
        }),
        prisma.looproom.count({ where })
      ]);

      // Format response
      const formattedLooprooms = looprooms.map(looproom => ({
        id: looproom.id,
        title: looproom.title,
        slug: looproom.slug,
        description: looproom.description,
        thumbnail: looproom.thumbnail,
        contentType: looproom.contentType,
        contentUrl: looproom.contentUrl,
        duration: looproom.duration,
        difficulty: looproom.difficulty,
        isPremium: looproom.isPremium,
        viewCount: looproom.viewCount,
        reactionCount: looproom._count.reactions,
        saveCount: looproom._count.looplistItems,
        averageRating: looproom.averageRating,
        createdAt: looproom.createdAt,
        publishedAt: looproom.publishedAt,
        creator: {
          id: looproom.creator.id,
          name: looproom.creator.profile?.displayName ||
                `${looproom.creator.profile?.firstName || ''} ${looproom.creator.profile?.lastName || ''}`.trim(),
          avatar: looproom.creator.profile?.avatarUrl
        },
        category: looproom.category,
        tags: looproom.tags.map(t => t.tag)
      }));

      res.json({
        success: true,
        data: formattedLooprooms,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get looprooms error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch looprooms',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get a specific looproom by ID
   */
  static async getLooproomById(req, res) {
    try {
      const { id } = req.params;

      const looproom = await prisma.looproom.findFirst({
        where: {
          id,
          status: 'PUBLISHED'
        },
        include: {
          creator: {
            select: {
              id: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  displayName: true,
                  avatarUrl: true,
                  bio: true
                }
              }
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          },
          reactions: {
            select: {
              type: true,
              userId: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              reactions: true,
              looplistItems: true
            }
          }
        }
      });

      if (!looproom) {
        return res.status(404).json({
          success: false,
          message: 'Looproom not found'
        });
      }

      // Group reactions by type
      const reactionsByType = looproom.reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      }, {});

      const response = {
        id: looproom.id,
        title: looproom.title,
        slug: looproom.slug,
        description: looproom.description,
        thumbnail: looproom.thumbnail,
        contentType: looproom.contentType,
        contentUrl: looproom.contentUrl,
        duration: looproom.duration,
        difficulty: looproom.difficulty,
        isPremium: looproom.isPremium,
        viewCount: looproom.viewCount,
        averageRating: looproom.averageRating,
        transcription: looproom.transcription,
        keywords: looproom.keywords,
        createdAt: looproom.createdAt,
        publishedAt: looproom.publishedAt,
        creator: {
          id: looproom.creator.id,
          name: looproom.creator.profile?.displayName ||
                `${looproom.creator.profile?.firstName || ''} ${looproom.creator.profile?.lastName || ''}`.trim(),
          avatar: looproom.creator.profile?.avatarUrl,
          bio: looproom.creator.profile?.bio
        },
        category: looproom.category,
        tags: looproom.tags.map(t => t.tag),
        stats: {
          reactions: reactionsByType,
          totalReactions: looproom._count.reactions,
          saves: looproom._count.looplistItems
        }
      };

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Get looproom error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch looproom',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get looprooms by category
   */
  static async getLooproomsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const [looprooms, totalCount, category] = await Promise.all([
        prisma.looproom.findMany({
          where: {
            categoryId,
            status: 'PUBLISHED'
          },
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          include: {
            creator: {
              select: {
                id: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            },
            _count: {
              select: {
                reactions: true,
                looplistItems: true
              }
            }
          }
        }),
        prisma.looproom.count({
          where: { categoryId, status: 'PUBLISHED' }
        }),
        prisma.category.findUnique({
          where: { id: categoryId }
        })
      ]);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const formattedLooprooms = looprooms.map(looproom => ({
        id: looproom.id,
        title: looproom.title,
        slug: looproom.slug,
        description: looproom.description,
        thumbnail: looproom.thumbnail,
        contentType: looproom.contentType,
        duration: looproom.duration,
        difficulty: looproom.difficulty,
        isPremium: looproom.isPremium,
        viewCount: looproom.viewCount,
        reactionCount: looproom._count.reactions,
        saveCount: looproom._count.looplistItems,
        createdAt: looproom.createdAt,
        publishedAt: looproom.publishedAt,
        creator: {
          id: looproom.creator.id,
          name: looproom.creator.profile?.displayName ||
                `${looproom.creator.profile?.firstName || ''} ${looproom.creator.profile?.lastName || ''}`.trim(),
          avatar: looproom.creator.profile?.avatarUrl
        },
        category: looproom.category
      }));

      res.json({
        success: true,
        data: {
          category,
          looprooms: formattedLooprooms
        },
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get looprooms by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch looprooms by category',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Create a new looproom (creators only)
   */
  static async createLooproom(req, res) {
    try {
      const {
        title,
        description,
        categoryId,
        contentType,
        contentUrl,
        thumbnail,
        duration,
        difficulty = 'Beginner',
        keywords = [],
        tags = [],
        isPremium = false,
        previewDuration
      } = req.body;

      const userId = req.user.id;

      // Check if user is a creator
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || (user.role !== 'CREATOR' && user.role !== 'ADMIN')) {
        return res.status(403).json({
          success: false,
          message: 'Only creators can create looprooms'
        });
      }

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now();

      // Verify category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }

      const looproom = await prisma.looproom.create({
        data: {
          title,
          slug,
          description,
          thumbnail,
          contentType,
          contentUrl,
          duration,
          difficulty,
          keywords,
          isPremium,
          previewDuration,
          status: 'DRAFT', // Start as draft
          creatorId: userId,
          categoryId
        },
        include: {
          creator: {
            select: {
              id: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  displayName: true,
                  avatarUrl: true
                }
              }
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          }
        }
      });

      // Handle tags if provided
      if (tags && tags.length > 0) {
        const tagConnections = [];

        for (const tagName of tags) {
          // Find or create tag
          const tag = await prisma.tag.upsert({
            where: { name: tagName },
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            },
            update: {}
          });

          tagConnections.push({
            looproomId: looproom.id,
            tagId: tag.id
          });
        }

        await prisma.looproomTag.createMany({
          data: tagConnections
        });
      }

      res.status(201).json({
        success: true,
        message: 'Looproom created successfully',
        data: {
          id: looproom.id,
          title: looproom.title,
          slug: looproom.slug,
          status: looproom.status,
          creator: looproom.creator,
          category: looproom.category
        }
      });
    } catch (error) {
      console.error('Create looproom error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create looproom',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update a looproom
   */
  static async updateLooproom(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if looproom exists
      const existingLooproom = await prisma.looproom.findUnique({
        where: { id }
      });

      if (!existingLooproom) {
        return res.status(404).json({
          success: false,
          message: 'Looproom not found'
        });
      }

      // Check permissions
      if (existingLooproom.creatorId !== userId && userRole !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own looprooms'
        });
      }

      const {
        title,
        description,
        categoryId,
        contentUrl,
        thumbnail,
        duration,
        difficulty,
        keywords,
        isPremium,
        previewDuration,
        status
      } = req.body;

      // Update slug if title changed
      let slug = existingLooproom.slug;
      if (title && title !== existingLooproom.title) {
        slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          + '-' + Date.now();
      }

      const updateData = {
        ...(title && { title, slug }),
        ...(description !== undefined && { description }),
        ...(categoryId && { categoryId }),
        ...(contentUrl && { contentUrl }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(duration !== undefined && { duration }),
        ...(difficulty && { difficulty }),
        ...(keywords !== undefined && { keywords }),
        ...(isPremium !== undefined && { isPremium }),
        ...(previewDuration !== undefined && { previewDuration }),
        ...(status && { status, ...(status === 'PUBLISHED' && { publishedAt: new Date() }) })
      };

      const looproom = await prisma.looproom.update({
        where: { id },
        data: updateData,
        include: {
          creator: {
            select: {
              id: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  displayName: true,
                  avatarUrl: true
                }
              }
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Looproom updated successfully',
        data: looproom
      });
    } catch (error) {
      console.error('Update looproom error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update looproom',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Delete a looproom
   */
  static async deleteLooproom(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if looproom exists
      const existingLooproom = await prisma.looproom.findUnique({
        where: { id }
      });

      if (!existingLooproom) {
        return res.status(404).json({
          success: false,
          message: 'Looproom not found'
        });
      }

      // Check permissions
      if (existingLooproom.creatorId !== userId && userRole !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own looprooms'
        });
      }

      await prisma.looproom.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Looproom deleted successfully'
      });
    } catch (error) {
      console.error('Delete looproom error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete looproom',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Add reaction to looproom
   */
  static async addReaction(req, res) {
    try {
      const { id } = req.params;
      const { type, isAnonymous = false } = req.body;
      const userId = req.user.id;

      const looproom = await prisma.looproom.findUnique({
        where: { id, status: 'PUBLISHED' }
      });

      if (!looproom) {
        return res.status(404).json({
          success: false,
          message: 'Looproom not found'
        });
      }

      // Use upsert to handle adding or updating reaction
      const reaction = await prisma.reaction.upsert({
        where: {
          userId_reactableType_reactableId_type: {
            userId,
            reactableType: 'LOOPROOM',
            reactableId: id,
            type
          }
        },
        create: {
          userId,
          type,
          reactableType: 'LOOPROOM',
          reactableId: id,
          isAnonymous
        },
        update: {
          type,
          isAnonymous
        }
      });

      res.json({
        success: true,
        message: 'Reaction added successfully',
        data: reaction
      });
    } catch (error) {
      console.error('Add reaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add reaction',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Remove reaction from looproom
   */
  static async removeReaction(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const userId = req.user.id;

      await prisma.reaction.deleteMany({
        where: {
          userId,
          reactableType: 'LOOPROOM',
          reactableId: id,
          ...(type && { type })
        }
      });

      res.json({
        success: true,
        message: 'Reaction removed successfully'
      });
    } catch (error) {
      console.error('Remove reaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove reaction',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Increment view count
   */
  static async incrementViewCount(req, res) {
    try {
      const { id } = req.params;

      await prisma.looproom.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });

      res.json({
        success: true,
        message: 'View count updated'
      });
    } catch (error) {
      console.error('Increment view count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to increment view count'
      });
    }
  }

  /**
   * Get looproom analytics
   */
  static async getLooproomAnalytics(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const looproom = await prisma.looproom.findUnique({
        where: { id }
      });

      if (!looproom) {
        return res.status(404).json({
          success: false,
          message: 'Looproom not found'
        });
      }

      // Check permissions
      if (looproom.creatorId !== userId && userRole !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'You can only view analytics for your own looprooms'
        });
      }

      // Get analytics data
      const [reactions, saves, analytics] = await Promise.all([
        prisma.reaction.groupBy({
          by: ['type'],
          where: {
            reactableType: 'LOOPROOM',
            reactableId: id
          },
          _count: true
        }),
        prisma.looplistItem.count({
          where: { looproomId: id }
        }),
        prisma.contentAnalytics.findMany({
          where: {
            contentType: 'looproom',
            contentId: id
          },
          orderBy: { date: 'desc' },
          take: 30
        })
      ]);

      const reactionsByType = reactions.reduce((acc, r) => {
        acc[r.type] = r._count;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          views: looproom.viewCount,
          reactions: reactionsByType,
          saves,
          dailyAnalytics: analytics
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get looprooms by creator
   */
  static async getLooproomsByCreator(req, res) {
    try {
      const { creatorId } = req.params;
      const { page = 1, limit = 12, status = 'PUBLISHED' } = req.query;
      const requesterId = req.user?.id;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      // If requesting own looprooms, allow all statuses, otherwise only published
      const whereCondition = {
        creatorId,
        ...(requesterId === creatorId ?
          (status !== 'ALL' ? { status } : {}) :
          { status: 'PUBLISHED' }
        )
      };

      const [looprooms, totalCount] = await Promise.all([
        prisma.looproom.findMany({
          where: whereCondition,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            },
            _count: {
              select: {
                reactions: true,
                looplistItems: true
              }
            }
          }
        }),
        prisma.looproom.count({ where: whereCondition })
      ]);

      const formattedLooprooms = looprooms.map(looproom => ({
        id: looproom.id,
        title: looproom.title,
        slug: looproom.slug,
        description: looproom.description,
        thumbnail: looproom.thumbnail,
        contentType: looproom.contentType,
        duration: looproom.duration,
        status: looproom.status,
        viewCount: looproom.viewCount,
        reactionCount: looproom._count.reactions,
        saveCount: looproom._count.looplistItems,
        createdAt: looproom.createdAt,
        publishedAt: looproom.publishedAt,
        category: looproom.category
      }));

      res.json({
        success: true,
        data: formattedLooprooms,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get looprooms by creator error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch creator looprooms',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = LooproomController;