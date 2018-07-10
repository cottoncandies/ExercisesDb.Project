package exercisesdb.services;

import com.jfinal.plugin.activerecord.Page;
import exercisesdb.common.ListUtil;
import exercisesdb.model.Exam;
import exercisesdb.model.Paper;

import java.util.List;

public class ExamService {
    private static final String commonSql = "select DISTINCT ng_id,ng_parent_id,nt_num,nt_parent_num,nt_section,nt_sub_index," +
            "ng_cat_id,sz_cat_full,nt_grade,nt_term,nt_deep,sz_prov,sz_city,sz_infor_src,sz_age,sz_infor_kind,nt_read_time," +
            "nt_answer_time,nt_score,sz_wenli,sz_must,nt_objective,nt_infor_trans,sz_chart_kind,nt_in_paper,sz_paper_num," +
            "sz_pager_level,sz_paper_age,sz_paper_index,tx_keywords,sz_listen,nt_view_times,nt_using_times,ts_created," +
            "ts_updated,ts_auditing,nt_audit,nt_state,tx_comment,sz_kp_cap2,tx_comment2,tx_err_descr,sz_old_textbook," +
            "sz_chapter,sz_segment,sz_edition,ng_kind_id,sz_kind_name,sz_abi_cap,sz_kp_cap,tx_mingti,tx_answer,tx_xuanxiang," +
            "tx_jiexi,tx_tigan,ng_subject_id ";
    private static final String commonMyCollectSql = "select DISTINCT e.ng_id,e.ng_parent_id,e.nt_num,e.nt_parent_num,e.nt_section,e.nt_sub_index," +
            "e.ng_cat_id,e.sz_cat_full,e.nt_grade,e.nt_term,e.nt_deep,e.sz_prov,e.sz_city,e.sz_infor_src,e.sz_age,e.sz_infor_kind,e.nt_read_time," +
            "e.nt_answer_time,e.nt_score,e.sz_wenli,e.sz_must,e.nt_objective,e.nt_infor_trans,e.sz_chart_kind,e.nt_in_paper,e.sz_paper_num," +
            "e.sz_pager_level,e.sz_paper_age,e.sz_paper_index,e.tx_keywords,e.sz_listen,e.nt_view_times,e.nt_using_times,e.ts_created," +
            "e.ts_updated,e.ts_auditing,e.nt_audit,e.nt_state,e.tx_comment,e.sz_kp_cap2,e.tx_comment2,e.tx_err_descr,e.sz_old_textbook," +
            "e.sz_chapter,e.sz_segment,e.sz_edition,e.ng_kind_id,e.sz_kind_name,e.sz_abi_cap,e.sz_kp_cap,e.tx_mingti,e.tx_answer,e.tx_xuanxiang," +
            "e.tx_jiexi,e.tx_tigan,e.ng_subject_id ";

    public static Page<Exam> firstEntrance(int pageNum, int pageSize, int section, Long subjectId) {
        return Exam.dao.paginate(pageNum, pageSize, commonSql,
                " from sys_exam_t where ng_subject_id = ? and nt_section = ? ", subjectId, section);
    }

    public static Page<Exam> firstEntrancePaper(int pageNum, int pageSize, int section, Long subjectId, String paperType) {
        if (section == 2) {
            paperType = "中考真题";
        } else if (section == 3) {
            paperType = "高考真题";
        }
        return Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql,
                " from sys_exam_t e inner join sys_paper_exam_t pe on e.ng_id = pe.ng_exam_id " +
                        "inner join sys_paper_t pa on pe.ng_paper_id = pa.ng_id " +
                        "where pa.sz_kind=? and e.ng_subject_id = ? and e.nt_section = ? ", paperType, subjectId, section);
    }

    public static Page<Exam> firstEntranceMyCollect(int section, Long subjectId, int pageNum, int pageSize, Long userId) {
        String sql = " from sys_exam_t e inner join sys_favorite_t f on e.ng_id = f.ng_exam_id where f.ng_subject_id = ? and f.nt_section = ? and f.ng_user_id = ? ";
        Page<Exam> paginate = Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql, sql, subjectId, section, userId);
        return (null != paginate && paginate.getList().size() > 0) ? paginate : null;
    }

    public static Page<Exam> getExamLimited(Long subjectId, String mlbh, String examKind, int difficulty, String ability,
                                            int pageNum, int pageSize) {
        String sql = " from sys_exam_t e inner join sys_book_catalog_t bc on e.ng_cat_id = bc.ng_id " +
                " where 1=1 ";
//        String sql = " from sys_exam_t e where 1=1 ";
        if (null != mlbh && !"0".equals(mlbh)) {
            sql += " and bc.sz_num like " + "\'" + mlbh + "%\'";
//            sql += " and exists(select * from sys_book_catalog_t bc where e.ng_cat_id=bc.ng_id and  bc.sz_num like " + "\'" + mlbh + "%\')";
        }
//        else {
//            sql += " and exists(select * from sys_book_catalog_t bc where e.ng_cat_id=bc.ng_id )";
//        }
        if (0 != subjectId) {
            sql += " and e.ng_subject_id = " + subjectId;
        }
        if (null != examKind && !"全部".equals(examKind)) {
            sql += " and e.sz_kind_name = " + "\'" + examKind + "\'";
        }
        if (0 != difficulty) {
            sql += " and e.nt_deep = " + difficulty;
        }
        if (null != ability && !"全部".equals(ability)) {
            sql += " and e.sz_abi_cap = " + "\'" + ability + "\'";
        }
        Page<Exam> paginate = Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql, sql);
        return paginate;
    }

    public static Page<Exam> getExamLimitedMyCollect(Long subjectId, String mlbh, String examKind, int difficulty, String ability,
                                                     int pageNum, int pageSize, Long userId) {
        String sql = " from sys_exam_t e inner join sys_book_catalog_t bc on e.ng_cat_id = bc.ng_id " +
                " inner join sys_favorite_t f on e.ng_id = f.ng_exam_id where 1=1 and f.ng_subject_id = ? and f.ng_user_id = ? ";
        if (null != mlbh && !"0".equals(mlbh)) {
            sql += " and bc.sz_num::text like " + "\'" + mlbh + "%\'";
        }
        if (null != examKind && !"全部".equals(examKind)) {
            sql += " and e.sz_kind_name = " + "\'" + examKind + "\'";
        }
        if (0 != difficulty) {
            sql += " and e.nt_deep = " + difficulty;
        }
        if (null != ability && !"全部".equals(ability)) {
            sql += " and e.sz_abi_cap = " + "\'" + ability + "\'";
        }
        Page<Exam> paginate = Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql, sql, subjectId, userId);
        return (null != paginate && paginate.getList().size() > 0) ? paginate : null;
    }

    public static List<Exam> getYears() {
        String sql = "select sz_age from sys_exam_t group by sz_age order by sz_age desc";
        List<Exam> exams = Exam.dao.find(sql);
        return (null != exams && exams.size() > 0) ? exams : null;
    }

    public static Page<Exam> getExamsByKPNum(String mlbh, String examKind, int difficulty, String ability, int pageNum,
                                             int pageSize, Integer section, Long subjectId) {
        String sql = " from sys_exam_t e " +
                "INNER JOIN sys_exam_kp_t k on  e.ng_id = k.ng_exam_id " +
                "inner join sys_know_point_t kp  on k.ng_kp_id = kp.ng_id " +
                "where 1=1 and e.nt_section = " + section + " and e.ng_subject_id = " + subjectId;
        if (null != mlbh && !"0".equals(mlbh)) {
            sql += " and kp.sz_num like " + "\'" + mlbh + "%\'";
        }
        if (null != examKind && !"全部".equals(examKind)) {
            sql += " and sz_kind_name = " + "\'" + examKind + "\'";
        }
        if (0 != difficulty) {
            sql += " and nt_deep = " + difficulty;
        }
        if (null != ability && !"全部".equals(ability)) {
            sql += " and sz_abi_cap = " + "\'" + ability + "\'";
        }
        return Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql, sql);
    }

    public static Page<Exam> getExamsByKPNumAndUserId(String mlbh, String examKind, Integer difficulty, String ability,
                                                      int pageNum, int pageSize, Long userId, Long subjectId) {
        String sql = " from sys_exam_t e " +
                "INNER JOIN sys_exam_kp_t k on  e.ng_id=k.ng_exam_id " +
                "inner join sys_know_point_t kp  on k.ng_kp_id=kp.ng_id " +
                "inner join sys_favorite_t f  on f.ng_exam_id=e.ng_id " +
                "where kp.sz_num like \'" + mlbh + "%\' and f.ng_user_id = ? and f.ng_subject_id = ?";
        if (null != examKind && !"全部".equals(examKind)) {
            sql += " and sz_kind_name = " + "\'" + examKind + "\'";
        }
        if (null != difficulty && 0 != difficulty) {
            sql += " and nt_deep = " + difficulty;
        }
        if (null != ability && !"全部".equals(ability)) {
            sql += " and sz_abi_cap = " + "\'" + ability + "\'";
        }
        Page<Exam> paginate = Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql, sql, userId, subjectId);
        return (null != paginate && paginate.getList().size() > 0) ? paginate : null;
    }

    public static Page<Exam> getExamByPaper(String paperType, String year, Long paperId, String examKind, int difficulty, String ability, int pageNum, int pageSize) {
        String sql = " FROM sys_exam_t e " +
                " INNER JOIN sys_paper_exam_t pe ON e.ng_id = pe.ng_exam_id " +
                " INNER JOIN sys_paper_t pa ON pe.ng_paper_id=pa.ng_id " +
                " where 1 = 1 and pa.sz_kind = ?";
        if (!"".equals(year)) {
            sql += " and pa.sz_age = \'" + year + "\'";
        }
        if (null != paperId) {
            sql += " and pe.ng_paper_id = " + paperId;
        }
        if (!"".equals(examKind) && !"全部".equals(examKind)) {
            sql += " and e.sz_kind_name = " + "\'" + examKind + "\'";
        }
        if (0 != difficulty) {
            sql += " and e.nt_deep = " + difficulty;
        }
        if (!"".equals(ability) && !"全部".equals(ability)) {
            sql += " and e.sz_abi_cap = " + "\'" + ability + "\'";
        }
        Page<Exam> paginate = Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql, sql, paperType);
        return paginate;
    }

    public static Page<Exam> getExamByPaperAndUserId(String year, Long paperId, String examKind, int difficulty, String ability, int pageNum, int pageSize, Long userId) {
        String sql = " FROM sys_exam_t e " +
                " INNER JOIN sys_paper_exam_t pe ON e.ng_id = pe.ng_exam_id " +
                " INNER JOIN sys_favorite_t f  ON f.ng_exam_id=e.ng_id " +
                " INNER JOIN sys_paper_t pa ON pe.ng_paper_id=pa.ng_id " +
                " where 1 = 1 and f.ng_user_id = ? ";
        if (!"".equals(year)) {
            sql += " and pa.sz_age = \'" + year + "\'";
        }
        if (null != paperId) {
            sql += " and pe.ng_paper_id = " + paperId;
        }
        if (!"".equals(examKind) && !"全部".equals(examKind)) {
            sql += " and e.sz_kind_name = " + "\'" + examKind + "\'";
        }
        if (0 != difficulty) {
            sql += " and e.nt_deep = " + difficulty;
        }
        if (!"".equals(ability) && !"全部".equals(ability)) {
            sql += " and e.sz_abi_cap = " + "\'" + ability + "\'";
        }

        Page<Exam> paginate = Exam.dao.paginate(pageNum, pageSize, commonMyCollectSql, sql, userId);
        return (null != paginate && paginate.getList().size() > 0) ? paginate : null;
    }
}
