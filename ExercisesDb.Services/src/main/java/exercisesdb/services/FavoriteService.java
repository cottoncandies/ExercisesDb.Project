package exercisesdb.services;

import com.jfinal.plugin.activerecord.Db;
import exercisesdb.common.LongId;
import exercisesdb.model.Favorite;

import java.sql.Timestamp;
import java.util.List;


public class FavoriteService {
    private static String commonSql = "select ng_id,ng_user_id,nt_section,ng_subject_id,ng_exam_id,ts_created " +
            "from sys_favorite_t where 1=1 ";

    public static boolean isFavoredByExamId(Long userId, Long examId) {
        Favorite favorite = Favorite.dao.findFirst(commonSql + " and ng_user_id = ? and ng_exam_id = ? ",
                userId, examId);
        return null == favorite;
    }

    public static List<Favorite> getFav(Long userId, int section, Long subjectId) {
        List<Favorite> favorites = Favorite.dao.find(commonSql + " and ng_user_id = ? and nt_section = ? and ng_subject_id = ? ",
                userId, section, subjectId);
        return (null != favorites && favorites.size() > 0) ? favorites : null;
    }

    public static boolean addExamToMyFavorite(Long userId, int section, Long subjectId, Long examId, String timeCreated) {
        int num = Db.update("insert into sys_favorite_t (ng_id,ng_user_id,nt_section,ng_subject_id,ng_exam_id,ts_created) " +
                        "values ( ?,? , ? , ? , ? , ? )",
                LongId.getId(), userId, section, subjectId, examId, Timestamp.valueOf(timeCreated));
        return num > 0;
    }

    public static boolean delMyFavoriteById(Long userId, Long examId) {
        int delete = Db.update("delete from sys_favorite_t where ng_user_id =? and ng_exam_id = ?", userId, examId);
        return delete > 0;
    }

}
