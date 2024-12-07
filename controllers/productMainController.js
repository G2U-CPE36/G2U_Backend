
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



exports.getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    province,
    minPrice,
    maxPrice,
    random = "true", // Flag for randomization
  } = req.query;

  try {
    const filters = {
      status: true, // Only active products
    };

    // Apply filters
    if (category) {
      filters.categoryId = parseInt(category);
    }

    if (province) {
      filters.User = {
        UserAddresses: {
          some: { province },
        },
      };
    }

    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }

    let products;

    if (random === "true") {
      console.log(`Fetching random products for page ${page}`);

      // Count total products that match the filters
      const productCount = await prisma.product.count({ where: filters });

      // Ensure no overlap by adjusting random offset based on the page
      const randomIndexes = [];
      const seenIndexes = new Set();

      while (
        randomIndexes.length < limit &&
        seenIndexes.size + randomIndexes.length < productCount
      ) {
        const randomIndex = Math.floor(Math.random() * productCount);

        // Ensure unique random indexes across pages
        if (!seenIndexes.has(randomIndex)) {
          randomIndexes.push(randomIndex);
          seenIndexes.add(randomIndex);
        }
      }

      // Fetch products by these random indexes
      products = await Promise.all(
        randomIndexes.map(async (index) =>
          prisma.product.findFirst({
            where: filters,
            skip: index,
            include: {
              Category: true,
              User: {
                select: {
                  userId: true,
                  username: true,
                  email: true,
                  UserAddresses: { select: { province: true } },
                },
              },
            },
          })
        )
      );
    } else {
      console.log("Fetching filtered or paginated products");

      // Calculate offset for pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Fetch products with filters, sorting, and pagination
      products = await prisma.product.findMany({
        where: filters,
        include: {
          Category: true,
          User: {
            select: {
              userId: true,
              username: true,
              email: true,
              UserAddresses: { select: { province: true } },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip: offset,
        take: parseInt(limit),
      });
    }

    // Format the product data
    const formattedProducts = products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      description: product.productDescription,
      price: product.price,
      categoryId: product.categoryId,
      province: product.User?.UserAddresses?.[0]?.province || "Unknown",
      username: product.User?.username || "Anonymous",
      email: product.User?.email || "N/A",
      picture: product.productImage || null,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchProducts = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    province,
    minPrice,
    maxPrice,
    search,
  } = req.query;

  try {
    const filters = {
      status: true, // Ensure only products in stock are fetched
    };

    // Apply category filter
    if (category) {
      filters.categoryId = parseInt(category); // Filter by category ID
    }

    // Apply province filter
    if (province) {
      filters.User = {
        UserAddresses: {
          some: { province }, // Filter by province in user addresses
        },
      };
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }

    // Search by productName or productDescription
    if (search) {
      filters.OR = [
        { productName: { contains: search, mode: "insensitive" } }, // Case-insensitive search on productName
        { productDescription: { contains: search, mode: "insensitive" } }, // Case-insensitive search on productDescription
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Fetch products with filters, pagination, and sorting
    const products = await prisma.product.findMany({
      where: filters,
      include: {
        Category: true, // Include category details
        User: {
          select: {
            userId: true,
            username: true,
            email: true,
            UserAddresses: { select: { province: true } }, // Include province
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Sort by latest update
      },
      skip: offset,
      take: parseInt(limit),
    });

    // Format products
    const formattedProducts = products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      description: product.productDescription,
      price: product.price,
      categoryId: product.categoryId,
      province: product.User?.UserAddresses?.[0]?.province || "Unknown",
      username: product.User?.username || "Anonymous",
      email: product.User?.email || "N/A",
      picture: product.productImage || null, // Include picture field
    }));

    // Return the products directly
    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};