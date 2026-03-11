package com.couplesplanning.user;

import com.couplesplanning.shared.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AvatarUploadResponse uploadAvatar(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestPart("file") MultipartFile file
    ) {
        return userService.uploadAvatar(authenticatedUser.getId(), file);
    }
}