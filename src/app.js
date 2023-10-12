import  express  from "express";
import ProductsRouter from "./routers/products.router.js";
import CartsRouter from "./routers/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use (`/api`, ProductsRouter,CartsRouter /* acá van las otras rutas importadas */);

app.get(`/`, (req, res)=> {
    res.send(`<h1> Hello</h1>`)
});

app.listen (8080, () => {
console.log(`server is running on port http://localhost:8080`)
})


