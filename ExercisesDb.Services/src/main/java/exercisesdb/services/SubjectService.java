package exercisesdb.services;

import exercisesdb.model.Subject;
/*
    Subject Service
    2018年1月11日16:19:22  楚了了
 */

public class SubjectService {

    //根据id查学科
    public static Subject getSubjectById(Long id) {
        return Subject.dao.findFirst("select * from sys_subject_t where ng_id=?", id);
    }

    //根据学科名字查找
    public static Subject getSubjectByCaption(String cap) {
        return Subject.dao.findFirst("select * from sys_subject_t where sz_caption=?", cap);
    }

    public static String getCaptionById(Long subjectId) {
        Subject subject = Subject.dao.findById(subjectId);
        return (null != subject) ? subject.getCaption() : null;
    }
}
