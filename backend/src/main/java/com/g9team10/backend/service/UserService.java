package com.g9team10.backend.service;

import com.g9team10.backend.dto.AuthResponse;
import com.g9team10.backend.dto.LoginRequest;
import com.g9team10.backend.dto.RegisterRequest;
import com.g9team10.backend.exception.BusinessException;
import com.g9team10.backend.model.User;
import com.g9team10.backend.repository.UserRepository;
import com.g9team10.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;


    public void register(RegisterRequest request){
        if(userRepository.existsByEmail(request.email())){
            throw new BusinessException("Email já cadastrado!");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);
    }


    public AuthResponse login(LoginRequest dto){

        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if(!passwordEncoder.matches(dto.password(), user.getPassword())){
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.gerarToken(user);

        return new AuthResponse(token);

    }




}
