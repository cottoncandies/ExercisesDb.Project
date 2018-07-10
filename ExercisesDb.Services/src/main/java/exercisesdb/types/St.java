package exercisesdb.types;

import java.util.Date;
import java.util.List;

public class St {
    /**
     * "Tid1":388922305832064,
     * "资料来源":"null",
     * "难度":"4",
     * "分值":8,
     * "客观题":"0",
     * "录入时间":"null",
     * "题型":"匹配题",
     * "考查能力":"理解,分析综合",
     * "答案":"",
     * "解析":"null",
     * "命题内容":,
     * "教材目录节点":"360525038745541","原学段":"小学","原学科":"语文","备注":"null"
     * "zsdlist":[
     * {
     * "tid1":388918947456128,
     * "知识点编号":"301102101101102",
     * "知识点名称":"韵母"
     * }
     * ],
     * "是否加入试卷":"否",
     * "是否加入收藏":"否"
     */

    private Long Tid1;
    private String zlSource;
    private String nd;
    private String score;
    private String objective;
    private Date entranceTime;
    private String tx;
    private String kcnl;
    private String xuanxiang;
    private String answer;
    private String jiexi;
    private String mingti;
    private String tigan;
    private String jiaocaiCata;
    private String section;
    private String subject;
    private String comment;

    public Long getTid1() {
        return Tid1;
    }

    public void setTid1(Long tid1) {
        Tid1 = tid1;
    }

    public String getZlSource() {
        return zlSource;
    }

    public void setZlSource(String zlSource) {
        this.zlSource = zlSource;
    }

    public String getNd() {
        return nd;
    }

    public void setNd(String nd) {
        this.nd = nd;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public Date getEntranceTime() {
        return entranceTime;
    }

    public void setEntranceTime(Date entranceTime) {
        this.entranceTime = entranceTime;
    }

    public String getTx() {
        return tx;
    }

    public void setTx(String tx) {
        this.tx = tx;
    }

    public String getKcnl() {
        return kcnl;
    }

    public void setKcnl(String kcnl) {
        this.kcnl = kcnl;
    }

    public String getXuanxiang() {
        return xuanxiang;
    }

    public void setXuanxiang(String xuanxiang) {
        this.xuanxiang = xuanxiang;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getJiexi() {
        return jiexi;
    }

    public void setJiexi(String jiexi) {
        this.jiexi = jiexi;
    }

    public String getMingti() {
        return mingti;
    }

    public void setMingti(String mingti) {
        this.mingti = mingti;
    }

    public String getTigan() {
        return tigan;
    }

    public void setTigan(String tigan) {
        this.tigan = tigan;
    }

    public String getJiaocaiCata() {
        return jiaocaiCata;
    }

    public void setJiaocaiCata(String jiaocaiCata) {
        this.jiaocaiCata = jiaocaiCata;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

}
