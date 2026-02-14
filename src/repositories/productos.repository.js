const { pool } = require('../db');

class ProductosRepository {

  async getAll() {
    const result = await pool.query(
      'select id, nombre, precio from productos;'
    );
    return result.rows;
  }

  async getAllActive() {
    const result = await pool.query(
      'select id, nombre, precio from productos where activo = true;'
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      'select id, nombre, precio, stock, descripcion from productos where activo = true and id = $1;', [id]
    );
    return result.rows[0];

  }

  async create(nombre, precio) {
    const result = await pool.query(
      'insert into productos (nombre, precio) values ($1,$2) returning id, nombre, precio;',[nombre, precio] 
    );
    return result.rows[0];

  }
  async update(id, data) {

    const result = await pool.query(
      'UPDATE productos SET nombre = coalesce($1, nombre), precio = coalesce($2, precio) WHERE id = $3 returning id, nombre, precio',
      [data.nombre ?? null, data.precio ?? null, data.id]
    )
    return result.rows[0] || null
  }

async delete(id) {
  /*const index = this.productos.findIndex(producto => producto.id === id);
  if (index !== -1) {
    return this.productos.splice(index, 1)[0];
  }
  return null;
  */
 const result = await pool.query(
  'DELETE FROM productos WHERE id = $1 returning id', [id]
 )

 return result.rows[0] || null
}

async search({ nombre, minPrecio, maxPrecio, page = 1, limit = 5 }) {
    // 1. Iniciamos las queries asegurando que solo traiga productos ACTIVOS
    let query = 'SELECT id, nombre, precio FROM productos WHERE activo = true';
    let countQuery = 'SELECT count(*) as total FROM productos WHERE activo = true';
    
    const values = [];
    let counter = 1;

    if (nombre) {
      const clause = ` AND nombre ILIKE $${counter}`;
      query += clause;
      countQuery += clause;
      values.push(`%${nombre}%`);
      counter++;
    }

    if (minPrecio !== undefined && minPrecio !== null) {
      const clause = ` AND precio >= $${counter}`;
      query += clause;
      countQuery += clause;
      values.push(minPrecio);
      counter++;
    }

    if (maxPrecio !== undefined && maxPrecio !== null) {
      const clause = ` AND precio <= $${counter}`;
      query += clause;
      countQuery += clause;
      values.push(maxPrecio);
      counter++;
    }

    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total, 10);

    const offset = (page - 1) * limit;

    query += ` ORDER BY id DESC LIMIT $${counter} OFFSET $${counter + 1}`;
    
    values.push(limit, offset);

    const result = await pool.query(query, values);

    return {
      data: result.rows,
      page: Number(page),  
      limit: Number(limit), 
      total: total
    };
  }
}
module.exports = { ProductosRepository }