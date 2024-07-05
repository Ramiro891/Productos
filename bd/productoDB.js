const ConectarBD = require("./conexionBD");

class ProductoDB extends ConectarBD {
    constructor() {
        super();
    }

    async nuevoProducto(producto) {
        const sql = `INSERT INTO productos (nombre, descripcion, precio, stock) VALUES ('${producto.nombre}', '${producto.descripcion}', ${producto.precio}, ${producto.stock});`;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Producto insertado en MySql");
        } catch (error) {
            console.error("Error al insertar producto en MySql: " + error);
            console.error(sql);
        }
    }

    async mostrarProductos() {
        const sql = "SELECT * FROM productos";
        var productosBD;
        try {
            await this.conectarMySQL();
            [productosBD] = await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Productos recuperados");
    
            // Convertir precios a tipo numérico antes de devolverlos
            return productosBD.map(producto => ({
                ...producto,
                precio: parseFloat(producto.precio)
            }));
        } catch (error) {
            console.error("Error al recuperar los datos de productos: " + error);
            console.error(sql);
        }
    }
    

    async buscarProductoPorID(idProducto) {
        const sql = `SELECT * FROM productos WHERE id=${idProducto}`;
        try {
            await this.conectarMySQL();
            const [result] = await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Producto recuperado correctamente");
            return result.length ? result[0] : null;  // Retorna el primer producto si existe
        } catch (error) {
            console.error("Error al recuperar el producto: " + error);
            console.error(sql);
        }
    }
    

    async editarProducto(producto) {
        const sql = `
        UPDATE productos SET
        nombre="${producto.nombre}",
        descripcion="${producto.descripcion}",
        precio=${producto.precio},
        stock=${producto.stock}
        WHERE id=${producto.id}
        `;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Producto editado correctamente");
        } catch (error) {
            console.error("Error al editar producto: " + error);
            console.error(sql);
        }
    }

    async borrarProducto(idProducto) {
        const sql = `DELETE FROM productos WHERE id=${idProducto}`;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Producto borrado correctamente");
        } catch (error) {
            console.error("Error al borrar el producto: " + error);
            console.error(sql);
        }
    }
}

module.exports = ProductoDB;
