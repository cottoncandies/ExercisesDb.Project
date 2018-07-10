package exercisesdb.types;

import java.util.List;

public class StStruct {
    private St st;
    private List<Zsd> zsdList;
    private String isInPaper;
    private String isFav;

    public St getSt() {
        return st;
    }

    public void setSt(St st) {
        this.st = st;
    }

    public List<Zsd> getZsdList() {
        return zsdList;
    }

    public void setZsdList(List<Zsd> zsdList) {
        this.zsdList = zsdList;
    }

    public String getIsInPaper() {
        return isInPaper;
    }

    public void setIsInPaper(String isInPaper) {
        this.isInPaper = isInPaper;
    }

    public String getIsFav() {
        return isFav;
    }

    public void setIsFav(String isFav) {
        this.isFav = isFav;
    }
}
