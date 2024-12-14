package com.example.backend.minio;

import com.example.backend.domain.HumanBeing;
import com.example.backend.exception.MinioLostException;
import com.example.backend.repository.ImportHistoryRepository;
import com.example.backend.service.HumanBeingService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.minio.*;
import io.minio.errors.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
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
    private final PlatformTransactionManager transactionManager;

//    @Transactional(isolation = Isolation.REPEATABLE_READ, propagation = Propagation.REQUIRES_NEW, rollbackFor = MinioLostException.class)
public int importFile(MultipartFile file, Long userId) throws Exception {
    int count;
    String objectName = null;


    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    try {

        count = importFromJson(file, userId);

        objectName = (importHistoryRepository.findMaxId() + 1) + ".json";
        String bucketName = minioProperties.getBucketName();

        InputStream inputStream = file.getInputStream();
        String contentType = file.getContentType();


        uploadFile(bucketName, objectName, inputStream, contentType);


//        if (BBB >= 1) {
//            throw new RuntimeException("Test exception for rollback");
//        }


        transactionManager.commit(status);

    } catch (RuntimeException e) {

        transactionManager.rollback(status);

        if (objectName != null) {
            deleteFile(minioProperties.getBucketName(), objectName);
        }

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

    public void deleteFile(String bucketName, String objectName) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .build());


    }
}
