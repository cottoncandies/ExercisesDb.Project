package exercisesdb.types;

public class Nl {
    private long kcid;
    private String section;
    private String subject;
    private String caption;
    private int states;
    private String comment;

    public long getKcid() {
        return kcid;
    }

    public void setKcid(long kcid) {
        this.kcid = kcid;
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

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public int getStates() {
        return states;
    }

    public void setStates(int states) {
        this.states = states;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
