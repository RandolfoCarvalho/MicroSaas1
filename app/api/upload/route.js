// app/api/upload/route.js
/*import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json(
        { error: "No file received" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cria um nome único para o arquivo
    const filename = `${Date.now()}-${file.name}`;
    
    // Define o caminho para a pasta de imagens
    const filepath = path.join(process.cwd(), 'public/imagens', filename);

    // Salva o arquivo
    await writeFile(filepath, buffer);

    // Retorna a URL do arquivo
    return NextResponse.json({ 
      url: `imagens/${filename}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
} */


  // app/api/upload/route.js
  import { S3 } from 'aws-sdk';
  import { NextResponse } from 'next/server';
  
  const s3 = new S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  
  export async function POST(request) {
    try {
      const data = await request.formData();
      const file = data.get('file');
  
      if (!file) {
        return NextResponse.json(
          { error: "No file received" },
          { status: 400 }
        );
      }
  
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
  
      // Cria um nome único para o arquivo
      const filename = `${Date.now()}-${file.name}`;
  
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filename,  // Nome do arquivo no S3
        Body: buffer,
        ContentType: file.type,
      };
  
      // Envia a imagem para o S3
      const uploadResult = await s3.upload(uploadParams).promise();
  
      // Retorna a URL do arquivo no S3
      return NextResponse.json({
        url: uploadResult.Location,  // URL do arquivo no S3
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json(
        { error: "Error uploading file" },
        { status: 500 }
      );
    }
  }