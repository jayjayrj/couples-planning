package com.couplesplanning.user;

import com.couplesplanning.shared.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final UserRepository userRepository;

    @Value("${app.upload.avatar-dir:uploads/avatars}")
    private String avatarDir;

    @Value("${app.upload.avatar-base-url:/uploads/avatars}")
    private String avatarBaseUrl;

    public AvatarUploadResponse uploadAvatar(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Avatar file is required");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BusinessException("Only JPG, PNG or WEBP images are allowed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        try {
            Path uploadPath = Paths.get(avatarDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String extension = getExtension(file.getOriginalFilename());
            String fileName = "user-" + userId + "-" + UUID.randomUUID() + extension;

            Path targetFile = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = avatarBaseUrl + "/" + fileName;

            user.setAvatarUrl(avatarUrl);
            user.setUpdatedAt(OffsetDateTime.now());
            userRepository.save(user);

            return new AvatarUploadResponse(avatarUrl);

        } catch (IOException e) {
            throw new BusinessException("Could not save avatar");
        }
    }

    private String getExtension(String originalFilename) {
        String extension = StringUtils.getFilenameExtension(originalFilename);
        return extension == null ? ".jpg" : "." + extension.toLowerCase();
    }
}