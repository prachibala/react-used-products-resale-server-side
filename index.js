const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();

// PORT
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// mondodb connection
const uri = `mongodb+srv://itstanmaymitra:${process.env.DB_PASSWORD}@sandbox.fsshvm6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

// JWT Token Verify
const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).send({ message: "Unauthorized Access" });
	}
	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, function (err, decoded) {
		if (err) {
			return res.status(401).send({ message: "Unauthorized Access" });
		}

		req.decoded = decoded;
		next();
	});
};

const run = async () => {
	try {
		const productCollection = client.db("retoCart").collection("products");
		const userCollection = client.db("retoCart").collection("users");
		const orderCollection = client.db("retoCart").collection("orders");
		const categoryCollection = client
			.db("retoCart")
			.collection("categories");

		// Add new Category
		app.post("/add-category", async (req, res) => {
			const category = req.body;
			const result = await categoryCollection.insertOne({
				...category,
				createdAt: new Date(),
			});

			res.send(result);
		});

		// Get all categories
		app.get("/categories", async (req, res) => {
			const query = {};
			const cursor = categoryCollection
				.find(query)
				.sort({ createdAt: -1 });
			const categories = await cursor.toArray();
			res.send(categories);
		});

		// get products by category id
		app.get("/category-products/:catId", async (req, res) => {
			const id = req.params.catId;
			const query = { category: ObjectId(id) };
			const cursor = productCollection
				.find(query)
				.sort({ createdAt: -1 });
			const products = await cursor.toArray();
			const category = await categoryCollection.findOne({
				_id: ObjectId(id),
			});
			res.send({ category, products });
		});

		// add new product
		app.post("/add-product", async (req, res) => {
			const product = {
				name: req.body.name,
				resalePrice: req.body.resalePrice,
				originalPrice: req.body.originalPrice,
				imgUrl: req.body.imgUrl,
				condition: req.body.condition,
				sellerContact: req.body.sellerContact,
				location: req.body.location,
				category: ObjectId(req.body.category),
				description: req.body.description,
				createdBy: req.body.createdBy,
			};
			const result = await productCollection.insertOne({
				...product,
				createdAt: new Date(),
				advertiseStatus: "not published",
				saleStatus: "not sold",
			});

			res.send(result);
		});

		

app.get("/", (req, res) => {
	res.send("Server is Running!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
