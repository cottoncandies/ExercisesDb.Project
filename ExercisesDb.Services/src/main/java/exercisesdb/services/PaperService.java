package exercisesdb.services;

import exercisesdb.model.Paper;

import java.util.ArrayList;
import java.util.List;

public class PaperService {

    private static final String commonSql = "select ng_id,sz_num,sz_caption,sz_kind,sz_age,ng_cat_id,nt_section,ng_subject_id," +
            "sz_wenli,sz_prov,sz_city,nt_term,nt_grade,nt_score,nt_score_ex,nt_cost_resp,ts_created,ts_updated,ts_auditing," +
            "tx_comment,sz_infor_src,sz_infor_kind,nt_old_id from sys_paper_t where 1=1 ";
    private static final String commonSqlFav = "select pa.ng_id,pa.sz_num,pa.sz_caption,pa.sz_kind,pa.sz_age,pa.ng_cat_id," +
            "pa.nt_section,pa.ng_subject_id,pa.sz_wenli,pa.sz_prov,pa.sz_city,pa.nt_term,pa.nt_grade,pa.nt_score," +
            "pa.nt_score_ex,pa.nt_cost_resp,pa.ts_created,pa.ts_updated,pa.ts_auditing,pa.tx_comment,pa.sz_infor_src," +
            "pa.sz_infor_kind,pa.nt_old_id from sys_paper_t pa";

    public static List<String> getYears(Long subjectId, String paperType) {
        String sqlNF = "select sz_age from sys_paper_t where ng_subject_id = ? and sz_kind = ?" +
                " GROUP BY sz_age ORDER BY sz_age desc";
        List<String> years = new ArrayList<>();
        List<Paper> papers = Paper.dao.find(sqlNF, subjectId, paperType);
        for (Paper paper : papers) {
            years.add(paper.getAge());
        }
        return years.size() > 0 ? years : null;
    }

    public static List<String> getYearsFav(Long userId, int section, Long subjectId, String paperType) {
        String sqlNF = "select pa.sz_age FROM sys_paper_t pa " +
                " inner join sys_paper_exam_t pe on pa.ng_id = pe.ng_paper_id " +
                " inner join sys_favorite_t fav on pe.ng_exam_id = fav.ng_exam_id " +
                " where fav.ng_user_id=? and fav.nt_section=? and fav.ng_subject_id=?  and pa.sz_kind=? " +
                " group by pa.sz_age order by pa.sz_age desc";
        List<String> years = new ArrayList<>();
        List<Paper> papers = Paper.dao.find(sqlNF, userId, section, subjectId, paperType);
        for (Paper paper : papers) {
            years.add(paper.getAge());
        }
        return years.size() > 0 ? years : null;
    }

    public static List<Paper> getPapers(Long subjectId, String year, String paperType) {

        String sql = commonSql + " and sz_kind = \'" + paperType + "\' and ng_subject_id = ? ";
        List<Paper> results = new ArrayList<>();
        List<Paper> allPapers = Paper.dao.find(sql, subjectId);
        if (null != year) {
            for (Paper paper : allPapers) {
                if (year.equals(paper.getAge())) {
                    results.add(paper);
                }
            }
        }
        return results.size() > 0 ? results : null;
    }

    public static List<Paper> getPapersFav(Long userId, int section, Long subjectId, String year, String paperType) {

        String sql = commonSqlFav + " inner join sys_paper_exam_t pe on pa.ng_id = pe.ng_paper_id" +
                " inner join sys_favorite_t fav on pe.ng_exam_id = fav.ng_exam_id" +
                " where fav.ng_user_id=? and fav.nt_section=? and fav.ng_subject_id=? and pa.sz_age=? and pa.sz_kind = ? " +
                " order by pa.sz_age desc";
        List<Paper> results = Paper.dao.find(sql, userId, section, subjectId, year, paperType);
        return results.size() > 0 ? results : null;
    }

}
