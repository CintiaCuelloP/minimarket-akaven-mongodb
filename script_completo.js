/***************************************************************
 * PROYECTO INTEGRADOR: BASE DE DATOS NoSQL
 * MINIMARKET AKAVEN
 *
 * Motor: MongoDB
 * Intérprete: mongosh
 * Base de datos: minimarket_akaven
 *
 * ÁREA: VENTAS E INVENTARIO
 ***************************************************************/

/***************************************************************
 * 1. SELECCIÓN DE LA BASE DE DATOS
 ***************************************************************/
use minimarket_akaven;

/*
 * NOTA:
 * La siguiente instrucción se utiliza únicamente para reiniciar
 * la base de datos durante las pruebas del proyecto.
 *
 * NO debe ejecutarse en un entorno productivo porque elimina
 * toda la información almacenada.
 */

// db.dropDatabase();


/***************************************************************
 * 2. CREACIÓN DE COLECCIONES CON VALIDACIÓN JSON SCHEMA
 ***************************************************************/
// -------------------------------------------------------------
// 2.1 COLECCIÓN: CATEGORIAS
// -------------------------------------------------------------
db.createCollection("categorias", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "_id",
                "nombre",
                "estado"
            ],
            properties: {
                _id: {
                    bsonType: "string",
                    description: "Código identificador de la categoría"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre de la categoría"
                },
                descripcion: {
                    bsonType: "string",
                    description: "Descripción de la categoría"
                },
                estado: {
                    enum: ["Activo", "Inactivo"],
                    description: "Estado operativo de la categoría"
                }
            }
        }
    }
});

// -------------------------------------------------------------
// 2.2 COLECCIÓN: PRODUCTOS
// -------------------------------------------------------------
db.createCollection("productos", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "codigoBarra",
                "nombre",
                "precioUnitario",
                "stock",
                "categoria_id"
            ],
            properties: {
                codigoBarra: {
                    bsonType: "string",
                    description: "Código de barras del producto"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre comercial del producto"
                },
                precioUnitario: {
                    bsonType: "double",
                    minimum: 0,
                    description: "Precio de venta expresado en soles"
                },
                stock: {
                    bsonType: "int",
                    minimum: 0,
                    description: "Cantidad disponible en inventario"
                },
                categoria_id: {
                    bsonType: "string",
                    description: "Referencia a la colección categorias"
                }
            }
        }
    }
});

// -------------------------------------------------------------
// 2.3 COLECCIÓN: CLIENTES
// -------------------------------------------------------------
db.createCollection("clientes", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "dni",
                "nombre"
            ],
            properties: {
                dni: {
                    bsonType: "string",
                    pattern: "^[0-9]{8}$",
                    description: "DNI peruano de ocho dígitos"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre y apellido del cliente"
                },
                telefono: {
                    bsonType: "string",
                    description: "Número telefónico del cliente"
                },
                tipoCliente: {
                    bsonType: "string",
                    description: "Clasificación del cliente"
                }
            }
        }
    }
});

// -------------------------------------------------------------
// 2.4 COLECCIÓN: VENTAS
// -------------------------------------------------------------
// -------------------------------------------------------------
// 2.4 COLECCIÓN: VENTAS
// -------------------------------------------------------------
db.createCollection("ventas", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "fecha",
                "metodoPago",
                "items",
                "montoTotal"
            ],
            properties: {
                fecha: {
                    bsonType: "date",
                    description: "Fecha y hora de la transacción"
                },

                metodoPago: {
                    enum: [
                        "Efectivo",
                        "Yape",
                        "Plin",
                        "Tarjeta"
                    ],
                    description: "Método de pago utilizado"
                },

                cliente_id: {
                    bsonType: "string",
                    description: "Referencia opcional a la colección clientes"
                },

                items: {
                    bsonType: "array",
                    minItems: 1,
                    description: "Detalle embebido de productos incluidos en la venta",

                    items: {
                        bsonType: "object",
                        required: [
                            "producto_id",
                            "nombre",
                            "cantidad",
                            "precioUnitario",
                            "subtotal"
                        ],

                        properties: {
                            producto_id: {
                                bsonType: "string"
                            },

                            nombre: {
                                bsonType: "string"
                            },

                            cantidad: {
                                bsonType: "int",
                                minimum: 1
                            },

                            precioUnitario: {
                                bsonType: "double",
                                minimum: 0
                            },

                            subtotal: {
                                bsonType: "double",
                                minimum: 0
                            }
                        }
                    }
                },

                montoTotal: {
                    bsonType: "double",
                    minimum: 0,
                    description: "Monto total de la venta"
                }
            }
        }
    }
});
/***************************************************************
 * 3. INSERCIÓN DE DATOS SEMILLA
 ***************************************************************/
// -------------------------------------------------------------
// 3.1 CATEGORÍAS
// -------------------------------------------------------------
db.categorias.insertMany([
    {
        _id: "CAT-01",
        nombre: "Lácteos y Embutidos",
        descripcion: "Productos lácteos y derivados refrigerados",
        estado: "Activo"
    },
    {
        _id: "CAT-02",
        nombre: "Abarrotes",
        descripcion: "Arroz, fideos, aceites y conservas",
        estado: "Activo"
    },
    {
        _id: "CAT-03",
        nombre: "Bebidas y Bebidas Gaseosas",
        descripcion: "Gaseosas, jugos y aguas envasadas",
        estado: "Activo"
    },
    {
        _id: "CAT-04",
        nombre: "Golosinas y Helados",
        descripcion: "Galletas, chocolates y helados",
        estado: "Activo"
    }
]);
// -------------------------------------------------------------
// 3.2 PRODUCTOS
// -------------------------------------------------------------
db.productos.insertMany([
    {
        _id: "PROD-1001",
        codigoBarra: "7751234567890",
        nombre: "Leche Gloria Entera 400g",
        precioUnitario: 4.50,
        stock: 48,
        categoria_id: "CAT-01"
    },
    {
        _id: "PROD-1002",
        codigoBarra: "7759876543210",
        nombre: "Pan Molde Bimbo Blanco",
        precioUnitario: 7.20,
        stock: 18,
        categoria_id: "CAT-02"
    },
    {
        _id: "PROD-1003",
        codigoBarra: "7751112223334",
        nombre: "Gaseosa Inka Kola 1.5L",
        precioUnitario: 6.50,
        stock: 30,
        categoria_id: "CAT-03"
    },
    {
        _id: "PROD-1004",
        codigoBarra: "7754445556667",
        nombre: "Yogurt Gloria Fresa 1L",
        precioUnitario: 6.80,
        stock: 12,
        categoria_id: "CAT-01"
    },
    {
        _id: "PROD-1005",
        codigoBarra: "7758889990001",
        nombre: "Arroz Costeño Superior 1kg",
        precioUnitario: 4.80,
        stock: 50,
        categoria_id: "CAT-02"
    }
]);

// -------------------------------------------------------------
// 3.3 CLIENTES
// -------------------------------------------------------------
db.clientes.insertMany([
    {
        _id: "CLI-501",
        dni: "72819203",
        nombre: "Carlos Mendoza",
        telefono: "987654321",
        tipoCliente: "Frecuente"
    },
    {
        _id: "CLI-502",
        dni: "45891234",
        nombre: "Ana Torres",
        telefono: "912345678",
        tipoCliente: "Frecuente"
    }
]);

// -------------------------------------------------------------
// 3.4 VENTAS
// -------------------------------------------------------------
db.ventas.insertMany([
    {
        _id: "VTA-001",
        fecha: ISODate("2026-08-18T10:15:00Z"),
        metodoPago: "Yape",
        cliente_id: "CLI-501",

        items: [
            {
                producto_id: "PROD-1001",
                nombre: "Leche Gloria Entera 400g",
                cantidad: 2,
                precioUnitario: 4.50,
                subtotal: 9.00
            },
            {
                producto_id: "PROD-1002",
                nombre: "Pan Molde Bimbo Blanco",
                cantidad: 1,
                precioUnitario: 7.20,
                subtotal: 7.20
            }
        ],

        montoTotal: 16.20
    },

    {
        _id: "VTA-002",
        fecha: ISODate("2026-08-19T18:30:00Z"),
        metodoPago: "Efectivo",

        items: [
            {
                producto_id: "PROD-1003",
                nombre: "Gaseosa Inka Kola 1.5L",
                cantidad: 2,
                precioUnitario: 6.50,
                subtotal: 13.00
            }
        ],

        montoTotal: 13.00
    },

    {
        _id: "VTA-003",
        fecha: ISODate("2026-08-19T20:45:00Z"),
        metodoPago: "Yape",
        cliente_id: "CLI-502",

        items: [
            {
                producto_id: "PROD-1001",
                nombre: "Leche Gloria Entera 400g",
                cantidad: 1,
                precioUnitario: 4.50,
                subtotal: 4.50
            },
            {
                producto_id: "PROD-1004",
                nombre: "Yogurt Gloria Fresa 1L",
                cantidad: 2,
                precioUnitario: 6.80,
                subtotal: 13.60
            }
        ],

        montoTotal: 18.10
    }
]);
/***************************************************************
 * 4. OPERACIONES CRUD
 ***************************************************************/
// -------------------------------------------------------------
// 4.1 CREATE - Insertar un nuevo producto
// -------------------------------------------------------------
db.productos.insertOne({

    _id: "PROD-1006",
    codigoBarra: "7755554443332",
    nombre: "Aceite Primor Clásico 1L",
    precioUnitario: 11.50,
    stock: 24,
    categoria_id: "CAT-02"
});

// -------------------------------------------------------------
// 4.2 READ - Productos por categoría
// -------------------------------------------------------------
db.productos.find(

    {
        categoria_id: "CAT-02"
    },
    {
        nombre: 1,
        precioUnitario: 1,
        stock: 1,
        _id: 0
    }
);

// -------------------------------------------------------------
// 4.3 READ - Productos con stock bajo
// -------------------------------------------------------------
db.productos.find(
    {
        stock: {
            $lte: 20
        }
    },
    {
        nombre: 1,
        stock: 1,
        _id: 0
    }
);

// -------------------------------------------------------------
// 4.4 UPDATE - Actualización atómica del inventario
// -------------------------------------------------------------
db.productos.updateOne(
    {
        _id: "PROD-1001"
    },
    {
        $inc: {
            stock: -2
        }
    }
);
// -------------------------------------------------------------
// 4.5 DELETE - Eliminación del producto de prueba
// -------------------------------------------------------------
db.productos.deleteOne({
    _id: "PROD-1006"
});
/***************************************************************
 * 5. CONSULTAS DE AGREGACIÓN
 ***************************************************************/
// -------------------------------------------------------------
// 5.1 INGRESOS POR MÉTODO DE PAGO
// -------------------------------------------------------------
db.ventas.aggregate([
    {
        $group: {
            _id: "$metodoPago",
            totalIngresos: {
                $sum: "$montoTotal"
            },
            cantidadTransacciones: {
                $sum: 1
            }
        }
    },
    {
        $project: {
            _id: 0,
            metodoPago: "$_id",
            totalIngresos: {
                $round: [
                    "$totalIngresos",
                    2
                ]
            },
            cantidadTransacciones: 1
        }
    },
    {
        $sort: {
            totalIngresos: -1
        }
    }

]);

// -------------------------------------------------------------
// 5.2 PRODUCTOS MÁS VENDIDOS
// -------------------------------------------------------------
db.ventas.aggregate([
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: "$items.producto_id",
            nombreProducto: {
                $first: "$items.nombre"
            },
            unidadesVendidas: {
                $sum: "$items.cantidad"
            },
            montoTotalRecaudado: {
                $sum: "$items.subtotal"
            }
        }
    },
    {
        $sort: {
            unidadesVendidas: -1
        }
    },
    {
        $project: {
            _id: 0,
            producto_id: "$_id",
            nombreProducto: 1,
            unidadesVendidas: 1,
            montoTotalRecaudado: {
                $round: [
                    "$montoTotalRecaudado",
                    2
                ]
            }
        }
    }

]);

// -------------------------------------------------------------
// 5.3 CLIENTES FRECUENTES Y TICKET PROMEDIO
// -------------------------------------------------------------
db.ventas.aggregate([
    {
        $match: {
            cliente_id: {
                $exists: true,
                $ne: null
            }
        }
    },
    {
        $group: {
            _id: "$cliente_id",
            totalGasto: {
                $sum: "$montoTotal"
            },
            totalVisitas: {
                $sum: 1
            },
            ticketPromedio: {
                $avg: "$montoTotal"
            }
        }
    },
    {
        $lookup: {
            from: "clientes",
            localField: "_id",
            foreignField: "_id",
            as: "datosCliente"
        }
    },
    {
        $unwind: "$datosCliente"
    },
    {
        $project: {
            _id: 0,
            cliente_id: "$_id",
            nombreCliente: "$datosCliente.nombre",
            dni: "$datosCliente.dni",
            totalGasto: {
                $round: [
                    "$totalGasto",
                    2
                ]
            },
            totalVisitas: 1,
            ticketPromedio: {
                $round: [
                    "$ticketPromedio",
                    2
                ]
            }
        }
    },
    {
        $sort: {
            totalGasto: -1
        }
    }
]);

/***************************************************************
 * 6. ANÁLISIS DE DESEMPEÑO CON explain()
 ***************************************************************/

// -------------------------------------------------------------
// 6.1 CONSULTA SIN ÍNDICE
//
// Esta prueba debe ejecutarse antes de crear el índice
// codigoBarra_1.
// -------------------------------------------------------------
db.productos.find({
    codigoBarra: "7751234567890"
}).explain("executionStats");

// Resultado esperado:
// stage: "COLLSCAN"
// totalKeysExamined: 0
// totalDocsExamined: 5

/***************************************************************
 * 7. CREACIÓN DE ÍNDICES
 ***************************************************************/
// -------------------------------------------------------------
// 7.1 ÍNDICE ÚNICO EN CÓDIGO DE BARRAS
// -------------------------------------------------------------
db.productos.createIndex(
    {
        codigoBarra: 1
    },
    {
        unique: true
    }
);

// -------------------------------------------------------------
// 7.2 ÍNDICE COMPUESTO EN VENTAS
// -------------------------------------------------------------
db.ventas.createIndex({
    fecha: -1,
    metodoPago: 1
});

/***************************************************************
 * 8. ANÁLISIS DE DESEMPEÑO DESPUÉS DE LA INDEXACIÓN
 ***************************************************************/
// -------------------------------------------------------------
// 8.1 CONSULTA CON ÍNDICE
// -------------------------------------------------------------
db.productos.find({
    codigoBarra: "7751234567890"
}).explain("executionStats");


// Resultado esperado:
// stage: "FETCH"
// inputStage.stage: "IXSCAN"
// indexName: "codigoBarra_1"
// totalKeysExamined: 1
// totalDocsExamined: 1

/***************************************************************
 * 9. CONFIGURACIÓN DE SEGURIDAD Y RBAC
 ***************************************************************/
/*
 * IMPORTANTE:
 *
 * Esta sección requiere una cuenta con privilegios suficientes
 * para crear roles y usuarios.
 *
 * La autenticación del servidor debe estar habilitada mediante
 * mongod.conf:
 *
 * security:
 *   authorization: enabled
 *
 */

use minimarket_akaven;

// -------------------------------------------------------------
// 9.1 CREACIÓN DEL ROL PERSONALIZADO PARA CAJERO
// -------------------------------------------------------------

db.createRole({
    role: "rolCajeroAkaven",
    privileges: [
        {
            resource: {
                db: "minimarket_akaven",
                collection: "productos"
            },
            actions: [
                "find",
                "update"
            ]
        },
        {
            resource: {
                db: "minimarket_akaven",
                collection: "ventas"
            },
            actions: [
                "insert",
                "find"
            ]
        },
        {
            resource: {
                db: "minimarket_akaven",
                collection: "clientes"
            },
            actions: [
                "find",
                "insert"
            ]
        }
    ],
    roles: []
});

// -------------------------------------------------------------
// 9.2 CREACIÓN DEL USUARIO CAJERO
// -------------------------------------------------------------

db.createUser({
    user: "cajeroTurno",

    pwd: "CajaAkaven2026*",

    roles: [

        {
            role: "rolCajeroAkaven",
            db: "minimarket_akaven"
        }
    ]
});

/***************************************************************
 * FIN DEL SCRIPT
 ***************************************************************/
