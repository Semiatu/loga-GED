/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.loga.skeleton;

import com.loga.as.entity.Profile;
import com.loga.as.entity.ProfileRole;
import com.loga.as.entity.Role;
import com.loga.as.entity.User;
import com.loga.as.repository.ProfileRepository;
import com.loga.as.repository.ProfileRoleRepository;
import com.loga.as.repository.RoleRepository;
import com.loga.as.repository.UserRepository;
import java.nio.file.Files;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import ml.smk.common.util.ExceptionApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;
import static org.springframework.util.ResourceUtils.getFile;

/**
 *
 * @author sidaty
 */
@Component
public class DefaultUserCreator {
    
    private static final String PATTERN_SPLITTER = "#";
    private static final String ACTION_AJOUTER = "Ajouter";
    private static final String ACTION_EDITER = "Editer";
    private static final String ACTION_SUPPRIMER = "Supprimer";
    private static final List<String> ACTIONS_LIST = asList(ACTION_AJOUTER, ACTION_EDITER, ACTION_SUPPRIMER);
    private static final Map<String, List<String>> ACTIONS_LIST_MAP;
    
    private static final String ADMIN_NAME = "Admin";

    static {
        ACTIONS_LIST_MAP = new HashMap<>();
        ACTIONS_LIST_MAP.put("0", emptyList());
        ACTIONS_LIST_MAP.put("1", singletonList(ACTION_AJOUTER));
        ACTIONS_LIST_MAP.put("2", singletonList(ACTION_EDITER));
        ACTIONS_LIST_MAP.put("3", asList(ACTION_AJOUTER, ACTION_EDITER));
        ACTIONS_LIST_MAP.put("4", singletonList(ACTION_SUPPRIMER));
        ACTIONS_LIST_MAP.put("5", asList(ACTION_AJOUTER, ACTION_SUPPRIMER));
        ACTIONS_LIST_MAP.put("6", asList(ACTION_EDITER, ACTION_SUPPRIMER));
        ACTIONS_LIST_MAP.put("7", asList(ACTION_AJOUTER, ACTION_EDITER, ACTION_SUPPRIMER));
    }

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileRoleRepository profileRoleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public DefaultUserCreator(RoleRepository roleRepository, UserRepository userRepository, ProfileRepository profileRepository, ProfileRoleRepository profileRoleRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileRoleRepository = profileRoleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void create() throws Exception {
        Profile profile = createDefaultProfile();

        addAllRoles(profile);

        createDefaultUser(profile);
    }

    private User createDefaultUser(Profile profile) {
        User user = userRepository.findByUsername(ADMIN_NAME.toLowerCase());
        if (user != null) {
            return user;
        }
        user = User.builder()
                .username(ADMIN_NAME.toLowerCase())
                .password(bCryptPasswordEncoder.encode(ADMIN_NAME.toLowerCase()))
                .firstName(ADMIN_NAME)
                .lastName(ADMIN_NAME)
                .phone("00000000")
                .profile(profile)
                .build();

        return userRepository.saveAndFlush(user);
    }

    private Profile createDefaultProfile() {
        Profile profile = profileRepository.findByName(ADMIN_NAME.toLowerCase());
        if (profile != null) {
            return profile;
        }
        profile = Profile.builder()
                .name(ADMIN_NAME.toLowerCase())
                .description("Administrator profile")
                .build();

        return profileRepository.saveAndFlush(profile);
    }

    private void addAllRoles(Profile profile) throws Exception {
        Files.lines(getFile("classpath:roles").toPath())
                .map(this::toRoles)
                .flatMap(List::stream)
                .map(this::saveOrGet)
                .forEach(role -> addRoleToProfile(profile, role));
    }

    private Role saveOrGet(Role role) {
        Role roleDB = roleRepository.findByName(role.getName());
        if (roleDB != null) {
            return roleDB;
        }
        return roleRepository.saveAndFlush(role);
    }
    
    private void addRoleToProfile(Profile profile, Role role) {
        ProfileRole profileRole = profileRoleRepository.findByProfileIdAndRoleId(profile.getId(), role.getId());
        if(profileRole != null) {
            return;
        }
        profileRole = ProfileRole
                .builder()
                .profile(profile)
                .role(role)
                .build();
        profileRoleRepository.saveAndFlush(profileRole);
    }
    

    private List<Role> toRoles(String pattern) {
        return parseName(pattern)
                .stream()
                .map(name -> Role.builder().name(name).description(name).build())
                .collect(toList());
    }

    private List<String> parseName(String pattern) {
        if (!pattern.contains(PATTERN_SPLITTER)) {
            return formatNames(ACTIONS_LIST, pattern);
        }

        String[] namesTab = pattern.split(PATTERN_SPLITTER);
        if (namesTab.length != 2) {
            throw new ExceptionApplication("pattern error");
        }

        String begin = namesTab[0];
        String last = namesTab[1];
        return formatNames(actionsList(last), begin);
    }

    private List<String> actionsList(String last) {
        List<String> actions = ACTIONS_LIST_MAP.get(last);
        if (actions == null) {
            throw new ExceptionApplication("no related actions");
        }
        return actions;
    }

    private List<String> formatNames(Collection<String> actions, String name) {
        List<String> names = actions
                .stream()
                .map(prefix -> String.format("%s %s", prefix, name))
                .collect(toList());
        names.add(name);
        return names;
    }
}
