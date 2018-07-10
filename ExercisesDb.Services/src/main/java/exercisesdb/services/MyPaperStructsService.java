package exercisesdb.services;

import com.alibaba.fastjson.JSONObject;
import exercisesdb.common.LongId;
import exercisesdb.common.ReplaceSpecialChar;
import exercisesdb.common.ResultJson;
import exercisesdb.model.Exam;
import exercisesdb.model.MyPaper;
import exercisesdb.types.ExamStructs;
import exercisesdb.types.MyExamRegionStructs;
import exercisesdb.types.MyPaperStructs;
import exercisesdb.types.SessionalUser;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

public class MyPaperStructsService {

    //获取用户试题栏(根据ExamId)
    public static MyPaperStructs getMyPaper(Long userId, Long subjectId, Integer section) {
        MyPaper myPaper = MyPaper.dao.findFirst("select e.* from sys_my_paper_t e where e.ng_user_id=? and e.nt_state =? and e.nt_section =? and e.ng_subject_id =?", userId, 0, section, subjectId);
        MyPaperStructs myPaperStruct = null;
        if (null != myPaper) {
            myPaperStruct = new MyPaperStructs(myPaper);
            myPaperStruct.setTitleBar(myPaper.getTitleBar());
            myPaperStruct.setInfoBar(myPaper.getPaperInfo());
            myPaperStruct.setInputBar(myPaper.getInputInfo());
            myPaperStruct.setTongfenBar(myPaper.getTongfen());
            myPaperStruct.setPingfenBar(myPaper.getPingfen());
            myPaperStruct.setShowAnswer(myPaper.getShowAnswer());
            myPaperStruct.setShowDefen(myPaper.getShowDefen());
            myPaperStruct.setFileKind(myPaper.getFileKind());
            myPaperStruct.setPageSize(myPaper.getPageSize());
        }
        return myPaperStruct;
    }

    //试卷添加一道试题(根据ExamId)
    public static MyPaperStructs addExamStructToMyPaper(SessionalUser user, Long examId, Long paperId, MyPaperStructs myPaperStructs) {
        Exam exam = Exam.dao.findById(examId);
        exam.setMingTi(
                null != exam.getMingTi() ?
                        ReplaceSpecialChar.replaceChar(ReplaceSpecialChar.replaceChar(exam.getMingTi(), "##", "（"), "$$", "）") : "");
        exam.setTiGan(
                null != exam.getTiGan() ?
                        ReplaceSpecialChar.replaceChar(ReplaceSpecialChar.replaceChar(exam.getTiGan(), "##", "（"), "$$", "）") : "");

        MyPaper myPaper = new MyPaper();
//        MyPaper myPaper = (MyPaper) MyPaper.dao.findFirst("select e.* from sys_my_paper_t e where e.ng_user_id=? " +
//                "and e.nt_state =? ", userId, 0);
//        MyPaperStructs myPaperStructs = new MyPaperStructs();
        if (myPaperStructs == null || myPaperStructs.getId() == null) {
            myPaperStructs = new MyPaperStructs();
            ExamStructs examStructs = new ExamStructs(exam);
            MyExamRegionStructs myExamRegionStructs = new MyExamRegionStructs();
            myExamRegionStructs.setCaption(examStructs.getKindName());
            myExamRegionStructs.setKindName(examStructs.getKindName());
            myExamRegionStructs.setScore(Double.parseDouble(examStructs.getScore().toString()));
            myExamRegionStructs.setOrder(1);
            myExamRegionStructs.setExamNum(1);
            myExamRegionStructs.setRemark("");
            myExamRegionStructs.getExamList().add(examStructs);

            myPaperStructs.getData().add(myExamRegionStructs);
            myPaperStructs.setId(LongId.getId());
            myPaperStructs.setUserId(user.getId());
            myPaperStructs.setSubjectId(user.getSubjectId());
            myPaperStructs.setGradeId(user.getGrade());
//            myPaperStructs.setPerson(user.getUserName());
            myPaperStructs.setPerson(user.getNickName());
            myPaperStructs.setSection(user.getSection());
            myPaperStructs.setState(0);

            myPaper = new MyPaper(myPaperStructs);
            myPaper.save();
//            myPaper.setId(LongId.getId()).setUserId(user.getId()).setSubjectId(user.getSubjectId()).setGrade(user.getGrade().longValue()).setPerson(user.getUserName()).setData(JSONObject.toJSONString(myPaperStructs.getData())).setState(0).save();
        } else {
            Integer num = -1;
            for (int i = 0; i < myPaperStructs.getData().size(); i++) {
                if (exam.getKindName().equals(myPaperStructs.getData().get(i).getCaption())) {
                    num = i;
                }
            }
            ExamStructs examStructs = new ExamStructs(exam);
            if (num == -1) {
                MyExamRegionStructs myExamRegionStruct = new MyExamRegionStructs();
                myExamRegionStruct.setCaption(examStructs.getKindName());
                myExamRegionStruct.setKindName(examStructs.getKindName());
                myExamRegionStruct.setScore(Double.parseDouble(examStructs.getScore().toString()));
                myExamRegionStruct.setOrder(1);
                myExamRegionStruct.setExamNum(1);
                myExamRegionStruct.setRemark("");
                myExamRegionStruct.getExamList().add(examStructs);
                myPaperStructs.getData().add(myExamRegionStruct);
            } else {
                MyExamRegionStructs myExamRegionStructs = myPaperStructs.getData().get(num);
                myExamRegionStructs.getExamList().add(examStructs);
            }
            myPaper = new MyPaper(myPaperStructs);
            myPaper.setData(JSONObject.toJSONString(myPaperStructs.getData())).update();
        }
        return myPaperStructs;
    }

    //试卷删除一道试题
    public static MyPaperStructs removeExamStructToMyPaper(SessionalUser user, Long examId, MyPaperStructs myPaperStructs) {
        if (myPaperStructs == null || myPaperStructs.getId() == null) {
        } else {
            int papersNum = -1;
            int examNum = -1;
            Boolean deleteState = true;
            for (int i = 0; i < myPaperStructs.getData().size(); i++) {
                if (!deleteState) {
                    break;
                }
                for (int j = 0; j < myPaperStructs.getData().get(i).getExamList().size(); j++) {
                    if (examId.equals(myPaperStructs.getData().get(i).getExamList().get(j).getId())) {
                        papersNum = i;
                        examNum = j;
                        myPaperStructs.getData().get(papersNum).getExamList().remove(examNum);
                        //提醒下没有试题，删除题型
//                        if(myPaperStructs.getData().get(papersNum).getExamList().size() <= 0){
//                            myPaperStructs.getData().remove(papersNum);
//                        }
                        deleteState = false;
                        break;
                    }
                }
            }
            if (papersNum == -1 || examNum == -1) {
                return myPaperStructs;
            } else {
                MyPaper myPaper = new MyPaper(myPaperStructs);
                myPaper.setData(JSONObject.toJSONString(myPaperStructs.getData())).update();
            }
        }
        return myPaperStructs;
    }

    //试卷删除一个题型
    public static boolean removeExamStructRegionToMyPaper(int regionPosition, Long paperId) {
//        SessionalUser sessionalUser = new SessionalUser();
//        sessionalUser.getId();
        Long userId = 1l;
        MyPaper myPaper = (MyPaper) MyPaper.dao.findFirst("select e.* from sys_my_paper_t e where e.ng_id=? and e.ng_user_id=? ", paperId, userId);
        MyPaperStructs myPaperStructs = new MyPaperStructs();
        JSONObject resultJson = ResultJson.getResultJson();
        if (myPaper == null) {
            return false;
//            resultJson.put("result",-1);
//            resultJson.put("reason","试卷不存在");
        } else {
            myPaperStructs = new MyPaperStructs(myPaper);
            myPaperStructs.getData().remove(regionPosition);
            myPaper.setData(JSONObject.toJSONString(myPaperStructs.getData())).update();
        }
        return true;
    }

    public static boolean updateMyPaper(MyPaper myPaper) {
        myPaper.setFinished(Timestamp.valueOf(LocalDateTime.now()));
        myPaper.update();
        return true;
    }

}
