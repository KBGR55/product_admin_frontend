import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo imágenes' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Máx 5MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error('No upload result'))
            resolve(result)
          }
        ).end(buffer)
      }
    )

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    )
  }
}
