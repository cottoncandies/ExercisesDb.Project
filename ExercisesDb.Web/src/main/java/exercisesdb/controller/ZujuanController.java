package exercisesdb.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.plugin.activerecord.Page;
import exercisesdb.common.ListUtil;
import exercisesdb.common.PageHtmlCommon;
import exercisesdb.common.ReplaceSpecialChar;
import exercisesdb.common.ResultJson;
import exercisesdb.model.*;
import exercisesdb.services.*;
import exercisesdb.types.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ZujuanController extends BaseController {

    private SessionalUser user;
    private List<Exam> sts = new ArrayList<>();
    private int section;
    private long subjectId;
    private String strSection = "";
    private String strSubject = "";
    private int pageSize = 5;

    private void getSessionUser() {
        if (null == user) {
            user = getSessionalUser();
        }
    }

    private void initEnvironment() {
        section = user.getSection();
        strSection = changeSection(section);
        subjectId = user.getSubjectId();
        strSubject = user.getSubject();
    }

    private String getBookCatalogs(String mlNum) {
        List<BookCatalog> bookCatalogs=new ArrayList<>();
        String strMLTree = "<ul>";
        if (!"".equals(mlNum)) {
            bookCatalogs = BookCatlogService.getCatalogByParentNum(mlNum);
            if (null != bookCatalogs && bookCatalogs.size() > 0) {
                for (int i = 0; i < bookCatalogs.size(); i++) {
                    BookCatalog bookCatalog = bookCatalogs.get(i);
                    if (mlNum.length() < 12) {
                        strMLTree += "<li class=\'jstree-closed\' id= \'" + bookCatalog.getNum()
                                + "\'><a href=\'javascript:;\' title=\'" + bookCatalog.getCaption().replace(strSection + strSubject, "") + "\'>"
                                + bookCatalog.getCaption().replace(strSection + strSubject, "")
                                + "</a><ul></ul></li>";
                    } else {
                        strMLTree += "<li class=\'jstree-leaf\' id= \'" + bookCatalog.getNum()
                                + "\'><a href=\'javascript:;\' title=\'" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                                + "\'>" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                                + "</a></li>";
                    }
                }
            }
        } else {
            bookCatalogs = BookCatlogService.firstEntrance(section, subjectId);
            if (null != bookCatalogs && bookCatalogs.size() > 0) {
                for (BookCatalog bookCatalog : bookCatalogs) {
                    strMLTree += "<li class=\'jstree-closed\' id= \'" + bookCatalog.getNum()
                            + "\'><a href=\'javascript:;\' title=\'" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                            + "\'>" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                            + "</a><ul></ul></li>";
                }
            }
        }
        strMLTree += "</ul>";
        return strMLTree;
    }

    private String getKnowPoints(String zsdNum) {
        List<KnowPoint> knowPoints = null;
        knowPoints = user.getAllKnowPoint();
        if (null == knowPoints || knowPoints.size() <= 0) {
            knowPoints = KnowPointService.getKnowPoints(section, subjectId);
        }
        String strZSDTree = "<ul>";
        if (!"".equals(zsdNum)) {
            if (null != knowPoints && knowPoints.size() > 0) {
                for (KnowPoint knowPoint : knowPoints) {
                    if ((knowPoint.getNum().length() == (zsdNum.length() + 3)) && knowPoint.getNum().startsWith(zsdNum)) {
                        if (knowPoint.getNum().length() < 15) {
                            strZSDTree += "<li class=\'jstree-closed\' id= \'" + knowPoint.getNum() + "\'>" +
                                    "<a href=\'javascript:;\' title=\'" + knowPoint.getCaption() + "\'>" + knowPoint.getCaption()
                                    + "</a><ul></ul></li>";
                        } else if (knowPoint.getNum().length() == 15) {
                            strZSDTree += "<li class=\'jstree-leaf\' id= \'" + knowPoint.getNum() + "\'>" +
                                    "<a href=\'javascript:;\' title=\'" + knowPoint.getCaption() + "\'>" + knowPoint.getCaption()
                                    + "</a></li>";
                        }
                    }
                }
            }
        } else {
            if (null != knowPoints && knowPoints.size() > 0) {
                for (KnowPoint knowPoint : knowPoints) {
                    if (knowPoint.getNum().length() == 9) {
                        strZSDTree += "<li class=\'jstree-closed\' id= \'" + knowPoint.getNum() + "\'>" +
                                "<a href=\'javascript:;\' title=\'" + knowPoint.getCaption() + "\'>" + knowPoint.getCaption()
                                + "</a><ul></ul></li>";
                    }
                }
            }
        }
        strZSDTree += "</ul>";
        return strZSDTree;
    }

    private String getPaperCatalogs(String paperType) {
        String strPaper = "<ul>";
        if ("".equals(paperType)) {
            if (section == 2) {
                paperType = "中考真题";
            } else if (section == 3) {
                paperType = "高考真题";
            }
            strPaper += "<li class=\'jstree-closed jstree-last\' id=\'date" + paperType + "\'>" +
                    "<a href=\'javascript:;\' title=\'" + paperType + "\'>" + paperType + "</a><ul>";
            List<String> years = PaperService.getYears(subjectId, paperType);
            if (null != years) {
                for (String year : years) {
                    strPaper += "<li class=\'jstree-closed\' id=\'date" + paperType + "-" + year + "\'>" +
                            "<a href=\'javascript:;\' title=\'" + year + "\'>" + year + "</a><ul>";
                    List<Paper> papers = PaperService.getPapers(subjectId, year, paperType);
                    if (null != papers) {
                        for (Paper paper : papers) {
                            strPaper += "<li class=\'jstree-leaf\' id=\'date" + paperType + "-" + year + "-" + paper.getId()
                                    + "\'>" + "<a href=\'javascript:;\' title=\'" + paper.getCaption() + "\'>" + paper.getCaption()
                                    + "</a></li>";
                        }
                        strPaper += "</ul></li>";
                    } else {
                        strPaper += "</ul></li>";
                    }
                }
            } else {
                strPaper += "</ul></li></ul>";
            }
            strPaper += "</ul></li>";
        } else {

        }
        strPaper += "</ul>";
        return strPaper;
    }

    private String getKnowPointsFav(String zsdNum) {
        String strZSDTree = "<ul>";
        List<KnowPoint> knowPoints = KnowPointService.getKnowPointsByNum(user.getId(), section, subjectId);
        if (null == knowPoints) {
            strZSDTree += "</ul>";
            return strZSDTree;
        }
        ListUtil.removeDuplicate(knowPoints);
        if (!"".equals(zsdNum)) {
            if (null != knowPoints && knowPoints.size() > 0) {
                for (KnowPoint knowPoint : knowPoints) {
                    if ((knowPoint.getNum().length() == (zsdNum.length() + 3)) && knowPoint.getNum().startsWith(zsdNum)) {
                        if (knowPoint.getNum().length() < 15) {
                            strZSDTree += "<li class=\'jstree-closed\' id= \'" + knowPoint.getNum() + "\'>" +
                                    "<a href=\'javascript:;\' title=\'" + knowPoint.getCaption() + "\'>" + knowPoint.getCaption()
                                    + "</a><ul></ul></li>";
                        } else if (knowPoint.getNum().length() == 15) {
                            strZSDTree += "<li class=\'jstree-leaf\' id= \'" + knowPoint.getNum() + "\'>" +
                                    "<a href=\'javascript:;\' title=\'" + knowPoint.getCaption() + "\'>" + knowPoint.getCaption()
                                    + "</a></li>";
                        }
                    }
                }
            }
        } else {
            if (null != knowPoints && knowPoints.size() > 0) {
                for (KnowPoint knowPoint : knowPoints) {
                    if (knowPoint.getNum().length() == 9) {
                        strZSDTree += "<li class=\'jstree-closed\' id= \'" + knowPoint.getNum() + "\'>" +
                                "<a href=\'javascript:;\' title=\'" + knowPoint.getCaption() + "\'>" + knowPoint.getCaption()
                                + "</a><ul></ul></li>";
                    }
                }
            }
        }
        strZSDTree += "</ul>";
        return strZSDTree;
    }

    private String getBookCatalogsFav(String mlNum) {
        List<BookCatalog> bookCatalogs = new ArrayList<>();
        List<BookCatalog> tempBookCatalogs = null;
        String strMLTree = "<ul>";
        if (!"".equals(mlNum)) {
            int length = mlNum.length();
            switch (length) {
                case 6:
                    tempBookCatalogs = BookCatlogService.getCatalogsByNum(user.getId(), section, subjectId, 2);
                    if (null == tempBookCatalogs) {
                        strMLTree += "</ul>";
                        return strMLTree;
                    }
                    for (BookCatalog bookCatalog : tempBookCatalogs) {
                        if (bookCatalog.getParentNum().equals(mlNum)) {
                            bookCatalogs.add(bookCatalog);
                        }
                    }
                    break;
                case 9:
                    tempBookCatalogs = BookCatlogService.getCatalogsByNum(user.getId(), section, subjectId, 3);
                    if (null == tempBookCatalogs) {
                        strMLTree += "</ul>";
                        return strMLTree;
                    }
                    for (BookCatalog bookCatalog : tempBookCatalogs) {
                        if (bookCatalog.getParentNum().equals(mlNum)) {
                            bookCatalogs.add(bookCatalog);
                        }
                    }
                    break;
                case 12:
                    tempBookCatalogs = BookCatlogService.getCatalogsWithFav(user.getId(), section, subjectId);
                    if (null == tempBookCatalogs) {
                        strMLTree += "</ul>";
                        return strMLTree;
                    }
                    for (BookCatalog bookCatalog : tempBookCatalogs) {
                        if (bookCatalog.getParentNum().equals(mlNum)) {
                            if (!bookCatalogs.contains(bookCatalog)) {
                                bookCatalogs.add(bookCatalog);
                            }
                        }
                    }
                    break;
            }
            if (null != bookCatalogs && bookCatalogs.size() > 0) {
                for (int i = 0; i < bookCatalogs.size(); i++) {
                    BookCatalog bookCatalog = bookCatalogs.get(i);
                    if (mlNum.length() < 12) {
                        strMLTree += "<li class=\'jstree-closed\' id= \'" + bookCatalog.getNum()
                                + "\'><a href=\'javascript:;\' title=\'" + bookCatalog.getCaption().replace(strSection + strSubject, "") + "\'>"
                                + bookCatalog.getCaption().replace(strSection + strSubject, "")
                                + "</a><ul></ul></li>";
                    } else {
                        strMLTree += "<li class=\'jstree-leaf\' id= \'" + bookCatalog.getNum()
                                + "\'><a href=\'javascript:;\' title=\'" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                                + "\'>" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                                + "</a></li>";
                    }
                }
            }
        } else {
            bookCatalogs = BookCatlogService.getCatalogsByNum(user.getId(), section, subjectId, 1);
            if (null != bookCatalogs && bookCatalogs.size() > 0) {
                for (BookCatalog bookCatalog : bookCatalogs) {
                    strMLTree += "<li class=\'jstree-closed\' id= \'" + bookCatalog.getNum()
                            + "\'><a href=\'javascript:;\' title=\'" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                            + "\'>" + bookCatalog.getCaption().replace(strSection + strSubject, "")
                            + "</a><ul></ul></li>";
                }
            }
        }
        strMLTree += "</ul>";
        return strMLTree;
    }

    private String getPaperCatalogsFav(String paperType) {
        String strPaper = "<ul>";
        if ("".equals(paperType)) {
            if (section == 2) {
                paperType = "中考真题";
            } else if (section == 3) {
                paperType = "高考真题";
            }
            strPaper += "<li class=\'jstree-closed jstree-last\' id=\'date" + paperType + "\'>" +
                    "<a href=\'javascript:;\' title=\'" + paperType + "\'>" + paperType + "</a><ul>";
            List<String> years = PaperService.getYearsFav(user.getId(), section, subjectId, paperType);
            if (null != years) {
                for (String year : years) {
                    strPaper += "<li class=\'jstree-closed\' id=\'date" + paperType + "-" + year + "\'>" +
                            "<a href=\'javascript:;\' title=\'" + year + "\'>" + year + "</a><ul>";
                    List<Paper> papers = PaperService.getPapersFav(user.getId(), section, subjectId, year, paperType);
                    ListUtil.removeDuplicate(papers);
                    if (null != papers) {
                        for (Paper paper : papers) {
                            strPaper += "<li class=\'jstree-leaf\' id=\'date" + paperType + "-" + year + "-" + paper.getId()
                                    + "\'>" + "<a href=\'javascript:;\' title=\'" + paper.getCaption() + "\'>" + paper.getCaption()
                                    + "</a></li>";
                        }
                        strPaper += "</ul></li>";
                    } else {
                        strPaper += "</ul></li>";
                    }
                }
            } else {
                strPaper += "</ul></li></ul>";
            }
            strPaper += "</ul></li>";
        }
        strPaper += "</ul>";
        return strPaper;
    }

    private String getTX() {
        List<ExamKind> txs = user.getAllExamKind();
        if (null == txs || txs.size() <= 0) {
            txs = ExamKindService.getExamKinds(section, subjectId);
        }
        List<Tx> txShow = new ArrayList<>();
        if (null != txs && txs.size() > 0) {
            ListUtil.removeDuplicate(txs);
            for (ExamKind examKind : txs) {
                Tx tx = new Tx();
                tx.setTxid(examKind.getId());
                tx.setSection(strSection);
                tx.setSubject(strSubject);
                tx.setCaption(null != examKind.getCaption() ? examKind.getCaption() : "");
                tx.setStates(null != examKind.getState() ? examKind.getState() : 0);
                tx.setComment(examKind.getComment());
                txShow.add(tx);
            }
        }
        return JSON.toJSONString(txShow);
    }

    private String getNL() {
        List<Ability> nls = user.getAbilities();
        if (null == nls || nls.size() <= 0) {
            nls = AbilityService.getAbility(section, subjectId);
        }
        List<Nl> nlShow = new ArrayList<>();
        if (null != nls && nls.size() > 0) {
            for (Ability ability : nls) {
                Nl nl = new Nl();
                nl.setKcid(ability.getId());
                nl.setSection(strSection);
                nl.setSubject(strSubject);
                nl.setCaption(null != ability.getCaption() ? ability.getCaption() : "");
                nl.setStates(null != ability.getState() ? ability.getState() : 0);
                nl.setComment(ability.getComment());
                nlShow.add(nl);
            }
        }
        return JSON.toJSONString(nlShow);
    }

    private String getST() {
        List<Favorite> favorites = user.getFavorites();
        if (null == favorites) {
            favorites = FavoriteService.getFav(user.getId(), section, subjectId);
        }
        int examCount;
        int pageSize = 5;
        if (null != sts) {
            examCount = sts.size();
        } else {
            examCount = 0;
        }
        if (pageSize <= examCount) {
            pageSize = 5;
        } else {
            pageSize = examCount;
        }
        List<KnowPoint> knowPoints = new ArrayList<>();
        String isFav = "";
        String isInPaper = "";
        List<StStruct> stStructList = new ArrayList<>();

        for (int i = 0; i < pageSize; i++) {
            Exam exam = sts.get(i);
//            if (null != exam.getKpCap()) {
//                String strKpCaption = exam.getKpCap();
//                String[] kpCaptions = strKpCaption.split(",");
//                for (String kpCaption : kpCaptions) {
//                    List<KnowPoint> tempknowPoints = KnowPointService.getKnowPointsByCaption(section, subjectId, kpCaption);
//                    if (null != tempknowPoints && tempknowPoints.size() > 0)
//                        knowPoints.add(tempknowPoints.get(0));
//                }
//            }
            if (null != favorites) {
                isFav = checkFavorite(favorites, exam.getId()) ? "是" : "否";
            } else {
                isFav = "否";
            }

            isInPaper = checkExamInPaper(exam.getId()) ? "是" : "否";
            StStruct stStruct = new StStruct();
            St st = new St();
            st.setTid1(exam.getId());
            st.setZlSource(null != exam.getInforSrc() ? exam.getInforSrc() : "");
            st.setNd(exam.getDeep() + "");
            st.setScore(null != exam.getScore() ? (exam.getScore() + "") : "");
            st.setObjective((null != exam.getObjective() && exam.getObjective() == 1) ? "True" : "False");
            st.setEntranceTime(null != exam.getTimeUpdated() ? exam.getTimeUpdated() : (new Date()));
            st.setTx(null != exam.getKindName() ? exam.getKindName() : "");
            st.setKcnl(null != exam.getAbiCap() ? exam.getAbiCap() : "");
            st.setXuanxiang(null != exam.getXuanXiang() ? exam.getXuanXiang() : "");
            st.setAnswer(null != exam.getAnswer() ? exam.getAnswer() : "");
            st.setJiexi(null != exam.getJieXi() ? exam.getJieXi() : "");
            st.setMingti(
                    null != exam.getMingTi() ?
                            ReplaceSpecialChar.replaceChar(ReplaceSpecialChar.replaceChar(exam.getMingTi(), "##", "（"), "$$", "）") : "");
            st.setTigan(
                    null != exam.getTiGan() ?
                            ReplaceSpecialChar.replaceChar(ReplaceSpecialChar.replaceChar(exam.getTiGan(), "##", "（"), "$$", "）") : "");
            st.setJiaocaiCata(exam.getCatId() + "");
            st.setSection(strSection);
            st.setSubject(strSubject);
            st.setComment(null != exam.getComment() ? exam.getComment() : "");
            stStruct.setSt(st);
            stStruct.setZsdList(getZsdbh(knowPoints, exam));
            stStruct.setIsInPaper(isInPaper);
            stStruct.setIsFav(isFav);
            stStructList.add(stStruct);
        }
        return JSON.toJSONString(stStructList);
    }

    //拼接试题中获取的知识点编号
    private List<Zsd> getZsdbh(List<KnowPoint> knowPoints, Exam exam) {
        List<Zsd> zsdlist = new ArrayList<>();
        for (int k = 0; k < knowPoints.size(); k++) {
            KnowPoint knowPoint = knowPoints.get(k);
            Zsd zsd = new Zsd();
            zsd.setTid1(exam.getId());
            zsd.setZsdBh(knowPoint.getNum());
            zsd.setZsdMc(knowPoint.getCaption());
            zsdlist.add(zsd);
        }
        return zsdlist;
    }

    private String getND() {
        String strND = "[";
        strND += "\"易\",\"较易\",\"中\",\"较难\",\"难\"";
        strND += "],";
        return strND;
    }

    private String getNF() {
        String strNF = "[";
//        List<Exam> exams = ExamService.getYears();
//        if (null != exams && exams.size() > 0) {
//            for (int i = 0; i < exams.size(); i++) {
//                if (i < exams.size() - 1) {
//                    strNF += "\"" + exams.get(i).getAge() + "\",";
//                } else {
//                    strNF += "\"" + exams.get(i).getAge() + "\"";
//                }
//            }
//        }
        strNF += "],";
        return strNF;
    }

    private String getSTPaging(int totalPage, int currentPage) {
        return "\"" + PageHtmlCommon.getPageHtml(totalPage, currentPage) + "\",";
    }

    private String getResults(String flag, String mlbh, String examKind, int difficulty, String ability, int pageNum, int pageSize) {
        String data = "";
        int totalPage;
        int totalExam;
        if ("ML".equals(flag)) {
            if ("".equals(mlbh) && "".equals(examKind) && difficulty == 0 && "".equals(ability)) {
                sts.clear();
                Page<Exam> examPage = ExamService.firstEntrance(pageNum, pageSize, section, subjectId);
                if (null != examPage) {
                    totalPage = examPage.getTotalPage();
                    sts = examPage.getList();
                    totalExam = examPage.getTotalRow();
                } else {
                    totalPage = 0;
                    totalExam = 0;
                }
                data = "[\"成功\",\"ML\",\"\\\"" + getBookCatalogs(mlbh) + "\\\"\"," + getTX() + "," + getNL() + "," + getST() + "," + getND()
                        + getNF() + getSTPaging(totalPage, pageNum) + "\"" + mlbh + "\",\""
                        + totalExam + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            } else {
                sts.clear();
                Page<Exam> examLimited = ExamService.getExamLimited(subjectId, mlbh, examKind, difficulty, ability, pageNum, pageSize);
                if (null != examLimited) {
                    sts = examLimited.getList();
                    totalExam = examLimited.getTotalRow();
                    totalPage = examLimited.getTotalPage();
                } else {
                    totalPage = 0;
                    totalExam = 0;
                }
                data = "[\"成功\"," + getST() + "," + getSTPaging(totalPage, pageNum) + "\""
                        + totalExam + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            }
        } else if ("ZSD".equals(flag)) {
            if ("".equals(mlbh) && "".equals(examKind) && difficulty == 0 && "".equals(ability)) {
                sts.clear();
                Page<Exam> examPage = ExamService.firstEntrance(pageNum, pageSize, section, subjectId);
                if (null != examPage) {
                    totalPage = examPage.getTotalPage();
                    totalExam = examPage.getTotalRow();
                    sts = examPage.getList();
                } else {
                    totalPage = 0;
                    totalExam = 0;
                }
                data = "[\"成功\",\"ZSD\",\"\\\"" + getKnowPoints(mlbh) + "\\\"\"," + getTX() + "," + getNL() + "," + getST() + "," + getND()
                        + getNF() + getSTPaging(totalPage, pageNum) + "\"" + mlbh + "\",\""
                        + totalExam + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            } else {
                sts.clear();
                Page<Exam> examsByKPNum = ExamService.getExamsByKPNum(mlbh, examKind, difficulty, ability, pageNum, pageSize, section, subjectId);
                if (null != examsByKPNum) {
                    totalExam = examsByKPNum.getTotalRow();
                    totalPage = examsByKPNum.getTotalPage();
                    sts = examsByKPNum.getList();
                } else {
                    totalExam = 0;
                    totalPage = 0;
                }
                data = "[\"成功\"," + getST() + "," + getSTPaging(totalPage, pageNum)
                        + "\"" + totalExam + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            }
        }
        return data;
    }

    private String getPaperResults(String paperType, String year, Long paperName, String examKind, int difficulty, String ability, int pageNum, int pageSize) {
        String data = "";
        int totalPage;
        int totalRows;
        if ("".equals(paperType) && "".equals(year) && null == paperName && "".equals(examKind) && difficulty == 0 && "".equals(ability)) {
            sts.clear();
            Page<Exam> examPage = ExamService.firstEntrancePaper(pageNum, pageSize, section, subjectId, paperType);
            if (null != examPage) {
                totalRows = examPage.getTotalRow();
                totalPage = examPage.getTotalPage();
                sts = examPage.getList();
            } else {
                totalPage = 0;
                totalRows = 0;
            }
            data = "[\"成功\"," + getTX() + "," + getNL() + "," + getND() + "\"" + getPaperCatalogs(paperType) + "\"," + getST() + ","
                    + getSTPaging(totalPage, pageNum) + "\"" + totalRows + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
        } else {
            sts.clear();
            Page<Exam> examByPaper = ExamService.getExamByPaper(paperType, year, paperName, examKind, difficulty, ability, pageNum, pageSize);
            if (null != examByPaper) {
                totalPage = examByPaper.getTotalPage();
                totalRows = examByPaper.getTotalRow();
                sts = examByPaper.getList();
            } else {
                totalRows = 0;
                totalPage = 0;
            }
            data = "[\"成功\"," + getST() + "," + getSTPaging(totalPage, pageNum) + "\"" + totalRows + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
        }
        return data;
    }

    private String getMyCollectPaperResults(String paperType, String year, Long paperName, String examKind, int difficulty, String ability, Long userId, int pageNum, int pageSize) {
        String data = "";
        int totalPage;
        int totalExam;
        if ("".equals(paperType) && "".equals(year) && null == paperName && "".equals(examKind) && difficulty == 0 && "".equals(ability)) {
            sts.clear();
            Page<Exam> examPage = ExamService.firstEntranceMyCollect(section, subjectId, pageNum, pageSize, userId);
            if (null != examPage) {
                totalPage = examPage.getTotalPage();
                sts = examPage.getList();
                totalExam = examPage.getTotalRow();
            } else {
                totalExam = 0;
                totalPage = 0;
            }
            data = "[\"成功\"," + getTX() + "," + getNL() + "," + getND() + "\"" + getPaperCatalogsFav(paperType) + "\"," + getST() + ","
                    + getSTPaging(totalPage, pageNum) + "\"" + totalExam + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
        } else {
            sts.clear();
            Page<Exam> examByPaper = ExamService.getExamByPaperAndUserId(year, paperName, examKind, difficulty, ability, pageNum, pageSize, userId);
            if (null != examByPaper) {
                totalExam = examByPaper.getTotalRow();
                totalPage = examByPaper.getTotalPage();
                sts = examByPaper.getList();
            } else {
                totalPage = 0;
                totalExam = 0;
            }
            data = "[\"成功\"," + getST() + "," + getSTPaging(totalPage, pageNum) + "\"" + totalExam + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
        }
        return data;
    }

    private String getMyCollectResults(String flag, String mlbh, String examKind, int difficulty, String ability, Long userId, int pageNum, int pageSize) {
        String data = "";
        int totalPage;
        int totalExamRows;
        if ("ML".equals(flag)) {
            if ("".equals(mlbh) && "".equals(examKind) && difficulty == 0 && "".equals(ability)) {
                sts.clear();
                Page<Exam> examPage = ExamService.firstEntranceMyCollect(section, subjectId, pageNum, pageSize, userId);
                if (null != examPage) {
                    totalExamRows = examPage.getTotalRow();
                    totalPage = examPage.getTotalPage();
                    sts = examPage.getList();
                } else {
                    totalExamRows = 0;
                    totalPage = 0;
                }
                data = "[\"成功\",\"ML\",\"\\\"" + getBookCatalogs(mlbh) + "\\\"\"," + getTX() + "," + getNL() + "," + getST() + "," + getND()
                        + getNF() + getSTPaging(totalPage, pageNum) + "\"" + mlbh + "\",\"" + totalExamRows + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            } else {
                sts.clear();
                Page<Exam> examLimited = ExamService.getExamLimitedMyCollect(subjectId, mlbh, examKind, difficulty, ability, pageNum, pageSize, userId);
                if (null != examLimited) {
                    totalExamRows = examLimited.getTotalRow();
                    totalPage = examLimited.getTotalPage();
                    sts = examLimited.getList();
                } else {
                    totalPage = 0;
                    totalExamRows = 0;
                }
                data = "[\"成功\"," + getST() + "," + getSTPaging(totalPage, pageNum) + "\"" + totalExamRows + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            }
        } else if ("ZSD".equals(flag)) {
            if ("".equals(mlbh) && "".equals(examKind) && difficulty == 0 && "".equals(ability)) {
                sts.clear();
                Page<Exam> examPage = ExamService.firstEntranceMyCollect(section, subjectId, pageNum, pageSize, userId);
                if (null != examPage) {
                    totalPage = examPage.getTotalPage();
                    sts = examPage.getList();
                    totalExamRows = examPage.getTotalRow();
                } else {
                    totalPage = 0;
                    totalExamRows = 0;
                }
                data = "[\"成功\",\"ZSD\",\"\\\"" + getKnowPointsFav(mlbh) + "\\\"\"," + getTX() + "," + getNL() + "," + getST() + "," + getND()
                        + getNF() + getSTPaging(totalPage, pageNum) + "\"" + mlbh + "\",\"" + totalExamRows + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            } else {
                sts.clear();
                Page<Exam> examsByKPNum = ExamService.getExamsByKPNumAndUserId(mlbh, examKind, difficulty, ability, pageNum, pageSize, userId, subjectId);
                if (null != examsByKPNum) {
                    totalPage = examsByKPNum.getTotalPage();
                    totalExamRows = examsByKPNum.getTotalRow();
                    sts = examsByKPNum.getList();
                } else {
                    totalExamRows = 0;
                    totalPage = 0;
                }
                data = "[\"成功\"," + getST() + "," + getSTPaging(totalPage, pageNum) + "\"" + totalExamRows + "\",\"" + strSection + "\",\"" + strSubject + "\"]";
            }
        }
        return data;
    }

    public void ml() {
        getSessionUser();
        initEnvironment();
        String data = "";
        String mlbh = getPara("mlbh");//目录编号
        String examKind = getPara("Questions");//题型
        String strDifficulty = getPara("Difficulty");//难度
        String ability = getPara("Ability");//能力
//        String year = getPara("Year");//年份
        int currentPage = getParaToInt("CurrentPage");//当前页
//        int isPaging = getParaToInt("isPaging");//是否分页
        int difficulty = changeDifficult(strDifficulty);
        data = getResults("ML", mlbh, examKind, difficulty, ability, currentPage, pageSize);
        renderText(data);
    }

    public void scan() {
        getSessionUser();
        initEnvironment();
        String data = "";
        String mlbh = getPara("mlbh");//目录编号
        String examKind = getPara("Questions");//题型
        String strDifficulty = getPara("Difficulty");//难度
        String ability = getPara("Ability");//能力
        String year = getPara("Year");//年份
        int currentPage = getParaToInt("CurrentPage");//当前页
        int isPaging = getParaToInt("isPaging");//是否分页
        int difficulty = changeDifficult(strDifficulty);
        data = getMyCollectResults("ML", mlbh, examKind, difficulty, ability, user.getId(), currentPage, pageSize);
        renderText(data);
    }

    public void myCollectzsd() {
        getSessionUser();
        initEnvironment();
        String data = "";
        String mlbh = getPara("mlbh");//目录编号
        String examKind = getPara("Questions");//题型
        String strDifficulty = getPara("Difficulty");//难度
        String ability = getPara("Ability");//能力
        int currentPage = getParaToInt("CurrentPage");//当前页
        int isPaging = getParaToInt("isPaging");//是否分页
        int difficulty = changeDifficult(strDifficulty);
        data = getMyCollectResults("ZSD", mlbh, examKind, difficulty, ability, user.getId(), currentPage, pageSize);
        renderText(data);
    }

    public void getMLOrZSDTreeInfo() {
        getSessionUser();
        initEnvironment();
        String catalogs = "";
        String isMLorZSD = getPara("isMLorZSD");
        String id = getPara("id");
        if (id == null) {
            id = "";
        }
        Integer collect = getParaToInt("collect");
        if (collect == 0) {
            if ("ML".equals(isMLorZSD)) {
                catalogs = getBookCatalogs(id);
            } else if ("ZSD".equals(isMLorZSD)) {
                catalogs = getKnowPoints(id);
            }
        } else if (collect == 1) {
            if ("ML".equals(isMLorZSD)) {
                catalogs = getBookCatalogsFav(id);
            } else if ("ZSD".equals(isMLorZSD)) {
                catalogs = getKnowPointsFav(id);
            }
        }
        renderText(catalogs);
    }

    public void addCollectQuestion() {
        getSessionUser();
        initEnvironment();
        String tid = getPara("tid");
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//可以方便地修改日期格式
        String nowFormat = dateFormat.format(now);
        boolean b = FavoriteService.addExamToMyFavorite(user.getId(), section, subjectId, Long.parseLong(tid), nowFormat);
        String data = "[";
        if (b) {
            data += "\"成功\",";
        } else {
            data += "\"收藏试题失败\",";
        }
        data += "\"" + tid + "\"]";
        renderText(data);
    }

    public void removeCollectQuestion() {
        getSessionUser();
        initEnvironment();
        String tid = getPara("tid");
        boolean b = FavoriteService.delMyFavoriteById(user.getId(), Long.parseLong(tid));
        String data = "[";
        if (b) {
            data += "\"成功\",";
        } else {
            data += "\"取消收藏失败\",";
        }
        data += "\"" + tid + "\"]";
        renderText(data);
    }

    public void zsd() {
        getSessionUser();
        initEnvironment();
        String data = "";
        String mlbh = getPara("mlbh");//目录编号
        String examKind = getPara("Questions");//题型
        String strDifficulty = getPara("Difficulty");//难度
        String ability = getPara("Ability");//能力
        int currentPage = getParaToInt("CurrentPage");//当前页
        int isPaging = getParaToInt("isPaging");//是否分页
        int difficulty = changeDifficult(strDifficulty);
        data = getResults("ZSD", mlbh, examKind, difficulty, ability, currentPage, pageSize);
        renderText(data);
    }

    public void tj() {
        getSessionUser();
        initEnvironment();
        String data = "";
        String paperType = getPara("paperType");
        String year = getPara("year");
        Long paperName = getParaToLong("paperName");
        String province = getPara("province");
        String qType = getPara("qType");
        String ability = getPara("qAbility");
        String qDifficulty = getPara("qDifficulty");
        int currentPage = getParaToInt("currentPage");
        int isPaging = getParaToInt("isPaging");
        int difficulty = changeDifficult(qDifficulty);
        data = getPaperResults(paperType, year, paperName, qType, difficulty, ability, currentPage, pageSize);
        renderText(data);
    }

    public void myCollecttj() {
        getSessionUser();
        initEnvironment();
        String data = "";
        String paperType = getPara("paperType");
        String year = getPara("year");
        Long paperName = getParaToLong("paperName");
        String province = getPara("province");
        String qType = getPara("qType");
        String ability = getPara("qAbility");
        String qDifficulty = getPara("qDifficulty");
        int currentPage = getParaToInt("currentPage");
        int isPaging = getParaToInt("isPaging");
        int difficulty = changeDifficult(qDifficulty);
        data = getMyCollectPaperResults(paperType, year, paperName, qType, difficulty, ability, user.getId(), currentPage, pageSize);

        renderText(data);
    }

    public void loadQuestionBasket() {
        getSessionUser();
        initEnvironment();
        int examCount = 0;
        JSONObject resultJson = ResultJson.getResultJson();
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        if (null != myPaperStructs) {
            List<MyExamRegionStructs> data = myPaperStructs.getData();
            for (MyExamRegionStructs structs : data) {
                examCount += structs.getExamList().size();
            }
            resultJson.put("data", examCount);
        } else {
            resultJson.put("data", 0);
        }
        renderJson(resultJson);
    }

    private int changeDifficult(String strDiff) {
        int diff = 0;
        if (null != strDiff) {
            switch (strDiff) {
                case "全部":
                    diff = 0;
                    break;
                case "易":
                    diff = 1;
                    break;
                case "较易":
                    diff = 2;
                    break;
                case "中":
                    diff = 3;
                    break;
                case "较难":
                    diff = 4;
                    break;
                case "难":
                    diff = 4;
                    break;
                default:
                    diff = 0;
            }
        } else {
            diff = 0;
        }
        return diff;
    }

    private boolean checkExamInPaper(Long examId) {
        boolean isInPaper = false;
        MyPaperStructs myPaperStructs = user.getMyPaperStructs();
        if (null != myPaperStructs) {
            List<ExamStructs> data = new ArrayList<>();
            List<MyExamRegionStructs> myExamRegionStructs = myPaperStructs.getData();
            if (null != myExamRegionStructs && myExamRegionStructs.size() > 0) {
                for (MyExamRegionStructs datum : myExamRegionStructs) {
                    List<ExamStructs> examList = datum.getExamList();
                    data.addAll(examList);
                }
                if (data.size() > 0) {
                    for (ExamStructs data1 : data) {
                        if (examId.equals(data1.getId())) {
                            isInPaper = true;
                            break;
                        } else {
                            isInPaper = false;
                        }
                    }
                } else {
                    isInPaper = false;
                }
            } else {
                isInPaper = false;
            }

        } else {
            isInPaper = false;
        }

        return isInPaper;
    }

    private boolean checkFavorite(List<Favorite> favoriteList, Long examId) {
        for (Favorite favorite : favoriteList) {
            if (examId.equals(favorite.getExamId())) {
                return true;
            }
        }
        return false;
    }

}
