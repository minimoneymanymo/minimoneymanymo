package com.beautifulyomin.mmmm.simulation;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentAndChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import java.util.*;
import java.util.stream.IntStream;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@Import({QueryDslConfig.class})
class userMakeSimulation {

    private static final int INVESTOR_START_IDX = 50;
    private static final int MAKE_COUNT = 1000;
    private static final int MONEY = 100000;
    private final Integer PARENT_ID = 1;
    private final EntityManager entityManager;
    private final ChildrenRepository childrenRepository;
    private final ParentRepository parentRepository;
    private final ParentAndChildrenRepository parentAndChildrenRepository;

    @Autowired
    userMakeSimulation(EntityManager entityManager, ChildrenRepository childrenRepository, ParentRepository parentRepository, ParentAndChildrenRepository parentAndChildrenRepository) {
        this.entityManager = entityManager;
        this.childrenRepository = childrenRepository;
        this.parentRepository = parentRepository;
        this.parentAndChildrenRepository = parentAndChildrenRepository;
    }

    @Test
    public void createChildrenAndParentBatch() {
        // 1. 부모 생성 (ID는 5로 통일)
        Parent parent = parentRepository.findById(1).orElseGet(() -> {
            Parent newParent = new Parent("김부모", "김부모", "1234", "010-1234-5678", "77777");
            return parentRepository.save(newParent);
        });

        // 2. 300명의 Children 생성
        List<Children> childrenList = new ArrayList<>();
        List<ParentAndChildren> parentAndChildrenList = new ArrayList<>();

        for (int i = INVESTOR_START_IDX; i <= INVESTOR_START_IDX + MAKE_COUNT; i++) {
            String userId = "김자식" + i;
            String name = "김자식" + i;
            String password = "1234";
            String phoneNumber = "010-0000-000" + (i % 10);  // 예시로 010-0000-000X 형태
            String birthDay = "2010-01-0" + (i % 9 + 1);  // 예시로 2010-01-01 ~ 2010-01-09
            String userKey = "userKey" + i;
            Integer money = MONEY; //한 달동안 거래는 10만원 내에서 진행하도록 하자.

            // Children 엔티티 생성
            Children child = new Children(userId, name, password, phoneNumber, birthDay, userKey);
            child.setMoney(money);

            // 리스트에 추가
            childrenList.add(child);
        }

        // 3. Children 저장
        childrenRepository.saveAll(childrenList);

        // 4. ParentAndChildren 관계 설정 및 저장
        for (Children child : childrenList) {
            ParentAndChildren relation = new ParentAndChildren(parent, child, true);
            parentAndChildrenList.add(relation);
        }

        // 5. ParentAndChildren 저장
        parentAndChildrenRepository.saveAll(parentAndChildrenList);

        System.out.println("300명의 Children과 ParentAndChildren 관계가 성공적으로 저장되었습니다.");
    }

    @Test
    public void updateChildrenMoney() {

        List<Children> childrenList = childrenRepository.findAllById(
                IntStream.rangeClosed(58, 58 + MAKE_COUNT)
                        .boxed()
                        .toList()
        );

        for (Children children : childrenList) {
            children.setMoney(MONEY);
        }

        childrenRepository.saveAll(childrenList);
    }
}
