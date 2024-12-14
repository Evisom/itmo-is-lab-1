package com.example.backend.service;

import com.example.backend.config.ImportStatus;
import com.example.backend.config.TransactionManagerConfig;
import com.example.backend.domain.History;
import com.example.backend.domain.Role;
import com.example.backend.entity.ImportHistoryEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.MinioLostException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.minio.MinioProperties;
import com.example.backend.minio.MinioService;
import com.example.backend.repository.ImportHistoryRepository;
import com.example.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.web.multipart.MultipartFile;


import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImportService {


    private final UserRepo userRepo;
    private final MinioService minioService;
    private final MinioProperties minioProperties;

    private final ImportHistoryRepository importHistoryRepository;

    private final PlatformTransactionManager transactionManager;


    public void addToHistory(MultipartFile file, Long userId) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        ImportHistoryEntity historyEntity = new ImportHistoryEntity();
        historyEntity.setStatus(ImportStatus.IN_PROGRESS);
        historyEntity.setFilename(file.getOriginalFilename());

        historyEntity.setUser(userRepo.findById(userId).orElse(null));
        if (historyEntity.getUser() == null) {
            throw new UserNotFoundException("No such user");
        }

        historyEntity.setLogin();
        String fileName = file.getOriginalFilename();
        Integer count = null;
        String uploadedFileName = null;

        DefaultTransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
        transactionDefinition.setIsolationLevel(TransactionDefinition.ISOLATION_REPEATABLE_READ);
        transactionDefinition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionStatus status = transactionManager.getTransaction(transactionDefinition);

        try {
            if (fileName != null && fileName.endsWith(".json")) {

                count = minioService.importFile(file, userId);
                uploadedFileName = fileName;
                historyEntity.setStatus(ImportStatus.SUCCESS);
            } else {
                historyEntity.setStatus(ImportStatus.FAILURE);
                throw new IllegalArgumentException("Unsupported file format");
            }


            historyEntity.setAddedObjectsCount(count);
            importHistoryRepository.save(historyEntity);


            transactionManager.commit(status);
        } catch (MinioLostException e) {

            historyEntity.setStatus(ImportStatus.FAILURE);
            importHistoryRepository.save(historyEntity);

            transactionManager.commit(status);
            throw e;
        } catch (Exception e) {
            historyEntity.setStatus(ImportStatus.FAILURE);
            importHistoryRepository.save(historyEntity);

            transactionManager.rollback(status);


            if (uploadedFileName != null) {
                minioService.deleteFile(minioProperties.getBucketName(),  uploadedFileName);
            }

            throw e;
        }
    }




    @Transactional(readOnly = true)
    public List<History> getImportHistory() {
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        Set<Role> roles = authorities.stream()
                .map(auth -> Role.valueOf(auth.getAuthority()))
                .collect(Collectors.toSet());

        if (roles.contains(Role.ADMIN)) {
            return importHistoryRepository.findAll().stream().map(History::toModel).collect(Collectors.toList());

        }
        UserEntity user = (UserEntity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return importHistoryRepository.findByUser(user).stream().map(History::toModel).collect(Collectors.toList());


    }
}
