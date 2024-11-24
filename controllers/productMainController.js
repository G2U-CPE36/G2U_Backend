const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllMainProducts = async (req, res) => {
  try {
    // Fetch random products from the database using raw SQL
    const products =
      await prisma.$queryRaw`SELECT * FROM "Product" ORDER BY RANDOM() LIMIT 10`;

    // Include related data such as categories, users, and addresses
    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        const userWithAddress = await prisma.user.findUnique({
          where: { userId: product.userId }, // assuming `userId` is the foreign key
          select: {
            username: true,
            email: true,
            UserAddresses: { select: { province: true } },
          },
        });

        return {
          ...product,
          province: userWithAddress?.UserAddresses[0]?.province || null,
          username: userWithAddress?.username,
          email: userWithAddress?.email,
        };
      })
    );

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchAndFilterProducts = async (req, res) => {
  const { minPrice, maxPrice, province, categoryId } = req.query;

  try {
    // Construct filter options
    const filters = {};

    // Price Range filter
    if (minPrice && maxPrice) {
      filters.price = {
        gte: parseFloat(minPrice), // Greater than or equal to minPrice
        lte: parseFloat(maxPrice), // Less than or equal to maxPrice
      };
    }

    // Province filter with correct nested relation filter
    if (province) {
      filters.User = {
        UserAddresses: {
          some: {
            province: province, // Filter by province inside UserAddresses
          },
        },
      };
    }

    // Category filter
    if (categoryId) {
      filters.categoryId = parseInt(categoryId); // Filter by category ID
    }

    // Fetch filtered products from the database
    const products = await prisma.product.findMany({
      where: filters,
      include: {
        Category: true,
        User: {
          select: {
            username: true,
            email: true,
            UserAddresses: { select: { province: true } }, // Fetch province from UserAddresses
          },
        },
      },
    });

    // Format products to include province info correctly, without duplicating
    const formattedProducts = products.map((product) => ({
      ...product,
      User: {
        ...product.User, // Keep the User object intact
        UserAddresses: product.User.UserAddresses, // Keep UserAddresses with the province
      },
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
