const ruta = require("express").Router();
const UsuarioClase = require("../clases/usuarioClase");
const UsuarioDB = require("../bd/usuarioDB");
const ProductoClase = require("../clases/productoClase");
const ProductoDB = require("../bd/productoDB");

ruta.get("/", async (req, res) => {
    const usuariobd = new UsuarioDB()
    var usuarios = await usuariobd.mostrarUsuarios();
    var usuariosCorrectos=[];
    usuarios.forEach(usuario =>{
        const usuario1 = new UsuarioClase(usuario);
        if(usuario1.nombre!=undefined && usuario1.celular!=undefined && usuario1.correo!=undefined){
            usuariosCorrectos.push(usuario1.obtenerDatos);
        }
    });
    res.render("mostrarUsuarios", {usuariosCorrectos});
});

ruta.get("/agregarUsuario",(req,res)=>{
    res.render("formulario");
});

ruta.post("/agregarUsuario", async (req, res) => {
    console.log(req.body);
    const usuario1 = new UsuarioClase(req.body);
    if (usuario1.nombre!=undefined && usuario1.celular!=undefined && usuario1.correo!=undefined) {
        const usuarioDB = new UsuarioDB();
        usuarioDB.nuevoUsuario(usuario1.obtenerDatos);
        res.render("mostrarDatos", usuario1.obtenerDatos);
    } 
    else {
        res.render("error");
    }
});

ruta.get("/editarUsuario/:idusuario", async(req, res)=>{
    const usuariobd = new UsuarioDB();
    const [[usuario]]=await usuariobd.buscarUsuarioPorID(req.params.idusuario);
    console.log(usuario);
    res.render("editarUsuario",usuario);
});

ruta.post ("/editarUsuario", async (req, res) =>{
    const usuariobd = new UsuarioDB();
    const usuario1 = new UsuarioClase(req.body);
    if(usuario1.nombre!=undefined && usuario1.celular!=undefined && usuario1.correo!=undefined){
        await usuariobd.editarUsuario(req.body);
        res.redirect("/");
    }
    else{
        res.render("error");
    }
});

ruta.get("/borrarUsuario/:idusuario",async(req, res)=>{
    const usuariobd = new UsuarioDB();
    await usuariobd.borrarUsuario(req.params.idusuario);
    res.redirect("/");
});

// Obtener todos los productos
ruta.get("/productos", async (req, res) => {
    const productoDB = new ProductoDB();
    var productos = await productoDB.mostrarProductos();
    var productosCorrectos = [];
    productos.forEach(producto => {
        const producto1 = new ProductoClase(producto);
        if (producto1.nombre != undefined && producto1.descripcion != undefined && producto1.precio != undefined && producto1.stock != undefined) {
            productosCorrectos.push(producto1.obtenerDatos);
        }
    });
    res.render("mostrarProductos", { productosCorrectos });
});

// Formulario para agregar producto
ruta.get("/agregarProducto", (req, res) => {
    res.render("formularioProducto");
});

ruta.post("/agregarProducto", async (req, res) => {
    console.log(req.body);
    const producto = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: parseFloat(req.body.precio), // Convertir a número flotante
        stock: parseInt(req.body.stock) // Convertir a número entero
    };

    const productoDB = new ProductoDB();
    if (!isNaN(producto.precio) && !isNaN(producto.stock)) {
        await productoDB.nuevoProducto(producto);
        res.render("mostrarDatosProducto", producto); // Mostrar vista de confirmación de datos
    } else {
        console.error("Precio o stock inválidos");
        res.render("error"); // Mostrar vista de error
    }
});


ruta.get("/editarProducto/:idproducto", async (req, res) => {
    const productoDB = new ProductoDB();
    try {
        const producto = await productoDB.buscarProductoPorID(req.params.idproducto);
        if (producto) {
            res.render("editarProducto", { producto });
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        console.error("Error al buscar producto:", error);
        res.status(500).send("Error interno al buscar el producto");
    }
});

// Editar producto
ruta.post("/editarProducto", async (req, res) => {
    const productoDB = new ProductoDB();
    const producto1 = new ProductoClase(req.body);
        await productoDB.editarProducto(req.body);
        res.redirect("/productos");
});

// Borrar producto
ruta.get("/borrarProducto/:idproducto", async (req, res) => {
    const productoDB = new ProductoDB();
    await productoDB.borrarProducto(req.params.idproducto);
    res.redirect("/productos");
});


module.exports = ruta;
