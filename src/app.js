const express = require("express");
const ProductManager = require("./ProductManager");
const API_BASE_PATH = '/api';
const API_VERSION = '/v1';
const PORT = 8080;

class Product {
    id;
    title;
    description;
    price;
    thumbnail;
    code;
    stock;
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = 0;
    }
    getStock() {
        return this.stock;
    }
    setStock(stock) {
        this.stock = stock;
    }
    getPrice() {
        return this.price;
    }
    setPrice(price) {
        this.price = price;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    setId(id) {
        this.id = id;
    }
}


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const inicializarManager = async () => {
    const manager = new ProductManager("C:/Users/Usuario/Desktop/Test/Entregables/Entregable3Final/src/productos.json");
    return manager;
}

const startServer = async () =>{
    
    const manager = await inicializarManager();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
//METHOD GET
    app.get(`${API_BASE_PATH}${API_VERSION}/productos`, async (req, res) => {
        let limit = req.query.Limit;
        console.log(manager.products);
        try{ 
//La logica de negocio esta todo dentro del productManager para que cada entidad tenga su responsabilidad
            const resul = await manager.getProductsLimit(limit);
            if(resul == null){
                res.send("El limite debe ser un numero");
            }else{
                return res.json(resul);
            }
        }catch{
            console.log("El limite debe ser un numero");
            return res.status(400).send("Error - getProductsLimit");
        }    
    });

//METHOD GET BY ID
    app.get(`${API_BASE_PATH}${API_VERSION}/productos/:id`, async (req, res) => {
        const id = parseInt(req.params.id);
        try{
            return res.json(await manager.getProductById(id));
        }catch{
            return res.status(400).send("Error - getProductById");
        }
    });
//METHOD POST
    app.post(`${API_BASE_PATH}${API_VERSION}/productos`, async (req, res) => {
        const body = req.body;
        const product = new Product(body.title, body.description, body.price, body.thumbnail, body.code, body.stock);
        product.setId(parseInt(body.id));
        try{
            await manager.addProduct(product);
            return res.json(product);
        }catch{
            console.log("No se pudo agregar el producto");
            return res.status(400).send("Error - addProduct");
        }
    });
//METHOD UPDATE
    app.put(`${API_BASE_PATH}${API_VERSION}/productos/:id`, async (req, res) => {
        const id = parseInt(req.params.id);
        const body = req.body;
        const product = new Product(body.title, body.description, body.price, body.thumbnail, body.code, body.stock);
        try{
            await manager.updateProduct(id, product);
            return res.json(product);
        }catch{
            console.log("No se pudo actualizar el producto");
            res.status(400).send("Error - updateProduct");
        }
    });

//METHOD DELETE
    app.delete(`${API_BASE_PATH}${API_VERSION}/productos/:id`, async (req, res) => {
        const id = parseInt(req.params.id);
        try{
            const resul = await manager.deleteProductById(id);
            if(resul == null){
                return res.send("No se encontro el producto");
            }else{
                return res.send("Producto eliminado");
            }
        }catch{
            console.log("No se pudo eliminar el producto");
            return res.status(400).send("Error - deleteProduct");
        }
    });
//METHOD DELETE ALL
    app.delete(`${API_BASE_PATH}${API_VERSION}/productos`, async (req, res) => {
        try{
            await manager.deleteAllProducts();
            res.send("Productos eliminados");
        }catch{
            console.log("No se pudo eliminar el producto");
            res.status(400).send("Error - deleteAllProducts");
        }
    });
}

startServer();