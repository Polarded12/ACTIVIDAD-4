const express = require('express')
const {pool} = require('./src/db')
const { router: productosRouter } = require('./src/routes/productos.routes')
const app = express()

app.use(express.json())
app.get('/', (req, res) => {
  res.send('API OK');
})
app.use('/productos', productosRouter);
app.listen(3000, () => {
  console.log("Servidor Corriendo")
})

app.get('/health', (req, res) => {
  res.json({ok:true, service:'api'})
})

app.get('/health/db', async (req, res) => {
  try {
    const r = await pool.query('select 1 as ok');
    return res.json({ok:true, db:r.rows[0].ok})
  } catch (err) {
    console.log('DB Error', err.message)
    return res.status(500).json({ok:false, error:'DB no disponible'})
  }
})


