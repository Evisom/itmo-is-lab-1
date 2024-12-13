package com.example.backend.controller;




import com.example.backend.service.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final ImportService importService;



    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam Long userId,@RequestParam("file") MultipartFile file) {

            importService.addToHistory(file, userId);
            return ResponseEntity.ok("File imported successfully");

    }
}
