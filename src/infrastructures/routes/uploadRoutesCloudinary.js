// back/src/infrastructures/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// CONFIGURAR CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CONFIGURAR MULTER CON CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'unistock/products', // Carpeta en Cloudinary
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    max_file_size: 10 * 1024 * 1024, // 10MB
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WebP)'), false);
    }
  }
});

// POST: Subir una imagen
// Endpoint: POST /api/upload
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No se subió ningún archivo' 
      });
    }

    // 🔍 DEBUG: Ver estructura del archivo
    console.log('🔍 [SINGLE] req.file:', JSON.stringify(req.file, null, 2));

    // ✅ Mapear correctamente los campos de Cloudinary
    const src = req.file.secure_url || req.file.path;
    const public_id = req.file.public_id || req.file.filename;

    console.log('✅ [SINGLE] Mapeado:', { src, public_id });

    res.json({
      success: true,
      url: src,
      src: src,
      public_id: public_id,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('❌ [SINGLE] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// POST: Subir múltiples imágenes
// Endpoint: POST /api/upload-multiple
router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No se subieron archivos' 
      });
    }

    // 🔍 DEBUG: Ver estructura del primer archivo
    console.log('🔍 [MULTIPLE] req.files[0]:', JSON.stringify(req.files[0], null, 2));

    // ✅ Mapear correctamente los campos de Cloudinary
    const images = req.files.map((file, index) => {
      const src = file.secure_url || file.path;
      const public_id = file.public_id || file.filename;
      
      console.log(`✅ [MULTIPLE] Imagen ${index} mapeada:`, { src, public_id });

      return {
        src: src,
        public_id: public_id,
        label: file.originalname,
        filename: file.originalname,
        size: file.size
      };
    });

    console.log('✅ [MULTIPLE] Response final:', JSON.stringify({ success: true, images }, null, 2));

    res.json({
      success: true,
      images: images
    });
  } catch (error) {
    console.error('❌ [MULTIPLE] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// DELETE: Eliminar imagen de Cloudinary
// Endpoint: DELETE /api/upload/:publicId
router.delete('/upload/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    // Decodificar el public_id (puede venir URL-encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    console.log('🗑️ Eliminando de Cloudinary:', decodedPublicId);

    // Eliminar de Cloudinary
    const result = await cloudinary.uploader.destroy(decodedPublicId);

    console.log('✅ Resultado eliminación:', result);

    if (result.result === 'ok') {
      res.json({ 
        success: true, 
        message: 'Imagen eliminada correctamente' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'No se pudo eliminar la imagen' 
      });
    }
  } catch (error) {
    console.error('❌ Error eliminando:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;