package exercisesdb.controller;

import com.alibaba.fastjson.JSONObject;
import com.sun.istack.internal.NotNull;
import exercisesdb.common.GetPathCommon;
import exercisesdb.common.MyPaperStructCommon;
import exercisesdb.common.PageHtmlCommon;
import exercisesdb.common.ResultJson;
import exercisesdb.model.*;
import com.jfinal.plugin.activerecord.Page;
import exercisesdb.services.MyPaperService;
import exercisesdb.services.SubjectService;
import exercisesdb.services.UserService;
import exercisesdb.types.MyPaperResult;
import exercisesdb.types.MyPaperSetting;
import exercisesdb.types.MyPaperStructs;
import exercisesdb.types.SessionalUser;
import exercisesdb.utils.IParallelRun;
import exercisesdb.utils.SimpleParallel;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * <p>
 * IndexController
 */


public class MyPaperListController extends BaseController {

    private SessionalUser user;
    private int section;
    private long subjectId;
    private String strSection = "";
    private String strSubject = "";

    public void init() {
        if (null == user) {
            user = getSessionalUser();
        }
    }

    public void initEnvironment() {
        section = user.getSection();
        strSection = changeSection(section);
        subjectId = user.getSubjectId();
        strSubject = user.getSubject();
    }

    //我的试卷 主页面
    public void index() {
        init();
        Long userId = user.getId();
        this.setAttr("userId", userId);
        render("/myPaperList.html");
    }

    //分页查询
    public void findAllMyPaper() {
        init();
        initEnvironment();
        int pageNum = getParaToInt("pageNum");//页码
        //该用户的所有已发布试卷 数据
        List<MyPaper> myPaperAllList = MyPaperService.getMyPaperListByUserId(1, user.getId(), section, subjectId);
        //分页后的 数据
        double pageSize = 10;//每页数目
        Page<MyPaper> myPaperPage = MyPaperService.getMyPaperPageByUserId(pageNum, (int) pageSize, 1, user.getId(), section, subjectId);
        String returnVal = "成功";
        //returnVal
        setAttr("returnVal", returnVal);
        int pageAllCount = 0;
        if (myPaperPage != null) {
            pageAllCount = myPaperPage.getTotalPage();
            //得到分页后的List
            List<MyPaper> myPaperList = myPaperPage.getList();
            //数据处理
            if (myPaperList.size() > 0) {
                for (MyPaper mp : myPaperList) {
                    if (mp.getSubjectId() != null) {
                        Subject s = SubjectService.getSubjectById(mp.getSubjectId());
                        mp.put("subjectName", s.getCaption());
                    } else {
                        mp.put("subjectName", "暂无此学科");
                    }
                }
            }
            //pageContent 分页后已经处理的数据 （学科名的赋值）
            setAttr("pageContent", myPaperList);
        } else {
            setAttr("pageContent", "[]");
        }
        //分页Html
        double pageTotal = 0;
        if (myPaperAllList != null) {
            pageTotal = myPaperAllList.size();//总条数
        }
        //分页Html
        String strPageHTML = PageHtmlCommon.getPageHtml(pageAllCount, pageNum);
        //strPageHTML
        setAttr("strPageHTML", strPageHTML);
        //stCount 总条数
        setAttr("stCount", pageTotal);
        //学段
        setAttr("strSection", strSection);
        //学科
        setAttr("strSubject", strSubject);
        renderJson();
    }

    //删除试卷
    public void delMyPaper() {
        Long id = getParaToLong("pId");
        JSONObject result = ResultJson.getResultJson();
        if (!MyPaperService.updateStateById(id, -2)) {
            result.put("result", -1);
            result.put("reason", "删除失败");
        }
        renderJson(result);
    }

    //设置下载
    public void setWordPaperFormatServer() {
        Long pId = getParaToLong("pId");
        String paperFormat = getPara("paperFormat");
        JSONObject parse = JSONObject.parseObject(paperFormat);
        //下载属性
        int nt_title_bar = Integer.parseInt(parse.getString("nt_title_bar"));//试卷标题栏
        int nt_info_bar = Integer.parseInt(parse.getString("nt_info_bar"));
        int nt_input_bar = Integer.parseInt(parse.getString("nt_input_bar"));
        int nt_tongfen_bar = Integer.parseInt(parse.getString("nt_tongfen_bar"));
        int nt_pingfen_bar = Integer.parseInt(parse.getString("nt_pingfen_bar"));
        int nt_show_answer = Integer.parseInt(parse.getString("nt_show_answer"));
        int nt_show_defen = Integer.parseInt(parse.getString("nt_show_defen"));
        int nt_file_kind = Integer.parseInt(parse.getString("nt_file_kind"));
        int nt_page_size = Integer.parseInt(parse.getString("nt_page_size"));
        SessionalUser user = getSessionalUser();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        JSONObject result = ResultJson.getResultJson();
        if (null == myPaperStructs) {
            if (!MyPaperService.updateDownloadById(pId, nt_title_bar, nt_info_bar, nt_input_bar, nt_tongfen_bar,
                    nt_pingfen_bar, nt_show_answer, nt_show_defen, nt_file_kind, nt_page_size)) {
                result.put("result", -1);
                result.put("reason", "设置失败");
            }
        } else {
            Long sessionUserId = myPaperStructs.getId();
            if (null != sessionUserId && pId.equals(sessionUserId)) {
                myPaperStructs.setTitleBar(nt_title_bar);
                myPaperStructs.setInfoBar(nt_info_bar);
                myPaperStructs.setInputBar(nt_input_bar);
                myPaperStructs.setTongfenBar(nt_tongfen_bar);
                myPaperStructs.setPingfenBar(nt_pingfen_bar);
                myPaperStructs.setShowAnswer(nt_show_answer);
                myPaperStructs.setShowDefen(nt_show_defen);
                myPaperStructs.setFileKind(nt_file_kind);
                myPaperStructs.setPageSize(nt_page_size);
                if (!MyPaperService.updateDownloadById(pId, nt_title_bar, nt_info_bar, nt_input_bar, nt_tongfen_bar, nt_pingfen_bar,
                        nt_show_answer, nt_show_defen, nt_file_kind, nt_page_size)) {
                    result.put("result", -1);
                    result.put("reason", "设置失败");
                }
            } else {
                if (!MyPaperService.updateDownloadById(pId, nt_title_bar, nt_info_bar, nt_input_bar, nt_tongfen_bar,
                        nt_pingfen_bar, nt_show_answer, nt_show_defen, nt_file_kind, nt_page_size)) {
                    result.put("result", -1);
                    result.put("reason", "设置失败");
                }
            }
        }
        renderJson(result);
    }

    public void getPaperSetting() {
        Long paperId = getParaToLong("paperId");
        JSONObject result = ResultJson.getResultJson();
        if (null != paperId && paperId != 0) {
            MyPaper paperSetting = MyPaperService.getPaperSetting(paperId);
            if (null != paperSetting) {
                MyPaperSetting myPaperSetting = new MyPaperSetting();
                myPaperSetting.setTitle(paperSetting.getTitleBar());
                myPaperSetting.setPaperInfo(paperSetting.getPaperInfo());
                myPaperSetting.setInputInfo(paperSetting.getInputInfo());
                myPaperSetting.setTongfen(paperSetting.getTongfen());
                myPaperSetting.setPingfen(paperSetting.getPingfen());
                myPaperSetting.setAnswer(paperSetting.getShowAnswer());
                myPaperSetting.setDefen(paperSetting.getShowDefen());
                myPaperSetting.setFileKind(paperSetting.getFileKind());
                myPaperSetting.setPageSize(paperSetting.getPageSize());
                result.put("data", myPaperSetting);
            } else {
                result.put("result", -1);
                result.put("reason", "试卷不存在！");
            }
        } else {
            SessionalUser user = getSessionalUser();
            MyPaperStructs myPaperStructs = user.getMyPaperStructs();
            MyPaperSetting myPaperSetting = new MyPaperSetting();
            myPaperSetting.setTitle(myPaperStructs.getTitleBar());
            myPaperSetting.setPaperInfo(myPaperStructs.getInfoBar());
            myPaperSetting.setInputInfo(myPaperStructs.getInputBar());
            myPaperSetting.setTongfen(myPaperStructs.getTongfenBar());
            myPaperSetting.setPingfen(myPaperStructs.getPingfenBar());
            myPaperSetting.setAnswer(myPaperStructs.getShowAnswer());
            myPaperSetting.setDefen(myPaperStructs.getShowDefen());
            myPaperSetting.setFileKind(myPaperStructs.getFileKind());
            myPaperSetting.setPageSize(myPaperStructs.getPageSize());
            result.put("data", myPaperSetting);
        }
        renderJson(result);
    }

    //得到服务器文件路径
    public String getLocalPath() {
        return GetPathCommon.getDownloadPath();
    }

    public String getResourceUrl() {
        return GetPathCommon.getResourceUrl();
    }

    //查询改试卷是否已生成
    public void findLocalPaper() {
        Long pId = getParaToLong("pId");
        MyPaper myPaper = MyPaper.dao.findById(pId);
        JSONObject resultJson = ResultJson.getResultJson();
        if (null != myPaper) {
            String userName = UserService.getUsernameById(myPaper.getUserId());
            Integer section = myPaper.getSection();
            int fileKind = Integer.parseInt(myPaper.getStr("nt_file_kind"));
            String rendType = "";
            if (fileKind == 1) {
                rendType = "pdf";
            }
            if (fileKind == 2) {
                rendType = "docx";
            }
            String fullPath = getLocalPath() + "/" + userName + "/" + section + "/" + myPaper.getSubjectId() + "/" + myPaper.getId() + "." + rendType;
            File paper = new File(fullPath);
            if (!paper.exists()) {
                resultJson.put("result", -1);
                resultJson.put("reason", "试卷不存在");
            }else{
                resultJson.put("result", 0);
                resultJson.put("reason", "试卷已经存在");
            }
        } else {
            resultJson.put("result", -1);
            resultJson.put("reason", "试卷不存在");
        }
        renderJson(resultJson);
    }

    private String GenPaper(@NotNull MyPaper myPaper,boolean force)
    {
        int fileKind = myPaper.getInt("nt_file_kind");
        String rendType = "";
        if (fileKind == 1) {
            rendType = "pdf";
        }else if (fileKind == 2) {
            rendType = "docx";
        }
        String userName = UserService.getUsernameById(myPaper.getUserId());
        Integer section = myPaper.getSection();
        String cPath = "/" + userName + "/" + section + "/" + myPaper.getSubjectId() + "/";
        String folderPath = getLocalPath() + cPath;
        File folderPathFile = new File(folderPath);
        if (!folderPathFile.exists()) {
            folderPathFile.mkdirs();
        }
        String rPath = cPath + myPaper.getId() + "." + rendType;
        String path = getLocalPath() + rPath;

        File targetFile = new File(path);
        boolean fexist = targetFile.exists();
        if (!force && fexist){
           return rPath;
        }else{
            if(fexist){
                targetFile.delete();
            }
            boolean flag = MyPaperStructCommon.download(myPaper.getId(), path);
            if (fileKind == 2 && flag) {
                String pdfPath = getLocalPath() + cPath + myPaper.getId() + ".pdf";
                File pp = new File(pdfPath);
                if (pp.exists()){
                    pp.delete();
                }
                flag = MyPaperStructCommon.download(myPaper.getId(), pdfPath);
            }
            if (flag){
                MyPaperService.updatePaperFile(myPaper.getId(), rPath);
                return rPath;
            }else{
                return null;
            }
        }
    }

    /**
     * 生成试卷文件
     */
    public void genPaperFile()
    {
        Long pId = getParaToLong("pId");
        MyPaper myPaper = MyPaper.dao.findById(pId);
        JSONObject resultJson = ResultJson.getResultJson();
        if (myPaper != null) {
            SimpleParallel.run(new IParallelRun() {
                @Override
                public void run(Object... arg) {
                    GenPaper((MyPaper)arg[0],true);
                }
            },myPaper);

            resultJson.put("reason", "成功");
        } else {
            resultJson.put("result", -1);
            resultJson.put("reason", "暂无数据");
        }
        renderJson(resultJson);
    }

    //生成试题
    public void getDownLoadPaper() {
        Long pId = getParaToLong("pId");
        MyPaper myPaper = MyPaper.dao.findById(pId);
        JSONObject resultJson = ResultJson.getResultJson();
        if (myPaper != null) {
            String file= GenPaper(myPaper,false);
            if (null == file || "".equals(file)) {
                resultJson.put("result", -1);
                resultJson.put("reason", "暂无数据");
            } else {
                resultJson.put("reason", "成功");
                resultJson.put("data", file);
            }
        } else {
            resultJson.put("result", -1);
            resultJson.put("reason", "暂无数据");
        }
        renderJson(resultJson);
    }

    //下载试题
    public void DownLoadPaper() {
        Long pId = getParaToLong("pId");
        MyPaper myPaper = MyPaperService.getMyPaperById(pId);
        JSONObject result = ResultJson.getResultJson();
        String path = myPaper.getStr("sz_file_store");
        File fileName = new File(getLocalPath() + path);
        if (fileName.exists()) {
            MyPaperService.updateDownloadTimesById(pId);
            renderFile(fileName);
        } else {
            result.put("result", -1);
            result.put("reason", "文件不存在");
            renderJson(result);
        }
    }

    //生成答案
    public void getDownLoadKey() {
        Long pId = getParaToLong("pId");
        MyPaper myPaper = MyPaper.dao.findById(pId);
        String resultVal = "";
        if (myPaper != null) {
            String path = getLocalPath() + myPaper.getCaption() + "-答案.pdf";
            boolean flag = MyPaperStructCommon.download(pId, path);
            if (flag) {
                MyPaperService.updateAnswerFile(pId, path);
                resultVal = "成功";
            } else {
                resultVal = "暂无数据";
            }
        } else {
            resultVal = "暂无数据";
        }
        setAttr("resultVal", resultVal);
        renderJson();
    }

    //下载答案
    public void DownLoadKey() {
        Long pId = getParaToLong("pId");
        MyPaper myPaper = MyPaperService.getMyPaperById(pId);
        JSONObject result = ResultJson.getResultJson();
        if (null != myPaper) {
            String path = myPaper.getStr("sz_answer_store");
            File fileName = new File(path);
            if (fileName.exists()) {
                MyPaperService.updateDownloadTimesById(pId);
                renderFile(fileName);
            } else {
                result.put("result", -1);
                result.put("reason", "文件不存在");
                renderJson(result);
            }
        } else {
            result.put("result", -1);
            result.put("reason", "试卷不存在");
            renderJson(result);
        }
    }

    public void getMyPaperList() {
        String userName = getPara("username");
        String strSection = getPara("section");
        String strSubject = getPara("subject");
        JSONObject result = ResultJson.getResultJson();
        User user = UserService.getUserByUsername(userName);
        if (null != user) {
            Long sId = null;
            if (null != strSubject) {
                sId = SubjectService.getSubjectByCaption(strSubject).getId();
            }
            List<MyPaper> myPaperList =
                    MyPaperService.getMyPapersByUserId(1, user.getId(), changeSectionToCode(strSection), sId);
            if (null != myPaperList) {
                List<MyPaperResult> myPaperResultList = new ArrayList<>();
                for (MyPaper myPaper : myPaperList) {
                    MyPaperResult myPaperResult = new MyPaperResult();
                    myPaperResult.setPaperId(myPaper.getId());
                    myPaperResult.setState(null != myPaper.getFileStore() ? 1 : 0);
                    myPaperResult.setUsername(userName);
                    myPaperResult.setSection(changeSection(myPaper.getSection()));
                    myPaperResult.setSubject(SubjectService.getCaptionById(myPaper.getSubjectId()));
                    myPaperResult.setPaperName(myPaper.getCaption());
                    if (myPaper.getFileStore().endsWith("pdf")) {
                        myPaperResult.setPaperPath(
                                myPaper.getFileStore() == null ? null : (getResourceUrl() + myPaper.getFileStore()));
                    } else {
                        myPaperResult.setPaperPath(
                                myPaper.getFileStore() == null ? null : (getResourceUrl() + myPaper.getFileStore().replace("docx", "pdf")));
                    }
                    myPaperResultList.add(myPaperResult);
                }
                result.put("data", myPaperResultList);
            }
        }
        renderJson(result);
    }

}



