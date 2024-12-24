// app/api/upload/route.js
import { writeFile } from 'fs/promises';
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
    const filepath = path.join(process.cwd(), 'app/imagens', filename);

    // Salva o arquivo
    await writeFile(filepath, buffer);

    // Retorna a URL do arquivo
    return NextResponse.json({ 
      url: `/imagens/${filename}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}