import connectDB from '@/lib/mongodb';
import Deliverable from '@/model/Deliverable';
import { NextApiRequest, NextApiResponse } from 'next';
import { S3 } from 'aws-sdk';

const s3 = new S3({
  endpoint: 'https://2de57c7224179b080809d4ee4c47f989.r2.cloudflarestorage.com',
  accessKeyId: '491885b2f5d4f7f933d823ade12a8cec',
  secretAccessKey: 'a9f67204d6b340f80b5c8d6beb8fc796d496433057771a5a69df53a53e148da6',
  region: 'auto',
  signatureVersion: 'v4',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      const fileType = req.headers['content-type'];
      const fileName = req.headers['x-file-name'] as string;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'text/plain'];
      if (!fileType || !allowedTypes.includes(fileType)) {
        return res.status(400).json({ message: 'Invalid file type' });
      }

      try {
        // Upload file to Cloudflare R2
        const params = {
          Bucket: 'divstore',
          Key: fileName,
          Body: buffer,
          ContentType: fileType,
        };

        const uploadResult = await s3.upload(params).promise();

        // Save file URL to database
        const deliverable = new Deliverable({
          name: fileName,
          type: fileType,
          url: uploadResult.Location,
          uploadedAt: new Date(),
        });

        await deliverable.save();

        res.status(201).json({ message: 'Work uploaded successfully', deliverable });
      } catch (uploadError) {
        res.status(500).json({ message: 'Error uploading to Cloudflare R2', error: uploadError });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 