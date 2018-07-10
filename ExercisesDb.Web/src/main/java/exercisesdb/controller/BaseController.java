package exercisesdb.controller;

import com.jfinal.core.Controller;
import exercisesdb.model.KnowPoint;
import exercisesdb.model.Subject;
import exercisesdb.model.User;
import exercisesdb.services.*;
import exercisesdb.types.SessionalUser;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import static exercisesdb.common.Const.*;

public class BaseController extends Controller {
    public static final String SESSIONAL_USER = "__SESSIONAL_USER__";
    private SessionalUser su = null;

    protected int checkUserLogin()throws UnsupportedEncodingException {
        String ak = getPara("ak");
        String userName = getPara("username");
//        String nickName = URLDecoder.decode(getPara("nickname"), "UTF-8");
        String nickName = getPara("nickname");
        if (null == ak || "".equals(ak)
                || null == userName || "".equals(userName)) {
            if (null == su) {
                su = getSessionalUser();
            }
            if (null == su) {
                return SUNULL;
            }
            if (null == su.getSection() || null == su.getSubjectId()) {
                return UNULL;
            }
            return SUCCESS;
        }
        User u = UserService.getUserByUsername(userName);
        if (null == u) {
            return UNULL;
        }
        if (null == u.getSection() || null == u.getSubjectId()) {
            return UNULL;
        }
        if (null == getSessionalUser()) {
            su = new SessionalUser();
            su.setId(u.getId());
            su.setUserName(u.getUsername());
            su.setNickName(u.getNickname());
            su.setSection(u.getSection());
            Subject subject = SubjectService.getSubjectById(u.getSubjectId());
            su.setSubject(subject.getCaption());
            //  初始化试题栏内容。TODO:按用户 ID，学科，年级查询
            su.setSubjectId(subject.getId());
            su.setMyPaperStructs(MyPaperStructsService.getMyPaper(u.getId(), subject.getId(), su.getSection()));
            su.setAllKnowPoint(KnowPointService.getKnowPoints(u.getSection(), u.getSubjectId()));
            su.setAbilities(AbilityService.getAbility(u.getSection(), u.getSubjectId()));
            su.setAllExamKind(ExamKindService.getExamKinds(u.getSection(), u.getSubjectId()));
            su.setFavorites(FavoriteService.getFav(u.getId(), u.getSection(), u.getSubjectId()));
            setSessionalUser(su);
        }
        return SUCCESS;
    }

    //  切换学科年级，sesion中试题栏信息。TODO:按用户 ID，学科，年级查询
    protected void checkUserMyPaper() {
        SessionalUser su = getSessionalUser();
        su.setMyPaperStructs(MyPaperStructsService.getMyPaper(su.getId(), su.getSubjectId(), su.getSection()));
        setSessionalUser(su);
    }

    protected SessionalUser getSessionalUser() {
        SessionalUser su = (SessionalUser) getRequest().getSession().getAttribute(SESSIONAL_USER);
        return su;
    }

    protected void setSessionalUser(SessionalUser su) {
        if (null != su) {
            getRequest().getSession().setAttribute(SESSIONAL_USER, su);
        }
    }

    protected String changeSection(int section) {
        String strSection = "";
        switch (section) {
            case 1:
                strSection = "小学";
                break;
            case 2:
                strSection = "初中";
                break;
            case 3:
                strSection = "高中";
                break;
            default:
                strSection = "";
        }
        return strSection;
    }

    protected Integer changeSectionToCode(String strSection) {
        Integer section = 0;
        if ("小学".equals(strSection)) {
            section = 1;
        } else if ("初中".equals(strSection)) {
            section = 2;
        } else if ("高中".equals(strSection)) {
            section = 3;
        } else {
            section = 0;
        }
        return section;
    }

}
