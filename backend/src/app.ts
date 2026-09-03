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
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import chapaRoutes from "./routes/chapa.routes.js";
import orderRoutes from "./routes/order.routes.js";
import riderRoutes from "./routes/rider.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";

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
app.use("/api/v1/cart", cartRoutes,);
app.use( "/api/v1/addresses",addressRoutes,);
app.use("/api/v1/checkout", checkoutRoutes,);
app.use("/api/v1/payments/chapa",chapaRoutes,);
app.use("/api/v1/orders", orderRoutes, );
app.use("/api/v1/riders", riderRoutes,);
app.use("/api/v1/deliveries",deliveryRoutes,);
export default app;
