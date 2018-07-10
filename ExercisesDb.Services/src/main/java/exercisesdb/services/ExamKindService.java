package exercisesdb.services;

import exercisesdb.model.ExamKind;

import java.util.List;

public class ExamKindService {

    public static List<ExamKind> getExamKinds(int section, Long subjectId) {
        String txSql = "select ng_id,nt_section,ng_subject_id,sz_caption,nt_state,tx_comment,nt_old_id from sys_exam_kind_t" +
                " where nt_section = ? and ng_subject_id = ?";
        List<ExamKind> examKinds = ExamKind.dao.find(txSql, section, subjectId);
        return (null != examKinds && examKinds.size() > 0) ? examKinds : null;
    }

}
