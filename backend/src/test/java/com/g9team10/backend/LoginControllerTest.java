package com.g9team10.backend;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
class LoginControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	@WithMockUser(username = "teste@teste.com", roles = {"USER"})
	void deveLogarComSucesso() throws Exception {
		String json = "{\"email\":\"teste@teste.com\", \"senha\":\"123456\"}";
		mockMvc.perform(post("/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(status().isOk());
	}

	@Test
	void deveRetornar404SeUsuarioNaoExiste() throws Exception {
		String json = "{\"email\":\"naoexiste@teste.com\", \"senha\":\"123456\"}";
		mockMvc.perform(post("/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(status().isNotFound());
	}

	@Test
    void deveAnalisarTextoComSucesso() throws Exception {
        String json = "{\"texto\":\"Java\"}";
        mockMvc.perform(post("/conteudos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }
	
}
