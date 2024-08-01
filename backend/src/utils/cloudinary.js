const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  /* ------ Testing Connection is established ---- */
  /* const testConnection = async () => {
    try {
      const result = await cloudinary.api.resources();
      console.log('Connected to Cloudinary successfully!');
      console.log('Resources:', result);
    } catch (error) {
      console.error('Error connecting to Cloudinary:', error.message);
    }
  }; 
  testConnection(); 
  */

module.exports = {cloudinary};