package exercisesdb.types;

import exercisesdb.model.Exam;

import java.util.Date;

public class ExamStructs {
    public ExamStructs(){

    }
    public ExamStructs(Exam exam){

        this.id = exam.getId();
        this.parentId = exam.getParentId();
        this.created = exam.getTimeCreated();
        this.kindId = exam.getKindId();
        this.kindName = exam.getKindName();
        this.deep = exam.getDeep();
        this.score = exam.getScore();
        this.mingti = exam.getMingTi();
        this.answer = exam.getAnswer();
        this.xuanxiang = exam.getXuanXiang();
        this.jiexi = exam.getJieXi();
        this.tigan = exam.getTiGan();
        this.abiCap = exam.getAbiCap();
//        this.oldId = exam.getOldTextbook();
    }
    private Long id ;
    private Long parentId ;
    private Date created ;
    private Long kindId ;
    private String kindName ;//题型
    private Integer deep ;
    private Integer score ;
    private String mingti ;
    private String answer ;
    private String xuanxiang ;
    private String jiexi ;
    private String tigan ;
    private Long oldId ;
    private String abiCap;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Long getKindId() {
        return kindId;
    }

    public void setKindId(Long kindId) {
        this.kindId = kindId;
    }

    public String getKindName() {
        return kindName;
    }

    public void setKindName(String kindName) {
        this.kindName = kindName;
    }

    public Integer getDeep() {
        return deep;
    }

    public void setDeep(Integer deep) {
        this.deep = deep;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getMingti() {
        return mingti;
    }

    public void setMingti(String mingti) {
        this.mingti = mingti;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getXuanxiang() {
        return xuanxiang;
    }

    public void setXuanxiang(String xuanxiang) {
        this.xuanxiang = xuanxiang;
    }

    public String getJiexi() {
        return jiexi;
    }

    public void setJiexi(String jiexi) {
        this.jiexi = jiexi;
    }

    public String getTigan() {
        return tigan;
    }

    public void setTigan(String tigan) {
        this.tigan = tigan;
    }

    public Long getOldId() {
        return oldId;
    }

    public void setOldId(Long oldId) {
        this.oldId = oldId;
    }

    public String getAbiCap() {
        return abiCap;
    }

    public void setAbiCap(String abiCap) {
        this.abiCap = abiCap;
    }
}
