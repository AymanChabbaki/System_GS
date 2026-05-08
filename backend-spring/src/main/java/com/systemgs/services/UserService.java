package com.systemgs.services;

import com.systemgs.entities.User;
import com.systemgs.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User details) {
        User user = userRepository.findById(id).orElseThrow();
        user.setEmail(details.getEmail());
        user.setUsername(details.getUsername());
        if (details.getRole() != null) user.setRole(details.getRole());
        return userRepository.save(user);
    }

    public void changePassword(Long id, String newPassword) {
        User user = userRepository.findById(id).orElseThrow();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(false);
        user.setPending(true);
        user.setRole(User.Role.employee);
        return userRepository.save(user);
    }

    public void approveUser(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActive(true);
        user.setPending(false);
        userRepository.save(user);
    }

    public void rejectUser(Long id) {
        userRepository.deleteById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
