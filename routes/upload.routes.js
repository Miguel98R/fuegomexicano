const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: './public/images/db_images',  // Ruta donde se guardarán las imágenes
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        const newFileName = `imgDb_${Date.now()}${extname}`;
        cb(null, newFileName);
    }
});


const upload = multer({ storage: storage });

// Ruta para subir imágenes
router.post('/single_image', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path; // Ruta final de la imagen
    console.log(`Ruta final de la imagen: ${imagePath}`);


    res.status(200).json({ success: true, message: 'Imagen subida con éxito', imagePath });
});

module.exports = router;
