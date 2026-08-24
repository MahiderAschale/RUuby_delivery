import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import menuCategoryRoutes from "./routes/menu-category.routes.js";
import menuItemRoutes from "./routes/menu-item.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import customerRestaurantRoutes from "./routes/customer-restaurant.routes.js";

const app = express();

app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/restaurants",restaurantRoutes)
app.use( "/api/v1",  menuCategoryRoutes,);
app.use("/api/v1",menuItemRoutes,);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", customerRestaurantRoutes,);
export default app;
