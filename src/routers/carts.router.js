import { Router } from "express";
import fs from "fs/promises";

const router = Router();

/////////////////////AGREGAR CART//////////
router.post (`/carts/:cid` , (req, res) => {

    fs.readFile("carts.json", "utf8", (err, data) => {
        if (err) {
          console.error("Error al intentar leer el  JSON⛔", err);
          res.status(500).json({ error: "Error al intentar leer el  JSON⛔" });
          return;
        }
      //SI LO ENCUENTRA BIEN, PARSEA A JAVASCRIPT.//
    
        const carts = JSON.parse(data);

        let newCartID = parseInt(req.params.cid)
//VERIFICA QUE EL CARRITO NO EXISTA PREVIAMENTE//
        const existingCart = carts.find((cart) => cart.id === newCartID);

       if (existingCart) {
         res.status(400).json({ error: "El carrito ya existe" });
         return;
       }
   
       const newCart = {
         id: newCartID,
         products: [],
       };
   

       //PUSHEA EL CARRITO 
       carts.push(newCart);
   
//GUARDA LOS DATOS EN EL JSON//
       fs.writeFile("carts.json", JSON.stringify(carts, null, 2), (err) => {
         if (err) {
           console.error("Error al escribir en el archivo JSON⛔", err);
           res.status(500).json({ error: "Error al escribir en el archivo JSON⛔" });
           return;
         }
   
         res.status(201).json(newCart);
       });
     });
   });
//////////////////////AGREGAR AL CART EL PRODUCTO DEL ID PARAMS ////////////

router.post('/carts/:cartId/products/:productId', async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);

  try {
    const cartsData = await fs.readFile('carts.json', 'utf8');
    const carts = JSON.parse(cartsData);

    const productsData = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(productsData);

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
      res.status(404).json({ error: 'Cart not founded⛔' });
      return;
    }

    
    //VALIDACION PARA CONFIRMAR SI EXISTE O NO EL PRODUCTO EN CARRITO

    const existingItem = cart.products.find((item) => item.productId === productId);


    if (existingItem) {

        existingItem.quantity += 1;
    } else {

        cart.products.push({ productId, quantity: 1 });
    }

    await fs.writeFile('carts.json', JSON.stringify(carts, null, 2));

    res.status(201).json(cart);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server Error⛔' });
  }
});

export default router;
