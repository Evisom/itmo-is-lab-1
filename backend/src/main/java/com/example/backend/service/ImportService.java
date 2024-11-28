package com.example.backend.service;

import com.example.backend.domain.HumanBeing;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportService {
    private final HumanBeingService humanBeingService;

    private final ObjectMapper objectMapper;

    @Transactional
    public void importFile(MultipartFile file, Long userId, String token) throws Exception {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        String fileName = file.getOriginalFilename();
        assert fileName != null;
        if (fileName.endsWith(".json")) {
            importFromJson(file,userId,token);
        } else {
            throw new IllegalArgumentException("Unsupported file format");
        }
    }




    private void importFromJson(MultipartFile file, Long userId, String token) throws Exception {

        List<HumanBeing> humans = objectMapper.readValue(file.getInputStream(),
                new TypeReference<>() {});
        for (HumanBeing human : humans) {
            humanBeingService.addHumanModelFromFile(human,userId,token);
        }
    }
}
