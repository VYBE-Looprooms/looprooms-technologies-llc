const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryController {
  /**
   * Get all active categories
   */
  static async getAllCategories(req, res) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          iconUrl: true,
          sortOrder: true,
          _count: {
            select: {
              looprooms: {
                where: { status: 'PUBLISHED' }
              }
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        data: categories.map(category => ({
          ...category,
          looproomCount: category._count.looprooms
        })),
        message: 'Categories retrieved successfully'
      });

    } catch (error) {
      console.error('Error retrieving categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: error.message
      });
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(req, res) {
    try {
      const { slug } = req.params;

      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          looprooms: {
            where: { status: 'PUBLISHED' },
            take: 12,
            orderBy: { viewCount: 'desc' },
            include: {
              creator: {
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
              },
              tags: {
                select: {
                  tag: {
                    select: {
                      name: true,
                      slug: true
                    }
                  }
                }
              },
              _count: {
                select: {
                  reactions: true
                }
              }
            }
          },
          _count: {
            select: {
              looprooms: {
                where: { status: 'PUBLISHED' }
              }
            }
          }
        }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Format the response
      const formattedCategory = {
        ...category,
        looproomCount: category._count.looprooms,
        looprooms: category.looprooms.map(looproom => ({
          ...looproom,
          creator: {
            id: looproom.creator.id,
            name: looproom.creator.profile?.displayName ||
                  `${looproom.creator.profile?.firstName || ''} ${looproom.creator.profile?.lastName || ''}`.trim() ||
                  'VYBE Creator',
            avatar: looproom.creator.profile?.avatarUrl
          },
          tags: looproom.tags.map(t => t.tag),
          reactionCount: looproom._count.reactions
        }))
      };

      delete formattedCategory._count;

      res.status(200).json({
        success: true,
        data: formattedCategory,
        message: 'Category retrieved successfully'
      });

    } catch (error) {
      console.error('Error retrieving category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve category',
        error: error.message
      });
    }
  }

  /**
   * Create new category (Admin only)
   */
  static async createCategory(req, res) {
    try {
      const { name, slug, description, color, iconUrl, sortOrder } = req.body;

      // Check if category with slug already exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug }
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Category with this slug already exists'
        });
      }

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description,
          color,
          iconUrl,
          sortOrder: sortOrder || 0,
          isActive: true
        }
      });

      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      });

    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message
      });
    }
  }

  /**
   * Update category (Admin only)
   */
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await prisma.category.update({
        where: { id },
        data: updateData
      });

      res.status(200).json({
        success: true,
        data: category,
        message: 'Category updated successfully'
      });

    } catch (error) {
      console.error('Error updating category:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error.message
      });
    }
  }

  /**
   * Delete category (Admin only)
   */
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      // Check if category has looprooms
      const looproomCount = await prisma.looproom.count({
        where: { categoryId: id }
      });

      if (looproomCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category with ${looproomCount} associated looprooms`
        });
      }

      await prisma.category.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error.message
      });
    }
  }
}

module.exports = CategoryController;