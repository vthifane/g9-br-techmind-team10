package com.g9team10.backend.controller;

import com.g9team10.backend.dto.AuthResponse;
import com.g9team10.backend.dto.LoginRequest;
import com.g9team10.backend.dto.RegisterRequest;
import com.g9team10.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(
        name = "Autenticação",
        description = "Endpoints responsáveis pelo cadastro e autenticação de usuários"
)
public class UserController {

    @Autowired
    private UserService service;

    @Operation(
            summary = "Cadastrar usuário",
            description = "Realiza o cadastro de um novo usuário utilizando nome de usuário, e-mail e senha."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Usuário cadastrado com sucesso"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos ou e-mail já cadastrado"
    )
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody @Valid RegisterRequest request) {

        service.register(request);

        return ResponseEntity.ok("Usuário cadastrado com sucesso.");
    }

    @Operation(
            summary = "Realizar login",
            description = "Autentica o usuário utilizando e-mail e senha e retorna um token JWT para acesso aos endpoints protegidos."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Login realizado com sucesso"
    )
    @ApiResponse(
            responseCode = "401",
            description = "E-mail ou senha inválidos"
    )
    @ApiResponse(
            responseCode = "403",
            description = "Acesso não autorizado!"
    )
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request){

        return ResponseEntity.ok(service.login(request));


    }

}
