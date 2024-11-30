package com.example.backend.service;

import com.example.backend.config.ImportStatus;
import com.example.backend.domain.History;
import com.example.backend.domain.HumanBeing;
import com.example.backend.domain.Role;
import com.example.backend.entity.ImportHistoryEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.HumanAlreadyExist;
import com.example.backend.exception.NoEntityException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.repository.ImportHistoryRepository;
import com.example.backend.repository.UserRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImportService {
    private final HumanBeingService humanBeingService;
    private final UserRepo userRepo;
    private final ObjectMapper objectMapper;
    private final ImportHistoryRepository importHistoryRepository;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void importFile(MultipartFile file, Long userId) throws Exception {
        ImportHistoryEntity historyEntity = new ImportHistoryEntity();
        historyEntity.setStatus(ImportStatus.IN_PROGRESS);

        historyEntity.setUser(userRepo.findById(userId).orElseThrow(() -> new UserNotFoundException("No such user")));
        historyEntity.setLogin();
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        String fileName = file.getOriginalFilename();

        if (fileName != null && fileName.endsWith(".json")) {
            try {
                int count = importFromJson(file, userId);
                historyEntity.setStatus(ImportStatus.SUCCESS);
                historyEntity.setAddedObjectsCount(count);
            } catch (NoEntityException | HumanAlreadyExist e) {
                historyEntity.setStatus(ImportStatus.FAILURE);
                importHistoryRepository.save(historyEntity);
                throw new IllegalArgumentException("Invalid data");
            } catch (AccessDeniedException e) {
                historyEntity.setStatus(ImportStatus.FAILURE);
                importHistoryRepository.save(historyEntity);
                throw new IllegalArgumentException("access denied");
            } catch (Exception e) {
                historyEntity.setStatus(ImportStatus.FAILURE);
                importHistoryRepository.save(historyEntity);
                throw new IllegalArgumentException("smth went wrong");
            }

        } else {
            historyEntity.setStatus(ImportStatus.FAILURE);
            importHistoryRepository.save(historyEntity);
            throw new IllegalArgumentException("Unsupported file format");
        }
        importHistoryRepository.save(historyEntity);

    }


    private int importFromJson(MultipartFile file, Long userId) throws Exception {

        List<HumanBeing> humans = objectMapper.readValue(file.getInputStream(),
                new TypeReference<>() {
                });
        for (HumanBeing human : humans) {
            humanBeingService.addHumanModelFromFile(human, userId);
        }
        return humans.size();
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
