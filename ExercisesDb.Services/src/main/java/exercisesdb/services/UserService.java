package exercisesdb.services;


import exercisesdb.common.LongId;
import exercisesdb.model.Subject;
import exercisesdb.model.User;

import java.util.List;

public class UserService {

    public static User getUserByUsername(String userName) {
        List<User> us = User.dao.find("select ng_id,sz_username,sz_password,nt_section,ng_subject_id,sz_nickname " +
                "from sys_user_t where sz_username = ?", userName);
        return (null != us && us.size() > 0) ? us.get(0) : null;
    }

    public static String getUsernameById(Long userId) {
        User user = User.dao.findById(userId);
        return (null != user) ? user.getUsername() : null;
    }

    public static User addUser(String userName, Integer section, String subject) {
        User u;
        u = getUserByUsername(userName);
        if (null == u) {
            u = new User();
            u.setId(LongId.getId());
            u.setUsername(userName);
            u.setPassword("12345678");
            u.setSection(section);
            Subject caption = SubjectService.getSubjectByCaption(subject);
            u.setSubjectId(caption.getId());
            u.save();
        } else {
            u.setSection(section);
            Subject caption = SubjectService.getSubjectByCaption(subject);
            u.setSubjectId(caption.getId());
            u.update();
        }
        return u;
    }
    public static User addUser(String userName, Integer section, String subject,String nickname) {
        User u;
        u = getUserByUsername(userName);
        if (null == u) {
            u = new User();
            u.setId(LongId.getId());
            u.setUsername(userName);
            u.setNickname(nickname);
            u.setPassword("12345678");
            u.setSection(section);
            Subject caption = SubjectService.getSubjectByCaption(subject);
            u.setSubjectId(caption.getId());
            u.save();
        } else {
            u.setSection(section);
            Subject caption = SubjectService.getSubjectByCaption(subject);
            u.setSubjectId(caption.getId());
            u.update();
        }
        return u;
    }

    public static User updateSectionSubject(String userName, int section, String subject) {
        User user = getUserByUsername(userName);
        Subject caption = SubjectService.getSubjectByCaption(subject);
        user.setSection(section);
        user.setSubjectId(caption.getId());
        user.update();
        return user;
    }
    public static User updateSectionSubject(String userName, int section, String subject,String nickname) {
        User user = getUserByUsername(userName);
        Subject caption = SubjectService.getSubjectByCaption(subject);
        user.setNickname(nickname);
        user.setSection(section);
        user.setSubjectId(caption.getId());
        user.update();
        return user;
    }
}
