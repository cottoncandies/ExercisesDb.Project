package exercisesdb.types;

import com.alibaba.fastjson.JSONObject;
import exercisesdb.model.MyPaper;

import java.util.*;

public class MyPaperStructs {
    public static final Map cache = new HashMap();

    public MyPaperStructs() {

    }

    public MyPaperStructs(MyPaper myPaper) {
        if (myPaper != null) {
            this.id = myPaper.getId();
            this.userId = myPaper.getUserId();
            this.caption = myPaper.getCaption();
            this.section = myPaper.getSection();
            this.subjectId = myPaper.getSubjectId();
            this.gradeId = myPaper.getGrade();
            this.scope = myPaper.getScope();
            this.timeLen = myPaper.getTimeLen();
            this.person = myPaper.getPerson();
//            this.nickName = myPaper.getNickName();
            this.total = myPaper.getTotal();
//         this.downloadTimes = myPaper.get();
//         this.finished =
            this.state = myPaper.getState();
            this.data = (List<MyExamRegionStructs>) JSONObject.parseArray(myPaper.getData(), MyExamRegionStructs.class);
        }
    }

    private Long id;
    private Long userId;
    private String caption;//试卷标题
    private Integer section;
    private Long subjectId;
    private Integer gradeId;
    private String scope;//考试范围
    private String timeLen;//考试时间
    private String person;//出题人
    private Integer total;//满分
    private Integer downloadTimes;//下载次数
    private Date finished;//完成时间

    private Integer titleBar; //显示标题栏
    private Integer infoBar; //显示信息栏
    private Integer inputBar; //显示信息栏
    private Integer tongfenBar; //显示统分栏
    private Integer pingfenBar; //显示评分栏
    private Integer showAnswer; //显示答案解析
    private Integer showDefen; //显示分数
    private Integer fileKind; //（1 PDF ，2 docx）
    private String fileStore; //文件存储，只记录最后一次生成的试卷
    private String answerStore; //答案文本存储，文件格式和试卷一致
    private Integer pageSize; //（1.A3(8开），2.A4（16开））
    private Integer state; //（状态：-2：删除，-1：未接受，0：处于试题篮中，1：已经发布）
    //    private String data ; //试卷内容
    private List<MyExamRegionStructs> data = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Integer getSection() {
        return section;
    }

    public void setSection(Integer section) {
        this.section = section;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getGradeId() {
        return gradeId;
    }

    public void setGradeId(Integer gradeId) {
        this.gradeId = gradeId;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getTimeLen() {
        return timeLen;
    }

    public void setTimeLen(String timeLen) {
        this.timeLen = timeLen;
    }

    public String getPerson() {
        return person;
    }

    public void setPerson(String person) {
        this.person = person;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getDownloadTimes() {
        return downloadTimes;
    }

    public void setDownloadTimes(Integer downloadTimes) {
        this.downloadTimes = downloadTimes;
    }

    public Date getFinished() {
        return finished;
    }

    public void setFinished(Date finished) {
        this.finished = finished;
    }

    public Integer getTitleBar() {
        return titleBar;
    }

    public void setTitleBar(Integer titleBar) {
        this.titleBar = titleBar;
    }

    public Integer getInfoBar() {
        return infoBar;
    }

    public void setInfoBar(Integer infoBar) {
        this.infoBar = infoBar;
    }

    public Integer getInputBar() {
        return inputBar;
    }

    public void setInputBar(Integer inputBar) {
        this.inputBar = inputBar;
    }

    public Integer getTongfenBar() {
        return tongfenBar;
    }

    public void setTongfenBar(Integer tongfenBar) {
        this.tongfenBar = tongfenBar;
    }

    public Integer getPingfenBar() {
        return pingfenBar;
    }

    public void setPingfenBar(Integer pingfenBar) {
        this.pingfenBar = pingfenBar;
    }

    public Integer getShowAnswer() {
        return showAnswer;
    }

    public void setShowAnswer(Integer showAnswer) {
        this.showAnswer = showAnswer;
    }

    public Integer getShowDefen() {
        return showDefen;
    }

    public void setShowDefen(Integer showDefen) {
        this.showDefen = showDefen;
    }

    public Integer getFileKind() {
        return fileKind;
    }

    public void setFileKind(Integer fileKind) {
        this.fileKind = fileKind;
    }

    public String getFileStore() {
        return fileStore;
    }

    public void setFileStore(String fileStore) {
        this.fileStore = fileStore;
    }

    public String getAnswerStore() {
        return answerStore;
    }

    public void setAnswerStore(String answerStore) {
        this.answerStore = answerStore;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public List<MyExamRegionStructs> getData() {
        return data;
    }

    public void setData(List<MyExamRegionStructs> data) {
        this.data = data;
    }
}
