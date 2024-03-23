import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadOptions } from './file-upload-options.interface';

@Injectable()
export class S3Service {
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKey = this.configService.get('AWS_ACCESS_KEY');
    const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');
    const region = configService.get('AWS_REGION');

    const clientConfig: S3ClientConfig = {};

    //we only have those two credentials in local development
    //if we do AWS CLI `configure` with default profile, we don't need these configs
    if (accessKey && secretAccessKey) {
      clientConfig.credentials = {
        accessKeyId: accessKey,
        secretAccessKey,
      };
      clientConfig.region = region;
    }

    this.client = new S3Client(clientConfig);
  }

  async upload({ bucket, key, file }: FileUploadOptions) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
      }),
    );
  }

  getObjectUrl(bucket: string, key: string) {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}
