package com.example.backend.minio;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
@Data
public class MinioProperties {

    @Value("${minio.access_key}")
    private String accessKey;
    @Value("${minio.secret_key}")
    private String secretKey;
    @Value("${minio.url}")
    private String url;
    @Value("${minio.bucket_name}")
    private String bucketName;

}
