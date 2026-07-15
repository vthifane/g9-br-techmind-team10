package com.g9team10.backend.exception;

public class ContentNotFoundException extends ResourceNotFoundException{
    public ContentNotFoundException(Long contentId) {
        super("Content with id " + contentId + " not found");
    }
}