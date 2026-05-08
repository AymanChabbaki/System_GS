package com.systemgs;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SystemGsApplication {
    public static void main(String[] args) {
        SpringApplication.run(SystemGsApplication.class, args);
    }

    @Bean
    public CommandLineRunner demo() {
        return (args) -> {
            System.out.println("DEBUG: Hash for 'admin123' is: " + new BCryptPasswordEncoder().encode("admin123"));
        };
    }
}
