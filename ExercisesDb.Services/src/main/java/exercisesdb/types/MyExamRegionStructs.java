package exercisesdb.types;

import java.util.ArrayList;
import java.util.List;

public class MyExamRegionStructs {
    private String caption;
    private String kindName;
    private String remark;
    private Integer examNum;//试题总数
    private Double score;//总分数
    private int order;//排序
    private List<ExamStructs> examList = new ArrayList<>();

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public List<ExamStructs> getExamList() {
        return examList;
    }

    public void setExamList(List<ExamStructs> examList) {
        this.examList = examList;
    }

    public Integer getExamNum() {
        return examNum;
    }

    public void setExamNum(Integer examNum) {
        this.examNum = examNum;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getKindName() {
        return kindName;
    }

    public void setKindName(String kindName) {
        this.kindName = kindName;
    }
}
