package exercisesdb.services;

import exercisesdb.common.ListUtil;
import exercisesdb.model.BookCatalog;

import java.util.ArrayList;
import java.util.List;

public class BookCatlogService {

    private static final String commonSql = "select DISTINCT ng_id,sz_num,sz_parent_num,sz_caption,nt_section,ng_subject_id,nt_grade," +
            "nt_serial,sz_descr,nt_show,tx_comment,nt_old_id from sys_book_catalog_t where 1=1 ";
    private static final String commonSqlFav = "select DISTINCT bc.ng_id,bc.sz_num,bc.sz_parent_num,bc.sz_caption,bc.ng_parent_id," +
            "bc.nt_section,bc.ng_subject_id,bc.nt_grade,bc.nt_serial,bc.sz_descr,bc.nt_show,bc.tx_comment,bc.nt_old_id " +
            " from sys_book_catalog_t bc " +
            " inner join sys_exam_t e on bc.ng_id = e.ng_cat_id " +
            " inner join sys_favorite_t fav on e.ng_id = fav.ng_exam_id " +
            " where 1=1 ";

    public static List<BookCatalog> getCatalogByParentNum(String parentNum) {
        String mlSql = commonSql + " and sz_parent_num = \'" + parentNum + "\'" + " order by sz_num asc";
        List<BookCatalog> bookCatalogs = BookCatalog.dao.find(mlSql);
        return (null != bookCatalogs && bookCatalogs.size() > 0) ? bookCatalogs : null;
    }

    public static List<BookCatalog> getCatalogsWithFav(Long userId, int section, Long subjectId) {
        String mlSql = commonSqlFav + " and fav.ng_user_id = ? and fav.nt_section = ? and fav.ng_subject_id = ? " +
                " order by bc.sz_num asc";
        List<BookCatalog> bookCatalogs = BookCatalog.dao.find(mlSql, userId, section, subjectId);
        return (null != bookCatalogs && bookCatalogs.size() > 0) ? bookCatalogs : null;
    }

    public static List<BookCatalog> getCatalogsWithFavClean(Long userId, int section, Long subjectId) {
        String mlSql = commonSqlFav + " and fav.ng_user_id = ? and fav.nt_section = ? and fav.ng_subject_id = ? and e.sz_edition !~*\'真题\' " +
                " order by bc.sz_num asc";
        List<BookCatalog> bookCatalogs = BookCatalog.dao.find(mlSql, userId, section, subjectId);
        return (null != bookCatalogs && bookCatalogs.size() > 0) ? bookCatalogs : null;
    }

    public static List<BookCatalog> getCatalogsByNum(Long userId, int section, Long subjectId, int level) {
        List<BookCatalog> bookCatalogs = getCatalogsWithFavClean(userId, section, subjectId);
        if (null == bookCatalogs) {
            return null;
        }
        ListUtil.removeDuplicate(bookCatalogs);
        String sql = commonSql + " and sz_num = ? and sz_parent_num !='' order by sz_num asc";
        List<BookCatalog> bookCatalogList = new ArrayList<>();
        String lastThirdNum = "";
        String lastSecondNum = "";
        String lastIndexNum = "";
        for (BookCatalog bookCatalog : bookCatalogs) {
            String thirdNum = bookCatalog.getParentNum();
            if (!lastThirdNum.equals(thirdNum)) {
                lastThirdNum = thirdNum;
                BookCatalog thirdBookCatalog = BookCatalog.dao.findFirst(sql, thirdNum);
                if (null != thirdBookCatalog && null != thirdBookCatalog.getParentNum()) {
                    if (3 == level) {
                        bookCatalogList.add(thirdBookCatalog);
                        continue;
                    }
                    String secondNum = thirdBookCatalog.getParentNum();
                    if (!lastSecondNum.equals(secondNum)) {
                        lastSecondNum = secondNum;
                        BookCatalog secondBookCatalog = BookCatalog.dao.findFirst(sql, secondNum);
                        if (null != secondBookCatalog && null != secondBookCatalog.getParentNum()) {
                            if (2 == level) {
                                bookCatalogList.add(secondBookCatalog);
                                continue;
                            }
                            String indexNum = secondBookCatalog.getParentNum();
                            if (!lastIndexNum.equals(indexNum)) {
                                lastIndexNum = indexNum;
                                BookCatalog indexBookCatalog = BookCatalog.dao.findFirst(sql, indexNum);
                                if (null != indexBookCatalog) {
                                    if (1 == level) {
                                        bookCatalogList.add(indexBookCatalog);
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
        ListUtil.removeDuplicate(bookCatalogList);
        return (bookCatalogList.size() > 0) ? bookCatalogList : null;
    }

    public static List<BookCatalog> getCatalogByParentNumFav(String parentNum) {
        String mlSql = commonSql + " and sz_parent_num = \'" + parentNum + "\'" + " order by sz_num asc";
        List<BookCatalog> bookCatalogs = BookCatalog.dao.find(mlSql);
        return (null != bookCatalogs && bookCatalogs.size() > 0) ? bookCatalogs : null;
    }

    public static List<BookCatalog> firstEntrance(int section, Long subjectId) {
        String sql = commonSql + " and nt_section=? and ng_subject_id=? and char_length(sz_num)=6 order by sz_num asc";
        List<BookCatalog> bookCatalogs = BookCatalog.dao.find(sql, section, subjectId);
        return (null != bookCatalogs && bookCatalogs.size() > 0) ? bookCatalogs : null;
    }

}
