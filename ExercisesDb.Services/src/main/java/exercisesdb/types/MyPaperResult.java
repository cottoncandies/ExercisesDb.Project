package exercisesdb.types;

public class MyPaperResult {
    private Long paperId;
    private Integer state;
    private String username;
    private String section;
    private String subject;
    private String paperName;
    private String paperPath;

    public Long getPaperId() {
        return paperId;
    }

    public void setPaperId(Long paperId) {
        this.paperId = paperId;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getPaperName() {
        return paperName;
    }

    public void setPaperName(String paperName) {
        this.paperName = paperName;
    }

    public String getPaperPath() {
        return paperPath;
    }

    public void setPaperPath(String paperPath) {
        this.paperPath = paperPath;
    }
}
