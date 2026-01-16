import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file received' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename: replace spaces with underscores, remove special chars
        const filename = Date.now() + '_' + file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory already exists
        }

        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
