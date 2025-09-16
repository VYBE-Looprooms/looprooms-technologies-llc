const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SocialFeedController {
  /**
   * Get social feed posts (SharedVybes) with filtering
   */
  static async getFeedPosts(req, res) {
    try {
      const userId = req.user?.id;
      const {
        page = 1,
        limit = 10,
        type,
        theme,
        includeAnonymous = true
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      // Build filter conditions
      const where = {
        // Only show posts that are not reported or have been reviewed
        OR: [
          { isReported: false },
          { moderatedAt: { not: null } }
        ],
        ...(type && { type }),
        ...(includeAnonymous === 'false' && { isAnonymous: false })
      };

      // If theme filter is provided, filter by looproom category
      if (theme) {
        where.OR = [
          {
            looproom: {
              category: {
                slug: { contains: theme }
              }
            }
          },
          {
            loopchain: {
              steps: {
                some: {
                  looproom: {
                    category: {
                      slug: { contains: theme }
                    }
                  }
                }
              }
            }
          }
        ];
      }

      const [posts, totalCount] = await Promise.all([
        prisma.sharedVybe.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                role: true,
                profile: {
                  select: {
                    displayName: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true
                  }
                },
                creatorApplication: {
                  select: {
                    status: true
                  }
                }
              }
            },
            looproom: {
              select: {
                id: true,
                title: true,
                category: {
                  select: {
                    name: true,
                    slug: true
                  }
                },
                viewCount: true
              }
            },
            reactions: {
              select: {
                type: true,
                isAnonymous: true,
                user: {
                  select: {
                    id: true
                  }
                }
              }
            },
            comments: {
              select: {
                id: true,
                content: true,
                isAnonymous: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    profile: {
                      select: {
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                      }
                    }
                  }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 3 // Only get latest 3 comments for feed
            }
          }
        }),
        prisma.sharedVybe.count({ where })
      ]);

      // Format posts for frontend
      const formattedPosts = posts.map(post => {
        // Determine theme based on looproom category
        let theme = 'recovery';
        if (post.looproom?.category?.slug) {
          const slug = post.looproom.category.slug;
          if (slug.includes('meditation') || slug.includes('mindful')) theme = 'meditation';
          else if (slug.includes('fitness') || slug.includes('movement')) theme = 'fitness';
          else if (slug.includes('music') || slug.includes('sound')) theme = 'music';
          else if (slug.includes('art') || slug.includes('creative')) theme = 'art';
        }

        // Count reactions by type
        const reactionCounts = post.reactions.reduce((acc, reaction) => {
          const type = reaction.type.toLowerCase();
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        // Check if current user reacted
        const userReacted = userId ? post.reactions.find(r => r.user.id === userId)?.type?.toLowerCase() : null;

        // Format author info
        const author = {
          id: post.user.id,
          name: post.isAnonymous ? 'Anonymous' : (
            post.user.profile?.displayName ||
            `${post.user.profile?.firstName || ''} ${post.user.profile?.lastName || ''}`.trim() ||
            'VYBE Member'
          ),
          avatar: post.isAnonymous ? null : post.user.profile?.avatarUrl,
          isCreator: post.user.role === 'CREATOR' || post.user.creatorApplication?.status === 'APPROVED',
          isVerified: post.user.role === 'CREATOR' || post.user.role === 'ADMIN',
          title: post.user.role === 'CREATOR' ? 'Creator' : undefined
        };

        return {
          id: post.id,
          author,
          content: post.content,
          timestamp: formatRelativeTime(post.createdAt),
          theme,
          isAnonymous: post.isAnonymous,
          looproom: post.looproom ? {
            id: post.looproom.id,
            title: post.looproom.title,
            category: post.looproom.category.name,
            participants: post.looproom.viewCount || 0,
            isLive: false // TODO: Check for active sessions
          } : null,
          stats: {
            likes: post.reactionCount,
            comments: post.commentCount,
            shares: post.shareCount
          },
          reactions: {
            fire: reactionCounts.fire || 0,
            heart: reactionCounts.heart || 0,
            growth: reactionCounts.growth || reactionCounts.inspire || 0,
            sparkle: reactionCounts.sparkle || reactionCounts.gratitude || 0
          },
          userReacted,
          isBookmarked: false, // TODO: Implement bookmarking
          comments: post.comments.slice(0, 2).map(comment => ({
            id: comment.id,
            content: comment.content,
            author: comment.isAnonymous ? 'Anonymous' : (
              comment.user.profile?.displayName ||
              `${comment.user.profile?.firstName || ''} ${comment.user.profile?.lastName || ''}`.trim() ||
              'VYBE Member'
            ),
            timestamp: formatRelativeTime(comment.createdAt)
          }))
        };
      });

      res.status(200).json({
        success: true,
        data: formattedPosts,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        },
        message: 'Feed posts retrieved successfully'
      });

    } catch (error) {
      console.error('Error retrieving feed posts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve feed posts',
        error: error.message
      });
    }
  }

  /**
   * Create a new shared vybe (post)
   */
  static async createPost(req, res) {
    try {
      const userId = req.user.id;
      const {
        content,
        type = 'REFLECTION',
        isAnonymous = false,
        looproomId,
        loopchainId,
        privacyLevel = 'PUBLIC'
      } = req.body;

      // Validate content length
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Post content is required'
        });
      }

      if (content.length > 2000) {
        return res.status(400).json({
          success: false,
          message: 'Post content must be less than 2000 characters'
        });
      }

      // Create the post
      const post = await prisma.sharedVybe.create({
        data: {
          userId,
          content: content.trim(),
          type,
          isAnonymous,
          privacyLevel,
          looproomId,
          loopchainId
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              profile: {
                select: {
                  displayName: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true
                }
              }
            }
          },
          looproom: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  name: true,
                  slug: true
                }
              }
            }
          }
        }
      });

      // Update user's shared vybes count
      await prisma.userProfile.update({
        where: { userId },
        data: {
          vibesShared: { increment: 1 }
        }
      });

      // Format response
      const formattedPost = {
        id: post.id,
        author: {
          id: post.user.id,
          name: post.isAnonymous ? 'Anonymous' : (
            post.user.profile?.displayName ||
            `${post.user.profile?.firstName || ''} ${post.user.profile?.lastName || ''}`.trim() ||
            'VYBE Member'
          ),
          avatar: post.isAnonymous ? null : post.user.profile?.avatarUrl,
          isCreator: post.user.role === 'CREATOR',
          isVerified: post.user.role === 'CREATOR' || post.user.role === 'ADMIN'
        },
        content: post.content,
        timestamp: 'Just now',
        theme: post.looproom?.category?.slug?.includes('meditation') ? 'meditation' :
               post.looproom?.category?.slug?.includes('fitness') ? 'fitness' : 'recovery',
        isAnonymous: post.isAnonymous,
        looproom: post.looproom,
        stats: {
          likes: 0,
          comments: 0,
          shares: 0
        },
        reactions: {
          fire: 0,
          heart: 0,
          growth: 0,
          sparkle: 0
        },
        userReacted: null,
        isBookmarked: false
      };

      res.status(201).json({
        success: true,
        data: formattedPost,
        message: 'Post created successfully'
      });

    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: error.message
      });
    }
  }

  /**
   * Add reaction to a post
   */
  static async addReaction(req, res) {
    try {
      const userId = req.user.id;
      const { postId } = req.params;
      const { type, isAnonymous = false } = req.body;

      // Validate reaction type
      const validTypes = ['HEART', 'CLAP', 'FIRE', 'PEACE', 'INSPIRE', 'STRENGTH', 'GRATITUDE', 'MINDFUL'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid reaction type'
        });
      }

      // Check if post exists
      const post = await prisma.sharedVybe.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // Check for existing reaction
      const existingReaction = await prisma.reaction.findUnique({
        where: {
          userId_reactableType_reactableId_type: {
            userId,
            reactableType: 'SHARED_VYBE',
            reactableId: postId,
            type
          }
        }
      });

      if (existingReaction) {
        return res.status(409).json({
          success: false,
          message: 'You have already reacted with this type'
        });
      }

      // Remove any existing reaction of different type
      await prisma.reaction.deleteMany({
        where: {
          userId,
          reactableType: 'SHARED_VYBE',
          reactableId: postId
        }
      });

      // Add new reaction
      await prisma.reaction.create({
        data: {
          userId,
          type,
          reactableType: 'SHARED_VYBE',
          reactableId: postId,
          isAnonymous
        }
      });

      // Update post reaction count
      const reactionCount = await prisma.reaction.count({
        where: {
          reactableType: 'SHARED_VYBE',
          reactableId: postId
        }
      });

      await prisma.sharedVybe.update({
        where: { id: postId },
        data: { reactionCount }
      });

      res.status(200).json({
        success: true,
        message: 'Reaction added successfully'
      });

    } catch (error) {
      console.error('Error adding reaction:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add reaction',
        error: error.message
      });
    }
  }

  /**
   * Remove reaction from a post
   */
  static async removeReaction(req, res) {
    try {
      const userId = req.user.id;
      const { postId } = req.params;

      // Remove user's reaction
      await prisma.reaction.deleteMany({
        where: {
          userId,
          reactableType: 'SHARED_VYBE',
          reactableId: postId
        }
      });

      // Update post reaction count
      const reactionCount = await prisma.reaction.count({
        where: {
          reactableType: 'SHARED_VYBE',
          reactableId: postId
        }
      });

      await prisma.sharedVybe.update({
        where: { id: postId },
        data: { reactionCount }
      });

      res.status(200).json({
        success: true,
        message: 'Reaction removed successfully'
      });

    } catch (error) {
      console.error('Error removing reaction:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove reaction',
        error: error.message
      });
    }
  }

  /**
   * Add comment to a post
   */
  static async addComment(req, res) {
    try {
      const userId = req.user.id;
      const { postId } = req.params;
      const { content, isAnonymous = false } = req.body;

      // Validate content
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Comment content is required'
        });
      }

      if (content.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Comment must be less than 500 characters'
        });
      }

      // Check if post exists
      const post = await prisma.sharedVybe.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // Create comment
      const comment = await prisma.comment.create({
        data: {
          userId,
          sharedVybeId: postId,
          content: content.trim(),
          isAnonymous
        },
        include: {
          user: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true
                }
              }
            }
          }
        }
      });

      // Update post comment count
      const commentCount = await prisma.comment.count({
        where: { sharedVybeId: postId }
      });

      await prisma.sharedVybe.update({
        where: { id: postId },
        data: { commentCount }
      });

      // Format response
      const formattedComment = {
        id: comment.id,
        content: comment.content,
        author: comment.isAnonymous ? 'Anonymous' : (
          comment.user.profile?.displayName ||
          `${comment.user.profile?.firstName || ''} ${comment.user.profile?.lastName || ''}`.trim() ||
          'VYBE Member'
        ),
        timestamp: 'Just now',
        isAnonymous: comment.isAnonymous
      };

      res.status(201).json({
        success: true,
        data: formattedComment,
        message: 'Comment added successfully'
      });

    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add comment',
        error: error.message
      });
    }
  }
}

// Helper function to format relative time
function formatRelativeTime(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return new Date(date).toLocaleDateString();
}

module.exports = SocialFeedController;