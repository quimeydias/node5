const { Router } = require('express');


const ProductManager = require('../ProductManager.js');
const productM = new ProductManager();

const router = Router();


const main = async () => {
    productM.initialize();
    productM.generarArchivoSiNoExiste('src/Products.json');
};

main();



router.get('/', async (req, res) => {
    const limit = +req.query.limit;

    if (limit) {
        res.send(await productM.getProductsWithLimit(limit));
    } else {
        const result = await productM.getProducts()
       
        const data = {
           
            result,
            
        }
        res.render('home',data)
        //res.send(result);
    }
});


router.get('/realtimeproducts', async (req, res) => {
  
        const result = await productM.getProducts()
       
        const data = {
           
            result,
            
        }
        res.render('realTimeProducts',data)
        //res.send(result);
    
});

router.post('/', async (req, res) => {
    const product = req.body;
    const result = await productM.addProduct(product.title, product.price, product.thumbnail, product.code, product.stock);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    const wsServer = req.app.get('ws')
    wsServer.emit('reload',result)
    return res.json(result);
});

router.put('/:pid', async (req, res) => {
    const productId = +req.params.pid;
    const product = req.body;
    console.log(product);

    const result = await productM.updateProduct(productId, product);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    return res.json(result);
});

router.get('/:pid', async (req, res) => {
    const userId = +req.params.pid;

    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await productM.getProductById(userId);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    return res.json(result);
});


router.delete('/:pid', async (req, res) => {
  const userId = +req.params.pid;

  if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
  }


  const result =  await productM.deleteProduct(userId)

  if (result.error) {
      return res.status(result.status).json({ error: result.error });
  }

  const wsServer = req.app.get('ws')
  wsServer.emit('reload',result)
  return res.json(result);

});

module.exports = router;