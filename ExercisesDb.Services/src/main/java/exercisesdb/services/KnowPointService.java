package exercisesdb.services;

import exercisesdb.model.KnowPoint;

import java.util.ArrayList;
import java.util.List;

public class KnowPointService {

    private static final String commonKPSql = "select ng_id,sz_num,ng_parent_id,sz_caption,ng_subject_id,nt_section,nt_state," +
            "tx_comment,nt_old_id from sys_know_point_t where 1=1 ";
    private static final String commonKPSqlFav = "select kp.ng_id,kp.sz_num,kp.ng_parent_id,kp.sz_caption,kp.ng_subject_id," +
            "kp.nt_section,kp.nt_state,kp.tx_comment,kp.nt_old_id from sys_know_point_t kp " +
            " inner join sys_exam_kp_t ekp on kp.ng_id = ekp.ng_kp_id " +
            " inner join sys_favorite_t fav on ekp.ng_exam_id = fav.ng_exam_id " +
            " where 1=1 ";

    public static List<KnowPoint> getKnowPoints(int section, Long subjectId) {
        String sql = commonKPSql + " and nt_section = ? and ng_subject_id = ? order by sz_num asc";
        List<KnowPoint> knowPoints = KnowPoint.dao.find(sql, section, subjectId);
        return (null != knowPoints && knowPoints.size() > 0) ? knowPoints : null;
    }

    private static List<KnowPoint> getKnowPointsWithFav(Long userId, int section, Long subjectId) {
        String sql = commonKPSqlFav + " and fav.ng_user_id = ? and fav.nt_section = ? and fav.ng_subject_id = ? " +
                "order by kp.sz_num asc";
        List<KnowPoint> knowPoints = KnowPoint.dao.find(sql, userId, section, subjectId);
        return (null != knowPoints && knowPoints.size() > 0) ? knowPoints : null;
    }

    public static List<KnowPoint> getKnowPointsByNum(Long userId, int section, Long subjectId) {
        List<KnowPoint> knowPoints = getKnowPointsWithFav(userId, section, subjectId);
        if (knowPoints == null) {
            return null;
        }
        String sql = commonKPSql + " and sz_num = ? order by sz_num asc";
        List<KnowPoint> knowPointList = new ArrayList<>();
        String lastSecondNum = "";
        String lastIndexNum = "";
        for (KnowPoint knowPoint : knowPoints) {
            String thirdNum = knowPoint.getNum();
            String secondNum = thirdNum.substring(0, thirdNum.length() - 3);
            if (!lastSecondNum.equals(secondNum)) {
                lastSecondNum = secondNum;
                KnowPoint secondKnowPoint = KnowPoint.dao.findFirst(sql, secondNum);
                knowPointList.add(secondKnowPoint);
                String indexNum = secondNum.substring(0, secondNum.length() - 3);
                if (!lastIndexNum.equals(indexNum)) {
                    lastIndexNum = indexNum;
                    KnowPoint indexKnowPoint = KnowPoint.dao.findFirst(sql, indexNum);
                    knowPointList.add(indexKnowPoint);
                }
            }
        }
        knowPoints.addAll(knowPointList);
        return (knowPoints.size() > 0) ? knowPoints : null;
    }

    public static List<KnowPoint> getKnowPointsByCaption(int section, Long subjectId, String caption) {
        String sql = commonKPSql + "and nt_section = ? and ng_subject_id = ? and sz_caption = ? order by sz_num asc";
        List<KnowPoint> knowPoints = KnowPoint.dao.find(sql, section, subjectId, caption);
        return (null != knowPoints && knowPoints.size() > 0) ? knowPoints : null;
    }

}
