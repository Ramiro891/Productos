// Importa el módulo dotenv para cargar variables de entorno desde el archivo .env
require('dotenv').config();

class ConectarBD {
    constructor() {
        this.conexion = null;
        this.mysql = require("mysql2/promise");
    }

    async conectarMySQL() {
        try {
            this.conexion = await this.mysql.createConnection({
                host:process.env.HOST_MySQL,
                user:process.env.USER_MySQL,
                password:process.env.PASSWORD_MySQL,
                database:process.env.DATABASE_MySQL,
                port:process.env.PORT_MySQL,
            });
            console.log("Conexión establecida con MySQL");
        } catch (error) {
            console.error("Error al crear la conexión", error);
            throw error; // Propagar el error para manejarlo fuera de esta función si es necesario
        }
    }

    async cerrarConexion() {
        try {
            if (this.conexion) {
                await this.conexion.end();
                console.log("Conexión cerrada con MySQL");
            } else {
                console.warn("No hay conexión abierta para cerrar");
            }
        } catch (error) {
            console.error("Error al cerrar la conexión", error);
            throw error; // Propagar el error para manejarlo fuera de esta función si es necesario
        }
    }
}

module.exports = ConectarBD;
