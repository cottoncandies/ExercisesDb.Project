package exercisesdb.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import exercisesdb.common.FileUtil;
import exercisesdb.common.GetPathCommon;
import exercisesdb.common.LongId;
import exercisesdb.common.ResultJson;
import exercisesdb.model.MyPaper;
import exercisesdb.services.MyPaperService;
import exercisesdb.services.MyPaperStructsService;
import exercisesdb.types.ExamStructs;
import exercisesdb.types.MyExamRegionStructs;
import exercisesdb.types.MyPaperStructs;

import java.util.Date;

import exercisesdb.types.SessionalUser;

import java.util.List;

public class MyPaperStructsController extends BaseController {

    //进入预览页面（myLook.html）
    public void intoMyLook() {
        render("/myLook.html");
    }

    //获取一套试题。根据试卷id
    public void loadTestCenter() {
        Long paperId = getParaToLong("paperId");
        SessionalUser user = getSessionalUser();
        JSONObject result = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        if (null == paperId) {
            result.put("data", myPaperStructs);
        } else {
            if (0 != paperId) {
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                if (null != myPaper) {
                    MyPaperStructs myPaperStruct = new MyPaperStructs(myPaper);
                    myPaperStruct.setTitleBar(myPaper.getTitleBar());
                    myPaperStruct.setInfoBar(myPaper.getPaperInfo());
                    myPaperStruct.setInputBar(myPaper.getInputInfo());
                    myPaperStruct.setTongfenBar(myPaper.getTongfen());
                    myPaperStruct.setPingfenBar(myPaper.getPingfen());
                    myPaperStruct.setShowAnswer(myPaper.getShowAnswer());
                    myPaperStruct.setShowDefen(myPaper.getShowDefen());
                    myPaperStruct.setFileKind(myPaper.getFileKind());
                    myPaperStruct.setPageSize(myPaper.getPageSize());
                    result.put("data", myPaperStruct);
                } else {
                    result.put("result", -1);
                    result.put("reason", "试卷不存在！");
                }
            }
        }
        renderJson(result);
    }

    //添加一道试题进入试卷
    public void addMyPaper() {
        SessionalUser user = getSessionalUser();
        Long examId = getParaToLong("tid");
//        Long paperId = getParaToLong("paperId");
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        user.setMyPaperStructs(MyPaperStructsService.addExamStructToMyPaper(user, examId, null, myPaperStructs));
        setSessionalUser(user);
        JSONObject result = ResultJson.getResultJson();
        result.put("data", examId);
        renderJson(result);
    }

    //删除一道试题
    public void removeMyPaper() {
        SessionalUser user = getSessionalUser();
        Long examId = getParaToLong("tId");
        Long paperId = getParaToLong("paperId");
        JSONObject result = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        if (null == myPaperStructs) {
            if (0 != paperId) {
                boolean complete = false;
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                if (null != myPaper) {
                    String data = myPaper.getData();
                    JSONArray jsonArray = JSONArray.parseArray(data);
                    for (int i = 0; i < jsonArray.size(); i++) {
                        JSONObject jsonObject = jsonArray.getJSONObject(i);
                        JSONArray examList = jsonObject.getJSONArray("examList");
                        for (int j = 0; j < examList.size(); j++) {
                            JSONObject exam = examList.getJSONObject(j);
                            if (exam.getLong("id").equals(examId)) {
                                examList.remove(j);
                                result.put("reason", "删除成功");
                                complete = true;
                                break;
                            }
                        }
                        if (complete) {
                            break;
                        }
                    }
                    boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                    if (!update) {
                        result.put("result", -1);
                        result.put("reason", "删除失败");
                    }
                } else {
                    result.put("result", -1);
                    result.put("reason", "试卷不存在！");
                }
            }
        } else {
            Long sessionPaperId = myPaperStructs.getId();
            if (null != sessionPaperId && paperId == null) {
                if (examId == null) {
                    result.put("reason", "试卷主键不存在！");
                    result.put("result", -1);
                } else {
                    if (myPaperStructs == null) {
                        result.put("reason", "用户当前学科试题栏没有试题！");
                        result.put("result", -1);
                    } else {
                        user.setMyPaperStructs(MyPaperStructsService.removeExamStructToMyPaper(user, examId, myPaperStructs));
                        setSessionalUser(user);
                        result.put("data", examId);
                    }
                }
            } else {
                if (0 != paperId) {
                    boolean complete = false;
                    MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                    if (null != myPaper) {
                        String data = myPaper.getData();
                        JSONArray jsonArray = JSONArray.parseArray(data);
                        for (int i = 0; i < jsonArray.size(); i++) {
                            JSONObject jsonObject = jsonArray.getJSONObject(i);
                            JSONArray examList = jsonObject.getJSONArray("examList");
                            for (int j = 0; j < examList.size(); j++) {
                                JSONObject exam = examList.getJSONObject(j);
                                if (exam.getLong("id").equals(examId)) {
                                    examList.remove(j);
                                    result.put("reason", "删除成功");
                                    complete = true;
                                    break;
                                }
                            }
                            if (complete) {
                                break;
                            }
                        }
                        user.setMyPaperStructs(MyPaperStructsService.removeExamStructToMyPaper(user, examId, myPaperStructs));
                        setSessionalUser(user);
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            result.put("result", -1);
                            result.put("reason", "删除失败");
                        }
                    } else {
                        result.put("result", -1);
                        result.put("reason", "试卷不存在！");
                    }
                }
            }
        }
        renderJson(result);
    }

    //删除一个题型
    public void removeMyPaperRegion() {
        SessionalUser user = getSessionalUser();
        int regionPosition = getParaToInt("regionPosition");
        Long paperId = getParaToLong("paperId");
        JSONObject result = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        //试题篮为空时
        if (null == myPaperStructs) {
            if (0 != paperId) {
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                if (null != myPaper) {
                    String data = myPaper.getData();
                    JSONArray jsonArray = JSONArray.parseArray(data);
                    if (jsonArray.size() >= regionPosition) {
                        jsonArray.remove(regionPosition);
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            result.put("result", -1);
                            result.put("reason", "删除失败");
                        }
                    } else {
                        result.put("result", -1);
                        result.put("reason", "删除题型不存在！");
                    }
                } else {
                    result.put("result", -1);
                    result.put("reason", "试卷不存在！");
                }
            }
        } else {
            Long sessionUserId = myPaperStructs.getId();
            //删除试题篮题型
            if (null != sessionUserId && sessionUserId.equals(paperId)) {
                if (myPaperStructs.getData().size() > regionPosition) {
                    if (myPaperStructs.getData().size() == 1) {
                        MyPaperService.updateStateById(paperId, -2);
                        user.setMyPaperStructs(null);
                        setSessionalUser(user);
                    } else {
                        myPaperStructs.getData().remove(regionPosition);
                        MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                        user.setMyPaperStructs(myPaperStructs);
                        setSessionalUser(user);
                    }
                } else {
                    result.put("result", -1);
                    result.put("reason", "删除题型不存在！");
                }
            } else {
                if (0 != paperId) {
                    MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                    if (null != myPaper) {
                        String data = myPaper.getData();
                        JSONArray jsonArray = JSONArray.parseArray(data);
                        if (jsonArray.size() >= regionPosition) {
                            jsonArray.remove(regionPosition);
                            boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                            if (!update) {
                                result.put("result", -1);
                                result.put("reason", "删除失败");
                            }
                        } else {
                            result.put("result", -1);
                            result.put("reason", "删除题型不存在！");
                        }
                    } else {
                        result.put("result", -1);
                        result.put("reason", "试卷不存在！");
                    }
                }
            }
        }

//        MyPaperStructsService.removeExamStructRegionToMyPaper(regionPosition, paperId);
        renderJson(result);
    }

    //修改一个题型的基础信息
    public void changeMyPaperRegion() {
        SessionalUser user = getSessionalUser();
        Long paperId = getParaToLong("paperId");
        int regionRegion = getParaToInt("regionPosition");
        String regionTitle = getPara("regionTitle");
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        JSONObject result = ResultJson.getResultJson();
        if (myPaperStructs != null) {
            myPaperStructs.getData().get(regionRegion).setKindName(regionTitle);
            myPaperStructs.getData().get(regionRegion).setCaption(regionTitle);
            MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
            user.setMyPaperStructs(myPaperStructs);
            setSessionalUser(user);
        } else {
            result.put("result", -1);
            result.put("reason", "修改题型不存在！");
        }
//        myPaper.setData(JSONObject.toJSONString(myPaperStructs.getData())).update();
//        MyPaper myPaper = MyPaper.dao.findById(paperId);
        renderJson(result);
    }

    //修改试卷基础信息
    public void changeMyPaperInfo() {
        Long paperId = getParaToLong("paperId");
        SessionalUser user = getSessionalUser();
//        sessionalUser.getId();
//        试卷标题 paperTitle
//        考试时间  examTime
//        考试范围 paperRange
//        命题人 examIners
//        满分 examScore
        String paperTitle = getPara("paperTitle");
        String examTime = getPara("examTime");
        String paperRange = getPara("paperRange");
        String examIners = getPara("examIners");

        MyPaper myPaper = MyPaper.dao.findById(paperId);
        if (myPaper != null) {
            myPaper.setCaption(paperTitle).setScope(paperRange).setPerson(examIners).setTimeLen(examTime).update();
            if (myPaper.getState() == 0) {
                user.setMyPaperStructs(new MyPaperStructs(myPaper));
                setSessionalUser(user);
            }
        }
        renderJson(ResultJson.getResultJson());
    }

    //修改题型位置
    public void moveMyPaperRegionNum() {
        SessionalUser user = getSessionalUser();
        Long paperId = getParaToLong("paperId");
        int num = getParaToInt("num");
        int state = getParaToInt("state");//上移 1 下移-1
        JSONObject resultJson = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        if (null == myPaperStructs) {
            if (0 != paperId) {
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                if (null != myPaper) {
                    String data = myPaper.getData();
                    JSONArray jsonArray = JSONArray.parseArray(data);
                    if (state > 0) {
                        JSONObject jsonObject1 = jsonArray.getJSONObject(num - 1);
                        jsonArray.set(num - 1, jsonArray.getJSONObject(num));
                        jsonArray.set(num, jsonObject1);
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            resultJson.put("result", -1);
                            resultJson.put("reason", "移动失败");
                        }
                    } else if (state < 0) {
                        JSONObject jsonObject2 = jsonArray.getJSONObject(num + 1);
                        jsonArray.set(num + 1, jsonArray.get(num));
                        jsonArray.set(num, jsonObject2);
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            resultJson.put("result", -1);
                            resultJson.put("reason", "移动失败");
                        }
                    }
                } else {
                    resultJson.put("result", -1);
                    resultJson.put("reason", "试卷不存在！");
                }
            }
        } else {
            Long sessionPaperId = myPaperStructs.getId();
            if (null != sessionPaperId && paperId.equals(sessionPaperId)) {
                if (myPaperStructs != null) {
                    List<MyExamRegionStructs> list = myPaperStructs.getData();
                    if (state > 0) {
                        MyExamRegionStructs myExamRegionStructs = list.get(num - 1);
                        list.set(num - 1, list.get(num));
                        list.set(num, myExamRegionStructs);
                    } else if (state < 0) {
                        MyExamRegionStructs myExamRegionStructs = list.get(num + 1);
                        list.set(num + 1, list.get(num));
                        list.set(num, myExamRegionStructs);
                    }
                    MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                    user.setMyPaperStructs(myPaperStructs);
                    setSessionalUser(user);
                } else {
                    resultJson.put("result", -1);
                    resultJson.put("reason", "试卷不存在！");
                }
            } else {
                if (0 != paperId) {
                    MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                    if (null != myPaper) {
                        String data = myPaper.getData();
                        JSONArray jsonArray = JSONArray.parseArray(data);
                        if (state > 0) {
                            JSONObject jsonObject1 = jsonArray.getJSONObject(num - 1);
                            jsonArray.set(num - 1, jsonArray.getJSONObject(num));
                            jsonArray.set(num, jsonObject1);
                            boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                            if (!update) {
                                resultJson.put("result", -1);
                                resultJson.put("reason", "移动失败");
                            }
                        } else if (state < 0) {
                            JSONObject jsonObject2 = jsonArray.getJSONObject(num + 1);
                            jsonArray.set(num + 1, jsonArray.get(num));
                            jsonArray.set(num, jsonObject2);
                            boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                            if (!update) {
                                resultJson.put("result", -1);
                                resultJson.put("reason", "移动失败");
                            }
                        }
                    } else {
                        resultJson.put("result", -1);
                        resultJson.put("reason", "试卷不存在！");
                    }
                }
            }
        }
        renderJson(resultJson);
    }

    //修改试题位置
    public void moveMyPaperExamNum() {
        SessionalUser user = getSessionalUser();
        Long paperId = getParaToLong("paperId");
        Long examId = getParaToLong("examId");
        int state = getParaToInt("state");//上移 1 下移-1
        int region = getParaToInt("region");
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        JSONObject resultJson = ResultJson.getResultJson();
        if (null == myPaperStructs) {
            if (0 != paperId) {
                boolean complete = false;
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                String data = myPaper.getData();
                JSONArray jsonArray = JSONArray.parseArray(data);
                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    JSONArray examList = jsonObject.getJSONArray("examList");
                    for (int j = 0; j < examList.size(); j++) {
                        JSONObject exam = examList.getJSONObject(j);
                        if (examId.equals(exam.getLong("id"))) {
                            if (state > 0) {
                                JSONObject listJSONObject1 = examList.getJSONObject(j - 1);
                                examList.set(j - 1, examList.get(j));
                                examList.set(j, listJSONObject1);
                                complete = true;
                                break;
                            } else if (state < 0) {
                                JSONObject listJSONObject2 = examList.getJSONObject(j + 1);
                                examList.set(j + 1, examList.get(j));
                                examList.set(j, listJSONObject2);
                                complete = true;
                                break;
                            }
                        }
                    }
                    if (complete) {
                        break;
                    }
                }
                boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                if (!update) {
                    resultJson.put("result", -1);
                    resultJson.put("reason", "修改失败");
                }
            }
        } else {
            Long sessionPaperId = myPaperStructs.getId();
            if (null != sessionPaperId && paperId.equals(sessionPaperId)) {
                if (myPaperStructs != null) {
                    List<ExamStructs> list = myPaperStructs.getData().get(region).getExamList();
                    for (int i = 0; i < list.size(); i++) {
                        if (examId.equals(list.get(i).getId())) {
                            if (state > 0) {
                                ExamStructs examStructs = list.get(i - 1);
                                list.set(i - 1, list.get(i));
                                list.set(i, examStructs);
                                break;
                            } else if (state < 0) {
                                ExamStructs examStructs = list.get(i + 1);
                                list.set(i + 1, list.get(i));
                                list.set(i, examStructs);
                                break;
                            }
                        }
                    }

                    MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                    user.setMyPaperStructs(myPaperStructs);
                    setSessionalUser(user);
                } else {
                    resultJson.put("result", -1);
                    resultJson.put("reason", "试卷不存在！");
                }
            } else {
                if (0 != paperId) {
                    boolean complete = false;
                    MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                    String data = myPaper.getData();
                    JSONArray jsonArray = JSONArray.parseArray(data);
                    for (int i = 0; i < jsonArray.size(); i++) {
                        JSONObject jsonObject = jsonArray.getJSONObject(i);
                        JSONArray examList = jsonObject.getJSONArray("examList");
                        for (int j = 0; j < examList.size(); j++) {
                            JSONObject exam = examList.getJSONObject(j);
                            if (examId.equals(exam.getLong("id"))) {
                                if (state > 0) {
                                    JSONObject listJSONObject1 = examList.getJSONObject(j - 1);
                                    examList.set(j - 1, examList.get(j));
                                    examList.set(j, listJSONObject1);
                                    complete = true;
                                    break;
                                } else if (state < 0) {
                                    JSONObject listJSONObject2 = examList.getJSONObject(j + 1);
                                    examList.set(j + 1, examList.get(j));
                                    examList.set(j, listJSONObject2);
                                    complete = true;
                                    break;
                                }
                            }
                        }
                        if (complete) {
                            break;
                        }
                    }
                    boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                    if (!update) {
                        resultJson.put("result", -1);
                        resultJson.put("reason", "修改失败");
                    }
                }
            }
        }
        renderJson(resultJson);
    }

    //试卷设置完成状态
    public void saveMyPaper() {
        SessionalUser user = getSessionalUser();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        JSONObject resultJson = ResultJson.getResultJson();
        if (myPaperStructs != null) {
            myPaperStructs.setState(1);
            MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
            user.setMyPaperStructs(null);
            setSessionalUser(user);
            //

        } else {
            resultJson.put("result", -1);
            resultJson.put("reason", "试卷不存在！");
        }
        renderJson(resultJson);
    }

    //跳转到编辑添加页面
    public void intoUe() {
        render("/UEditor.html");
    }

    //跳转到编辑试题类型页面
    public void intoUeKindName() {
        render("/editExamKindName.html");
    }

    //获取试题
    public void getExamUe() {
        Long examId = getParaToLong("examId");
        int type = getParaToInt("type");
        Long paperId = getParaToLong("paperId");
        JSONObject result = ResultJson.getResultJson();
        if (1 == type) {
            SessionalUser user = getSessionalUser();
            MyPaperStructs myPaperStructs = user.getMyPaperStructs();
            if (myPaperStructs != null) {
                for (int i = 0; i < myPaperStructs.getData().size(); i++) {
                    for (int j = 0; j < myPaperStructs.getData().get(i).getExamList().size(); j++) {
                        if (examId.equals(myPaperStructs.getData().get(i).getExamList().get(j).getId())) {
                            result.put("data", myPaperStructs.getData().get(i).getExamList().get(j));
                            break;
                        }
                    }
                }
            }
        } else if (2 == type) {
            if (0 != paperId) {
                boolean complete = false;
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                String data = myPaper.getData();
                JSONArray jsonArray = JSONArray.parseArray(data);
                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    JSONArray examList = jsonObject.getJSONArray("examList");
                    for (int j = 0; j < examList.size(); j++) {
                        JSONObject exam = examList.getJSONObject(j);
                        if (exam.getLong("id").equals(examId)) {
                            result.put("data", exam);
                            complete = true;
                            break;
                        }
                    }
                    if (complete) {
                        break;
                    }
                }
            }
        }
        renderJson(result);
    }

    //保存编辑试题
    public void editExamUe() {
        int type = getParaToInt("type");
        String tigan = getPara("tigan");
        String answer = getPara("answer");
        Long examId = getParaToLong("examId");
        Long paperId = getParaToLong("paperId");
        JSONObject resultJson = ResultJson.getResultJson();
        if (1 == type) {
            SessionalUser user = getSessionalUser();
            MyPaperStructs myPaperStructs = user.getMyPaperStructs();
            if (myPaperStructs != null) {
                for (int i = 0; i < myPaperStructs.getData().size(); i++) {
                    for (int j = 0; j < myPaperStructs.getData().get(i).getExamList().size(); j++) {
                        if (examId.equals(myPaperStructs.getData().get(i).getExamList().get(j).getId())) {
                            myPaperStructs.getData().get(i).getExamList().get(j).setMingti(tigan);
                            myPaperStructs.getData().get(i).getExamList().get(j).setTigan(tigan);
                            myPaperStructs.getData().get(i).getExamList().get(j).setAnswer(answer);
                            MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                            user.setMyPaperStructs(myPaperStructs);
                            setSessionalUser(user);
                        }
                    }
                }
            } else {
                resultJson.put("result", -1);
                resultJson.put("reason", "编辑试题不存在！");
            }
        } else if (2 == type) {
            if (0 != paperId) {
                boolean complete = false;
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                String data = myPaper.getData();
                JSONArray jsonArray = JSONArray.parseArray(data);
                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    JSONArray examList = jsonObject.getJSONArray("examList");
                    for (int j = 0; j < examList.size(); j++) {
                        JSONObject exam = examList.getJSONObject(j);
                        if (exam.getLong("id").equals(examId)) {
                            exam.put("tigan", tigan);
                            exam.put("mingti", tigan);
                            exam.put("answer", answer);
                            complete = true;
                            break;
                        }
                    }
                    if (complete) {
                        break;
                    }
                }
                boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                if (!update) {
                    resultJson.put("result", -1);
                    resultJson.put("reason", "修改失败");
                }
            }
        }
        renderJson(resultJson);
    }

    //添加试题
    public void addExamUe() {
        SessionalUser user = getSessionalUser();
        int examRegion = getParaToInt("examRegion");
        Long paperId = getParaToLong("paperId");
        String tigan = getPara("tigan");
        String answer = getPara("answer");
        Integer score = getParaToInt("score");
        JSONObject result = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        if (null == myPaperStructs) {
            if (0 != paperId) {
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                if (null != myPaper) {
                    ExamStructs examStructs = new ExamStructs();
                    examStructs.setId(LongId.getId());
                    examStructs.setMingti(tigan);
                    examStructs.setTigan(tigan);
                    examStructs.setAnswer(answer);
                    examStructs.setCreated(new Date());
                    examStructs.setScore(score);
                    String data = myPaper.getData();
                    JSONArray jsonArray = JSONArray.parseArray(data);
                    JSONObject jsonObjectRegion = jsonArray.getJSONObject(examRegion);
                    jsonObjectRegion.getJSONArray("examList").add(examStructs);
                    boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                    if (!update) {
                        result.put("result", -1);
                        result.put("reason", "添加失败");
                    }
                } else {
                    result.put("result", -1);
                    result.put("reason", "试卷不存在！");
                }
            }
        } else {
            Long sessionPaperId = myPaperStructs.getId();
            if (null != sessionPaperId && paperId.equals(sessionPaperId)) {
                ExamStructs examStructs = new ExamStructs();
                examStructs.setId(LongId.getId());
                examStructs.setMingti(tigan);
                examStructs.setTigan(tigan);
                examStructs.setAnswer(answer);
                examStructs.setCreated(new Date());
                examStructs.setScore(score);
                myPaperStructs.getData().get(examRegion).getExamList().add(examStructs);
                MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                user.setMyPaperStructs(myPaperStructs);
                setSessionalUser(user);
            } else {
                if (0 != paperId) {
                    MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                    if (null != myPaper) {
                        ExamStructs examStructs = new ExamStructs();
                        examStructs.setId(LongId.getId());
                        examStructs.setMingti(tigan);
                        examStructs.setTigan(tigan);
                        examStructs.setAnswer(answer);
                        examStructs.setCreated(new Date());
                        examStructs.setScore(score);
                        String data = myPaper.getData();
                        JSONArray jsonArray = JSONArray.parseArray(data);
                        JSONObject jsonObjectRegion = jsonArray.getJSONObject(examRegion);
                        jsonObjectRegion.getJSONArray("examList").add(examStructs);
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            result.put("result", -1);
                            result.put("reason", "添加失败");
                        }
                    } else {
                        result.put("result", -1);
                        result.put("reason", "试卷不存在！");
                    }
                }
            }
        }
        renderJson(result);
    }

    //修改试题分数信息
    public void editExamScoreUe() {
        SessionalUser user = getSessionalUser();
        Long paperId = getParaToLong("paperId");
        Long examId = getParaToLong("examId");
        Integer score = getParaToInt("score");
        JSONObject result = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        if (null == myPaperStructs) {
            if (0 != paperId) {
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                boolean complete = false;
                if (null != myPaper) {
                    String data = myPaper.getData();
                    JSONArray jsonArray = JSONArray.parseArray(data);
                    for (int i = 0; i < jsonArray.size(); i++) {
                        JSONObject examRegion = jsonArray.getJSONObject(i);
                        JSONArray examList = examRegion.getJSONArray("examList");
                        for (int j = 0; j < examList.size(); j++) {
                            JSONObject exam = examList.getJSONObject(j);
                            if (exam.getLong("id").equals(examId)) {
                                exam.put("score", score);
                                complete = true;
                                break;
                            }
                        }
                        if (complete) {
                            break;
                        }
                    }
                    boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                    if (!update) {
                        result.put("result", -1);
                        result.put("reason", "添加失败");
                    }
                } else {
                    result.put("result", -1);
                    result.put("reason", "试卷不存在！");
                }
            }
        } else {
            Long sessionPaperId = myPaperStructs.getId();
            if (null != sessionPaperId && paperId.equals(sessionPaperId)) {
                if (myPaperStructs != null) {
                    List<MyExamRegionStructs> lists = myPaperStructs.getData();
                    for (int i = 0; i < lists.size(); i++) {
                        for (int j = 0; j < lists.get(i).getExamList().size(); j++) {
                            if (examId.equals(lists.get(i).getExamList().get(j).getId())) {
                                myPaperStructs.getData().get(i).getExamList().get(j).setScore(score);
                                MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                                user.setMyPaperStructs(myPaperStructs);
                                setSessionalUser(user);
                            }
                        }
                    }
                } else {
                    result.put("result", -1);
                    result.put("reason", "试卷不存在！");
                }
            } else {
                if (0 != paperId) {
                    MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                    boolean complete = false;
                    if (null != myPaper) {
                        String data = myPaper.getData();
                        JSONArray jsonArray = JSONArray.parseArray(data);
                        for (int i = 0; i < jsonArray.size(); i++) {
                            JSONObject examRegion = jsonArray.getJSONObject(i);
                            JSONArray examList = examRegion.getJSONArray("examList");
                            for (int j = 0; j < examList.size(); j++) {
                                JSONObject exam = examList.getJSONObject(j);
                                if (exam.getLong("id").equals(examId)) {
                                    exam.put("score", score);
                                    complete = true;
                                    break;
                                }
                            }
                            if (complete) {
                                break;
                            }
                        }
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            result.put("result", -1);
                            result.put("reason", "添加失败");
                        }
                    } else {
                        result.put("result", -1);
                        result.put("reason", "试卷不存在！");
                    }
                }
            }
        }

        renderJson(result);
    }

    //修改-或添加  一个题型
    public void editExamKindName() {
        SessionalUser user = getSessionalUser();
        //op:判断添加还是重置题型：-1：添加题型  1：重置题型
        int op = getParaToInt("op");
        int num = getParaToInt("num");
        Long paperId = getParaToLong("paperId");
        String kindName = getPara("kindName");
        JSONObject result = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        //试题篮为空：试卷预览时操作试卷
        if (null == myPaperStructs) {
            if (0 != paperId) {
                MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                if (null != myPaper) {
                    String data = myPaper.getData();
                    JSONArray jsonArray = JSONArray.parseArray(data);
                    if (op == 1) {
                        //重置题型
                        jsonArray.getJSONObject(num).put("kindName", kindName);
                        jsonArray.getJSONObject(num).put("caption", kindName);
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            result.put("result", -1);
                            result.put("reason", "修改失败");
                        }
                    } else {
                        //添加题型
                        MyExamRegionStructs myExamRegionStructs = new MyExamRegionStructs();
                        myExamRegionStructs.setCaption(kindName);
                        myExamRegionStructs.setKindName(kindName);
                        myExamRegionStructs.setExamList(null);
                        myExamRegionStructs.setExamNum(0);
                        myExamRegionStructs.setScore(0D);
                        myExamRegionStructs.setOrder(1);
                        myExamRegionStructs.setRemark("");
                        jsonArray.add(num + 1, myExamRegionStructs);
                        boolean update = MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
                        if (!update) {
                            result.put("result", -1);
                            result.put("reason", "修改失败");
                        }
                    }
//                    if (null != myPaper.getFileStore()) {
//                        FileUtil.deleteMyPaperDocument(GetPathCommon.getDownloadPath() + myPaper.getFileStore());
//                    }
                } else {
                    result.put("result", -1);
                    result.put("reason", "试卷不存在！");
                }
            } else {
                result.put("result", -1);
                result.put("reason", "paperId不能为空！");
            }
        } else {
            Long sessionPaperId = myPaperStructs.getId();
            //试题篮不为空，操作试题篮时
            if (null != sessionPaperId && paperId.equals(sessionPaperId)) {
                if (op == 1 && kindName != null) {
                    //重置题型
                    myPaperStructs.getData().get(num).setKindName(kindName);
                    myPaperStructs.getData().get(num).setCaption(kindName);
                    MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                } else {
                    //添加题型
                    MyExamRegionStructs myExamRegionStructs = new MyExamRegionStructs();
                    myExamRegionStructs.setCaption(kindName);
                    myExamRegionStructs.setKindName(kindName);
                    myExamRegionStructs.setScore(0.00);
                    myExamRegionStructs.setOrder(1);
                    myExamRegionStructs.setExamNum(0);
                    myPaperStructs.getData().add(num + 1, myExamRegionStructs);
                    MyPaperStructsService.updateMyPaper(new MyPaper(myPaperStructs));
                }
                user.setMyPaperStructs(myPaperStructs);
                setSessionalUser(user);
            } else {
                //试题篮不为空，操作试卷预览时
                if (0 != paperId) {
                    MyPaper myPaper = MyPaperService.getMyPaperById(paperId);
                    if (null != myPaper) {
                        if (op == 1) {
                            //重置题型
                            boolean update = resetRegion(myPaper, num, kindName, paperId);
                            if (!update) {
                                result.put("result", -1);
                                result.put("reason", "修改失败");
                            }
                        } else {
                            //添加题型
                            boolean update = addRegion(myPaper, num, kindName, paperId);
                            if (!update) {
                                result.put("result", -1);
                                result.put("reason", "修改失败");
                            }
                        }
//                        if (null != myPaper.getFileStore()) {
//                            FileUtil.deleteMyPaperDocument(GetPathCommon.getDownloadPath() + myPaper.getFileStore());
//                        }
                    } else {
                        result.put("result", -1);
                        result.put("reason", "试卷不存在！");
                    }
                }
            }
        }
        renderJson(ResultJson.getResultJson());
    }

    private boolean resetRegion(MyPaper myPaper, int num, String kindName, Long paperId) {
        String data = myPaper.getData();
        JSONArray jsonArray = JSONArray.parseArray(data);
        jsonArray.getJSONObject(num).put("kindName", kindName);
        jsonArray.getJSONObject(num).put("caption", kindName);
        return MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
    }

    private boolean addRegion(MyPaper myPaper, int num, String kindName, Long paperId) {
        String data = myPaper.getData();
        JSONArray jsonArray = JSONArray.parseArray(data);
        MyExamRegionStructs myExamRegionStructs = new MyExamRegionStructs();
        myExamRegionStructs.setCaption(kindName);
        myExamRegionStructs.setKindName(kindName);
        myExamRegionStructs.setExamList(null);
        myExamRegionStructs.setExamNum(0);
        myExamRegionStructs.setScore(0D);
        myExamRegionStructs.setOrder(1);
        myExamRegionStructs.setRemark("");
        jsonArray.add(num + 1, myExamRegionStructs);
        return MyPaperService.updatePaperData(paperId, JSON.toJSONString(jsonArray));
    }
}
