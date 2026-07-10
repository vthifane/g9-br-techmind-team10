package com.g9team10.backend.controller;

import com.g9team10.backend.dto.AuthResponse;
import com.g9team10.backend.dto.LoginRequest;
import com.g9team10.backend.dto.RegisterRequest;
import com.g9team10.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody @Valid RegisterRequest request) {

        service.register(request);

        return ResponseEntity.ok("Usuário cadastrado com sucesso.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request){

        return ResponseEntity.ok(service.login(request));


    }

}
