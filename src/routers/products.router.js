import { Router } from "express";
import fs from "fs"

const router = Router()




router.get(`/products`, (req, res) => {

  //LEER EL ARCHIVO CON FS//
  fs.readFile("products.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al intentar leer el  JSON⛔", err);
      res.status(500).json({ error: "Error al intentar leer el  JSON⛔" });
      return;
    }
  //SI LO ENCUENTRA BIEN, PARSEA A JAVASCRIPT.//

    const products = JSON.parse(data);

//DEVUELVE EL LLAMADO CON LOS PRODUCTOS PARSEADOS.//
    res.status(200).json(products);
  });
});


/////////////////PRODUCTS BY ID///////////////////////

router.get(`/products/:id` , (req, res) => {

  fs.readFile("products.json", "utf8", (err, data) => {
    // PARA OBTENER EL ID DEL PARAMS//
    const productId = parseInt(req.params.id);
    if (err) {
      console.error("Error al intentar leer el  JSON⛔", err);
      res.status(500).json({ error: "Error al intentar leer el  JSON⛔" });
      return;
    }
  //SI LO ENCUENTRA BIEN, PARSEA A JAVASCRIPT.//

    const products = JSON.parse(data);

// COMPARAR ID DE PARAMS CON ID DE PRODUCTS//

    const productFind = products.find((product) => product.id === productId);

    if (!productFind) {
      res.status(404).json({ error: "Producto no encontrado⛔" });
    } else {
      res.status(200).json(productFind);
    }
  });
});

/////////////////POST DE PRODUCTO///////////////////////

router.post(`/products`, (req, res) => {
  fs.readFile("products.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al intentar leer el  JSON⛔", err);
      res.status(500).json({ error: "Error al intentar leer el  JSON⛔" });
      return;
    }

    const products = JSON.parse(data);

//OBTENER PRODUCTO DEL BODY//
    const newProduct = req.body;
    //REQUERIR CAMPOS Y ARRAY DE THUMBAIL//
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.thumbnail ||
      !Array.isArray(newProduct.thumbnail) ||
      !newProduct.code ||
      !newProduct.stock ||
      !newProduct.category
    ) {
      console.log("Please check the fields⛔");
      res.status(400).json({ error: "Please check the fields⛔" });
      return;
    } else {
      //AGREGAR ID CON FECHA EXACTA + NÚMERO RANDOM //

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
      newProduct.id = formattedDate + Math.floor(Math.random() * 1000000);
      //AGREGAR EL PRODUCTO AL ARRAY //

      products.push(newProduct);
    }


    //GUARDAR LOS DATOS ACTUALIZADOS EN EL JSON //
    fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo JSON⛔", err);
        res.status(500).json({ error: "Error al escribir en el archivo JSON⛔" });
        return;
      }

      // STATUS 201 PRODUCTO AGREGADO // 
      res.status(201).json(products); 
    });
  });
});



/////////////////////DELETE BY ID ///////////////////////

router.delete(`/products/:id`, (req, res) => {
  fs.readFile("products.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al intentar leer el JSON⛔", err);
      res.status(500).json({ error: "Error al intentar leer el JSON⛔" });
      return;
    }

    const products = JSON.parse(data);
    const productId = parseInt(req.params.id);


//GENERAR UN NUEVO ARRAY SÍN EL PRODUCTO ENCONTRADO//
    const updatedProducts = products.filter((product) => product.id !== productId);


    //SI ES IGUAL DE LARGO UNO Y OTRO NO FUE ENCONTRADO//
    if (updatedProducts.length === products.length) {
      res.status(404).json({ error: "Producto no encontrado⛔" });
      return;
    }
  //GUARDAR EL ARRAY NUEVO COMO PRODUCTS//
    fs.writeFile("products.json", JSON.stringify(updatedProducts, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo JSON⛔", err);
        res.status(500).json({ error: "Error al escribir en el archivo JSON⛔" });
        return;
      }
+
//RESPONDER CON LA CONFIRMACIÓN DEL DELETE
      res.status(200).json({ message: "Producto eliminado exitosamente" });
    });
  });
});

/////////////////ACTUALIZAR PRODUCTO ////////////////////


export default router ;