const { Router } = require('express');
const CartManager = require('../CartsManager.js');
const cartM = new CartManager();

const router = Router();

router.post('/', async (req, res) => {
  const result = await cartM.createCart();

  return res.json(result);
});

router.get('/:cid', async (req, res) => {
    const cartId = +req.params.cid;
  
    if (isNaN(cartId)) {
      return res.status(400).json({ error: 'Invalid cart ID' });
    }
  
    const result = await cartM.getCartById(cartId);
  
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
  
    return res.json({ products: result.products });
  });

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = +req.params.cid;
  const productId = +req.params.pid;

  if (isNaN(cartId) || isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid cart or product ID' });
  }

  const result = await cartM.addProductToCart(cartId, productId);

  return res.json(result);
});


module.exports = router;