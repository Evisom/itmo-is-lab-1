package com.example.backend.minio;

import com.example.backend.domain.HumanBeing;
import com.example.backend.exception.MinioLostException;
import com.example.backend.repository.ImportHistoryRepository;
import com.example.backend.service.HumanBeingService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.minio.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;


@AllArgsConstructor
@Service
public class MinioService {
    private MinioClient minioClient;
    private final MinioProperties minioProperties;
    private final ObjectMapper objectMapper;
    private final HumanBeingService humanBeingService;
    private final ImportHistoryRepository importHistoryRepository;

    @Transactional
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


    private static final int BBB = 1;

    @Transactional(isolation = Isolation.REPEATABLE_READ, propagation = Propagation.REQUIRES_NEW, rollbackFor = MinioLostException.class)
    public int importFile(MultipartFile file, Long userId) throws Exception {


        int count = importFromJson(file, userId);

        String objectName = (importHistoryRepository.findMaxId() + 1) + ".json";

        InputStream inputStream = file.getInputStream();
        String contentType = file.getContentType();
        try {
            uploadFile(minioProperties.getBucketName(), objectName, inputStream, contentType);
            if (BBB >= 1) {

                deleteFile(minioProperties.getBucketName(), objectName);
                throw new RuntimeException("");
            }
        } catch (RuntimeException e) {
            throw new MinioLostException("minio lost");
        }


        return count;

    }


    private int importFromJson(MultipartFile file, Long userId) throws Exception {

        List<HumanBeing> humans = objectMapper.readValue(file.getInputStream(),
                new TypeReference<>() {
                });
//        for (HumanBeing human : humans) {
//            humanBeingService.addHumanModelFromFile(human, userId);
//        }

        humanBeingService.addAllHumanModelFromFile(humans, userId);
        return humans.size();
    }

    private void deleteFile(String bucketName, String objectName) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .build());
            System.out.println("File deleted from MinIO: " + objectName);
        } catch (Exception e) {
            System.err.println("Failed to delete file from MinIO: " + objectName);
        }
    }
}
