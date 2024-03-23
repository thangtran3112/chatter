export interface FileUploadOptions {
  bucket: string;
  key: string;
  file: Buffer; //both Multer and S3 accept Buffer as file
}
