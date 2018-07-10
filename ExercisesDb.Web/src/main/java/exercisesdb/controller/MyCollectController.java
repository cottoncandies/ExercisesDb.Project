package exercisesdb.controller;

import exercisesdb.model.*;

import java.util.ArrayList;
import java.util.List;


public class MyCollectController extends BaseController {

    private static List<BookCatalog> allBookCatalogs = new ArrayList<>();
    private static List<BookCatalog> bookCatalogs = new ArrayList<>();
    private static List<ExamKind> txs = new ArrayList<>();
    private static List<Ability> nls = new ArrayList<>();
    private static List<Exam> sts = new ArrayList<>();
    private static int section = 1;
    private static int subject = 1;
    private static String strSection = "";
    private static String strSubject = "";
    private static String num = "100";

    static {
        String muSql = "select ng_id,sz_num,sz_parent_num,sz_caption,nt_section,ng_subject_id,nt_grade,nt_serial,sz_descr,nt_show,tx_comment,nt_old_id from sys_book_catalog_t where nt_section = ? and ng_subject_id = ?";
        bookCatalogs = BookCatalog.dao.find(muSql, section, subject);
        String txSql = "select ng_id,nt_section,ng_subject_id,sz_caption,nt_state,tx_comment,nt_old_id from sys_exam_kind_t where nt_section = ? and ng_subject_id = ?";
        txs = ExamKind.dao.find(txSql, section, subject);
        String sql = "select ng_id,nt_section,ng_subject_id,sz_caption,nt_state,tx_comment,nt_old_id from sys_ability_t where nt_section = ? and ng_subject_id = ?";
        nls = Ability.dao.find(sql, section, subject);
//        strSection = changeSection(section);
        List<Subject> subjects = Subject.dao.find("select sz_caption from sys_subject_t where ng_id = ?", subject);
        strSubject = subjects.get(0).getCaption();
        String stSql = "select ng_id,ng_parent_id,nt_sub_index,ng_cat_id,sz_cat_full,nt_grade,nt_term,nt_deep,sz_prov,sz_city,sz_infor_src,sz_age,sz_infor_kind,nt_read_time,nt_answer_time,nt_score,sz_wenli,sz_must,nt_objective,nt_infor_trans,sz_chart_kind,nt_in_paper,sz_paper_num,sz_pager_level,sz_paper_age,sz_paper_index,tx_keywords,sz_listen,nt_view_times,nt_using_times,ts_created,ts_updated,ts_auditing,nt_audit,nt_state,tx_comment,sz_kp_cap2,tx_comment2,tx_err_descr,sz_old_textbook,sz_chapter,sz_segment,sz_edition,ng_kind_id,sz_kind_name,sz_abi_cap,sz_kp_cap,tx_mingti,tx_answer,tx_xuanxiang,tx_jiexi,tx_tigan from sys_exam_t where ng_cat_id::text like ";
        sts = Exam.dao.find(stSql + "\'" + num + "%\'");
    }


    private int examCount;

    public String getBookCatalogs(String mlNum) {
        String strMLTree = "<ul>";
        for (BookCatalog bookCatalog : bookCatalogs) {
            if (bookCatalog.getParentNum().equals(mlNum)) {
                strMLTree += "<li class=\'jstree-closed\' id= \'" + bookCatalog.getNum() + "\'><a href=\'javascript:;\' title=\'" + bookCatalog.getCaption() + "\'>" + bookCatalog.getCaption() + "</a><ul></ul></li>";
            }
        }
        strMLTree += "</ul>";

        return strMLTree;
    }


}
