package exercisesdb.services;

import com.jfinal.plugin.activerecord.Page;
import exercisesdb.model.MyPaper;

import java.util.List;

/*
    我的试卷service
    2018年1月11日15:29:08  楚了了
 */
public class MyPaperService {

    //增加下载次数
    public static void updateDownloadTimesById(Long paperId) {
        MyPaper myPaper = getMyPaperById(paperId);
        MyPaper.dao.findById(paperId).set("nt_download_times", Integer.parseInt(myPaper.getStr("nt_download_times")) + 1).update();
    }

    //通过用户Id、学段、学科查找试卷
    public static List<MyPaper> getMyPaperListByUserId(int state, Long userId, Integer section, Long subjectId) {
        String sql = "select *  from sys_my_paper_t where 1=1 and nt_state = " + state;

        if (null != userId) {
            sql += " and ng_user_id = " + userId;
        }
        if (null != section && 0 != section) {
            sql += " and nt_section = " + section;
        }
        if (null != subjectId) {
            sql += " and ng_subject_id = " + subjectId;
        }
        List<MyPaper> myPaperList = MyPaper.dao.find(sql);
        return (null != myPaperList && myPaperList.size() > 0) ? myPaperList : null;
    }

    //通过用户Id查找试卷
    public static List<MyPaper> getMyPapersByUserId(int state, Long userId, Integer section, Long subjectId) {
        String sql = "select ng_id,sz_caption,nt_section,ng_subject_id,sz_file_store from sys_my_paper_t where 1=1 and nt_state = " + state;
        if (null != userId) {
            sql += " and ng_user_id = " + userId;
        }
        if (null != section && 0 != section) {
            sql += " and nt_section = " + section;
        }
        if (null != subjectId) {
            sql += " and ng_subject_id = " + subjectId;
        }
        List<MyPaper> myPaperList = MyPaper.dao.find(sql);
        return (null != myPaperList && myPaperList.size() > 0) ? myPaperList : null;
    }


    //我的试卷主页分页查询
    public static Page<MyPaper> getMyPaperPageByUserId(int pageNum, int pageSize, int state, Long userId, Integer section, Long subjectId) {
        Page<MyPaper> myPaperPage = MyPaper.dao.paginate(pageNum, pageSize, "select *",
                "from sys_my_paper_t where nt_state=? and ng_user_id=? and nt_section = ? and ng_subject_id = ? order by ts_finished desc", state, userId, section, subjectId);
        return (null != myPaperPage && myPaperPage.getList().size() > 0) ? myPaperPage : null;
    }

    //修改试卷状态
    public static boolean updateStateById(Long id, int state) {
        return MyPaper.dao.findById(id).set("nt_state", state).update();
    }

    //通过id获取单个试卷
    public static MyPaper getMyPaperById(Long id) {
        return MyPaper.dao.findById(id);
    }

    //通过id获取单个试卷
    public static MyPaper getPaperSetting(Long id) {
        List<MyPaper> myPapers = MyPaper.dao.find("select nt_title_bar,nt_info_bar,nt_input_bar,nt_tongfen_bar,nt_pingfen_bar," +
                "nt_show_answer,nt_show_defen,nt_file_kind,nt_page_size from sys_my_paper_t where ng_id = " + id);
        return (null != myPapers ? myPapers.get(0) : null);
    }

    //修改试卷下载设置
    public static boolean updateDownloadById(Long id, int nt_title_bar, int nt_info_bar, int nt_input_bar, int nt_tongfen_bar, int nt_pingfen_bar, int nt_show_answer, int nt_show_defen, int nt_file_kind, int nt_page_size) {
         return MyPaper.dao.findById(id).set("nt_title_bar", nt_title_bar).set("nt_info_bar", nt_info_bar).set("nt_input_bar", nt_input_bar).set("nt_tongfen_bar", nt_tongfen_bar).set("nt_pingfen_bar", nt_pingfen_bar).set("nt_show_answer", nt_show_answer).set("nt_show_defen", nt_show_defen).set("nt_file_kind", nt_file_kind).set("nt_page_size", nt_page_size).update();
    }

    //修改试卷路径
    public static void updatePaperFile(Long id, String paperFile) {
        MyPaper.dao.findById(id).set("sz_file_store", paperFile).update();
    }

    //修改答案路径
    public static void updateAnswerFile(Long id, String answerFile) {
        MyPaper.dao.findById(id).set("sz_answer_store", answerFile).update();
    }

    public static boolean updatePaperData(Long id, String data) {
        return MyPaper.dao.findById(id).set("tx_data", data).update();
    }


}
