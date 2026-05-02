// lib/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: string, folder = 'uphaar/products') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation: [
        { width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
      ],
    })
    return result.secure_url
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Image upload failed. Please try again.')
  }
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary
