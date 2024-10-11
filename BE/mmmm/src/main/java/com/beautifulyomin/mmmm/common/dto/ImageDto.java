package com.beautifulyomin.mmmm.common.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImageDto {
    private String originName;
    private String storedImagePath;
}
