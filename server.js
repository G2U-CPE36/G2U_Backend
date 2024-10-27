const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //ทำให้สามารถส่งbody ไปด้วยได้

const { PrismaClient } = require("@prisma/client"); //ให้prismaไปคุยฐานข้อมูลของเรา
const prisma = new PrismaClient();

app.delete("/user/delete/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { userId: parseInt(userId) },
    });

    res
      .status(200)
      .send({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .send({ error: "Error deleting user", details: error.message });
  }
});

app.use(bodyParser.json()); //ยิงแบบjson,สามารถยิงได้ทั้ง json และfrompost
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/user/create", async (req, res) => {
  const { first_name, last_name, username, email, phone } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        firstName: first_name,
        lastName: last_name,
        username,
        email,
        phone,
      },
    });

    // Convert BigInt phone to String for the response
    const responseUser = {
      ...newUser,
      phone: newUser.phone.toString(), // Convert BigInt to String
    };

    res
      .status(201)
      .send({ message: "User created successfully", user: responseUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send({ error: "Error creating user", details: error.message });
  }
});

app.listen(3001);
