package com.example.backend.minio;

import io.minio.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.InputStream;


@AllArgsConstructor
@Service
public class MinioService {
    private MinioClient minioClient;

    public void uploadFile(String bucketName, String objectName, InputStream inputStream, String contentType) {
        try {

            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {

                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, inputStream.available(), -1)
                            .contentType(contentType)
                            .build());

        } catch (Exception e) {

            throw new RuntimeException("Error occurred: " + e.getMessage(), e);
        }
    }

    public InputStream downloadFile(String bucketName, String objectName) {
        try {

            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {

            throw new RuntimeException("Error occurred while downloading file: " + e.getMessage(), e);
        }
    }
}
