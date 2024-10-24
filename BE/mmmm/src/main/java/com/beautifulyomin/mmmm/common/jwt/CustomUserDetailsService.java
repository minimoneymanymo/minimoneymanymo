package com.beautifulyomin.mmmm.common.jwt;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ParentRepository parentsRepository;
    private final ChildrenRepository childrenRepository;


    public CustomUserDetailsService(ParentRepository parentsRepository, ChildrenRepository childrenRepository) {
        this.parentsRepository = parentsRepository;
        this.childrenRepository = childrenRepository;
    }

    // role을 인자로 받는 새로운 메서드
    public UserDetails loadUserByUsernameAndRole(String username, String role) throws UsernameNotFoundException {
        System.out.println("In CustomUserDetailsService loadUserByUsernameAndRole");
        System.out.println(username + " " + role);
        if (role.equals("0")) {
            // 부모 계정으로 조회
            Parent parent = parentsRepository.findByUserId(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Parent not found with username: " + username));
            System.out.println(parent);
            return new CustomUserDetails(parent); // CustomUserDetails은 필터에서 필요한 정보를 각 클래스별로 정보를 알맞게 저장해 가져온다
        } else if (role.equals("1")) {
            // 자녀 계정으로 조회
            Children children = childrenRepository.findByUserId(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Children not found with username: " + username));
            System.out.println(children);
            return new CustomUserDetails(children);
        } else {
            throw new IllegalArgumentException("Invalid role provided: " + role);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        throw new UnsupportedOperationException("Role is required to load user.");
    }

}
