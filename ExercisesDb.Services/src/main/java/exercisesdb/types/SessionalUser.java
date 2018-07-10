package exercisesdb.types;


import exercisesdb.model.Ability;
import exercisesdb.model.ExamKind;
import exercisesdb.model.Favorite;
import exercisesdb.model.KnowPoint;

import java.util.List;

public class SessionalUser {
    private long id;
    private String userName;
    private String nickName;
    private Integer grade;
    private Integer section;
    private Long subjectId;
    private String subject;
    private MyPaperStructs myPaperStructs;
    private List<ExamStructs> examStructs;
    private List<KnowPoint> allKnowPoint;
    private List<ExamKind> allExamKind;
    private List<Ability> abilities;
    private List<Favorite> favorites;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getGrade() {
        return grade;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
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

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public MyPaperStructs getMyPaperStructs() {
        return myPaperStructs;
    }

    public void setMyPaperStructs(MyPaperStructs myPaperStructs) {
        this.myPaperStructs = myPaperStructs;
    }

    public List<ExamStructs> getExamStructs() {
        List<MyExamRegionStructs> data = myPaperStructs.getData();
        for (MyExamRegionStructs datum : data) {
            List<ExamStructs> examList = datum.getExamList();
        }
        return examStructs;
    }

    public void setExamStructs(List<ExamStructs> examStructs) {
        this.examStructs = examStructs;
    }

    public List<KnowPoint> getAllKnowPoint() {
        return allKnowPoint;
    }

    public void setAllKnowPoint(List<KnowPoint> allKnowPoint) {
        this.allKnowPoint = allKnowPoint;
    }

    public List<ExamKind> getAllExamKind() {
        return allExamKind;
    }

    public void setAllExamKind(List<ExamKind> allExamKind) {
        this.allExamKind = allExamKind;
    }

    public List<Ability> getAbilities() {
        return abilities;
    }

    public void setAbilities(List<Ability> abilities) {
        this.abilities = abilities;
    }

    public List<Favorite> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<Favorite> favorites) {
        this.favorites = favorites;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}
