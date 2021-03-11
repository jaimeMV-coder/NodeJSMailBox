const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('reportes/add');
});

router.post('/add', async (req, res) => {
    const { titulo, descripcion } = req.body;

    const newReporte = {
        titulo,
        descripcion
    };
    await pool.query('INSERT INTO reportes set ?', [newReporte]);
    req.flash('Success', 'Reporte Generado Correctamente');
    res.redirect('/reportes');
});
router.get('/', async (rep, res) => {
    const reportes = await pool.query('SELECT * FROM reportes');
    console.log(reportes);
    res.render('reportes/list', { reportes });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM  reportes WHERE ID =?', [id]);
    req.flash('Success','Reporte Eliminado Correctamente');
    res.redirect('/reportes');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const reportes = await pool.query('SELECT * FROM reportes WHERE id=?', [id]);
    res.render('reportes/edit', { reporte: reportes[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    const newReporte = {
        titulo,
        descripcion
    };
    await pool.query('UPDATE reportes set ? WHERE id=?', [newReporte, id]);
    req.flash('Success','Reporte Actualizado Correctamente');
    res.redirect('/reportes');
});

module.exports = router;