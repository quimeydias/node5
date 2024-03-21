const fs = require('fs');
const fe = require('fs').promises;

const filename = 'src/Carts.json';

class CartManager {
  #carts;
  #lastCartId = 1;

  async initialize() {
    this.#carts = await this.readCartsFromFile();
    this.updateLastCartId();
  }

  async generateFileIfNotExists(filename) {
    try {
      await fe.access(filename);
      return 'El archivo ya existe. No se generará uno nuevo.';
    } catch (error) {
      try {
        await fe.writeFile(filename, []);
        return 'Archivo generado exitosamente.';
      } catch (error) {
        return 'Error al generar el archivo:' + error;
      }
    }
  }



  async getCarts() {
    try {
      const cartsFileContent = await fs.promises.readFile(filename, 'utf-8');
      return JSON.parse(cartsFileContent);
    } catch (err) {
      return [];
    }
  }

  async getCartById(cartId) {
    await this.initialize();
    const cart = this.#carts.find((c) => c.id == cartId);

    if (!cart) {
      return { error: 'No se encontró ningún carrito con ese ID', status: 404 };
    } else {
      return cart;
    }
  }

    async createCart() {
      await this.initialize();
  
      const newCart = {
        id: this.#getNewCartId(),
        products: [],
      };
  
      this.#carts.push(newCart);
      await this.#updateFile();
  
      return { response: 'Nuevo carrito creado', cartId: newCart.id };
    }
  

    async addProductToCart(cartId, productId, quantity = 1) {
        await this.initialize();
      
        try {
          const products = await this.readProductsFromFile();
          const product = products.find((p) => p.id == productId);
      
          if (!product) {
            return 'No se encontró un producto con el ID proporcionado.';
          }
      
          const cartIndex = this.#carts.findIndex((cart) => cart.id == cartId);
      
          if (cartIndex !== -1) {
            const productIndex = this.#carts[cartIndex].products.findIndex(
              (prod) => prod.id == productId
            );
      
            if (productIndex !== -1) {
              this.#carts[cartIndex].products[productIndex].quantity += quantity;
            } else {
              this.#carts[cartIndex].products.push({ id: productId, quantity });
            }
      
            await this.#updateFile();
            return 'Producto agregado al carrito exitosamente.';
          } else {
            return 'No se encontró un carrito con el ID proporcionado.';
          }
        } catch (error) {
          console.error('Error al agregar producto al carrito:', error);
          return 'Error al agregar producto al carrito.';
        }
      }

  #getNewCartId() {
    const highestId = Math.max(...this.#carts.map((cart) => cart.id), 0);
    return highestId + 1;
  }

  updateLastCartId() {
    if (this.#carts.length > 0) {
      this.#lastCartId = Math.max(...this.#carts.map((cart) => cart.id), 0);
    }
  }

  async #updateFile() {
    try {
      await fs.promises.writeFile(filename, JSON.stringify(this.#carts, null, '\t'));
    } catch (error) {
      console.error('Error al escribir en el archivo:', error);
      throw error;
    }
  }

  async readCartsFromFile() {
    try {
      const cartsFileContent = await fs.promises.readFile(filename, 'utf-8');
      return JSON.parse(cartsFileContent);
    } catch (err) {
      return [];
    }
  }

  async readProductsFromFile() {
    try {
      const productsFileContent = await fs.promises.readFile('src/Products.json', 'utf-8');
      return JSON.parse(productsFileContent);
    } catch (err) {
      console.error('Error al leer el archivo de productos:', err);
      throw err;
    }
  }
}



module.exports = CartManager;

