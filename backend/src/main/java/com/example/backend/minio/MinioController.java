package com.example.backend.minio;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@RestController
@RequiredArgsConstructor
@RequestMapping("/minio")
public class MinioController {

    private final MinioService minioService;
    private final MinioProperties minioProperties;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String objectName = file.getOriginalFilename();

        try (InputStream inputStream = file.getInputStream()) {
            String contentType = file.getContentType();
            minioService.uploadFile(minioProperties.getBucketName(), objectName, inputStream, contentType);
            return ResponseEntity.ok("File uploaded successfully to bucket: " + minioProperties.getBucketName());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String filename) {
        try {
            InputStream fileStream = minioService.downloadFile(minioProperties.getBucketName(), filename);
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (filename.endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            } else if (filename.endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            } else if (filename.endsWith(".json")) {
                mediaType = MediaType.APPLICATION_JSON;

            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.setContentDispositionFormData("attachment", filename);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(new InputStreamResource(fileStream));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
